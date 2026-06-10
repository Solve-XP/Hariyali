# app/schemas/rental.py

from typing import Optional

from typing import Optional, List

from pydantic import BaseModel


class RentalCreate(BaseModel):

    equipment_name: str

    price_per_hour: Optional[float] = None

    price_per_day: Optional[float] = None

    village: str

    taluka: str

    district: str

    state: str

    latitude: Optional[float] = None

    longitude: Optional[float] = None

    owner_name: str

    phone: str

    description: Optional[str] = None

    equipment_images: List[str]

class RentalUpdate(BaseModel):

    equipment_name: Optional[str] = None

    price_per_hour: Optional[float] = None

    price_per_day: Optional[float] = None

    village: Optional[str] = None

    taluka: Optional[str] = None

    district: Optional[str] = None

    state: Optional[str] = None

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    owner_name: Optional[str] = None

    phone: Optional[str] = None

    description: Optional[str] = None

    is_available: Optional[bool] = None