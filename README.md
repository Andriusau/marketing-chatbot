AI Marketing Lead Generation Chatbot
🚀 Overview
This is a modern, full-stack application designed to act as an intelligent, front-line marketing assistant. The system engages website visitors in a conversational manner to qualify leads, gather contact information, and answer initial product questions, utilizing the power of the Gemini AI model.

The architecture uses a high-performance FastAPI backend to handle the AI logic and a responsive React/TypeScript frontend for a seamless user experience.

✨ Key Features
Intelligent Lead Qualification: Uses the Gemini API to maintain context and ask targeted questions to qualify the user's need.

Real-time Chat Interface: Built with React and Tailwind CSS for a fast, mobile-first, and professional user interface.

High-Performance API: FastAPI provides asynchronous, high-speed routing for immediate AI responses.

Scalable Architecture: Separate frontend and backend services are ready for independent scaling and deployment.

🛠️ Technology Stack
This project is split into two distinct services:

Frontend
Component

Technology

Description

Framework

React

Core library for building the user interface.

Language

TypeScript

For type safety and better developer tooling.

Styling

Tailwind CSS

Utility-first CSS framework for rapid and responsive design.

Backend
Component

Technology

Description

Framework

FastAPI

High-performance, modern Python web framework.

AI Engine

Gemini API

Powers the conversational and lead-generation intelligence.

Dependencies

requests, uvicorn

For making external API calls and serving the ASGI application.

⚙️ Local Setup Instructions
Follow these steps to get the application running on your local machine.

Prerequisites
Node.js & npm: Required for the React frontend (install via Homebrew: brew install node).

Python 3.9+: Required for the FastAPI backend.

Gemini API Key: Obtain a key from Google AI Studio.

1. Backend Setup
Open your first terminal window and navigate to the backend/ directory:

cd marketing-chatbot-app/backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Set your API Key (Replace with your actual key)
export GEMINI_API_KEY="YOUR_API_KEY_HERE"

# Start the FastAPI server
uvicorn app.main:app --reload

The API server should start running at http://127.0.0.1:8000. Keep this terminal window open.

2. Frontend Setup
Open a second terminal window and navigate to the frontend/ directory:

cd marketing-chatbot-app/frontend

# Install Node dependencies
npm install

# Start the React development server
npm start

This command will automatically open the application in your browser (usually at http://localhost:3000). The frontend will automatically connect to your running FastAPI backend.

☁️ Deployment Guide (Free Tiers)
The project is structured for easy deployment on free cloud services:

Frontend (React): Deploy the frontend/ directory to Vercel or Netlify.

Backend (FastAPI): Deploy the backend/ directory to Render or Fly.io.

Important: Once your FastAPI backend is deployed, you MUST update the API_BASE_URL variable inside the frontend/src/App.tsx file to point to your live backend URL.

🤝 Contribution
Feel free to fork this repository, submit pull requests, or open issues.

(Optional: Add your contact info or GitHub profile here)
