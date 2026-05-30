from fastapi import APIRouter

from app.schemas.auth import (
    SignupRequest,
    LoginRequest,
    TokenResponse,
    ForgotPasswordRequest
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

@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest
):

    return await AuthService.forgot_password(
        request.phone,
        request.new_password,
        request.confirm_password
    )
