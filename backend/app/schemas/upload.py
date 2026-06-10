from typing import List

from pydantic import BaseModel


class BatchPresignedUrlRequest(BaseModel):

    folder: str

    content_types: List[str]