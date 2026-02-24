import joblib
import pandas as pd

from core.preprocessing import clean_text
from core.features import extract_advanced_features


# Load saved artifacts
model = joblib.load("models/spam_model.pkl")
scaler = joblib.load("models/scaler.pkl")
vectorizer = joblib.load("models/vectorizer.pkl")


def predict_spam(text):

    cleaned = clean_text(text)

    tfidf_vector = vectorizer.transform([cleaned])
    tfidf_df = pd.DataFrame(
        tfidf_vector.toarray(),
        columns=vectorizer.get_feature_names_out()
    )

    advanced_features = extract_advanced_features(text)
    advanced_df = pd.DataFrame([advanced_features])

    final_input = pd.concat([tfidf_df, advanced_df], axis=1)

    final_input = scaler.transform(final_input)

    prob = model.predict_proba(final_input)[0][1]

    threshold = 0.72  # replace with your best_threshold

    if prob >= threshold:
        return f"SPAM ⚠️ (Confidence: {prob:.2f})"
    else:
        return f"HAM ✅ (Confidence: {1 - prob:.2f})"


