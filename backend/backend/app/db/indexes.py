from app.db.database import users_collection


async def create_indexes():

    await users_collection.create_index(
        "phone",
        unique=True
    )