from fastapi import (
    HTTPException,
    status
)

from app.repositories.user_repo import (
    UserRepository
)

from app.schemas.user import (
    UpdateProfileRequest,
    ChangePasswordRequest
)

from app.core.security import (
    verify_password,
    hash_password
)


class UserService:

    @staticmethod
    async def get_current_user_profile(
        current_user: dict
    ):

        return {
            "id": str(current_user["_id"]),
            "name": current_user.get("name") or "",
            "phone": current_user.get("phone") or "",
            "role": current_user.get("role") or ""
        }

    @staticmethod
    async def update_profile(
        current_user: dict,
        payload: UpdateProfileRequest
    ):

        update_data = {}

        # ---------------------------------------------------
        # UPDATE NAME
        # ---------------------------------------------------

        if payload.name is not None:

            cleaned_name = payload.name.strip()

            if cleaned_name != (current_user.get("name") or ""):

                update_data["name"] = cleaned_name

        # ---------------------------------------------------
        # UPDATE PHONE
        # ---------------------------------------------------

        if payload.phone is not None:

            cleaned_phone = payload.phone.strip()

            if cleaned_phone != (current_user.get("phone") or ""):

                existing_user = await UserRepository.get_user_by_phone(
                    cleaned_phone
                )

                if (
                    existing_user
                    and
                    str(existing_user["_id"]) != str(current_user["_id"])
                ):

                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Phone number already exists"
                    )

                update_data["phone"] = cleaned_phone

        # ---------------------------------------------------
        # NO CHANGES
        # ---------------------------------------------------

        if not update_data:

            return {
                "id": str(current_user["_id"]),
                "name": current_user.get("name") or "",
                "phone": current_user.get("phone") or "",
                "role": current_user.get("role") or ""
            }

        # ---------------------------------------------------
        # UPDATE USER
        # ---------------------------------------------------

        await UserRepository.update_user(
            str(current_user["_id"]),
            update_data
        )

        updated_user = await UserRepository.get_user_by_id(
            str(current_user["_id"])
        )

        return {
            "id": str(updated_user["_id"]),
            "name": updated_user.get("name") or "",
            "phone": updated_user.get("phone") or "",
            "role": updated_user.get("role") or ""
        }

    @staticmethod
    async def change_password(
        current_user: dict,
        payload: ChangePasswordRequest
    ):

        password_valid = verify_password(
            payload.current_password,
            current_user["password"]
        )

        if not password_valid:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )

        if payload.current_password == payload.new_password:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password must be different"
            )

        hashed_password = hash_password(
            payload.new_password
        )

        await UserRepository.update_password(
            str(current_user["_id"]),
            hashed_password
        )

        return {
            "message": "Password updated successfully"
        }