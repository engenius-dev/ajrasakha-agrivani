import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "AgriVani Express Server is live!" });
});

// 2. The Main AI Chat Route (Traffic Cop)
app.post('/api/chat', async (req: Request, res: Response): Promise<any> => {
  const { farmerId, transcript, language } = req.body;

  console.log(`Received query from ${farmerId || 'Unknown'}: "${transcript}"`);

  try {
    // Forward the request exactly as received to Swetha's FastAPI
    // Note: We are hitting her /check-eligibility endpoint, not /search
    const aiEngineUrl = process.env.AI_ENGINE_URL || 'http://127.0.0.1:8000/check-eligibility';
    
    const pythonResponse = await axios.post(aiEngineUrl, {
        farmerId: farmerId || "user_123",
        transcript: transcript,
        language: language || "English"
    });

    // Swetha's server returns the exact JSON contract we agreed on!
    console.log("Successfully got response from Swetha's AI Engine!");
    res.json(pythonResponse.data);

  } catch (error: any) {
    console.error('Backend Error:', error?.response?.data || error.message);
    res.status(500).json({ 
        error: "The AI Brain is having trouble connecting.",
        details: error?.response?.data || "Python server might be offline"
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`AgriVani Backend is running on http://localhost:${PORT}`);
});