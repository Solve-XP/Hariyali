from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    # MongoDB
    MONGO_URL: str
    DATABASE_NAME: str

    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # AWS S3
    AWS_ACCESS_KEY: str
    AWS_SECRET_KEY: str
    AWS_REGION: str
    AWS_BUCKET_NAME: str

    class Config:
        env_file = ".env"


settings = Settings()