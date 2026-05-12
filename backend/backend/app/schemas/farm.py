from pydantic import BaseModel, Field
from typing import Optional


class FarmCreate(BaseModel):
    farm_name: str = Field(..., min_length=2, max_length=100)
    acres: float = Field(..., gt=0)
    location: str
    soil_type: str


class FarmUpdate(BaseModel):
    farm_name: Optional[str] = None
    acres: Optional[float] = None
    location: Optional[str] = None
    soil_type: Optional[str] = None


class FarmResponse(BaseModel):
    id: str
    farm_name: str
    acres: float
    location: str
    soil_type: str
    farm_photo: Optional[str]