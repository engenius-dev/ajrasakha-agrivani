# AgriVani
**A Voice-First AI Eligibility Engine for Indian Agricultural Schemes**

## Project Overview
AgriVani is an intelligent, voice-activated platform designed to simplify the complex landscape of Indian government agricultural schemes. Built for the **Ajrasakha Hackathon Season 2**, this project addresses **Problem Statement 5: "Niti-Setu"**.

By extracting expert-validated rules directly from official government PDFs and utilizing a Python-based RAG (Retrieval-Augmented Generation) engine, AgriVani allows farmers to check their eligibility for schemes through simple voice queries in regional languages (English & Hindi), bridging the gap between policy and the people. 

## Key Features (Phase 1 Target)
* **Voice-to-Text Input:** An accessible, intuitive UI designed for users with low digital literacy. Farmers can simply speak their details.
* **Document-Backed AI:** Decisions based strictly on official PDFs, preventing AI hallucinations.
* **Smart Dashboard:** A personalized insights dashboard showing "Eligible" and "Ineligible" schemes, required documents, and exact reasoning.
* **Social Category & Landholding Awareness:** Tailored results based on highly specific criteria like caste categories, state-level rules, and land holding sizes.
* **Cost-Effective Architecture:** Utilizing semantic caching to minimize LLM API calls and reduce latency.

## Tech Stack
* **Frontend:** React.js, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion
* **Backend:** Node.js, Express.js, TypeScript
* **AI/Engine:** Python, FastAPI, LangChain (RAG), Google Gemini
* **Database:** MongoDB Atlas

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* npm or bun

### Installation & Setup

1. **Clone the repository**
   ```sh
   git clone <YOUR_GIT_URL>
   cd ajrasakha-agrivani

2. **Start the Frontend**
   ```sh
   cd frontend
   npm install
   npm run dev

3. **Start the Backend (Coming Soon!)**
   ```sh
   cd backend
   npm install
   npm run dev

## The Team
* **Himanshu Chib** - Team Lead / Backend & API
* **S Swetha** - Data Engine & AI Logic
* **Jayesh Thakur** - Frrontend & Voice UI
* **Harini Elangovan** - Research, Ops, & Journaling

---
*Developed for the annam.ai Ajrasakha Hackathon.*
*Built with ❤️ for the Indian Farming Community.*