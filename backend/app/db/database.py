from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings


client = AsyncIOMotorClient(
    settings.MONGO_URL
)

database = client[
    settings.DATABASE_NAME
]

users_collection = database["users"]
farms_collection = database["farms"]
crop_collection = database["crops"]
fertilizers_collection = database["fertilizers"]
pesticides_collection = database["pesticides"]