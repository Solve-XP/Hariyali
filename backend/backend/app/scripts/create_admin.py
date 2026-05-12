import asyncio

from motor.motor_asyncio import AsyncIOMotorClient

from passlib.context import CryptContext

from app.core.config import settings


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


async def create_admin():

    client = AsyncIOMotorClient(
        settings.MONGO_URL
    )

    database = client[
        settings.DATABASE_NAME
    ]

    users_collection = database["users"]

    phone = "9999999999"

    existing_admin = await users_collection.find_one(
        {"phone": phone}
    )

    if existing_admin:

        print("Admin already exists")
        return

    hashed_password = pwd_context.hash(
        "admin123"
    )

    admin_data = {
        "name": "Super Admin",
        "phone": "9999999999",
        "password": hashed_password,
        "role": "admin"
    }

    await users_collection.insert_one(
        admin_data
    )

    print("Admin created successfully")


asyncio.run(create_admin())