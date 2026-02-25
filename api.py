"""
Smart Spam Detection Engine — FastAPI Backend
───────────────────────────────────────────────
Loads the trained ML artifacts at startup and
exposes a single POST /predict endpoint.
"""

import os
import sys
import joblib
import pandas as pd
from pathlib import Path
import nltk
from fastapi import FastAPI

# Download required NLTK resources
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('omw-1.4')

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── Resolve project root so imports work regardless of cwd ──
PROJECT_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(PROJECT_ROOT))

from core.preprocessing import clean_text
from core.features import extract_advanced_features

# ═══════════════════════════════════════════════
#  Load ML Artifacts (once, at startup)
# ═══════════════════════════════════════════════
MODELS_DIR = PROJECT_ROOT / "models"

try:
    model = joblib.load(MODELS_DIR / "spam_model.pkl")
    scaler = joblib.load(MODELS_DIR / "scaler.pkl")
    vectorizer = joblib.load(MODELS_DIR / "vectorizer.pkl")
    print("[INFO] All ML artifacts loaded successfully.")
except FileNotFoundError as e:
    print(f"❌ Missing model file: {e}")
    print("   Run training first to generate models/vectorizer.pkl")
    sys.exit(1)


# ═══════════════════════════════════════════════
#  FastAPI App
# ═══════════════════════════════════════════════
app = FastAPI(
    title="Smart Spam Detection Engine",
    description="AI-Powered Threat Intelligence API",
    version="1.0.0",
)

# ── CORS — allow the React frontend to connect ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ═══════════════════════════════════════════════
#  Request / Response Schemas
# ═══════════════════════════════════════════════
class PredictRequest(BaseModel):
    message: str


class PredictResponse(BaseModel):
    prediction: str        # "SPAM" or "HAM"
    confidence: float      # 0.0 – 1.0
    signals: dict          # advanced feature breakdown


# ═══════════════════════════════════════════════
#  Prediction Endpoint
# ═══════════════════════════════════════════════
@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    text = req.message.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # 1. Clean text
    cleaned = clean_text(text)

    # 2. TF-IDF vectorization
    tfidf_vector = vectorizer.transform([cleaned])
    tfidf_df = pd.DataFrame(
        tfidf_vector.toarray(),
        columns=vectorizer.get_feature_names_out(),
    )

    # 3. Extract advanced behavioral features
    advanced_features = extract_advanced_features(text)
    advanced_df = pd.DataFrame([advanced_features])

    # 4. Combine & scale
    final_input = pd.concat([tfidf_df, advanced_df], axis=1)
    final_input_scaled = scaler.transform(final_input)

    # 5. Predict
    spam_prob = model.predict_proba(final_input_scaled)[0][1]

    prediction = "SPAM" if spam_prob >= 0.4 else "HAM"
    confidence = round(spam_prob if prediction == "SPAM" else 1 - spam_prob, 4)

    return PredictResponse(
        prediction=prediction,
        confidence=confidence,
        signals={
            "keywordScore": round(advanced_features["Suspicious_Keyword_Score"] * 100, 1),
            "urlRisk": round(min(advanced_features["URL_Risk_Score"] * 33.3, 100), 1),
            "capRatio": round(advanced_features["Capitalization_Ratio"] * 100, 1),
            "entropy": round(advanced_features["Text_Entropy"], 2),
        },
    )


# ═══════════════════════════════════════════════
#  Health Check
# ═══════════════════════════════════════════════
@app.get("/health")
def health():
    return {"status": "ok", "model": "LogisticRegression", "version": "1.0.0"}





app = FastAPI()

# routes
@app.get("/health")
def health():
    return {"status":"ok"}

@app.post("/predict")
def predict(...):
    ...

# ═══════════════════════════════════════════════
#  Run with: python api.py
# ═══════════════════════════════════════════════
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)

