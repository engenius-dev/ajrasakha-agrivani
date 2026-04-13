# AgriVani
**A Voice-First AI Eligibility Engine for Indian Agricultural Schemes**

## Project Overview
AgriVani is an intelligent, voice-activated platform designed to simplify the complex landscape of Indian government agricultural schemes. Built for the **Ajrasakha Hackathon Season 2**, this project addresses **Problem Statement 5: "Niti-Setu"**.

By extracting expert-validated rules directly from official government PDFs and utilizing a Python-based RAG (Retrieval-Augmented Generation) engine, AgriVani allows farmers to check their eligibility for schemes through simple voice queries in regional languages (Hindi & Others) along with English, bridging the gap between policy and the people. 

## Key Features (Phase 1 & 2)
* **Hybrid Voice Parser:** A lightning-fast, cost-effective keyword heuristic engine backed by a strict-JSON LLM fallback to handle complex conversational speech seamlessly.
* **API Circuit Breaker:** Graceful degradation architecture that instantly swaps to perfect fallback mock data if third-party LLM services experience downtime, ensuring a crash-proof user experience.
* **Document-Backed AI:** Decisions based strictly on official PDFs, preventing AI hallucinations.
* **Smart Dashboard:** A personalized insights dashboard showing "Eligible" and "Ineligible" schemes, required documents, and exact reasoning.
* **Extracted Proof:** The AI "shows its work" by quoting the exact paragraph from the scheme guidelines.
* **Social Category & Landholding Awareness:** Tailored results based on highly specific criteria like caste categories, state-level rules, and land holding sizes.

## Tech Stack
* **Frontend:** React.js, TypeScript, Vite, Tailwind CSS, shadcn/ui
* **Backend:** Node.js, Express.js, TypeScript
* **AI RAG Engine:** Python, FastAPI, LangChain, Google Gemini 2.5 Flash
* **Database:** MongoDB Atlas (Vector Search)

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* Python 3.9+
* npm or bun

### Installation & Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/engenius-dev/ajrasakha-agrivani.git
   cd ajrasakha-agrivani

2. **Start the AI Engine (Python)**
   ```sh
   cd ai
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   # Create a .env file with MONGODB_URI and GEMINI_API_KEY
   python ingest.py # Run once to populate Vector DB
   uvicorn main:app --host 0.0.0.0 --port 8000

3. **Start the Backend Bridge (Node)**
   ```sh
   cd backend
   npm install
   # Create a .env file with PORT=5000, GEMINI_API_KEY, and the provided AI_ENGINE_URL
   npx ts-node src/server.ts

4. **Start the Frontend (React)**
   ```sh
   cd frontend
   npm install
   # Rename .env.example to .env and add your Gemini API Key:
   # VITE_GEMINI_API_KEY=your_gemini_api_key_here
   npm run dev

## The Team
* **Himanshu Chib** - Team Lead / Backend & API
* **S Swetha** - Data Engine & AI Logic
* **Jayesh Thakur** - Frrontend & Voice UI
* **Harini Elangovan** - Research, Ops, & Journaling

---
*Developed for the annam.ai Ajrasakha Hackathon.*
*Built with ❤️ for the Indian Farming Community.*
