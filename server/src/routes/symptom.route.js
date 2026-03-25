const express = require("express");
const path = require("path");
const { spawn } = require("child_process");

const router = express.Router();

const SERVER_ROOT = path.join(__dirname, "..", "..");
const BRIDGE_SCRIPT = path.join(SERVER_ROOT, "ml", "predict_bridge.py");

function getPythonExecutable() {
  return process.env.PYTHON || process.env.PYTHON3 || "python";
}

/**
 * POST /api/symptoms/predict
 * Body: { symptoms: string[], k?: number }
 */
router.post("/predict", (req, res) => {
  const { symptoms, k = 3 } = req.body || {};

  if (!Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({ error: "Please provide symptoms as a non-empty array." });
  }

  const payload = JSON.stringify({ symptoms, k });
  const py = getPythonExecutable();
  const child = spawn(py, [BRIDGE_SCRIPT], {
    cwd: SERVER_ROOT,
    env: { ...process.env },
    windowsHide: true,
  });

  let stdout = "";
  let stderr = "";

  const timeoutMs = 25000;
  const timer = setTimeout(() => {
    child.kill("SIGKILL");
  }, timeoutMs);

  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  child.on("error", (err) => {
    clearTimeout(timer);
    return res.status(503).json({
      error: "Could not run Python predictor. Is Python installed and on PATH?",
      detail: String(err.message || err),
    });
  });

  child.stdin.write(payload);
  child.stdin.end();

  child.on("close", (code) => {
    clearTimeout(timer);
    if (code !== 0) {
      return res.status(503).json({
        error: "Prediction script failed.",
        detail: stderr.trim() || `exit code ${code}`,
      });
    }
    try {
      const parsed = JSON.parse(stdout.trim());
      if (!parsed.matched_symptoms || parsed.matched_symptoms.length === 0) {
        return res.status(400).json({
          error: "None of the provided symptoms match model features.",
          matched_symptoms: parsed.matched_symptoms || [],
          unmatched_symptoms: parsed.unmatched_symptoms || [],
        });
      }
      return res.json(parsed);
    } catch (e) {
      return res.status(503).json({
        error: "Invalid JSON from prediction script.",
        detail: String(e.message),
        raw: stdout.slice(0, 500),
      });
    }
  });
});

module.exports = router;
