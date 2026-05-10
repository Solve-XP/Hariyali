import boto3
import uuid

from fastapi import HTTPException

from app.core.config import settings


s3_client = boto3.client(
    "s3",
    aws_access_key_id=settings.AWS_ACCESS_KEY,
    aws_secret_access_key=settings.AWS_SECRET_KEY,
    region_name=settings.AWS_REGION
)


async def upload_file_to_s3(file, folder):

    try:

        file_extension = file.filename.split(".")[-1]

        file_name = (
            f"{folder}/{uuid.uuid4()}.{file_extension}"
        )

        s3_client.upload_fileobj(
            file.file,
            settings.AWS_BUCKET_NAME,
            file_name,
            ExtraArgs={
                "ContentType": file.content_type
            }
        )

        file_url = (
            f"https://{settings.AWS_BUCKET_NAME}.s3."
            f"{settings.AWS_REGION}.amazonaws.com/{file_name}"
        )

        return file_url

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"S3 Upload Failed: {str(e)}"
        )