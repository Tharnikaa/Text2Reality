import React from 'react';
import { X, Info, Box } from 'lucide-react';

export default function PartInspector({ selectedMesh, onClose }) {
  if (!selectedMesh) return null;

  return (
    <div className="inspector-card">
      <div className="inspector-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Box className="w-4 h-4 text-cyan-400" />
          <span className="inspector-title">{selectedMesh.name}</span>
        </div>
        <button className="btn-icon" style={{ width: '24px', height: '24px' }} onClick={onClose}>
          <X className="w-3 h-3" />
        </button>
      </div>

      <p className="inspector-desc">{selectedMesh.description}</p>

      <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.72rem', color: '#9ca3af' }}>
        <div>UUID: <span style={{ fontFamily: 'monospace', color: '#a5b4fc' }}>{selectedMesh.uuid.slice(0, 8)}...</span></div>
        <div>Interactive status: <span style={{ color: '#10b981', fontWeight: 600 }}>Clickable Object Node</span></div>
      </div>
    </div>
  );
}
