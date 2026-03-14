"""
users.py
--------
User authentication and management routes.

Endpoints:
  POST /api/users/signup  - Register a new user
  POST /api/users/login   - Authenticate and get JWT
  GET  /api/users/me      - Get current user profile (requires auth)
  GET  /api/users/        - List all users (requires admin role)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import select

from db.session import get_db
from models.models import User
from src.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_role,
)
from schemas.user import SignupRequest, TokenResponse, UserResponse

from datetime import timezone, datetime

router = APIRouter()

VALID_ROLES = {"employee", "manager", "admin"}

# ──────────────────────────────────────────────
# POST /api/users/signup
# ──────────────────────────────────────────────
@router.post(
    "/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    """
    Create a new user account.

    - **email**: must be unique across all users
    - **password**: min 6 characters (stored as bcrypt hash)
    - **first_name** / **last_name**: required
    - **role**: `employee` (default), `manager`, or `admin`
    """
    # Validate role
    role = payload.role or "employee"
    if role not in VALID_ROLES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid role '{role}'. Must be one of: {', '.join(VALID_ROLES)}",
        )

    # Check for duplicate email
    existing = db.execute(
        select(User).where(User.email == payload.email)
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A user with email '{payload.email}' already exists",
        )

    new_user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        first_name=payload.first_name,
        last_name=payload.last_name,
        role=role,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


# ──────────────────────────────────────────────
# POST /api/users/login
# ──────────────────────────────────────────────
@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login and receive a JWT access token",
)
def login(payload: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Authenticate with email (as username) and password.

    Returns a **Bearer** JWT token valid for the duration
    configured in `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` (default 60 min).
    """
    user = db.execute(
        select(User).where(User.email == payload.username)
    ).scalar_one_or_none()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(
        data={"sub": user.email, "role": user.role}
    )

    user.last_login_at = datetime.now(timezone.utc)
    db.add(user)
    db.commit()

    return TokenResponse(access_token=token)


# ──────────────────────────────────────────────
# GET /api/users/me
# ──────────────────────────────────────────────
@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get the currently authenticated user's profile",
)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns the profile of the user who owns the provided JWT token.
    Requires a valid **Bearer** token in the `Authorization` header.
    """
    return current_user


# ──────────────────────────────────────────────
# GET /api/users/   (admin only)
# ──────────────────────────────────────────────
@router.get(
    "/",
    response_model=list[UserResponse],
    summary="List all users (admin only)",
)
def get_all_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin")),
):
    """
    Returns all registered users. **Requires the `admin` role.**
    """
    try:
        query = select(
            User.id,
            User.email,
            User.first_name,
            User.last_name,
            User.role,
            User.last_login_at,
        )
        result = db.execute(query).mappings().all()
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching users",
        )