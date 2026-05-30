from fastapi import (
    HTTPException,
    status
)

from app.repositories.user_repo import (
    UserRepository
)

from app.schemas.auth import (
    SignupRequest,
    LoginRequest
)

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)


class AuthService:

    @staticmethod
    async def signup(user: SignupRequest):

        existing_user = await UserRepository.get_user_by_phone(
            user.phone
        )

        if existing_user:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone already registered"
            )

        hashed_password = hash_password(
            user.password
        )

        user_data = {
            "name": user.name,
            "phone": user.phone,
            "password": hashed_password,
            "role": user.role
        }

        inserted_id = await UserRepository.create_user(
            user_data
        )

        token = create_access_token(
            {
                "user_id": inserted_id,
                "role": user.role
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": inserted_id,
                "name": user.name,
                "role": user.role
            }
        }

    @staticmethod
    async def login(user: LoginRequest):

        existing_user = await UserRepository.get_user_by_phone(
            user.phone
        )

        if not existing_user:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        password_valid = verify_password(
            user.password,
            existing_user["password"]
        )

        if not password_valid:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        token = create_access_token(
            {
                "user_id": str(existing_user["_id"]),
                "role": existing_user["role"]
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": str(existing_user["_id"]),
                "name": existing_user["name"],
                "role": existing_user["role"]
            }
        }

    @staticmethod
    async def forgot_password(
        phone: str,
        new_password: str,
        confirm_password: str
    ):

        user = await UserRepository.get_user_by_phone(
            phone
        )

        if not user:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        if new_password != confirm_password:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Passwords do not match"
            )

        if verify_password(
            new_password,
            user["password"]
        ):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password cannot be the same as the old password"
            )

        hashed_password = hash_password(
            new_password
        )

        await UserRepository.update_password(
            str(user["_id"]),
            hashed_password
        )

        return {
            "message": "Password updated successfully"
        }