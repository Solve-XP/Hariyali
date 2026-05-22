import asyncio

from app.db.database import incomes_collection


async def main():

    doc = await incomes_collection.find_one()

    print(doc)


asyncio.run(main())