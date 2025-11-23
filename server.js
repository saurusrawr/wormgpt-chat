import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const apiKeys = process.env.GEMINI_API_KEYS.split(",");

function getRandomKey() {
  return apiKeys[Math.floor(Math.random() * apiKeys.length)];
}

// Endpoint untuk mengirim pesan ke Gemini API
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: "No messages sent" });

  const API_KEY = getRandomKey();
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

  const payload = {
    contents: messages,
    systemInstruction: {
      parts: [{
        text: "Anda adalah WormGPT, AI asisten teknis developer. Jawab dengan jelas dan rinci."
      }]
    },
    generationConfig: {
      maxOutputTokens: 4096
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI tidak memberikan jawaban.";
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini API error" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));