from app.db.database import users_collection


class UserRepository:

    @staticmethod
    async def get_user_by_phone(phone: str):

        return await users_collection.find_one(
            {"phone": phone}
        )

    @staticmethod
    async def create_user(user_data: dict):

        result = await users_collection.insert_one(
            user_data
        )

        return str(result.inserted_id)