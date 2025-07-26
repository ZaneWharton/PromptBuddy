from pydantic import BaseModel

#Pydantic schemas for request validation and output formatting

class PromptRequest(BaseModel):
    prompt: str

class PromptAnalysis(BaseModel):
    intent: str
    ambiguity: list[str]
    risks: list[str]
    suggestions: list[str]
    confidence_score: float