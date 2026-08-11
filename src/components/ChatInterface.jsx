import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Mic, 
  Key, 
  Bot, 
  User, 
  Box, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Sun,
  Moon,
  Trash2,
  Image as ImageIcon,
  Download,
  Maximize2,
  X
} from 'lucide-react';

export default function ChatInterface({
  messages,
  onSendMessage,
  onOpenApiKeyModal,
  isCollapsed,
  onToggleCollapse,
  theme,
  onToggleTheme,
  onClearChat
}) {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech Recognition API is not supported in this browser. Please type your prompt.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    if (!isListening) {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
    }
  };

  const handleDownloadImage = (url, title = "generated_image") => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}.png`;
    link.target = '_blank';
    link.click();
  };

  return (
    <div className={`chat-sidebar glass-panel ${isCollapsed ? 'collapsed' : ''}`}>
      {/* App Header */}
      <div className="app-header">
        <div className="brand-logo">
          <div className="logo-icon">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="brand-text">
            <span className="brand-title">Text2Reality</span>
            <span className="brand-tag">Natural Language to VR</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button 
            className="btn-icon" 
            onClick={onToggleTheme} 
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          <button className="btn-icon" onClick={onClearChat} title="Clear Chat History">
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
          <button className="btn-icon" onClick={onOpenApiKeyModal} title="Configure Gemini API Key">
            <Key className="w-4 h-4 text-purple-400" />
          </button>
          <button className="btn-icon" onClick={onToggleCollapse} title="Collapse Chat Panel">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-avatar">
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className="message-content">
              <p>{msg.text}</p>
              
              {/* AI Generated Image Card */}
              {msg.imageUrl && (
                <div className="message-image-card">
                  <div className="image-card-header">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#06b6d4', fontWeight: 600 }}>
                      <ImageIcon className="w-3.5 h-3.5" /> AI Generated Image
                    </span>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button 
                        className="btn-icon-xs" 
                        onClick={() => setPreviewImage(msg.imageUrl)}
                        title="Enlarge Image"
                      >
                        <Maximize2 className="w-3 h-3" />
                      </button>
                      <button 
                        className="btn-icon-xs" 
                        onClick={() => handleDownloadImage(msg.imageUrl, msg.spec?.title || "ai_render")}
                        title="Download Image"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="image-wrapper" onClick={() => setPreviewImage(msg.imageUrl)}>
                    <img 
                      src={msg.imageUrl} 
                      alt="AI Generated Visualization"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>
                </div>
              )}

              {msg.spec && (
                <div className="spec-badge">
                  <Box className="w-3.5 h-3.5" />
                  <span>3D Model Rendered: {msg.spec.title}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Image Preview Modal */}
      {previewImage && (
        <div className="image-modal-backdrop" onClick={() => setPreviewImage(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={() => setPreviewImage(null)}>
              <X className="w-5 h-5" />
            </button>
            <img src={previewImage} alt="Enlarged AI Visualization" />
            <div style={{ padding: '0.8rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#06b6d4', fontWeight: 600 }}>Text2Reality AI Visualizer</span>
              <button 
                className="btn-primary" 
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => handleDownloadImage(previewImage, "ai_high_res_visualizer")}
              >
                <Download className="w-3.5 h-3.5" /> Download HD Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Input Form */}
      <div className="chat-input-wrapper">
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Describe what you want to learn in 3D..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <button
            type="button"
            className={`btn-icon ${isListening ? 'text-red-400 animate-pulse' : ''}`}
            style={{ width: '32px', height: '32px', border: 'none' }}
            onClick={handleVoiceToggle}
            title="Voice Input"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '0.4rem 0.8rem', borderRadius: '8px' }}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div style={{ marginTop: '0.6rem', textAlign: 'center', fontSize: '0.7rem', color: '#6b7280' }}>
          Powered by Gemini AI • 3D WebXR Three.js Engine
        </div>
      </div>
    </div>
  );
}
