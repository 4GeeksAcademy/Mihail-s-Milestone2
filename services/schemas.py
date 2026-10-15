"""Esquemas Pydantic de entrada y salida, separados de los modelos ORM."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

Warehouse = Literal["LA", "ZGZ"]
Category = Literal["fashion", "electronics", "cosmetics"]
ExitType = Literal["dispatch", "loss"]


class SKUCreate(BaseModel):
    """Datos permitidos al registrar un SKU nuevo."""

    model_config = ConfigDict(extra="forbid")

    name: str = Field(min_length=1, max_length=200)
    sku: str = Field(min_length=1, max_length=100)
    client_name: str = Field(min_length=1, max_length=160)
    category: Category
    warehouse: Warehouse


class SKURead(BaseModel):
    """Respuesta SKU con stock calculado, nunca persistido."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    sku: str
    client_name: str
    category: Category
    warehouse: Warehouse
    current_stock: int


class StockEntryCreate(BaseModel):
    """Payload para recibir existencias en un almacén."""

    model_config = ConfigDict(extra="forbid")

    sku_id: int = Field(gt=0, strict=True)
    quantity: int = Field(gt=0, strict=True)
    reference: str = Field(min_length=1, max_length=120)
    warehouse: Warehouse


class StockEntryRead(BaseModel):
    """Respuesta de un movimiento de entrada."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    sku_id: int
    quantity: int
    reference: str
    warehouse: Warehouse
    created_at: datetime
    user_uuid: str


class StockExitCreate(BaseModel):
    """Payload para un despacho o una pérdida confirmada."""

    model_config = ConfigDict(extra="forbid")

    sku_id: int = Field(gt=0, strict=True)
    quantity: int = Field(gt=0, strict=True)
    exit_type: ExitType
    tracking_number: str | None = Field(default=None, max_length=120)
    warehouse: Warehouse

    @model_validator(mode="after")
    def validate_tracking_number(self) -> "StockExitCreate":
        """Exige seguimiento para despachos y lo prohíbe para pérdidas."""
        if self.exit_type == "dispatch" and not self.tracking_number:
            raise ValueError("tracking_number is required for dispatch exits")
        if self.exit_type == "loss" and self.tracking_number is not None:
            raise ValueError("tracking_number must be null for loss exits")
        return self


class StockExitRead(BaseModel):
    """Respuesta de un movimiento de salida."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    sku_id: int
    quantity: int
    exit_type: ExitType
    tracking_number: str | None
    warehouse: Warehouse
    created_at: datetime
    user_uuid: str


class InventoryOrderRead(BaseModel):
    """Movimiento enriquecido con el SKU, cargado sin consultas N+1."""

    id: int
    sku_id: int
    quantity: int
    order_type: Literal["inbound", "outbound"]
    reference: str | None = None
    exit_type: ExitType | None = None
    tracking_number: str | None = None
    warehouse: Warehouse
    created_at: datetime
    user_uuid: str
    sku: SKURead