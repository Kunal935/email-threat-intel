# pipelines/dataset.py

import pandas as pd
import joblib
from core.features import extract_advanced_features
from core.preprocessing import clean_text
from sklearn.feature_extraction.text import TfidfVectorizer
import os

def build_dataset():

    # 1️⃣ Load merged dataset
    df = pd.read_csv("data/merged_spam_data.csv", encoding="latin1")
    df.dropna(inplace=True)

    # Safety check (very important)
    df = df[["text", "target"]]

    # 2️⃣ Map labels if needed
    if df["target"].dtype == "object":
        df["target"] = df["target"].map({"ham": 0, "spam": 1})

    # 3️⃣ Shuffle
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)

    # 4️⃣ Clean text
    df["clean_text"] = df["text"].apply(clean_text)

    # 5️⃣ Advanced features
    advanced_features = df["text"].apply(extract_advanced_features).apply(pd.Series)

    # 6️⃣ TF-IDF
    vectorizer = TfidfVectorizer(max_features=8000)
    tfidf_matrix = vectorizer.fit_transform(df["clean_text"])
    tfidf_df = pd.DataFrame(
        tfidf_matrix.toarray(),
        columns=vectorizer.get_feature_names_out()
    )

    # Ensure models folder exists
    os.makedirs("models", exist_ok=True)

    # Save vectorizer
    joblib.dump(vectorizer, "models/vectorizer.pkl")

    # 7️⃣ Combine features
    X = pd.concat([tfidf_df, advanced_features], axis=1)
    y = df["target"]

    return X, y