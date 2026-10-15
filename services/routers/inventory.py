"""Router protegido para SKUs y movimientos de inventario."""

from collections import defaultdict
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from ..auth import get_current_user
from ..database import get_db
from ..models import SKU, StockEntry, StockExit
from ..schemas import InventoryOrderRead, SKUCreate, SKURead, StockEntryCreate, StockExitCreate

router = APIRouter(
    prefix="/inventory",
    tags=["inventory"],
    dependencies=[Depends(get_current_user)],
)


def current_stock(session: Session, sku_id: int, warehouse: str) -> int:
    """Calcula stock neto por SKU y almacén sin almacenarlo en la tabla SKU."""
    entries = session.exec(
        select(func.coalesce(func.sum(StockEntry.quantity), 0)).where(
            StockEntry.sku_id == sku_id,
            StockEntry.warehouse == warehouse,
        )
    ).one()
    exits = session.exec(
        select(func.coalesce(func.sum(StockExit.quantity), 0)).where(
            StockExit.sku_id == sku_id,
            StockExit.warehouse == warehouse,
        )
    ).one()
    return int(entries - exits)


def _stock_by_sku(session: Session, sku_ids: list[int]) -> dict[tuple[int, str], int]:
    """Agrega entradas y salidas en dos consultas para evitar N+1 al listar SKU."""
    if not sku_ids:
        return {}
    totals: dict[tuple[int, str], int] = defaultdict(int)
    entries = session.exec(
        select(StockEntry.sku_id, StockEntry.warehouse, func.sum(StockEntry.quantity))
        .where(StockEntry.sku_id.in_(sku_ids))
        .group_by(StockEntry.sku_id, StockEntry.warehouse)
    ).all()
    exits = session.exec(
        select(StockExit.sku_id, StockExit.warehouse, func.sum(StockExit.quantity))
        .where(StockExit.sku_id.in_(sku_ids))
        .group_by(StockExit.sku_id, StockExit.warehouse)
    ).all()
    for sku_id, warehouse, quantity in entries:
        totals[(sku_id, warehouse)] += int(quantity or 0)
    for sku_id, warehouse, quantity in exits:
        totals[(sku_id, warehouse)] -= int(quantity or 0)
    return totals


def _sku_read(sku: SKU, stock: int) -> SKURead:
    """Construye la respuesta Pydantic sin exponer directamente el ORM."""
    return SKURead(
        id=sku.id,
        name=sku.name,
        sku=sku.sku,
        client_name=sku.client_name,
        category=sku.category,
        warehouse=sku.warehouse,
        current_stock=stock,
    )


def _sku_or_404(session: Session, sku_id: int, lock: bool = False) -> SKU:
    """Busca un SKU y permite bloquear su fila antes de registrar una salida."""
    statement = select(SKU).where(SKU.id == sku_id)
    if lock:
        statement = statement.with_for_update()
    sku = session.exec(statement).first()
    if sku is None:
        raise HTTPException(status_code=404, detail=f"SKU {sku_id} was not found.")
    return sku


def _movement_read(
    session: Session,
    movement: StockEntry | StockExit,
    order_type: str,
    stock: int,
) -> InventoryOrderRead:
    """Serializa una entrada o salida y el SKU relacionado."""
    sku = movement.sku
    return InventoryOrderRead(
        id=movement.id,
        sku_id=movement.sku_id,
        quantity=movement.quantity,
        order_type=order_type,
        reference=movement.reference if isinstance(movement, StockEntry) else None,
        exit_type=movement.exit_type if isinstance(movement, StockExit) else None,
        tracking_number=movement.tracking_number if isinstance(movement, StockExit) else None,
        warehouse=movement.warehouse,
        created_at=movement.created_at,
        user_uuid=movement.user_uuid,
        sku=_sku_read(sku, stock),
    )


