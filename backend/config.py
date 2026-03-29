from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # API Keys
    groq_api_key: str = ""
    gemini_api_key: str = ""
    anthropic_api_key: str = ""
    newsapi_key: str = ""

    # Firebase
    firebase_credentials_path: str = "firebase-service-account.json"
    firebase_project_id: str = ""

    # Pipeline config
    groq_model: str = "llama-3.1-70b-versatile"
    gemini_model: str = "gemini-1.5-flash"
    claude_model: str = "claude-sonnet-4-20250514"

    # Source config
    max_articles_per_source: int = 10
    brief_max_sections: int = 5

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
