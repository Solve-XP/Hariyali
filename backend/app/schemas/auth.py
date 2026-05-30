from typing import Literal
from pydantic import (
    BaseModel,
    Field,
    field_validator
)

import re


class SignupRequest(BaseModel):

    name: str = Field(..., min_length=2)

    phone: str

    password: str

    role: Literal[
        "farmer",
        "merchant"
    ]

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value):

        value = value.strip()

        pattern = r"^[6-9]\d{9}$"

        if not re.match(pattern, value):

            raise ValueError(
                "Invalid phone number"
            )

        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):

        if len(value) < 8:

            raise ValueError(
                "Password must be at least 8 characters"
            )

        return value


class LoginRequest(BaseModel):

    phone: str

    password: str


class UserResponse(BaseModel):

    id: str
    name: str
    role: str


class TokenResponse(BaseModel):

    access_token: str

    token_type: str = "bearer"

    user: UserResponse

class ForgotPasswordRequest(BaseModel):

    phone: str

    new_password: str

    confirm_password: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value):

        value = value.strip()

        pattern = r"^[6-9]\d{9}$"

        if not re.match(pattern, value):

            raise ValueError(
                "Invalid phone number"
            )

        return value

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, value):

        if len(value) < 8:

            raise ValueError(
                "Password must be at least 8 characters"
            )

        return value