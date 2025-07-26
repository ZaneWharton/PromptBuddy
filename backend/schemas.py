from pydantic import BaseModel
from typing import List
from datetime import datetime

#Pydantic schemas for request validation and output formatting

class Prompt(BaseModel):
    prompt: str

#Gemini-generate analysis
class PromptAnalysisGemini(BaseModel):
    intent: str
    ambiguity: List[str]
    risks: List[str]
    suggestions: List[str]
    confidence_score: float

#DB results
class PromptAnalysisDB(PromptAnalysisGemini):
    id: int
    prompt: str
    timestamp: datetime

    class config:
        orm_mode = True

