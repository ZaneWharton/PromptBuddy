#Run server: uvicorn main:app --reload
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from gemini_wrapper import analyze_prompt, prompt_suggestion
from schemas import PromptAnalysisGemini, PromptAnalysisDB, Prompt
from db import init_db, get_session
from models import PromptAnalysis
from sqlmodel import select
import json
from typing import List
import traceback

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
async def analyze(req: Prompt):
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
async def revise_prompt(req: Prompt):
    try:
        result_text = prompt_suggestion(req.prompt)

        return result_text
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))