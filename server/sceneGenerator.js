import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Generates 3D Scene JSON specifications using Google Gemini AI.
 */
export async function generateSceneFromGemini(prompt, apiKey) {
  if (!apiKey && !process.env.GEMINI_API_KEY) {
    throw new Error("No Gemini API key provided.");
  }

  const genAI = new GoogleGenerativeAI(apiKey || process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemInstruction = `
    You are an expert 3D WebXR and Scene Architect AI.
    The user wants to generate a 3D VR environment for: "${prompt}".
    Return a clean JSON object summarizing the explanatory text and 3D scene structure:
    {
      "explanation": "Clear 2-3 sentence overview of the topic",
      "sceneSpec": {
        "title": "Title of concept",
        "category": "Domain category",
        "lighting": "Suggested lighting environment (space/cyberpunk/studio)",
        "elements": [
          { "name": "Element name", "shape": "sphere/cylinder/box/torus", "color": "#hex", "desc": "Function" }
        ],
        "webxrReady": true
      }
    }
  `;

  const result = await model.generateContent(systemInstruction);
  const text = result.response.text();
  
  // Clean JSON block formatting if present
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}