@router.get("/products", response_model=list[SKURead])
def list_products(session: Session = Depends(get_db)) -> list[SKURead]:
    """Lista SKU y stock actual agrupado por almacén."""
    products = session.exec(select(SKU).order_by(SKU.name, SKU.warehouse)).all()
    stock = _stock_by_sku(session, [product.id for product in products])
    return [_sku_read(product, stock.get((product.id, product.warehouse), 0)) for product in products]


@router.post("/products", response_model=SKURead, status_code=status.HTTP_201_CREATED)
def create_product(payload: SKUCreate, session: Session = Depends(get_db)) -> SKURead:
    """Crea un SKU sin aceptar ni persistir un campo de stock."""
    product = SKU(**payload.model_dump())
    session.add(product)
    try:
        session.commit()
    except IntegrityError as error:
        session.rollback()
        raise HTTPException(status_code=409, detail="This SKU already exists in the selected warehouse.") from error
    session.refresh(product)
    return _sku_read(product, 0)


@router.get("/products/{sku_id}", response_model=SKURead)
def get_product(sku_id: int, session: Session = Depends(get_db)) -> SKURead:
    """Devuelve un SKU con el stock calculado de su almacén."""
    product = _sku_or_404(session, sku_id)
    return _sku_read(product, current_stock(session, product.id, product.warehouse))


@router.post("/orders/inbound", response_model=InventoryOrderRead, status_code=status.HTTP_201_CREATED)
def create_stock_entry(
    payload: StockEntryCreate,
    session: Session = Depends(get_db),
    user: dict[str, str] = Depends(get_current_user),
) -> InventoryOrderRead:
    """Registra una recepción atribuida al usuario autenticado."""
    product = _sku_or_404(session, payload.sku_id)
    if product.warehouse != payload.warehouse:
        raise HTTPException(status_code=400, detail="The StockEntry warehouse must match the SKU warehouse.")
    entry = StockEntry(**payload.model_dump(), user_uuid=user["user_uuid"])
    entry.sku = product
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return _movement_read(session, entry, "inbound", current_stock(session, product.id, product.warehouse))


@router.post("/orders/outbound", response_model=InventoryOrderRead, status_code=status.HTTP_201_CREATED)
def create_stock_exit(
    payload: StockExitCreate,
    session: Session = Depends(get_db),
    user: dict[str, str] = Depends(get_current_user),
) -> InventoryOrderRead:
    """Valida stock por almacén y registra un despacho o pérdida."""
    product = _sku_or_404(session, payload.sku_id, lock=True)
    if product.warehouse != payload.warehouse:
        raise HTTPException(status_code=400, detail="The StockExit warehouse must match the SKU warehouse.")
    available = current_stock(session, product.id, payload.warehouse)
    if payload.quantity > available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient stock for SKU '{product.sku}'. Available: {available}, requested: {payload.quantity}.",
        )
    exit_ = StockExit(**payload.model_dump(), user_uuid=user["user_uuid"])
    exit_.sku = product
    session.add(exit_)
    session.commit()
    session.refresh(exit_)
    return _movement_read(session, exit_, "outbound", current_stock(session, product.id, product.warehouse))


@router.get("/orders", response_model=list[InventoryOrderRead])
def list_orders(session: Session = Depends(get_db)) -> list[InventoryOrderRead]:
    """Lista movimientos y SKU relacionado con carga eager para evitar N+1."""
    entries = session.exec(
        select(StockEntry).options(selectinload(StockEntry.sku)).order_by(StockEntry.created_at.desc())
    ).all()
    exits = session.exec(
        select(StockExit).options(selectinload(StockExit.sku)).order_by(StockExit.created_at.desc())
    ).all()
    stock = _stock_by_sku(session, [movement.sku_id for movement in [*entries, *exits]])
    movements = [
        _movement_read(session, entry, "inbound", stock.get((entry.sku_id, entry.warehouse), 0))
        for entry in entries
    ] + [
        _movement_read(session, exit_, "outbound", stock.get((exit_.sku_id, exit_.warehouse), 0))
        for exit_ in exits
    ]
    return sorted(movements, key=lambda movement: movement.created_at, reverse=True)