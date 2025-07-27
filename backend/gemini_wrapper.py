import google.genai as genai
from dotenv import load_dotenv
import os
import re
import json

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

#Gemini Wrapper. Analyzes user's prompt, gives suggestions for improvement.
def analyze_prompt(prompt: str) -> str:
    gemini_prompt = f"""
        You are an expert prompt engineer and AI safety specialist.
        Your task is to meticulously analyze a given user prompt and provide a structured JSON output.

        Output Format:
        Your response MUST be a valid JSON object with the following exact structure:
        ```json
        {{
            "intent": "string (e.g., 'Summarize Document', 'Generate Code', 'Answer Question')",
            "ambiguity": [
                "string (description of vague/unclear parts, if any)"
            ],
            "risks": [
                "string (e.g., 'Hallucination', 'Bias', 'Data Privacy', 'Overload', 'Misinterpretation', 'Security Vulnerabilities', 'Ethical Concerns', if any)"
            ],
            "suggestions": [
                "string (actionable advice for rephrasing, improving clarity, mitigating risks, or enhancing format)"
            ],
            "confidence_score": "float (0.0 to 1.0, indicating confidence in prompt effectiveness)"
        }}
        ```
        If a category has no findings, provide an empty array for lists or an empty string for single values.

        Analysis Criteria:
        - intent: Clearly identify the primary goal or purpose of the user's prompt.
        - ambiguity: Point out any parts of the prompt that are vague, open to multiple interpretations, or lack necessary detail.
        - risks: Identify and justify the reasoning for potential issues such as:
            - Hallucination: Likelihood of generating factually incorrect or fabricated information.
            - Bias: Potential for biased or unfair outputs based on prompt wording or inherent model biases.
            - Overload: If the prompt is too long or complex for efficient processing.
            - Misinterpretation: If the prompt could be easily misunderstood by the AI.
            - Security: If the prompt could lead to insecure code or data exposure.
            - Privacy: If the prompt involves sensitive personal information without proper handling.
            - Ethical Concerns: Any potential misuse or harmful applications.
        - suggestions: Offer concrete, actionable advice to improve the prompt. This includes:
            - Rephrasing for clarity and specificity.
            - Suggestions for better formatting (e.g., using bullet points, code blocks).
            - Strategies to mitigate identified risks.
            - Ways to make the prompt more efficient or effective.
        - confidence_score: A float between 0.0 and 1.0 representing your confidence in the thoroughness and accuracy of the prompt. Only give a score above 0.9 if the prompt is extremely clear,
          unambiguous, and low-risk. Score below 0.5 if there is major ambiguity, unclear intent, or multiple risk flags.

        User Prompt to Analyze:
        ```
        {prompt}
        ```
        Ensure your response is ONLY the JSON object and nothing else.
        """
    
    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash-latest", contents=gemini_prompt
        )

        raw = response.text.strip()

        #Remove markdown formatting
        if raw.startswith("```"):
            cleaned = re.sub(r"```(?:json)?|```", "", raw).strip()
            return cleaned
        else:
            return raw
    except Exception as e:
        print(f"Error calling Gemeni API: {e}")
        return json.dumps({"error": str(e)})

def prompt_suggestion(prompt: str) -> str:
    gemini_prompt = f"""
        You are a skilled prompt refinement expert.

        Your task is to rewrite the user's prompt adhering to the following criteria:
        -Clarity: Ensure every part of the prompt is unambiguous and easy to understand.
        -Effectiveness: Optimize the prompt to elicit the most reliable and precise response from a large language model.
        -Safety: Identify and mitigate potential risks (e.g., hallucination, bias, misinterpretation).
        -Conciseness: Be as direct as possible without losing necessary detail.
        -Completeness: Include ALL necessary context and information for the large language model.
        
        Keep the original intent of the prompt, rewrite it to improve its quality based on the criteria previously mentioned.

        Output only the revised prompt.

        Original Prompt:
        ```
        {prompt}
        ```
        Ensure your response is ONLY the revised prompt and nothing else.
        """
    
    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash-latest", contents=gemini_prompt
        )
        return response.text
    
    except Exception as e:
        print(f"Error calling Gemeni API: {e}")
        return json.dumps({"error": str(e)})