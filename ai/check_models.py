import os
from dotenv import load_dotenv
from google import genai

# Load the API key from the .env file
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

print("Authenticating with Gemini...")
client = genai.Client(api_key=API_KEY)

print("\n=== AVAILABLE MODELS FOR YOUR KEY ===")
try:
    # Fetch all models available to this specific key
    for model in client.models.list():
        # We only care about models that can generate text/content
        if "generateContent" in model.supported_actions:
            print(f"✅ {model.name}")
except Exception as e:
    print(f"Error fetching models: {e}")