"""Pruebas de auth, relaciones y reglas de inventario en SQLite temporal."""

import os

os.environ["DATABASE_URL"] = "sqlite://"
os.environ["JWT_SECRET"] = "test-only-secret-with-at-least-32-characters"
os.environ["AUTH_DB_PATH"] = "/tmp/trackflow-test-users.json"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import SQLModel, Session, create_engine

from services.database import get_db
from services.main import app
from services.models import SKU, StockEntry, StockExit
from services import seed_data

test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


@pytest.fixture
def client(tmp_path, monkeypatch):
    """Usa SQLite en memoria y TinyDB aislado por prueba."""
    monkeypatch.setenv("AUTH_DB_PATH", str(tmp_path / "users.json"))
    SQLModel.metadata.create_all(test_engine)
    with Session(test_engine) as session:
        for table in reversed(SQLModel.metadata.sorted_tables):
            session.exec(table.delete())
        session.commit()

    def get_test_db():
        with Session(test_engine) as session:
            yield session

    app.dependency_overrides[get_db] = get_test_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    SQLModel.metadata.drop_all(test_engine)


@pytest.fixture
def auth_headers(client):
    """Registra y autentica un operativo real de la base temporal."""
    registered = client.post(
        "/auth/register",
        json={"name": "Test Operative", "email": "operative@example.com", "password": "correct-horse-42"},
    )
    assert registered.status_code == 201
    login = client.post(
        "/auth/login",
        json={"email": "operative@example.com", "password": "correct-horse-42"},
    )
    assert login.status_code == 200
    return {"Authorization": f"Bearer {login.json()['access_token']}"}


def create_sku(client, headers, warehouse="LA"):
    """Crea un SKU válido para una prueba."""
    response = client.post(
        "/inventory/products",
        headers=headers,
        json={
            "name": "Classic White Sneaker - Size 42",
            "sku": f"CLT-SNK-W-42-{warehouse}",
            "client_name": "PureStep Footwear",
            "category": "fashion",
            "warehouse": warehouse,
        },
    )
    assert response.status_code == 201
    return response.json()


def test_auth_registration_login_and_inventory_protection(client, auth_headers):
    """Protege rutas, rechaza credenciales inválidas y bloquea duplicados."""
    assert client.get("/inventory/products").status_code == 401
    assert client.get("/inventory/products", headers={"Authorization": "Bearer invalid"}).status_code == 401
    assert client.get("/inventory/products", headers=auth_headers).status_code == 200
    duplicate = client.post(
        "/auth/register",
        json={"name": "Another", "email": "OPERATIVE@example.com", "password": "correct-horse-42"},
    )
    assert duplicate.status_code == 409
    assert client.post(
        "/auth/login",
        json={"email": "operative@example.com", "password": "wrong-password"},
    ).status_code == 401


