from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    UploadFile
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
    farm_name: str = Form(...),
    acres: float = Form(...),
    location: str = Form(...),
    soil_type: str = Form(...),
    farm_photo: UploadFile = File(...),
    current_user: dict = Depends(
        require_roles(["farmer"])
    )
):

    payload = FarmCreate(
        farm_name=farm_name,
        acres=acres,
        location=location,
        soil_type=soil_type
    )

    return await farm_service.create_farm(
        user_id=str(current_user["_id"]),
        payload=payload,
        farm_photo=farm_photo
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
    farm_name: str = Form(None),
    acres: float = Form(None),
    location: str = Form(None),
    soil_type: str = Form(None),
    farm_photo: UploadFile = File(None),
    current_user: dict = Depends(
        require_roles(["farmer"])
    )
):

    payload = FarmUpdate(
        farm_name=farm_name,
        acres=acres,
        location=location,
        soil_type=soil_type
    )

    return await farm_service.update_farm(
        farm_id=farm_id,
        user_id=str(current_user["_id"]),
        payload=payload,
        farm_photo=farm_photo
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