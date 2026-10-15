"""Autenticación de usuarios operativos almacenados únicamente en TinyDB."""

import hashlib
import hmac
import os
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, EmailStr, Field
from tinydb import Query, TinyDB

from .database import get_auth_db

router = APIRouter(prefix="/auth", tags=["authentication"])
bearer_scheme = HTTPBearer(auto_error=False)
JWT_ALGORITHM = "HS256"
TOKEN_LIFETIME_HOURS = 8
PBKDF2_ITERATIONS = 310_000


def _jwt_secret() -> str:
    """Obtiene una clave JWT privada con longitud mínima segura."""
    secret = os.getenv("JWT_SECRET")
    if not secret or len(secret) < 32:
        raise RuntimeError("JWT_SECRET debe configurarse con al menos 32 caracteres.")
    return secret


def _hash_password(password: str, salt: str | None = None) -> str:
    """Genera un hash PBKDF2 con una sal aleatoria por contraseña."""
    salt_value = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), bytes.fromhex(salt_value), PBKDF2_ITERATIONS
    ).hex()
    return f"{salt_value}${digest}"


def _password_matches(password: str, stored_hash: str) -> bool:
    """Compara una contraseña con su hash en tiempo constante."""
    try:
        salt, expected = stored_hash.split("$", maxsplit=1)
    except ValueError:
        return False
    actual = _hash_password(password, salt).split("$", maxsplit=1)[1]
    return hmac.compare_digest(actual, expected)


def _public_user(user: dict[str, Any]) -> dict[str, str]:
    """Expone los datos públicos y omite el hash de contraseña."""
    return {"user_uuid": user["user_uuid"], "name": user["name"], "email": user["email"]}


def _create_access_token(user_uuid: str) -> str:
    """Emite un JWT de acceso que expira después de ocho horas."""
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {"sub": user_uuid, "iat": now, "exp": now + timedelta(hours=TOKEN_LIFETIME_HOURS)},
        _jwt_secret(),
        algorithm=JWT_ALGORITHM,
    )


class RegisterRequest(BaseModel):
    """Datos para crear una cuenta operativa en TinyDB."""

    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    """Credenciales de acceso del usuario operativo."""

    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class UserRead(BaseModel):
    """Representación pública segura del usuario."""

    user_uuid: str
    name: str
    email: str


class TokenResponse(BaseModel):
    """Token bearer y usuario autenticado."""

    access_token: str
    token_type: str = "bearer"
    user: UserRead


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_user(payload: RegisterRequest, database: TinyDB = Depends(get_auth_db)) -> dict[str, str]:
    """Registra una cuenta TinyDB, sin replicar usuarios en PostgreSQL."""
    email = str(payload.email).strip().lower()
    users = Query()
    if database.contains(users.email == email):
        raise HTTPException(status_code=409, detail="Ya existe una cuenta con este correo.")
    user = {
        "user_uuid": str(uuid.uuid4()),
        "name": payload.name.strip(),
        "email": email,
        "password_hash": _hash_password(payload.password),
    }
    database.insert(user)
    return _public_user(user)


@router.post("/login", response_model=TokenResponse)
def login_user(payload: LoginRequest, database: TinyDB = Depends(get_auth_db)) -> dict[str, Any]:
    """Valida credenciales y devuelve un JWT firmado."""
    email = str(payload.email).strip().lower()
    user = database.get(Query().email == email)
    if not user or not _password_matches(payload.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El correo o la contraseña no son correctos.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {
        "access_token": _create_access_token(user["user_uuid"]),
        "token_type": "bearer",
        "user": _public_user(user),
    }


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    database: TinyDB = Depends(get_auth_db),
) -> dict[str, str]:
    """Valida el JWT y confirma que la cuenta siga en TinyDB."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Se requiere autenticación.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(credentials.credentials, _jwt_secret(), algorithms=[JWT_ALGORITHM])
        user_uuid = payload.get("sub")
        if not isinstance(user_uuid, str):
            raise jwt.InvalidTokenError("Invalid token subject")
    except jwt.PyJWTError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="La sesión no es válida o ha expirado. Inicia sesión de nuevo.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from error
    user = database.get(Query().user_uuid == user_uuid)
    if user is None:
        raise HTTPException(status_code=401, detail="La cuenta de esta sesión ya no existe.")
    return _public_user(user)