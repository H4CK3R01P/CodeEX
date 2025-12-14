"""
CodeEX_brain Configuration

Configuration settings for the agent system.
"""

from pydantic_settings import BaseSettings
from typing import Optional


class BrainSettings(BaseSettings):
    """CodeEX_brain configuration settings"""
    
    # LLM Integration
    LLM_PROVIDER: str = "openai"  # "openai", "anthropic", "google"
    LLM_MODEL: str = "gpt-4"
    LLM_API_KEY: Optional[str] = None
    LLM_TIMEOUT_SECONDS: int = 30
    LLM_MAX_TOKENS: int = 2000
    
    # Agent Settings
    MAX_AGENT_OPERATIONS: int = 100  # Per agent instance
    AGENT_TIMEOUT_SECONDS: int = 30
    
    # Security
    VIOLATION_ALERT_THRESHOLD: int = 3
    ENABLE_AUDIT_LOGGING: bool = True
    LOG_LEVEL: str = "INFO"
    
    # Input Sanitization
    MAX_INPUT_SIZE_BYTES: int = 1_000_000  # 1MB
    MAX_CODE_LENGTH: int = 50_000  # 50K characters
    STRIP_SENSITIVE_DATA: bool = True
    
    # Output Verification
    VERIFY_OUTPUTS: bool = True
    MAX_OUTPUT_SIZE_BYTES: int = 2_000_000  # 2MB
    
    # Authorization
    REQUIRE_AUTH_FOR_FULL_SOLUTIONS: bool = True
    MIN_ATTEMPTS_FOR_SOLUTION: int = 3
    
    # Memory Agent
    MEMORY_RETENTION_DAYS: int = 7
    MAX_CONTEXT_SIZE_KB: int = 100
    
    class Config:
        env_file = ".env"
        env_prefix = "BRAIN_"
        case_sensitive = True


settings = BrainSettings()
