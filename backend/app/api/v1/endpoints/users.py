# app/api/v1/endpoints/users.py

from fastapi import (
    APIRouter,
    Depends
)

from app.api.dependencies.auth import (
    get_current_user
)

from app.schemas.user import (
    UserProfileResponse,
    UpdateProfileRequest,
    ChangePasswordRequest
)

from app.services.user_service import (
    UserService
)


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get(
    "/me",
    response_model=UserProfileResponse
)
async def get_my_profile(
    current_user: dict = Depends(get_current_user)
):

    return await UserService.get_current_user_profile(
        current_user
    )


@router.patch(
    "/me",
    response_model=UserProfileResponse
)
async def update_my_profile(
    payload: UpdateProfileRequest,
    current_user: dict = Depends(get_current_user)
):

    return await UserService.update_profile(
        current_user,
        payload
    )


@router.patch(
    "/change-password"
)
async def change_password(
    payload: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user)
):

    return await UserService.change_password(
        current_user,
        payload
    )