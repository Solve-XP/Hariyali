from bson import ObjectId


ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
]


def validate_image_type(
    content_type: str
) -> bool:

    return content_type in ALLOWED_IMAGE_TYPES


def is_valid_object_id(
    id: str
) -> bool:

    return ObjectId.is_valid(id)