def test_fk_validation_warehouse_scope_and_exact_insufficient_stock(client, auth_headers):
    """Valida FK, movimientos y cálculo aislado por almacén."""
    assert SKU.__table__.c.id.primary_key
    assert next(iter(SKU.__table__.c.id.foreign_keys), None) is None
    assert StockEntry.__table__.c.sku_id.foreign_keys
    assert StockExit.__table__.c.sku_id.foreign_keys
    assert next(iter(StockEntry.__table__.c.sku_id.foreign_keys)).ondelete == "RESTRICT"

    missing_sku = client.post(
        "/inventory/orders/inbound",
        headers=auth_headers,
        json={"sku_id": 9000, "quantity": 1, "reference": "NO-SKU", "warehouse": "LA"},
    )
    assert missing_sku.status_code == 404

    la = create_sku(client, auth_headers, "LA")
    zgz = create_sku(client, auth_headers, "ZGZ")
    direct_stock = client.post(
        "/inventory/products",
        headers=auth_headers,
        json={
            "name": "Not allowed",
            "sku": "DIRECT-STOCK",
            "client_name": "PureStep Footwear",
            "category": "fashion",
            "warehouse": "LA",
            "current_stock": 100,
        },
    )
    assert direct_stock.status_code == 422
    assert "current_stock" not in SKU.__table__.columns
    entry = {"sku_id": la["id"], "quantity": 8, "reference": "PO-2024-0098", "warehouse": "LA"}
    assert client.post("/inventory/orders/inbound", headers=auth_headers, json=entry).status_code == 201
    mismatched_warehouse = client.post(
        "/inventory/orders/inbound",
        headers=auth_headers,
        json={"sku_id": la["id"], "quantity": 6, "reference": "PO-WRONG-WAREHOUSE", "warehouse": "ZGZ"},
    )
    assert mismatched_warehouse.status_code == 400
    zgz_entry = client.post(
        "/inventory/orders/inbound",
        headers=auth_headers,
        json={"sku_id": zgz["id"], "quantity": 6, "reference": "PO-ZGZ-0099", "warehouse": "ZGZ"},
    )
    assert zgz_entry.status_code == 201
    assert client.get(f"/inventory/products/{la['id']}", headers=auth_headers).json()["current_stock"] == 8
    assert client.get(f"/inventory/products/{zgz['id']}", headers=auth_headers).json()["current_stock"] == 6

    fractional = client.post(
        "/inventory/orders/inbound",
        headers=auth_headers,
        json={"sku_id": la["id"], "quantity": 1.5, "reference": "FRACTIONAL", "warehouse": "LA"},
    )
    assert fractional.status_code == 422
    too_many = client.post(
        "/inventory/orders/outbound",
        headers=auth_headers,
        json={"sku_id": la["id"], "quantity": 9, "exit_type": "dispatch", "tracking_number": "1Z123", "warehouse": "LA"},
    )
    assert too_many.status_code == 400
    assert too_many.json()["detail"] == (
        f"Insufficient stock for SKU '{la['sku']}'. Available: 8, requested: 9."
    )
    assert client.get(f"/inventory/products/{la['id']}", headers=auth_headers).json()["current_stock"] == 8


def test_tracking_validation_and_order_history_relationships(client, auth_headers):
    """Comprueba reglas de salida y datos relacionados de historial."""
    product = create_sku(client, auth_headers)
    client.post(
        "/inventory/orders/inbound",
        headers=auth_headers,
        json={"sku_id": product["id"], "quantity": 4, "reference": "GR-LA-0234", "warehouse": "LA"},
    )
    missing_tracking = client.post(
        "/inventory/orders/outbound",
        headers=auth_headers,
        json={"sku_id": product["id"], "quantity": 1, "exit_type": "dispatch", "warehouse": "LA"},
    )
    assert missing_tracking.status_code == 422

    dispatch = client.post(
        "/inventory/orders/outbound",
        headers=auth_headers,
        json={"sku_id": product["id"], "quantity": 1, "exit_type": "dispatch", "tracking_number": "1Z999AA10123456784", "warehouse": "LA"},
    )
    assert dispatch.status_code == 201
    loss = client.post(
        "/inventory/orders/outbound",
        headers=auth_headers,
        json={"sku_id": product["id"], "quantity": 1, "exit_type": "loss", "tracking_number": None, "warehouse": "LA"},
    )
    assert loss.status_code == 201
    assert loss.json()["tracking_number"] is None

    history = client.get("/inventory/orders", headers=auth_headers)
    assert history.status_code == 200
    orders = history.json()
    assert {order["order_type"] for order in orders} == {"inbound", "outbound"}
    assert all(order["sku"]["name"] == product["name"] for order in orders)
    assert all(order["sku"]["current_stock"] == 2 for order in orders)
    assert all(order["user_uuid"] for order in orders)
    assert "current_stock" not in SKU.__table__.columns


def test_development_seed_is_idempotent_and_uses_tinydb_user(client, auth_headers, monkeypatch):
    """Carga los datos de contexto una sola vez y atribuye movimientos al usuario TinyDB."""
    monkeypatch.setattr(seed_data, "engine", test_engine)
    monkeypatch.setattr(seed_data, "create_db_and_tables", lambda: SQLModel.metadata.create_all(test_engine))

    seed_data.seed_development_inventory()
    seed_data.seed_development_inventory()

    products = client.get("/inventory/products", headers=auth_headers)
    orders = client.get("/inventory/orders", headers=auth_headers)
    assert products.status_code == 200
    assert len(products.json()) == 6
    assert orders.status_code == 200
    assert len(orders.json()) == 8
    assert all(order["user_uuid"] for order in orders.json())