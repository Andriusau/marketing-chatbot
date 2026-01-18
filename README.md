# AI Marketing Growth Assistant

## 🚀 Overview
**AI Growth Assistant** is a premium, intelligent marketing chatbot designed to qualify leads, strategize campaigns, and assist with copy. It replaces static forms with a dynamic, conversational interface powered by Google's **Gemini 1.5** model.

The application features a modern, "glassmorphism" design, identifying as a high-end professional tool for marketers and agencies.

## ✨ Key Features
- **Intelligent Conversations**: Context-aware dialogue using Gemini 1.5 to qualify leads and answer complex marketing questions.
- **Premium UI/UX**:
    - **Glassmorphism Header**: Sleek, modern visual style.
    - **Responsive Design**: Built with Tailwind CSS for a flawless experience on all devices.
    - **Real-time Feedback**: Typing indicators and smooth message transitions.
- **High-Performance Architecture**:
    - **Frontend**: React + TypeScript + Tailwind CSS (Vite-ready architecture).
    - **Backend**: FastAPI for async, non-blocking AI responses.

## 🛠️ Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: FastAPI, Python 3.9+, Google Gemini API.
- **State Management**: React Hooks (local state).

## ⚙️ Local Setup Instructions

### Prerequisites
- **Node.js** (v16+) & **npm**
- **Python** (v3.9+)
- **Gemini API Key** (Get one from [Google AI Studio](https://makersuite.google.com/app/apikey))

### 1. Backend Setup
Navigate to the `backend` directory and set up the Python environment:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Configuration:**
Create a `.env` file in the `backend` directory:
```bash
echo 'GEMINI_API_KEY="your_actual_api_key_here"' > .env
```
*Note: The application expects `GEMINI_API_KEY` to be available in the environment.*

**Start the Server:**
```bash
uvicorn app.main:app --reload --port 8000
```
The backend will be available at `http://127.0.0.1:8000`.

### 2. Frontend Setup
Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
npm install
```

**Start the Application:**
```bash
npm start
```
The application will open at `http://localhost:3000`.

## 📂 Project Structure
```
marketing-chatbot-app/
├── backend/
│   ├── app/main.py       # FastAPI application & Gemini logic
│   ├── .env              # Environment variables (API Key)
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.tsx       # Main Chat Interface (React)
│   │   └── index.css     # Tailwind imports & custom styles
│   ├── tailwind.config.js # Tailwind configuration
│   └── tsconfig.json     # TypeScript configuration
└── README.md             # This file
```

## 🤝 Contribution
Feel free to fork this repository and submit pull requests.

**Developer**: Andrius Aukstuolis
**GitHub**: https://github.com/Andriusau
