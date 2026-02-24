import numpy as np
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    roc_auc_score
)

from xgboost import XGBClassifier

from pipelines.dataset import build_dataset
from pipelines.evaluate_model import show_feature_importance


# ===============================
# 1️⃣ Load Dataset
# ===============================

print("Loading dataset...")
X, y = build_dataset()

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)


# ===============================
# 2️⃣ Logistic Regression (Scaled)
# ===============================

print("\nTraining Logistic Regression...")

scaler = StandardScaler(with_mean=False)
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

log_model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)

log_model.fit(X_train_scaled, y_train)

log_probs = log_model.predict_proba(X_test_scaled)[:, 1]

# 🔥 FIXED THRESHOLD (from tuning)
best_threshold = 0.18

log_preds = (log_probs >= best_threshold).astype(int)

print("\n===== Logistic Regression Results =====")
print("Threshold:", best_threshold)
print("Accuracy:", accuracy_score(y_test, log_preds))
print("AUC:", roc_auc_score(y_test, log_probs))
print(classification_report(y_test, log_preds))


# ===============================
# 3️⃣ XGBoost (No Scaling)
# ===============================

print("\nTraining XGBoost...")

xgb_model = XGBClassifier(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.1,
    eval_metric="logloss"
)

xgb_model.fit(X_train, y_train)

xgb_probs = xgb_model.predict_proba(X_test)[:, 1]
xgb_preds = (xgb_probs >= 0.5).astype(int)

print("\n===== XGBoost Results =====")
print("Threshold: 0.5")
print("Accuracy:", accuracy_score(y_test, xgb_preds))
print("AUC:", roc_auc_score(y_test, xgb_probs))
print(classification_report(y_test, xgb_preds))


# ===============================
# 4️⃣ Compare & Select Best Model
# ===============================

log_auc = roc_auc_score(y_test, log_probs)
xgb_auc = roc_auc_score(y_test, xgb_probs)

if log_auc >= xgb_auc:
    print("\n✅ Logistic Regression selected as final model.")
    final_model = log_model
    final_scaler = scaler
    model_type = "logistic"
    final_threshold = best_threshold
else:
    print("\n✅ XGBoost selected as final model.")
    final_model = xgb_model
    final_scaler = None
    model_type = "xgboost"
    final_threshold = 0.5


# ===============================
# 5️⃣ Save Artifacts
# ===============================

os.makedirs("models", exist_ok=True)

joblib.dump(final_model, "models/spam_model.pkl")
joblib.dump(final_scaler, "models/scaler.pkl")
joblib.dump(final_threshold, "models/threshold.pkl")
joblib.dump(model_type, "models/model_type.pkl")

print("\nModel, scaler, threshold saved successfully.")


# ===============================
# 6️⃣ Feature Importance (Logistic only)
# ===============================

if model_type == "logistic":
    show_feature_importance(log_model, X.columns)