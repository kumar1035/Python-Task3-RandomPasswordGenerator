"""
SecurePass Flask API
Endpoints:
  POST /api/generate  → generate one or many passwords
  POST /api/strength  → evaluate a password's strength
  GET  /api/health    → liveness check
"""

from flask import Flask, jsonify, request
from flask_cors import CORS

from generator import generate_multiple
from strength import evaluate
from validators import validate_generate_request, validate_strength_request

app = Flask(__name__)

# Allow requests from the React dev server and the deployed Vercel domain.
# Restrict origins in production by setting ALLOWED_ORIGINS env var.
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/api/generate")
def generate():
    data = request.get_json(silent=True) or {}
    ok, err = validate_generate_request(data)
    if not ok:
        return jsonify({"error": err}), 400

    length  = data["length"]
    count   = data.get("count", 1)
    options = {
        "uppercase":        data.get("uppercase", True),
        "lowercase":        data.get("lowercase", True),
        "numbers":          data.get("numbers", True),
        "symbols":          data.get("symbols", False),
        "exclude_ambiguous": data.get("exclude_ambiguous", False),
        "no_repeat":        data.get("no_repeat", False),
        "custom_exclude":   data.get("custom_exclude", ""),
    }

    try:
        passwords = generate_multiple(length, count, options)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 422

    results = []
    for pw in passwords:
        results.append({"password": pw, "strength": evaluate(pw)})

    return jsonify({"passwords": results})


@app.post("/api/strength")
def strength():
    data = request.get_json(silent=True) or {}
    ok, err = validate_strength_request(data)
    if not ok:
        return jsonify({"error": err}), 400

    return jsonify(evaluate(data["password"]))


if __name__ == "__main__":
    app.run(debug=True, port=5000)
