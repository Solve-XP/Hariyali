from fastapi import APIRouter

from app.api.v1.endpoints import auth
from app.api.v1.endpoints import farms
from app.api.v1.endpoints import crops

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(farms.router)
api_router.include_router(crops.router)