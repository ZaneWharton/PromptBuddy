#Run server: uvicorn main:app --reload
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from gemini_wrapper import analyze_prompt, prompt_suggestion
from schemas import PromptAnalysisGemini, PromptAnalysisDB, PromptRequest
from db import init_db, get_session
from models import PromptAnalysis
from sqlmodel import select
import json
from typing import List
from collections import Counter

app = FastAPI()
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

#Root endpoint, currently a health check
@app.get("/")
async def root():
    return {"message": "App is Running"}

#Endpoint to analyze the prompt input by the user
@app.post("/analyze", response_model=PromptAnalysisGemini)
async def analyze(req: PromptRequest):
    try:
        result_text = analyze_prompt(req.prompt)
        parsed = json.loads(result_text)

        db_entry = PromptAnalysis(
            prompt=req.prompt,
            intent=parsed["intent"],
            ambiguity=parsed["ambiguity"],
            risks=parsed["risks"],
            suggestions=parsed["suggestions"],
            confidence_score=float(parsed["confidence_score"])
        )
        with get_session() as session:
            session.add(db_entry)
            session.commit()
            session.refresh(db_entry)

        return parsed
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#Endpoint to return last 10 prompt analysis entries in the database
@app.get("/history", response_model=List[PromptAnalysisDB])
async def get_history():
    with get_session() as session:
        statement = select(PromptAnalysis).order_by(PromptAnalysis.timestamp.desc()).limit(10)
        results = session.exec(statement).all()
        return results
    
@app.post("/revise")
async def revise_prompt(req: PromptRequest):
    try:
        result_text = prompt_suggestion(req.prompt)

        return result_text
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/analytics")
async def get_analytics():
    with get_session() as session:
        prompts = session.exec(select(PromptAnalysis)).all()
    if not prompts:
        return JSONResponse(content={}, status_code=200)
    
    #Total analysis provided
    total_analysis = len(prompts)
    
    #Normalize the intents and risks for consistency
    normalized_intents = [normalize_intent(p.intent) for p in prompts]
    normalized_risks = [normalize_risks(p.risks) for p in prompts]

    #Flatten the risks list to use with counter
    flattened_risks = [risk for sublist in normalized_risks for risk in sublist]

    #Amt of occurences for each intent and risk
    intents = Counter(normalized_intents)
    risks = Counter(flattened_risks)

    #Average prompt confidence
    avg_confidence = round(sum(p.confidence_score for p in prompts) / total_analysis, 3)

    #Shows confidence for each intent
    confidence_by_intent = {}
    for p, intent in zip(prompts, normalized_intents):
        if intent not in confidence_by_intent:
            confidence_by_intent[intent] = []
        confidence_by_intent[intent].append(p.confidence_score)

    #Shows confidence for each risk
    confidence_by_risk = {}
    for p, risks_list in zip(prompts, normalized_risks):
        for r in risks_list:
            if r not in confidence_by_risk:
                confidence_by_risk[r] = []
            confidence_by_risk[r].append(p.confidence_score)
    
    return {
        "total": total_analysis,
        "intents": intents,
        "risks": risks,
        "avg_confidence": avg_confidence,
        "confidence_by_intent": confidence_by_intent,
        "confidence_by_risk": confidence_by_risk,
    }


#Helper Functions
def normalize_intent(raw_intent: str) -> str:
    raw = raw_intent.lower()

    if any(keyword in raw for keyword in ["summary", "summarize", "summarizing"]):
        return "summarize"
    if any(keyword in raw for keyword in ["generate", "generation", "create"]):
        return "generate"
    if any(keyword in raw for keyword in ["calculate", "compute", "calculation"]):
        return "calculate"
    if any(keyword in raw for keyword in ["answer", "question", "query"]):
        return "answer_question"
    if any(keyword in raw for keyword in ["rephrase", "rewrite", "revise", "revision"]):
        return "rewrite"
    if any(keyword in raw for keyword in ["extract", "identify", "pull out", "recognition"]):
        return "extract"
    if any(keyword in raw for keyword in ["unknown"]):
        return "unknown"
    return "other"

def normalize_risks(raw_risks: list[str]) -> list[str]:
    normalized = []

    for r in raw_risks:
        r_lower = r.lower()
        if "hallucinat" in r_lower:
            normalized.append("hallucination")
        elif "bias" in r_lower:
            normalized.append("bias")
        elif "overload" in r_lower:
            normalized.append("overload")
        elif "misinterpret" in r_lower:
            normalized.append("misinterpretation")
        elif "security" in r_lower:
            normalized.append("security")
        elif "privacy" in r_lower:
            normalized.append("privacy")
        elif "ethical" in r_lower:
            normalized.append("ethical")
        else:
            normalized.append("other")
    return normalized