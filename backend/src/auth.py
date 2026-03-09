"""
auth.py
-------
JWT authentication helpers for the AI Database Analyzer.
Provides password hashing, token creation/verification,
and FastAPI dependency functions for auth guards.
"""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import bcrypt
from sqlalchemy.orm import Session
from sqlalchemy import select

from db.session import get_db
from models.models import User

load_dotenv()

# ──────────────────────────────────────────────
# Configuration  (loaded from .env)
# ──────────────────────────────────────────────
SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "")
ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
    os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "60")
)

if not SECRET_KEY:
    raise RuntimeError(
        "JWT_SECRET_KEY not set. Add it to your .env file."
    )

# ──────────────────────────────────────────────
# Password hashing
# ──────────────────────────────────────────────

def hash_password(plain: str) -> str:
    """Return a bcrypt hash of *plain*."""
    # bcrypt limits passwords to 72 bytes. Pre-truncate safely.
    pwd_bytes = plain.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(pwd_bytes, salt)
    return hashed_bytes.decode('utf-8')


def verify_password(plain: str, hashed: str) -> bool:
    """Return True if *plain* matches the stored *hashed* password."""
    pwd_bytes = plain.encode('utf-8')[:72]
    hashed_bytes = hashed.encode('utf-8')
    try:
        return bcrypt.checkpw(pwd_bytes, hashed_bytes)
    except ValueError:
        return False


# ──────────────────────────────────────────────
# JWT token helpers
# ──────────────────────────────────────────────
def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Encode *data* into a signed JWT.

    The token carries:
      - sub  : user email (string)
      - role : user role  (string)
      - exp  : expiry timestamp
    """
    payload = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload["exp"] = expire
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    """
    Decode and verify a JWT.

    Raises HTTPException 401 if the token is invalid or expired.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise credentials_exception


# ──────────────────────────────────────────────
# FastAPI security scheme  (OAuth2 Password Flow)
# ──────────────────────────────────────────────
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Dependency that extracts and validates the OAuth2 token,
    then returns the corresponding User row from the database.

    Usage::

        @router.get("/me")
        def me(user: User = Depends(get_current_user)):
            ...
    """
    payload = decode_access_token(token)
    email: Optional[str] = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing 'sub' claim",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def require_role(*allowed_roles: str):
    """
    Dependency factory that restricts access to users whose role
    is in *allowed_roles*.

    Usage::

        @router.get("/admin-only")
        def admin(user: User = Depends(require_role("admin"))):
            ...

        @router.get("/managers-and-admins")
        def mgmt(user: User = Depends(require_role("manager", "admin"))):
            ...
    """

    def _check(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Access denied. Required role(s): {', '.join(allowed_roles)}. "
                    f"Your role: {current_user.role}"
                ),
            )
        return current_user

    return _check
