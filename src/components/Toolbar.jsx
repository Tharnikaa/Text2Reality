import React from 'react';
import { 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  Eye, 
  Sun, 
  Sparkles, 
  Camera, 
  Download, 
  Layers, 
  Glasses, 
  RefreshCw,
  Image as ImageIcon,
  Box
} from 'lucide-react';

export default function Toolbar({
  isAutoRotate,
  onToggleAutoRotate,
  isFullscreen,
  onToggleFullscreen,
  onResetCamera,
  lightingPreset,
  onChangeLighting,
  isWireframe,
  onToggleWireframe,
  explodeFactor,
  onChangeExplode,
  onTakeScreenshot,
  onDownloadSpec,
  onToggleVR,
  isImageView,
  onToggleImageView
}) {
  return (
    <div className="top-bar">
      {/* Group 1: Rotation & View Mode Controls */}
      <div className="toolbar-group">
        <button
          className={`btn-icon ${!isImageView ? 'active' : ''}`}
          onClick={() => isImageView && onToggleImageView()}
          title="Switch to Interactive 3D Canvas"
        >
          <Box className="w-4 h-4 text-cyan-400" />
        </button>

        <button
          className={`btn-icon ${isImageView ? 'active' : ''}`}
          onClick={() => !isImageView && onToggleImageView()}
          title="Switch to AI Generated Image View"
        >
          <ImageIcon className="w-4 h-4 text-purple-400" />
        </button>

        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.15)', margin: '0 0.2rem' }} />

        <button
          className={`btn-icon ${isAutoRotate ? 'active' : ''}`}
          onClick={onToggleAutoRotate}
          title="Toggle 360° Auto-Rotation"
        >
          <RotateCw className={`w-4 h-4 ${isAutoRotate ? 'animate-spin' : ''}`} />
        </button>

        <button
          className="btn-icon"
          onClick={onResetCamera}
          title="Reset Camera & Recenter Model"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <button
          className="btn-icon"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Maximize Viewport"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Group 2: Scene & Environment Customization */}
      <div className="toolbar-group">
        <select
          className="btn-icon"
          style={{ width: 'auto', padding: '0 0.5rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.08)' }}
          value={lightingPreset}
          onChange={(e) => onChangeLighting(e.target.value)}
          title="Select Lighting Environment"
        >
          <option value="space" style={{ background: '#0f172a' }}>🌌 Deep Space</option>
          <option value="cyberpunk" style={{ background: '#0f172a' }}>⚡ Cyberpunk</option>
          <option value="studio" style={{ background: '#0f172a' }}>💡 Studio White</option>
        </select>

        <button
          className={`btn-icon ${isWireframe ? 'active' : ''}`}
          onClick={onToggleWireframe}
          title="Toggle Wireframe / X-Ray Mode"
        >
          <Layers className="w-4 h-4" />
        </button>

        <button
          className="btn-icon"
          onClick={onTakeScreenshot}
          title="Capture HD Screenshot"
        >
          <Camera className="w-4 h-4" />
        </button>

        <button
          className="btn-icon"
          onClick={onDownloadSpec}
          title="Download 3D Scene Specification JSON"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          className="btn-primary"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          onClick={onToggleVR}
          title="Launch WebXR VR Mode"
        >
          <Glasses className="w-4 h-4" />
          <span>Enter VR</span>
        </button>
      </div>
    </div>
  );
}

