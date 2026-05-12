from datetime import date

from typing import Optional

from pydantic import (
    BaseModel,
    Field
)


class CropCreateSchema(BaseModel):

    farm_id: str

    crop_name: str = Field(
        min_length=2,
        max_length=100
    )

    season: str

    sowing_date: date

    expected_harvest_date: Optional[
        date
    ] = None


class CropUpdateSchema(BaseModel):

    crop_name: Optional[str] = None

    season: Optional[str] = None

    sowing_date: Optional[
        date
    ] = None

    expected_harvest_date: Optional[
        date
    ] = None


class CropResponseSchema(BaseModel):

    id: str

    farm_id: str

    financial_year: str

    crop_name: str

    season: str

    sowing_date: date

    expected_harvest_date: Optional[
        date
    ]