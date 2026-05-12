# app/api/v1/endpoints/crops.py

from fastapi import (
    APIRouter,
    Depends,
    Query
)

from app.schemas.crop import (
    CropCreateSchema,
    CropUpdateSchema
)

from app.api.dependencies.auth import (
    get_current_user
)

from app.db.database import (
    crop_collection
)

from app.repositories.crop_repo import (
    CropRepository
)

from app.services.crop_service import (
    CropService
)


router = APIRouter(
    prefix="/crops",
    tags=["Crops"]
)


crop_repo = CropRepository(
    crop_collection
)

crop_service = CropService(
    crop_repo
)


@router.post("")
async def create_crop(
    payload: CropCreateSchema,
    current_user=Depends(
        get_current_user
    )
):

    return await crop_service.create_crop(
        user_id=str(
            current_user["_id"]
        ),
        payload=payload
    )


@router.get("")
async def get_all_crops(
    search: str = Query(
        default=None
    ),
    farm_id: str = Query(
        default=None
    ),
    season: str = Query(
        default=None
    ),
    financial_year: str = Query(
        default=None
    ),
    current_user=Depends(
        get_current_user
    )
):

    return await crop_service.get_all_crops(
        user_id=str(
            current_user["_id"]
        ),
        search=search,
        farm_id=farm_id,
        season=season,
        financial_year=financial_year
    )


@router.get("/{crop_id}")
async def get_crop_by_id(
    crop_id: str,
    current_user=Depends(
        get_current_user
    )
):

    return await crop_service.get_crop_by_id(
        crop_id=crop_id,
        user_id=str(
            current_user["_id"]
        )
    )


@router.put("/{crop_id}")
async def update_crop(
    crop_id: str,
    payload: CropUpdateSchema,
    current_user=Depends(
        get_current_user
    )
):

    return await crop_service.update_crop(
        crop_id=crop_id,
        user_id=str(
            current_user["_id"]
        ),
        payload=payload
    )


@router.delete("/{crop_id}")
async def delete_crop(
    crop_id: str,
    current_user=Depends(
        get_current_user
    )
):

    return await crop_service.delete_crop(
        crop_id=crop_id,
        user_id=str(
            current_user["_id"]
        )
    )