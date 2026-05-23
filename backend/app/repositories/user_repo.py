# app/repositories/user_repo.py

from bson import ObjectId

from app.db.database import users_collection


class UserRepository:

    @staticmethod
    async def get_user_by_phone(phone: str):

        return await users_collection.find_one({
            "phone": phone
        })

    @staticmethod
    async def create_user(user_data: dict):

        result = await users_collection.insert_one(
            user_data
        )

        return str(result.inserted_id)

    @staticmethod
    async def get_user_by_id(user_id: str):

        return await users_collection.find_one({
            "_id": ObjectId(user_id)
        })

    @staticmethod
    async def update_user(
        user_id: str,
        update_data: dict
    ):

        await users_collection.update_one(
            {
                "_id": ObjectId(user_id)
            },
            {
                "$set": update_data
            }
        )

    @staticmethod
    async def update_password(
        user_id: str,
        hashed_password: str
    ):

        await users_collection.update_one(
            {
                "_id": ObjectId(user_id)
            },
            {
                "$set": {
                    "password": hashed_password
                }
            }
        )