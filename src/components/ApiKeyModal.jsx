import React, { useState } from 'react';
import { X, Key, Check } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, apiKey, onSaveApiKey }) {
  const [keyInput, setKeyInput] = useState(apiKey || "");

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(keyInput);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key className="w-5 h-5 text-purple-400" />
            <h3 className="modal-title">Configure Gemini API Key</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.5 }}>
          Enter your Gemini API key to enable direct cloud AI 3D scene generation. If left blank, Text2Reality uses the high-speed built-in procedural engine.
        </p>

        <input
          type="password"
          className="modal-input"
          placeholder="AIzaSy..."
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <button className="btn-icon" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            <Check className="w-4 h-4" /> Save Key
          </button>
        </div>
      </div>
    </div>
  );
}
