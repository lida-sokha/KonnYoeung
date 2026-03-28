const express = require("express");
const path = require("path");
const { spawn } = require("child_process");

const router = express.Router();

const SERVER_ROOT = path.join(__dirname, "..", "..");
const BRIDGE_SCRIPT = path.join(SERVER_ROOT, "ml", "predict_bridge.py");

function getPythonCommands() {
  const cmds = [];
  if (process.env.PYTHON) cmds.push({ cmd: process.env.PYTHON, args: [] });
  if (process.env.PYTHON3) cmds.push({ cmd: process.env.PYTHON3, args: [] });
  cmds.push({ cmd: "python", args: [] });
  // Common Windows launcher fallback
  cmds.push({ cmd: "py", args: ["-3"] });
  cmds.push({ cmd: "python3", args: [] });
  return cmds;
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
  const commands = getPythonCommands();
  const timeoutMs = 25000;

  const runWithCommand = (index) => {
    if (index >= commands.length) {
      return res.status(503).json({
        error: "Prediction script failed.",
        detail: "No working Python executable found. Set PYTHON in server .env.",
      });
    }

    const current = commands[index];
    const child = spawn(current.cmd, [...current.args, BRIDGE_SCRIPT], {
      cwd: SERVER_ROOT,
      env: { ...process.env },
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";

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
      // Try next Python command on executable-not-found errors.
      if (err && err.code === "ENOENT") {
        return runWithCommand(index + 1);
      }
      return res.status(503).json({
        error: "Prediction script failed.",
        detail: String(err.message || err),
      });
    });

    child.stdin.write(payload);
    child.stdin.end();

    child.on("close", (code) => {
      clearTimeout(timer);

      // If this executable itself failed to launch/run, try next candidate.
      const launchFailure =
        code !== 0 &&
        (stderr.includes("is not recognized as an internal or external command") ||
          stderr.includes("No such file or directory"));
      if (launchFailure) {
        return runWithCommand(index + 1);
      }

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
  };

  return runWithCommand(0);
});

module.exports = router;