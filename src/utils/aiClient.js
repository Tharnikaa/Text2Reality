import { createSceneFromPrompt } from '../engine/ProceduralModels';

/**
 * AI Service Client
 * Connects to Express backend or falls back to local procedural generator.
 */

export async function generate3DScene(promptText, apiKey = "") {
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText + " 3D structure scientific render high quality dark background 8k resolution")}?width=800&height=450&nologo=true`;

  try {
    const response = await fetch('/api/generate-scene', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: promptText, apiKey })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.sceneSpec) {
        return {
          modelData: createSceneFromPrompt(promptText),
          aiText: data.aiExplanation || `Generated 3D scene and AI visual representation for "${promptText}".`,
          sceneSpec: data.sceneSpec,
          imageUrl
        };
      }
    }
  } catch (err) {
    console.warn("Backend API endpoint unavailable, executing client-side procedural generator.", err);
  }

  // Fallback to local procedural generator
  const modelData = createSceneFromPrompt(promptText);
  return {
    modelData,
    aiText: `Synthesized interactive 3D virtual environment for: "${promptText}". Features real-time PBR lighting, component hierarchy, 360° rotation, and WebXR scene graph.`,
    sceneSpec: {
      prompt: promptText,
      title: modelData.title,
      category: modelData.category,
      nodesCount: modelData.group.children.length,
      lighting: "Dynamic PBR Studio",
      webxrReady: true
    },
    imageUrl
  };
}

