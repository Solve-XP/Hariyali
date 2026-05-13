from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FertilizerCreate(BaseModel):

    farm_id: str

    crop_id: str

    fertilizer_name: str

    quantity: float

    unit: str

    cost: float

    application_date: datetime

    notes: Optional[str] = None


class FertilizerUpdate(BaseModel):

    fertilizer_name: Optional[str] = None

    quantity: Optional[float] = None

    unit: Optional[str] = None

    cost: Optional[float] = None

    application_date: Optional[datetime] = None

    notes: Optional[str] = None