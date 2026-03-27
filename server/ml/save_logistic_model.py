import os
import argparse
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression

THIS_DIR = os.path.abspath(os.path.dirname(__file__))
SERVER_DIR = os.path.abspath(os.path.join(THIS_DIR, ".."))
ROOT_DIR = os.path.abspath(os.path.join(SERVER_DIR, ".."))

SAVE_DIR = os.path.join(SERVER_DIR, "saved_models", "logistic_regression")
MODEL_FILE = os.path.join(SAVE_DIR, "disease_model.pkl")
LABEL_ENCODER_FILE = os.path.join(SAVE_DIR, "label_encoder.pkl")
SYMPTOM_COLUMNS_FILE = os.path.join(SAVE_DIR, "symptom_columns.pkl")

def train_and_save_logistic_model(
    data_path=os.path.join(THIS_DIR, "final_dataset.csv"),
    save_dir=SAVE_DIR,
    model_file=MODEL_FILE,
    label_encoder_file=LABEL_ENCODER_FILE,
    symptom_columns_file=SYMPTOM_COLUMNS_FILE,
    target_per_class=300,
    random_state=42,
):
    from imblearn.over_sampling import SMOTE
    from imblearn.under_sampling import RandomUnderSampler

    df = pd.read_csv(data_path)
    df["prognosis"] = df["prognosis"].str.replace(" ", "_")

    feature_cols = [c for c in df.columns if c != "prognosis"]
    zero_cols = df[feature_cols].columns[df[feature_cols].sum(axis=0) == 0].tolist()
    df.drop(columns=zero_cols, inplace=True)

    X = df.drop(columns=["prognosis"])

    symptom_columns = X.columns.tolist()

    le = LabelEncoder()
    y = le.fit_transform(df["prognosis"])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=random_state, stratify=y
    )
    
    # 1) Under-sample classes > target_per_class to exactly target_per_class
    current_counts = pd.Series(y_train).value_counts()
    classes_to_under = {
        cls: target_per_class
        for cls, count in current_counts.items()
        if count > target_per_class
    }
    if classes_to_under:
        under_sampler = RandomUnderSampler(
            sampling_strategy=classes_to_under, random_state=random_state
        )
        X_train_under, y_train_under = under_sampler.fit_resample(X_train, y_train)
    else:
        X_train_under, y_train_under = X_train, y_train

    # 2) Over-sample all classes to exactly target_per_class using SMOTE
    smote_sampling_strategy = {class_: target_per_class for class_ in np.unique(y_train_under)}
    smote = SMOTE(random_state=random_state, sampling_strategy=smote_sampling_strategy)
    X_train_bal, y_train_bal = smote.fit_resample(X_train_under, y_train_under)

    model = LogisticRegression(max_iter=1000, random_state=random_state)
    model.fit(X_train_bal, y_train_bal)

    os.makedirs(save_dir, exist_ok=True)
    joblib.dump(model, model_file)
    joblib.dump(le, label_encoder_file)
    joblib.dump(symptom_columns, symptom_columns_file)

    print("Saved model artifacts:")
    print(" -", os.path.abspath(model_file))
    print(" -", os.path.abspath(label_encoder_file))
    print(" -", os.path.abspath(symptom_columns_file))

    return model, le, symptom_columns


def load_model_artifacts(
    model_file=MODEL_FILE,
    label_encoder_file=LABEL_ENCODER_FILE,
    symptom_columns_file=SYMPTOM_COLUMNS_FILE,
):
    model = joblib.load(model_file)
    label_encoder = joblib.load(label_encoder_file)
    symptom_columns = joblib.load(symptom_columns_file)
    return model, label_encoder, symptom_columns


def normalize_symptom_key(value: str) -> str:
    return value.strip().lower().replace("-", "_").replace(" ", "_")


def build_input_vector(selected_symptoms, symptom_columns):
    selected_set = set(normalize_symptom_key(sym) for sym in selected_symptoms if isinstance(sym, str))
    symptom_set = {col.lower(): col for col in symptom_columns}

    matched = sorted(s for s in selected_set if s in symptom_set)
    unmatched = sorted(s for s in selected_set if s not in symptom_set)

    x = pd.DataFrame(
        [[1 if symptom.lower() in matched else 0 for symptom in symptom_columns]],
        columns=symptom_columns,
    )
    return x, matched, unmatched


def get_probabilities(model, X):
    if hasattr(model, "predict_proba"):
        return model.predict_proba(X)

    if hasattr(model, "decision_function"):
        scores = model.decision_function(X)
        if scores.ndim == 1:
            probs_pos = 1 / (1 + np.exp(-scores))
            probs = np.vstack([1 - probs_pos, probs_pos]).T
            return probs

        exp_scores = np.exp(scores - np.max(scores, axis=1, keepdims=True))
        return exp_scores / np.sum(exp_scores, axis=1, keepdims=True)

    raise ValueError("Model must support predict_proba or decision_function.")


def predict_top_k(selected_symptoms, model, label_encoder, symptom_columns, k=3):
    X, matched, unmatched = build_input_vector(selected_symptoms, symptom_columns)
    if not matched:
        return {
            "predictions": [],
            "matched_symptoms": matched,
            "unmatched_symptoms": unmatched,
        }

    probs = get_probabilities(model, X)[0]

    top_k_idx = np.argsort(probs)[::-1][:k]
    results = []
    for idx in top_k_idx:
        disease = label_encoder.inverse_transform([idx])[0]
        confidence = float(probs[idx])
        results.append({"disease": disease, "confidence": confidence})

    return {
        "predictions": results,
        "matched_symptoms": matched,
        "unmatched_symptoms": unmatched,
    }


def create_app():
    app = Flask(__name__)

    # load model once on startup
    model, label_encoder, symptom_columns = load_model_artifacts()

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"})

    @app.route("/predict", methods=["POST"])
    def predict():
        req = request.get_json(force=True)
        selected_symptoms = req.get("symptoms", [])
        if not isinstance(selected_symptoms, list) or not selected_symptoms:
            return jsonify({"error": "Please provide symptoms as a non-empty list."}), 400

        k = int(req.get("k", 3))
        k = max(1, min(10, k))

        output = predict_top_k(selected_symptoms, model, label_encoder, symptom_columns, k=k)
        if not output["matched_symptoms"]:
            return jsonify(
                {
                    "error": "None of the provided symptoms match model features.",
                    "matched_symptoms": output["matched_symptoms"],
                    "unmatched_symptoms": output["unmatched_symptoms"],
                }
            ), 400

        return jsonify(output)

    return app


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train and/or serve logistic disease model.")
    parser.add_argument("--train", action="store_true", help="Train model and save artifacts.")
    parser.add_argument("--serve", action="store_true", help="Start Flask API server.")
    parser.add_argument("--host", default="0.0.0.0", help="Flask host (default: 0.0.0.0).")
    parser.add_argument("--port", type=int, default=5000, help="Flask port (default: 5000).")
    parser.add_argument("--debug", action="store_true", help="Enable Flask debug mode.")
    args = parser.parse_args()

    do_train = args.train
    do_serve = args.serve or (not args.train and not args.serve)

    if do_train:
        model, label_encoder, symptom_columns = train_and_save_logistic_model()
        sample_symptoms = symptom_columns[:5]
        print("Sample predict:", predict_top_k(sample_symptoms, model, label_encoder, symptom_columns, k=3))

    if do_serve:
        app = create_app()
        app.run(host=args.host, port=args.port, debug=args.debug)
