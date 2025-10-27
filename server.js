// server.js
import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

// CORS: allow only your GitHub Pages origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://jbdoc19.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const WORKFLOW_ID = process.env.WORKFLOW_ID || "wf_68fec710e2b88190ac05c3dbcf8a0e780c32ac5cede0de70";

// Create short-lived client token for ChatKit
app.post("/api/chatkit/session", async (_req, res) => {
  try {
    const session = await openai.chatkit.sessions.create({
      workflow_id: WORKFLOW_ID,
    });
    res.json({ client_secret: session.client_secret });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create ChatKit session" });
  }
});

// Optional refresh: mint a new session (simple + reliable)
app.post("/api/chatkit/refresh", async (_req, res) => {
  try {
    const session = await openai.chatkit.sessions.create({
      workflow_id: WORKFLOW_ID,
    });
    res.json({ client_secret: session.client_secret });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to refresh" });
  }
});

app.get("/", (_req, res) => res.send("OK"));
app.listen(process.env.PORT || 3000, () => console.log("Token API running"));
