from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from app.schemas.upload import (
    BatchPresignedUrlRequest
)

from app.services.upload_service import (
    UploadService
)

from app.api.dependencies.auth import (
    get_current_user
)


router = APIRouter(
    prefix="/uploads",
    tags=["Uploads"]
)


ALLOWED_FOLDERS = {
    "farms",
    "marketplace",
    "rentals"
}


ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp"
}


FOLDER_LIMITS = {

    "farms": 1,

    "marketplace": 5,

    "rentals": 5
}


@router.post("/presigned-urls")
async def get_presigned_urls(
    payload: BatchPresignedUrlRequest,
    current_user=Depends(
        get_current_user
    )
):

    if payload.folder not in ALLOWED_FOLDERS:

        raise HTTPException(
            status_code=400,
            detail="Invalid folder"
        )

    max_allowed = (
        FOLDER_LIMITS[
            payload.folder
        ]
    )

    if len(payload.content_types) == 0:

        raise HTTPException(
            status_code=400,
            detail="At least one image required"
        )

    if (
        len(payload.content_types)
        >
        max_allowed
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                f"Maximum "
                f"{max_allowed} "
                f"images allowed"
            )
        )

    for content_type in payload.content_types:

        if content_type not in ALLOWED_CONTENT_TYPES:

            raise HTTPException(
                status_code=400,
                detail="Invalid image type"
            )

    return await UploadService.generate_upload_urls(
        folder=payload.folder,
        content_types=payload.content_types
    )