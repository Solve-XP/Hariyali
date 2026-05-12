from fastapi import APIRouter

from app.schemas.auth import (
    SignupRequest,
    LoginRequest,
    TokenResponse
)

from app.services.auth_service import (
    AuthService
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/signup",
    response_model=TokenResponse
)
async def signup(user: SignupRequest):

    return await AuthService.signup(user)


@router.post(
    "/login",
    response_model=TokenResponse
)
async def login(user: LoginRequest):

    return await AuthService.login(user)