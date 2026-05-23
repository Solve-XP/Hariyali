# app/schemas/user.py

from pydantic import (
    BaseModel,
    Field,
    field_validator
)

import re


class UserProfileResponse(BaseModel):

    id: str
    name: str
    phone: str
    role: str


class UpdateProfileRequest(BaseModel):

    name: str | None = Field(
        default=None,
        min_length=2
    )

    phone: str | None = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value):

        if value is None:
            return value

        value = value.strip()

        pattern = r"^[6-9]\d{9}$"

        if not re.match(pattern, value):

            raise ValueError(
                "Invalid phone number"
            )

        return value


class ChangePasswordRequest(BaseModel):

    current_password: str

    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, value):

        if len(value) < 8:

            raise ValueError(
                "Password must be at least 8 characters"
            )

        return value