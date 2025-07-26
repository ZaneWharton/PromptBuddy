#Run server: uvicorn main:app --reload
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from gemini_wrapper import analyze_prompt
from schemas import PromptAnalysis, PromptRequest
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Root endpoint, currently a health check
@app.get("/")
async def root():
    return {"message": "App is Running"}

#Endpoint to analyze the prompt input by the user
@app.post("/analyze", response_model=PromptAnalysis)
async def analyze(req: PromptRequest):
    try:
        result_text = analyze_prompt(req.prompt)
        parsed = json.loads(result_text)
        return parsed
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
