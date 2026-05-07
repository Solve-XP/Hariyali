from fastapi import APIRouter, Depends

from app.core.security import require_admin

from app.repositories.user_repo import (
    UserRepository
)

router = APIRouter()


@router.get("")
async def list_users(
    _: dict = Depends(require_admin)
):

    users = await UserRepository.get_all_farmers()

    data = []

    for u in users:
        data.append({
            "id": str(u["_id"]),
            "name": u["name"],
            "phone": u.get("phone", ""),
            "status": u.get("status", "active"),
        })

    return {
        "data": data
    }