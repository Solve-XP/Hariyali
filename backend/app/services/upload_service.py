from app.integrations.s3 import (
    generate_presigned_upload_url
)


class UploadService:

    @staticmethod
    async def generate_upload_urls(
        folder: str,
        content_types: list[str]
    ):

        uploads = []

        for content_type in content_types:

            uploads.append(
                generate_presigned_upload_url(
                    folder=folder,
                    content_type=content_type
                )
            )

        return {
            "uploads": uploads
        }