from typing import Optional

from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query

from app.schemas.fertilizer import (
    FertilizerCreate,
    FertilizerUpdate
)

from app.services.fertilizer_service import (
    FertilizerService
)

from app.api.dependencies.auth import (
    get_current_user
)


router = APIRouter(
    prefix="/fertilizers",
    tags=["Fertilizers"]
)

fertilizer_service = (
    FertilizerService()
)


@router.post("")
async def create_fertilizer(
    data: FertilizerCreate,
    current_user=Depends(
        get_current_user
    )
):

    return await fertilizer_service.create_fertilizer(
        str(current_user["_id"]),
        data
    )


@router.get("")
async def get_all_fertilizers(
    farm_id: Optional[str] = Query(None),
    crop_id: Optional[str] = Query(None),
    financial_year: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user=Depends(
        get_current_user
    )
):

    return await fertilizer_service.get_all_fertilizers(
        str(current_user["_id"]),
        farm_id,
        crop_id,
        financial_year,
        search
    )


@router.get("/{fertilizer_id}")
async def get_fertilizer_by_id(
    fertilizer_id: str,
    current_user=Depends(
        get_current_user
    )
):

    return await fertilizer_service.get_fertilizer_by_id(
        fertilizer_id,
        str(current_user["_id"])
    )


@router.patch("/{fertilizer_id}")
async def update_fertilizer(
    fertilizer_id: str,
    data: FertilizerUpdate,
    current_user=Depends(
        get_current_user
    )
):

    return await fertilizer_service.update_fertilizer(
        fertilizer_id,
        str(current_user["_id"]),
        data
    )


@router.delete("/{fertilizer_id}")
async def delete_fertilizer(
    fertilizer_id: str,
    current_user=Depends(
        get_current_user
    )
):

    return await fertilizer_service.delete_fertilizer(
        fertilizer_id,
        str(current_user["_id"])
    )