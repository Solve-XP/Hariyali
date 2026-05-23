from fastapi import APIRouter

from app.api.v1.endpoints import auth
from app.api.v1.endpoints import farms
from app.api.v1.endpoints import crops
from app.api.v1.endpoints import fertilizers
from app.api.v1.endpoints import pesticides
from app.api.v1.endpoints import expenses
from app.api.v1.endpoints import incomes
from app.api.v1.endpoints import rentals
from app.api.v1.endpoints import dashboard
from app.api.v1.endpoints import users




api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(farms.router)
api_router.include_router(crops.router)
api_router.include_router(fertilizers.router)
api_router.include_router(pesticides.router)
api_router.include_router(expenses.router)
api_router.include_router(incomes.router)
api_router.include_router(rentals.router)
api_router.include_router(dashboard.router)
api_router.include_router(users.router)