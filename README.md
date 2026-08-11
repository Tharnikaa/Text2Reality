# Text2Reality 🔮 — Natural Language to Interactive 3D/VR Engine

> **Team Name**: Reality Crafters  
> **Team Leader**: Srivarsha D M  
> **Team Members**: Tharnikaa Balakrishnan, Naveen Raj R, Sanjay D  
> **Hackathon**: HackFusion  

---

## 🌟 Project Overview

**Text2Reality** is an AI-powered **Natural Language-to-VR/3D Engine** designed to transform traditional textbook & 2D learning into dynamic, interactive, and immersive 3D/VR environments.

Users describe what they want to learn in natural language (e.g. *"Show me the structure of a neuron"*, *"Solar system with orbits"*, *"DNA double helix"*, *"Anatomical human heart"*, *"Rutherford-Bohr quantum atom"*). The application analyzes the request, synthesizes structured 3D scenes, renders them in Three.js with full 360° rotation and zoom control, and allows direct exploration in **WebXR / Virtual Reality**.

---

## 🚀 Key Features

### 💬 1. Interactive AI Chatbox Interface
* **ChatGPT/Claude Style Interface**: Glassmorphism dark-theme layout with real-time prompt generation.
* **Quick Prompt Suggestions**: One-click chips for popular biology, physics, astronomy, and engineering models.
* **Voice Speech Input**: Built-in speech-to-text button allowing users to speak their prompt directly.
* **Structured Output Badge**: Displays model details, category tags, node counts, and scene JSON specifications.

### 🔄 2. Freedom of Rotating (360° Orbit Controls)
* **Smooth 360° Rotation**: Full yaw, pitch, and roll rotation using mouse drag or touch inputs.
* **360° Auto-Rotate Mode**: One-click toggle button to continuously rotate 3D models in real time.
* **Damped Physics**: Smooth inertia feel when orbiting around complex 3D structures.

### 🔍 3. Freedom of Maximizing & Camera Zooming
* **Maximize Viewport Mode**: Fullscreen toggle button (`Maximize2` / `Minimize2`) to expand the 3D canvas across the screen.
* **Fit-to-View Camera Reset**: Instantly recalculates bounding box centers and resets camera focus.
* **Dynamic Zoom Slider & Mouse Wheel**: Infinite smooth zoom control to inspect microscopic structures (e.g. cell nucleus, electron shells).

### 🛠️ 4. Advanced Interactive 3D Inspector Tools
* **Explode View Slider**: Separates complex assemblies into constituent sub-components spaced out in 3D space.
* **Click-to-Inspect Raycaster**: Click on any 3D part to display its name, description, and metadata card.
* **3D Pin Annotations**: Real-time projected 2D HTML markers pinned to key 3D coordinates.
* **Environment Lighting Presets**: Switch instantly between **Deep Space**, **Cyberpunk Neon**, and **Studio White** light rigs.
* **Wireframe / X-Ray Mode**: Toggle transparent wireframe mesh rendering to view internal geometries.
* **HD Screenshot Generator**: Capture and download high-resolution PNG snapshots of generated 3D scenes.
* **WebXR / VR Launcher**: One-click button to initiate immersive WebXR VR sessions on Oculus / Meta Quest and WebXR headsets.

---

## 🏗️ System Architecture & Workflow

```
[ User Prompt / Voice ] 
          │
          ▼
[ React Chat Interface ] 
          │
          ▼
[ Express Backend / Gemini AI ] ───► [ Scene JSON Spec ]
          │
          ▼
[ Three.js Render Pipeline ] ───► [ Procedural & GLTF Builder ]
          │
          ▼
[ Interactive Viewport (OrbitControls / Explode / Annotations) ]
          │
          ▼
[ WebXR Immersive VR Environment ]
```

---

## 💻 Tech Stack

