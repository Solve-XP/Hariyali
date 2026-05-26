# app/api/v1/endpoints/marketplace.py

from typing import (
    List,
    Optional
)

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    UploadFile
)

from app.schemas.marketplace import (
    MarketplaceCreateSchema,
    MarketplaceUpdateSchema
)

from app.services.marketplace_service import (
    MarketplaceService
)

from app.repositories.marketplace_repo import (
    MarketplaceRepository
)

from app.db.database import (
    marketplace_collection
)

from app.api.dependencies.auth import (
    require_roles
)


router = APIRouter(
    prefix="/marketplace",
    tags=["Marketplace"]
)


marketplace_repo = MarketplaceRepository(
    marketplace_collection
)

marketplace_service = MarketplaceService(
    marketplace_repo
)


@router.post("/listings")
async def create_listing(

    farm_id: str = Form(...),

    farm_name: str = Form(...),

    crop_id: str = Form(...),

    crop_name: str = Form(...),

    quantity: float = Form(...),

    unit: str = Form(...),

    expected_price: float = Form(...),

    harvest_date: str = Form(...),

    village: str = Form(...),

    taluka: str = Form(...),

    district: str = Form(...),

    state: str = Form(...),

    description: str = Form(None),

    crop_images: List[UploadFile] = File(...),

    current_user: dict = Depends(
        require_roles(["farmer"])
    )
):

    payload = MarketplaceCreateSchema(
        farm_id=farm_id,
        farm_name=farm_name,
        crop_id=crop_id,
        crop_name=crop_name,
        quantity=quantity,
        unit=unit,
        expected_price=expected_price,
        harvest_date=harvest_date,
        village=village,
        taluka=taluka,
        district=district,
        state=state,
        description=description
    )

    return await marketplace_service.create_listing(
        current_user,
        payload,
        crop_images
    )


@router.get("/listings")
async def get_all_listings(

    search: Optional[str] = None,

    exclude_my_listings: bool = False,

    current_user: dict = Depends(
        require_roles([
            "farmer",
            "merchant"
        ])
    )
):

    return await marketplace_service.get_all_listings(
        search=search,
        current_user_id=str(
            current_user["_id"]
        ),
        exclude_my_listings=exclude_my_listings
    )

@router.get("/public/listings")
async def get_public_listings(

    search: Optional[str] = None
):

    return await marketplace_service.get_public_listings(
        search=search
    )


@router.get("/my-listings")
async def get_my_listings(

    current_user: dict = Depends(
        require_roles(["farmer"])
    )
):

    return await marketplace_service.get_my_listings(
        str(current_user["_id"])
    )


@router.get("/listings/{listing_id}")
async def get_listing_by_id(

    listing_id: str,

    current_user: dict = Depends(
        require_roles([
            "farmer",
            "merchant"
        ])
    )
):

    return await marketplace_service.get_listing_by_id(
        listing_id
    )


@router.patch("/listings/{listing_id}")
async def update_listing(

    listing_id: str,

    payload: MarketplaceUpdateSchema,

    current_user: dict = Depends(
        require_roles(["farmer"])
    )
):

    return await marketplace_service.update_listing(
        listing_id,
        str(current_user["_id"]),
        payload
    )


@router.delete("/listings/{listing_id}")
async def delete_listing(

    listing_id: str,

    current_user: dict = Depends(
        require_roles(["farmer"])
    )
):

    return await marketplace_service.delete_listing(
        listing_id,
        str(current_user["_id"])
    )