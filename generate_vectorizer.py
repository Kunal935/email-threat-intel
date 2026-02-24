"""Quick script to regenerate models/vectorizer.pkl"""
from pipelines.dataset import build_dataset

print("Building dataset (this will save vectorizer.pkl)...")
X, y = build_dataset()
print("Done! vectorizer.pkl has been saved to models/")
