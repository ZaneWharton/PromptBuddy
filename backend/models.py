from sqlmodel import SQLModel, Field
from sqlalchemy import JSON, Column
from datetime import datetime, timezone

class PromptAnalysis(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    prompt: str
    intent: str
    ambiguity: list = Field(sa_column=Column(JSON))
    risks: list = Field(sa_column=Column(JSON))
    suggestions: list = Field(sa_column=Column(JSON))
    confidence_score: float
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))