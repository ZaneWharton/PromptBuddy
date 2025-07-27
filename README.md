# PromptBuddy

PromptBuddy is designed to help you write clearer, smarter, and more effective prompts for LLMs.

## Features

**Prompt Analysis**
-Understand the intent, ambiguity, and risks involved with your prompt. Gain actionable insights and improvement suggestions.

**Prompt Revision**
-Automatically refine your prompts using Gemini with just the click of a button.

**History View**
-Browse a table of the last 10 analyzed prompts to view risks and prompt confidence associatedd with that prompt.

**Analytic Dashboard**
-Visual breakdown of common intents, risks, and how they impact confidence scores.

**Modern UI**
-Clean and polished design using Tailwind CSS and React

## Tech Stack

**Frontend**
-React
-Tailwind CSS
-Chart.js

**Backend**
-Python
-FastAPI

**ML and Data Storage**
-Gemini API
-SQLite Database

## Getting Started

**Clone the Repo**
```
git clone https://github.com/ZaneWharton/PromptBuddy.git
cd promptbuddy
```

**Setup Backend**
```
cd backend
python -m venv .venv
.venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
-Note: For local development, open main.py and set CORS origins to '*'. Then create a .env file with the environment variable GEMINI_API_KEY=your_api_key

**Setup Frontend**
```
cd frontend
npm install
npm start
```

## Deployment

This app is deployed using Render for the Backend and Vercel for the Frontend.
**Live Demo:** https://promptbuddy-omega.vercel.app/