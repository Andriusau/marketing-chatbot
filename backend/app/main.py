from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

import requests
import json
import time

# --- Configuration ---
# You would normally load your API key from an environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
SYSTEM_INSTRUCTION = "You are a friendly, highly persuasive marketing lead development chatbot for a modern data engineering consultancy. Your goal is to qualify leads by asking about their technical needs, current challenges, and budget. Keep responses concise and focused on gathering information. Do not mention that you are an AI."

# --- Models ---
class ChatRequest(BaseModel):
    """Defines the structure for an incoming chat message."""
    message: str
    chat_history: list # We will send the full history to maintain context

class ChatResponse(BaseModel):
    """Defines the structure for the outgoing chat response."""
    response: str
    source_url: str | None = None # For potential grounding sources (not used here)

# --- FastAPI App Setup ---
app = FastAPI(title="Lead Gen Chatbot API")

# Add CORS middleware to allow the React frontend (running on a different port) to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def call_gemini_api(user_message: str, history: list) -> str:
    """
    Calls the Gemini API to get a chatbot response using the chat history.
    
    NOTE: For simplicity, this uses a basic retry loop. In a real application, 
    you would implement full exponential backoff.
    """
    
    # Reconstruct the contents list for the API payload
    contents = []
    for item in history:
        # Assuming history format is [{role: 'user'/'model', parts: [{text: '...'}]}]
        contents.append(item)

    # Add the current user message
    contents.append({"role": "user", "parts": [{"text": user_message}]})

    payload = {
        "contents": contents,
        "systemInstruction": {"parts": [{"text": SYSTEM_INSTRUCTION}]},
    }

    headers = {'Content-Type': 'application/json'}
    
    # Simple retry mechanism (without exponential backoff for brevity)
    for attempt in range(3):
        try:
            response = requests.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                headers=headers,
                data=json.dumps(payload),
                timeout=10 # Set a timeout
            )
            response.raise_for_status() # Raise exception for HTTP errors (4xx or 5xx)
            
            result = response.json()
            
            # Extract the text response
            text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'Sorry, I am having trouble connecting right now.')
            return text
            
        except requests.exceptions.RequestException as e:
            # Handle connection errors, timeouts, etc.
            print(f"API call failed on attempt {attempt+1}: {e}")
            if attempt < 2:
                time.sleep(2 ** attempt) # Wait before retrying
            else:
                return f"I'm having trouble connecting to the service. Error: {str(e)}"
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            return f"An internal error occurred: {str(e)}"

    return "Service unavailable."


@app.get("/")
def read_root():
    """A simple endpoint to confirm the API is running."""
    return {"status": "FastAPI is running", "service": "Lead Gen Chatbot API"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Endpoint for sending a user message and getting a Gemini response."""
    
    # The history sent from the frontend is an array of objects like:
    # {role: 'user', parts: [{text: '...'}]}, {role: 'model', parts: [{text: '...'}]}
    
    model_response = call_gemini_api(request.message, request.chat_history)
    
    return ChatResponse(response=model_response)

# Note: In a real app, you would also add an endpoint here to save the qualified lead data (name, email, chat_history) to Firestore.

