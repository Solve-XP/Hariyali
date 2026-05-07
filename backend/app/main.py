from fastapi import FastAPI

from app.api.v1.router import api_router

from app.lifespan import lifespan

from app.middleware.logging_middleware import (
    LoggingMiddleware
)

from app.middleware.error_handler import (
    global_exception_handler
)


app = FastAPI(
    title="Farm Management API",
    lifespan=lifespan
)


# REGISTER MIDDLEWARE

app.add_middleware(
    LoggingMiddleware
)


# REGISTER GLOBAL EXCEPTION HANDLER

app.add_exception_handler(
    Exception,
    global_exception_handler
)


# REGISTER ROUTERS

app.include_router(
    api_router,
    prefix="/api/v1"
)


@app.get("/")
async def root():

    return {
        "message": "API Running"
    }