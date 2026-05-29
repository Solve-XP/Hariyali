import asyncio

from app.db.database import (
    marketplace_collection,
    rentals_collection
)


async def migrate():

    marketplace_result = await marketplace_collection.update_many(
        {},
        {
            "$set": {
                "latitude": None,
                "longitude": None
            }
        }
    )

    print(
        f"Marketplace updated: {marketplace_result.modified_count}"
    )

    rentals_result = await rentals_collection.update_many(
        {},
        {
            "$set": {
                "latitude": None,
                "longitude": None
            }
        }
    )

    print(
        f"Rentals updated: {rentals_result.modified_count}"
    )

    print(
        "Migration completed successfully."
    )


if __name__ == "__main__":
    asyncio.run(
        migrate()
    )