* **Frontend**: React.js 19, HTML5, CSS3 (Glassmorphism & Neon Design System), Lucide Icons
* **3D & VR**: Three.js (WebGL), OrbitControls, Raycaster, WebXR
* **AI Engine**: Google Gemini API (`@google/generative-ai`) + Client Procedural Fallback Engine
* **Backend**: Node.js, Express.js, CORS, Dotenv
* **Build Tooling**: Vite 6, Concurrently

---

## 🔧 Installation & Running Guide

### Prerequisites
* **Node.js**: v18.0 or higher
* **npm**: v9.0 or higher

### Step 1: Clone / Open Directory
```bash
cd f:\projects_antigravity\Text2Reality
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Application
You can run both the Vite frontend dev server and Node Express backend server concurrently using:

```bash
npm start
```

Or run them individually:
* **Frontend Dev Server** (Port 3000):
  ```bash
  npm run dev
  ```
* **Express Backend Server** (Port 5000):
  ```bash
  npm run server
  ```

Open your browser at: **`http://localhost:3000`**

---

## 🔑 Gemini API Key Configuration (Optional)

The application works **100% out-of-the-box** using the built-in high-speed procedural 3D model generator.

To connect your own Google Gemini API Key:
1. Click the 🔑 **Key icon** in the top right of the Chat Interface header.
2. Paste your Gemini API key (`AIzaSy...`).
3. Click **Save Key**.

Alternatively, create a `.env` file in the root folder:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🧪 Quick Test Prompts

Try pasting any of the following prompts into the chat box:

1. `Show me the structure of a biological neuron with axon and soma`
2. `Interactive solar system with sun, planets and orbits`
3. `DNA double helix with base pairs AT and GC`
4. `Anatomical human heart with aorta and muscle ventricles`
5. `Rutherford-Bohr quantum atom model with protons and electrons`
6. `Plant cell structure with cell wall, chloroplasts and nucleus`
7. `V8 internal combustion engine block with moving pistons`

---

## 📂 Project Directory Structure

```
Text2Reality/
├── package.json              # Package manifest and scripts
├── vite.config.js            # Vite configuration & dev proxy
├── index.html                # Main HTML template with fonts
├── README.md                 # Documentation
├── server/
│   ├── index.js              # Express API server endpoint
│   └── sceneGenerator.js     # Gemini AI integration module
└── src/
    ├── main.jsx              # React DOM entry point
    ├── App.jsx               # Main state container
    ├── index.css             # Glassmorphism dark mode CSS
    ├── components/
    │   ├── ChatInterface.jsx # AI Chat sidebar with prompt suggestions
    │   ├── Viewport3D.jsx    # 3D Three.js canvas container
    │   ├── Toolbar.jsx       # Rotation, Maximizing, Lighting & VR tools
    │   ├── PartInspector.jsx # Clicked 3D mesh metadata card
    │   └── ApiKeyModal.jsx   # Gemini API key configuration dialog
    ├── engine/
    │   ├── ThreeScene.js     # ThreeEngine WebGL, OrbitControls & Raycaster
    │   └── ProceduralModels.js # Procedural 3D model generators
    └── utils/
        └── aiClient.js       # Client API requester & fallback generator
```

---

## 🏆 Presentation Alignment

This repository completely implements all slides from the **Text2Reality PPT presentation**:
* **Problem Statement (Slide 2)**: Replaces flat 2D textbook learning with natural-language-driven interactive 3D/VR.
* **Proposed Solution (Slide 3)**: Natural Language → AI → Scene Generation → Three.js Interactive VR.
* **Features (Slide 4)**: AI scene generation, dynamic 3D content creation, rotate/zoom/maximize freedom, interactive VR experience.
* **Idea/Approach (Slide 5)**: React.js UI, Gemini API, Three.js, WebXR, Node.js + Express backend.
* **System Architecture (Slide 6)**: Implemented end-to-end with modular components.

---

© 2026 **Reality Crafters** — Built for HackFusion. All Rights Reserved.
