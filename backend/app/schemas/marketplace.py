# app/schemas/marketplace.py

from datetime import date

from typing import Optional

from pydantic import (
    BaseModel,
    Field
)


class MarketplaceCreateSchema(BaseModel):

    farm_id: str

    farm_name: str

    crop_id: str

    crop_name: str = Field(
        min_length=2,
        max_length=100
    )

    quantity: float

    unit: str

    expected_price: float

    harvest_date: date

    village: str

    taluka: str

    district: str

    state: str
    
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    description: Optional[str] = None


class MarketplaceUpdateSchema(BaseModel):

    farm_id: Optional[str] = None

    farm_name: Optional[str] = None

    crop_id: Optional[str] = None

    crop_name: Optional[str] = None

    quantity: Optional[float] = None

    unit: Optional[str] = None

    expected_price: Optional[float] = None

    harvest_date: Optional[date] = None

    village: Optional[str] = None

    taluka: Optional[str] = None

    district: Optional[str] = None

    state: Optional[str] = None

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    description: Optional[str] = None