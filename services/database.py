"""Configuración de las conexiones TinyDB y Supabase/PostgreSQL."""

import os
from collections.abc import Generator
from pathlib import Path

from sqlmodel import Session, SQLModel, create_engine
from tinydb import TinyDB


def _database_url() -> str:
    """Obtiene la URL de base de datos sin incluir credenciales en el código."""
    value = os.getenv("DATABASE_URL")
    if not value:
        raise RuntimeError("DATABASE_URL debe apuntar a la base PostgreSQL de Supabase.")
    return value


def _create_engine():
    """Crea el motor SQLModel, habilitando SQLite solo para pruebas locales."""
    url = _database_url()
    options = {"pool_pre_ping": True}
    if url.startswith("sqlite"):
        options["connect_args"] = {"check_same_thread": False}
    return create_engine(url, **options)


engine = _create_engine()


def get_auth_db_path() -> Path:
    """Devuelve la ruta TinyDB configurada para autenticación."""
    default_path = Path(__file__).parent / "data" / "users.json"
    return Path(os.getenv("AUTH_DB_PATH", str(default_path))).expanduser()


def get_db() -> Generator[Session, None, None]:
    """Proporciona una sesión SQLModel independiente por solicitud."""
    with Session(engine) as session:
        yield session


def get_auth_db() -> Generator[TinyDB, None, None]:
    """Abre TinyDB para la solicitud y cierra su conexión al finalizar."""
    path = get_auth_db_path()
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    database = TinyDB(path)
    if os.name != "nt":
        path.chmod(0o600)
    try:
        yield database
    finally:
        database.close()


def create_db_and_tables() -> None:
    """Crea las tablas ORM en PostgreSQL durante el inicio del servicio."""
    SQLModel.metadata.create_all(engine)