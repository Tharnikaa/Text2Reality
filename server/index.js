import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateSceneFromGemini } from './sceneGenerator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Status Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', engine: 'Text2Reality AI Scene Engine v1.0.0' });
});

// Scene Generation Endpoint
app.post('/api/generate-scene', async (req, res) => {
  const { prompt, apiKey } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt string is required.' });
  }

  try {
    const aiResult = await generateSceneFromGemini(prompt, apiKey);
    res.json({
      success: true,
      aiExplanation: aiResult.explanation,
      sceneSpec: aiResult.sceneSpec
    });
  } catch (err) {
    console.warn("Gemini API call fallback notice:", err.message);
    res.json({
      success: true,
      fallback: true,
      aiExplanation: `Generated procedural 3D scene representation for: "${prompt}".`,
      sceneSpec: {
        title: prompt.toUpperCase(),
        category: "Procedural 3D Model",
        lighting: "Deep Space",
        webxrReady: true
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Text2Reality Server running on http://localhost:${PORT}`);
});
