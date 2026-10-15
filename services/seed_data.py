"""Carga idempotente de datos de demostración del contexto TrackFlow."""

from sqlmodel import Session, select
from tinydb import Query, TinyDB

from .database import create_db_and_tables, engine, get_auth_db_path
from .models import SKU, StockEntry, StockExit

SKU_SEED = [
    {"name": "Classic White Sneaker - Size 42", "sku": "CLT-SNK-W-42", "client_name": "PureStep Footwear", "category": "fashion", "warehouse": "LA"},
    {"name": "Classic White Sneaker - Size 42", "sku": "CLT-SNK-W-42-Z", "client_name": "PureStep Footwear", "category": "fashion", "warehouse": "ZGZ"},
    {"name": "Wireless Earbuds Pro", "sku": "TEC-EAR-001", "client_name": "SoundWave Electronics", "category": "electronics", "warehouse": "LA"},
    {"name": "Hydrating Face Serum 30ml", "sku": "CSM-SRM-030", "client_name": "GlowLab Cosmetics", "category": "cosmetics", "warehouse": "ZGZ"},
    {"name": "Slim Fit Chino - Navy 32/32", "sku": "CLT-CHN-N-32", "client_name": "UrbanThread", "category": "fashion", "warehouse": "LA"},
    {"name": "USB-C Fast Charger 65W", "sku": "TEC-CHG-065", "client_name": "SoundWave Electronics", "category": "electronics", "warehouse": "ZGZ"},
]

ENTRY_SEED = [
    ("CLT-SNK-W-42", 20, "PO-2024-0098", "LA"),
    ("CLT-SNK-W-42", 5, "GR-LA-0234", "LA"),
    ("CLT-SNK-W-42-Z", 15, "PO-ZGZ-0042", "ZGZ"),
    ("TEC-EAR-001", 12, "GR-LA-0240", "LA"),
    ("CSM-SRM-030", 18, "PO-ZGZ-0104", "ZGZ"),
]

EXIT_SEED = [
    ("CLT-SNK-W-42", 4, "dispatch", "1Z999AA10123456784", "LA"),
    ("CLT-SNK-W-42", 1, "loss", None, "LA"),
    ("CLT-SNK-W-42-Z", 3, "dispatch", "MRW240000042", "ZGZ"),
]


def seed_development_inventory() -> None:
    """Inserta los SKU y movimientos del contexto usando un usuario TinyDB existente."""
    with TinyDB(get_auth_db_path()) as auth_db:
        operative = auth_db.get(Query().user_uuid.exists())
    if operative is None:
        raise RuntimeError("Registra un usuario operativo en /auth/register antes de cargar los datos.")
    user_uuid = operative["user_uuid"]

    create_db_and_tables()
    with Session(engine) as session:
        products = {product.sku: product for product in session.exec(select(SKU)).all()}
        for record in SKU_SEED:
            if record["sku"] not in products:
                product = SKU(**record)
                session.add(product)
                session.flush()
                products[record["sku"]] = product
        session.commit()

        for code, quantity, reference, warehouse in ENTRY_SEED:
            exists = session.exec(select(StockEntry).where(StockEntry.reference == reference)).first()
            if exists is None:
                session.add(StockEntry(
                    sku_id=products[code].id,
                    quantity=quantity,
                    reference=reference,
                    warehouse=warehouse,
                    user_uuid=user_uuid,
                ))

        for code, quantity, exit_type, tracking_number, warehouse in EXIT_SEED:
            statement = select(StockExit).where(
                StockExit.sku_id == products[code].id,
                StockExit.exit_type == exit_type,
                StockExit.tracking_number == tracking_number,
                StockExit.warehouse == warehouse,
            )
            if session.exec(statement).first() is None:
                session.add(StockExit(
                    sku_id=products[code].id,
                    quantity=quantity,
                    exit_type=exit_type,
                    tracking_number=tracking_number,
                    warehouse=warehouse,
                    user_uuid=user_uuid,
                ))
        session.commit()


if __name__ == "__main__":
    seed_development_inventory()
    print("Datos de inventario de desarrollo cargados.")