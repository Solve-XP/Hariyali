from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
)

from app.schemas.farm import (
    FarmCreate,
    FarmUpdate
)

from app.services.farm_service import FarmService

from app.repositories.farm_repo import FarmRepository

from app.db.database import farms_collection

from app.api.dependencies.auth import (
    require_roles
)


router = APIRouter(
    prefix="/farms",
    tags=["Farms"]
)


farm_repo = FarmRepository(
    farms_collection
)

farm_service = FarmService(
    farm_repo
)


@router.post("/")
async def create_farm(
    payload: FarmCreate,
    current_user: dict = Depends(
        require_roles(["farmer"])
    )
):

    return await farm_service.create_farm(
        user_id=str(current_user["_id"]),
        payload=payload
    )


@router.get("/")
async def get_all_farms(
    search: Optional[str] = None,
    current_user: dict = Depends(
        require_roles(["farmer"])
    )
):

    return await farm_service.get_all_farms(
        user_id=str(current_user["_id"]),
        search=search
    )


@router.get("/{farm_id}")
async def get_farm_by_id(
    farm_id: str,
    current_user: dict = Depends(
        require_roles(["farmer"])
    )
):

    return await farm_service.get_farm_by_id(
        farm_id=farm_id,
        user_id=str(current_user["_id"])
    )


@router.put("/{farm_id}")
async def update_farm(
    farm_id: str,
    payload: FarmUpdate,
    current_user: dict = Depends(
        require_roles(["farmer"])
    )
):

    return await farm_service.update_farm(
        farm_id=farm_id,
        user_id=str(current_user["_id"]),
        payload=payload
    )

@router.delete("/{farm_id}")
async def delete_farm(
    farm_id: str,
    current_user: dict = Depends(
        require_roles(["farmer"])
    )
):

    return await farm_service.delete_farm(
        farm_id=farm_id,
        user_id=str(current_user["_id"])
    )