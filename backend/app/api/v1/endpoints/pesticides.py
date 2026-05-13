from typing import Optional

from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query

from app.schemas.pesticide import (
    PesticideCreate,
    PesticideUpdate
)

from app.services.pesticide_service import (
    PesticideService
)

from app.api.dependencies.auth import (
    get_current_user
)


router = APIRouter(
    prefix="/pesticides",
    tags=["Pesticides"]
)

pesticide_service = (
    PesticideService()
)


@router.post("")
async def create_pesticide(
    data: PesticideCreate,
    current_user=Depends(
        get_current_user
    )
):

    return await pesticide_service.create_pesticide(
        str(current_user["_id"]),
        data
    )


@router.get("")
async def get_all_pesticides(
    farm_id: Optional[str] = Query(None),
    crop_id: Optional[str] = Query(None),
    financial_year: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user=Depends(
        get_current_user
    )
):

    return await pesticide_service.get_all_pesticides(
        str(current_user["_id"]),
        farm_id,
        crop_id,
        financial_year,
        search
    )


@router.get("/{pesticide_id}")
async def get_pesticide_by_id(
    pesticide_id: str,
    current_user=Depends(
        get_current_user
    )
):

    return await pesticide_service.get_pesticide_by_id(
        pesticide_id,
        str(current_user["_id"])
    )


@router.patch("/{pesticide_id}")
async def update_pesticide(
    pesticide_id: str,
    data: PesticideUpdate,
    current_user=Depends(
        get_current_user
    )
):

    return await pesticide_service.update_pesticide(
        pesticide_id,
        str(current_user["_id"]),
        data
    )


@router.delete("/{pesticide_id}")
async def delete_pesticide(
    pesticide_id: str,
    current_user=Depends(
        get_current_user
    )
):

    return await pesticide_service.delete_pesticide(
        pesticide_id,
        str(current_user["_id"])
    )