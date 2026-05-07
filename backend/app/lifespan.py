from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.db.indexes import create_indexes


@asynccontextmanager
async def lifespan(app: FastAPI):

    await create_indexes()

    yield