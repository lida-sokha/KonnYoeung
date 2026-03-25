"""
Read JSON from stdin: {"symptoms": ["fever", "cough"], "k": 3}
Write JSON to stdout for Express /api/symptoms/predict.
"""
import json
import os
import sys

DIR = os.path.dirname(os.path.abspath(__file__))
if DIR not in sys.path:
    sys.path.insert(0, DIR)

from save_logistic_model import load_model_artifacts, predict_top_k


def main():
    payload = json.load(sys.stdin)
    symptoms = payload.get("symptoms", [])
    k = int(payload.get("k", 3))
    k = max(1, min(10, k))

    model, le, cols = load_model_artifacts()
    out = predict_top_k(symptoms, model, le, cols, k=k)

    for p in out.get("predictions", []):
        p["disease"] = str(p["disease"])
        p["confidence"] = float(p["confidence"])

    print(json.dumps(out))


if __name__ == "__main__":
    main()
