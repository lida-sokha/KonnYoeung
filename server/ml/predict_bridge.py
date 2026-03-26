"""
Read JSON from stdin: {"symptoms": ["fever", "cough"], "k": 3}
OR run with command args:
  python predict_bridge.py --symptoms fever cough --k 3
  python predict_bridge.py --json '{"symptoms": ["fever","cough"], "k": 3}'

Write JSON to stdout for Express /api/symptoms/predict.
"""
import argparse
import json
import os
import sys

DIR = os.path.dirname(os.path.abspath(__file__))
if DIR not in sys.path:
    sys.path.insert(0, DIR)

from save_logistic_model import load_model_artifacts, predict_top_k


def _read_payload_from_stdin():
    try:
        if sys.stdin.isatty():
            return None

        raw = sys.stdin.read()
        if raw and raw.strip():
            return json.loads(raw)
    except json.JSONDecodeError:
        pass
    return None


def _read_payload_from_args():
    parser = argparse.ArgumentParser(description="Predict disease from symptoms")
    parser.add_argument("--symptoms", nargs="*", default=[], help="List of symptoms")
    parser.add_argument("--k", type=int, default=3, help="Top K predictions")
    parser.add_argument("--json", type=str, default=None, help="Payload as JSON string")
    parsed = parser.parse_args()

    if parsed.json:
        try:
            return json.loads(parsed.json)
        except json.JSONDecodeError:
            # Allow single quotes in JSON from command line for Windows convenience
            try:
                return json.loads(parsed.json.replace("'", '"'))
            except json.JSONDecodeError as e:
                raise ValueError(f"Invalid JSON argument: {e}")

    return {"symptoms": parsed.symptoms, "k": parsed.k}


def main():
    payload = _read_payload_from_stdin()
    if payload is None:
        payload = _read_payload_from_args()

    symptoms = payload.get("symptoms", [])
    if not isinstance(symptoms, list):
        raise ValueError("symptoms must be a list")

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
