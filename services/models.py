"""Modelos relacionales SQLModel para el inventario TrackFlow."""

from datetime import datetime, timezone

from sqlalchemy import CheckConstraint, UniqueConstraint
from sqlmodel import Field, Relationship, SQLModel


def utc_now() -> datetime:
    """Devuelve la fecha y hora UTC para los movimientos de inventario."""
    return datetime.now(timezone.utc)


class SKU(SQLModel, table=True):
    """SKU asignado a un único almacén; no almacena stock mutable."""

    __tablename__ = "sku"
    __table_args__ = (
        UniqueConstraint("sku", "warehouse", name="uq_sku_code_warehouse"),
        CheckConstraint("category IN ('fashion', 'electronics', 'cosmetics')", name="ck_sku_category"),
        CheckConstraint("warehouse IN ('LA', 'ZGZ')", name="ck_sku_warehouse"),
    )

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(min_length=1, max_length=200, index=True)
    sku: str = Field(min_length=1, max_length=100, index=True)
    client_name: str = Field(min_length=1, max_length=160, index=True)
    category: str = Field(index=True)
    warehouse: str = Field(index=True)

    stock_entries: list["StockEntry"] = Relationship(
        back_populates="sku",
        sa_relationship_kwargs={"cascade": "save-update, merge", "passive_deletes": True},
    )
    stock_exits: list["StockExit"] = Relationship(
        back_populates="sku",
        sa_relationship_kwargs={"cascade": "save-update, merge", "passive_deletes": True},
    )


class StockEntry(SQLModel, table=True):
    """Recepción de mercancía confirmada por un usuario operativo."""

    __tablename__ = "stockentry"
    __table_args__ = (
        CheckConstraint("quantity > 0", name="ck_stockentry_quantity_positive"),
        CheckConstraint("warehouse IN ('LA', 'ZGZ')", name="ck_stockentry_warehouse"),
    )

    id: int | None = Field(default=None, primary_key=True)
    sku_id: int = Field(foreign_key="sku.id", ondelete="RESTRICT", index=True)
    quantity: int
    reference: str = Field(min_length=1, max_length=120)
    warehouse: str = Field(index=True)
    created_at: datetime = Field(default_factory=utc_now, index=True)
    user_uuid: str = Field(min_length=1, max_length=64, index=True)

    sku: SKU = Relationship(back_populates="stock_entries")


class StockExit(SQLModel, table=True):
    """Despacho o pérdida autorizada, vinculada a un SKU y usuario TinyDB."""

    __tablename__ = "stockexit"
    __table_args__ = (
        CheckConstraint("quantity > 0", name="ck_stockexit_quantity_positive"),
        CheckConstraint("warehouse IN ('LA', 'ZGZ')", name="ck_stockexit_warehouse"),
        CheckConstraint("exit_type IN ('dispatch', 'loss')", name="ck_stockexit_type"),
        CheckConstraint(
            "(exit_type = 'dispatch' AND tracking_number IS NOT NULL) OR "
            "(exit_type = 'loss' AND tracking_number IS NULL)",
            name="ck_stockexit_tracking_by_type",
        ),
    )

    id: int | None = Field(default=None, primary_key=True)
    sku_id: int = Field(foreign_key="sku.id", ondelete="RESTRICT", index=True)
    quantity: int
    exit_type: str = Field(index=True)
    tracking_number: str | None = Field(default=None, max_length=120)
    warehouse: str = Field(index=True)
    created_at: datetime = Field(default_factory=utc_now, index=True)
    user_uuid: str = Field(min_length=1, max_length=64, index=True)

    sku: SKU = Relationship(back_populates="stock_exits")