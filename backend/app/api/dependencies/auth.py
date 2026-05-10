from fastapi import (
    Depends,
    HTTPException,
    status
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from jose import JWTError

from bson import ObjectId

from app.core.security import decode_access_token

from app.db.database import users_collection


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials"
    )

    try:

        payload = decode_access_token(token)

        user_id = payload.get("user_id")

        if not user_id:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = await users_collection.find_one({
        "_id": ObjectId(user_id)
    })

    if not user:
        raise credentials_exception

    return user


def require_roles(allowed_roles: list):

    async def role_checker(
        current_user: dict = Depends(get_current_user)
    ):

        if current_user["role"] not in allowed_roles:

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )

        return current_user

    return role_checker