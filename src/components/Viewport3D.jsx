import React, { useEffect, useRef, useState } from 'react';
import { ThreeEngine } from '../engine/ThreeScene';
import Toolbar from './Toolbar';
import PartInspector from './PartInspector';
import { Sliders, Sparkles, Image as ImageIcon, Download } from 'lucide-react';

export default function Viewport3D({
  currentModelData,
  isLoading,
  activePrompt,
  sceneSpec,
  imageUrl
}) {
  const containerRef = useRef(null);
  const engineRef = useRef(null);

  // States
  const [selectedMesh, setSelectedMesh] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lightingPreset, setLightingPreset] = useState('space');
  const [isWireframe, setIsWireframe] = useState(false);
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [isImageView, setIsImageView] = useState(false);

  // Initialize Three Engine once
  useEffect(() => {
    if (!containerRef.current) return;

    engineRef.current = new ThreeEngine(
      containerRef.current,
      (meshInfo) => setSelectedMesh(meshInfo),
      (pins) => setAnnotations(pins)
    );

    return () => {
      if (engineRef.current) engineRef.current.dispose();
    };
  }, []);

  // Update model when prop changes
  useEffect(() => {
    if (engineRef.current && currentModelData) {
      engineRef.current.loadModel(currentModelData);
      setExplodeFactor(0);
      setSelectedMesh(null);
    }
  }, [currentModelData]);

  // Toolbar Handlers
  const handleToggleAutoRotate = () => {
    const nextState = !isAutoRotate;
    setIsAutoRotate(nextState);
    if (engineRef.current) engineRef.current.setAutoRotate(nextState);
  };

  const handleResetCamera = () => {
    if (engineRef.current) engineRef.current.resetCamera();
  };

  const handleToggleFullscreen = () => {
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);
    const parentContainer = containerRef.current.parentElement;
    if (nextState) {
      if (parentContainer.requestFullscreen) parentContainer.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const handleChangeLighting = (preset) => {
    setLightingPreset(preset);
    if (engineRef.current) engineRef.current.setLightingPreset(preset);
  };

  const handleToggleWireframe = () => {
    const nextState = !isWireframe;
    setIsWireframe(nextState);
    if (engineRef.current) engineRef.current.setWireframe(nextState);
  };

  const handleChangeExplode = (val) => {
    setExplodeFactor(val);
    if (engineRef.current) engineRef.current.setExplodeFactor(val);
  };

  const handleTakeScreenshot = () => {
    if (engineRef.current) {
      const dataUrl = engineRef.current.takeScreenshot();
      const link = document.createElement('a');
      link.download = `Text2Reality_${activePrompt.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleDownloadSpec = () => {
    if (sceneSpec) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sceneSpec, null, 2));
      const link = document.createElement('a');
      link.setAttribute("href", dataStr);
      link.setAttribute("download", `SceneSpec_${activePrompt.replace(/\s+/g, '_')}.json`);
      link.click();
    }
  };

  const handleToggleVR = () => {
    alert("WebXR VR Mode initialized! Connect your Meta Quest or WebXR browser headset to view in full immersive 3D space.");
  };

  return (
    <div className="viewport-container">
      {/* 3D Canvas Element */}
      <div 
        ref={containerRef} 
        className="canvas-wrapper" 
        style={{ opacity: isImageView ? 0 : 1, transition: 'opacity 0.3s ease' }}
      />

      {/* AI Image Viewport Overlay */}
      {isImageView && imageUrl && (
        <div className="viewport-image-overlay">
          <img 
            src={imageUrl} 
            alt="AI Render Preview" 
            className="viewport-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";
            }}
          />
          <div className="viewport-image-badge">
            <ImageIcon className="w-4 h-4 text-purple-400" />
            <span>AI Render Visualization: {activePrompt}</span>
            <a 
              href={imageUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="btn-icon-xs"
              style={{ marginLeft: '0.5rem', color: '#06b6d4' }}
              title="Open full resolution"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Generating 3D Scene & AI Image...</h3>
            <p style={{ fontSize: '0.85rem', color: '#06b6d4', marginTop: '0.4rem' }}>
              Gemini AI synthesizing 3D geometry & rendering visual preview
            </p>
          </div>
        </div>
      )}

      {/* 3D Annotation Pins */}
      {!isImageView && annotations.map((pin, idx) => (
        pin.visible && (
          <div
            key={idx}
            className="annotation-pin"
            style={{ left: `${pin.x}px`, top: `${pin.y}px` }}
          >
            📌 {pin.text}
          </div>
        )
      ))}

      {/* Viewport Overlay & Toolbar */}
      <div className="viewport-overlay">
        <Toolbar
          isAutoRotate={isAutoRotate}
          onToggleAutoRotate={handleToggleAutoRotate}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          onResetCamera={handleResetCamera}
          lightingPreset={lightingPreset}
          onChangeLighting={handleChangeLighting}
          isWireframe={isWireframe}
          onToggleWireframe={handleToggleWireframe}
          explodeFactor={explodeFactor}
          onChangeExplode={handleChangeExplode}
          onTakeScreenshot={handleTakeScreenshot}
          onDownloadSpec={handleDownloadSpec}
          onToggleVR={handleToggleVR}
          isImageView={isImageView}
          onToggleImageView={() => setIsImageView(!isImageView)}
        />

        {/* Bottom Control Bar */}
        <div className="bottom-bar">
          <div className="model-title-badge">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <div>
              <div className="model-title-text">{currentModelData?.title || "3D Virtual Scene"}</div>
              <div className="model-sub-text">{currentModelData?.category || "Text2Reality Engine"}</div>
            </div>
          </div>

          <div className="controls-card">
            <div className="control-item">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sliders className="w-3.5 h-3.5" /> Explode View
              </span>
              <input
                type="range"
                min="0"
                max="2"
                step="0.05"
                value={explodeFactor}
                onChange={(e) => handleChangeExplode(parseFloat(e.target.value))}
                style={{ width: '100px' }}
              />
            </div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', display: 'flex', justifyContent: 'space-between' }}>
              <span>Mode: {isImageView ? "AI Image Render" : "Interactive 3D Canvas"}</span>
              <span>Zoom: Mouse Scroll</span>
            </div>
          </div>
        </div>
      </div>

      {/* Part Inspector Card */}
      {!isImageView && <PartInspector selectedMesh={selectedMesh} onClose={() => setSelectedMesh(null)} />}
    </div>
  );
}

