"""
Pydantic request / response schemas for authentication routes.
"""

import uuid
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


# ──────────────────────────────────────────────
# Auth request / response schemas
# ──────────────────────────────────────────────

class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72, description="Between 6 and 72 characters")
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    role: Optional[str] = Field(
        default="employee",
        description="One of: employee, manager, admin",
    )


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    first_name: str
    last_name: str
    role: str

    model_config = {"from_attributes": True}
