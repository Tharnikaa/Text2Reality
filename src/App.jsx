import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import Viewport3D from './components/Viewport3D';
import ApiKeyModal from './components/ApiKeyModal';
import { generate3DScene } from './utils/aiClient';
import { createSceneFromPrompt } from './engine/ProceduralModels';
import { ChevronRight } from 'lucide-react';

export default function App() {
  const initialPrompt = "Show me the structure of a biological neuron with axon and soma";
  const initialModelData = createSceneFromPrompt(initialPrompt);

  const [activePrompt, setActivePrompt] = useState(initialPrompt);
  const [currentModelData, setCurrentModelData] = useState(initialModelData);
  const [sceneSpec, setSceneSpec] = useState({
    title: initialModelData.title,
    category: initialModelData.category,
    nodesCount: initialModelData.group.children.length,
    lighting: "PBR Deep Space",
    webxrReady: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Welcome to Text2Reality! Describe anything in the chat below — I\'ll generate an interactive 3D scene and an AI image render for you.'
    }
  ]);

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'ai',
        text: 'Chat history cleared. Type any concept in the terminal to construct a 3D scene & AI image.'
      }
    ]);
  };

  const handleSendMessage = async (userText) => {
    setActivePrompt(userText);
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const result = await generate3DScene(userText, apiKey);
      
      setCurrentModelData(result.modelData);
      setSceneSpec(result.sceneSpec);
      if (result.imageUrl) {
        setCurrentImageUrl(result.imageUrl);
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: result.aiText,
          spec: result.sceneSpec,
          imageUrl: result.imageUrl
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `An error occurred while generating the scene. Loaded fallback procedural model for "${userText}".`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container" data-theme={theme}>
      {/* Expand Floating Button when sidebar collapsed */}
      {isSidebarCollapsed && (
        <button
          className="btn-icon"
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            zIndex: 20,
            background: 'rgba(16, 22, 38, 0.9)',
            borderColor: 'rgba(139, 92, 246, 0.4)'
          }}
          onClick={() => setIsSidebarCollapsed(false)}
          title="Expand Chat Sidebar"
        >
          <ChevronRight className="w-4 h-4 text-purple-400" />
        </button>
      )}

      {/* AI Chatbox Panel */}
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onClearChat={handleClearChat}
      />

      {/* 3D Viewport Panel */}
      <Viewport3D
        currentModelData={currentModelData}
        isLoading={isLoading}
        activePrompt={activePrompt}
        sceneSpec={sceneSpec}
        imageUrl={currentImageUrl}
      />

      {/* Gemini API Key Configuration Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={(key) => setApiKey(key)}
      />
    </div>
  );
}
