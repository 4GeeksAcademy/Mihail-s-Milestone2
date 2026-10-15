from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    """Devuelve la hora UTC actual para registrar movimientos."""
    return datetime.now(timezone.utc)


class SKU(SQLModel, table=True):
    __tablename__ = "sku"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    sku: str = Field(index=True)
    client_name: str = Field(index=True)
    category: str = Field(index=True)
    warehouse: str = Field(index=True)


class StockEntry(SQLModel, table=True):
    __tablename__ = "stockentry"

    id: int | None = Field(default=None, primary_key=True)
    sku_id: int = Field(foreign_key="sku.id", index=True)
    quantity: int
    reference: str
    warehouse: str = Field(index=True)
    created_at: datetime = Field(default_factory=utc_now, index=True)
    user_uuid: str = Field(index=True)


class StockExit(SQLModel, table=True):
    __tablename__ = "stockexit"

    id: int | None = Field(default=None, primary_key=True)
    sku_id: int = Field(foreign_key="sku.id", index=True)
    quantity: int
    exit_type: str
    tracking_number: str | None = None
    warehouse: str = Field(index=True)
    created_at: datetime = Field(default_factory=utc_now, index=True)
    user_uuid: str = Field(index=True)