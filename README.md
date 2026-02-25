# Smart Spam Detection Engine
AI-Powered Threat Intelligence & Email Filtering System.

- direct link :- (https://email-threat-intel-kunal935s-projects.vercel.app?_vercel_share=TdJ3UCs0SL9lygFnTyCAnQvWmsD6tBRa)
## Project Structure
- **Backend (FastAPI)**: `api.py`
- **Frontend (React/Vite)**: `frontend/`
- **Machine Learning Core**: `core/`, `models/`, `pipelines/`

## Quick Start

### 1. Prerequisites
- Python 3.10+
- Node.js & npm

### 2. Setup and Run Backend
The backend serves the ML model predictions via a REST API.
```bash
# Install dependencies
pip install -r requirements.txt

# Run the API server
python api.py
```
The API will be available at `http://localhost:8000`. You can check the health status at `http://localhost:8000/health`.

### 3. Setup and Run Frontend
The frontend provides a futuristic "Cyber" UI for analyzing messages.
```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```
The UI will typically be available at `http://localhost:5173` (or the next available port).

## API Endpoints
- **GET /health**: Check if the API and model are active.
- **POST /predict**: 
    - Payload: `{ "message": "your text here" }`
    - Response: Includes prediction (SPAM/HAM), confidence score, and advanced behavior signals.

## Machine Learning Details
The system uses a combination of:
- **TF-IDF Vectorization** (Top 1000 features)
- **Advanced Behavioral Features**: 
    - Suspicious Keyword Scoring
    - URL Risk Analysis
    - Capitalization Ratios
    - Text Entropy (Complexity measurement)
- **Logistic Regression Model**: Optimized for high recall on threat detection.


