"""
Application Settings

Configuration with feature flags.
"""

from pydantic_settings import BaseSettings
from typing import Optional, List


class Settings(BaseSettings):
    """Application settings"""
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    ALLOWED_ORIGINS: List[str] = ["*"]
    
    # Database
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "codex_grader"
    
    # Executor
    EXECUTOR_TYPE: str = "docker"  # "local" or "docker"
    DOCKER_ENABLED: bool = True
    EARLY_EXIT_ON_FAILURE: bool = True
    MAX_CONCURRENT_GRADINGS: int = 10
    
    # Feedback
    FEEDBACK_ENABLED: bool = True
    AI_FEEDBACK_ENABLED: bool = False
    AI_PROVIDER: Optional[str] = None
    AI_API_KEY: Optional[str] = None
    AI_TIMEOUT_SECONDS: int = 30
    FEEDBACK_SCHEMA_VERSION: str = "v1"
    
    # Rate Limiting
    RATE_LIMIT_SUBMISSIONS_PER_MINUTE: int = 5
    RATE_LIMIT_POLLS_PER_MINUTE: int = 30
    
    # Timeouts
    GRADING_TIMEOUT_SECONDS: int = 60
    FEEDBACK_GENERATION_TIMEOUT_SECONDS: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
