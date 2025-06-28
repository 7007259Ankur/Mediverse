// src/pages/HealthAssistant.jsx
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Mic, Volume2, Bot, User, Send, Sparkles, AlertCircle, Activity } from 'lucide-react';
import './HealthAssistant.css';

export default function HealthAssistant() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [inputMode, setInputMode] = useState('text');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample analytics data
  const healthMetrics = [
    { name: 'Heart Rate', value: 72, unit: 'bpm', trend: 'stable', icon: '❤️' },
    { name: 'Blood Pressure', value: '118/76', unit: 'mmHg', trend: 'improving', icon: '🩸' },
    { name: 'Sleep', value: 7.2, unit: 'hours', trend: 'declining', icon: '😴' },
    { name: 'Steps', value: 8543, unit: 'today', trend: 'improving', icon: '👟' }
  ];

  useEffect(() => {
    setIsVisible(true);
    // Sample welcome message
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your MediVerse Health Assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response after delay
    setTimeout(() => {
      const responses = {
        'headache': "For mild headaches, consider rest and hydration. Over-the-counter options include acetaminophen or ibuprofen. If severe or persistent, consult a doctor.",
        'blood sugar': "To help lower blood sugar: exercise regularly, reduce carb intake, increase fiber, stay hydrated, and manage stress. Monitor levels and consult your doctor.",
        'chest pain': "Chest pain can be serious. If it's severe, spreads to arms/jaw, or comes with sweating/nausea, seek emergency care immediately for evaluation."
      };

      const botResponse = {
        id: messages.length + 2,
        text: responses[inputValue.toLowerCase().match(/headache|blood sugar|chest pain/i)?.[0]] || 
              "I recommend consulting with your healthcare provider for personalized advice. For general information: " + 
              "Maintain a balanced diet, regular exercise, and proper sleep for overall health.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const toggleVoiceInput = () => {
    setIsListening(prev => !prev);
    // In a real app, you would integrate with the Web Speech API here
    if (!isListening) {
      setInputValue(prev => prev + " (Voice input would appear here...)");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className={`health-assistant ${isVisible ? 'fade-in' : ''}`}>
      {/* Hero Section */}
      <section className="assistant-hero">
        <div className="container">
          <div className="hero-content">
            <div className="badge">
              <Sparkles className="w-4 h-4" />
              AI Health Companion
            </div>
            <h1>
              Your 24/7 <span>Health Assistant</span>
            </h1>
            <p>
              Get instant health guidance through conversational AI. Our assistant provides 
              preliminary advice, medication information, and helps you understand when to 
              seek professional care.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <div>Instant</div>
                <span>Responses</span>
              </div>
              <div className="stat">
                <div>100+</div>
                <span>Health Topics</span>
              </div>
              <div className="stat">
                <div>Voice & Text</div>
                <span>Options</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="chat-bubble large">
              <div className="bubble-content">
                <div className="message bot">
                  <div className="avatar">
                    <Bot className="w-5 h-5" />
                  </div>
                  <p>Having chest discomfort? I can help assess your symptoms.</p>
                </div>
                <div className="message user">
                  <div className="avatar">
                    <User className="w-5 h-5" />
                  </div>
                  <p>My chest feels tight, what should I do?</p>
                </div>
                <div className="message bot urgent">
                  <div className="avatar">
                    <Bot className="w-5 h-5" />
                  </div>
                  <p>Chest tightness can be serious. If accompanied by pain spreading to arm/jaw or nausea, seek emergency care immediately.</p>
                </div>
              </div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interface */}
      <section className="assistant-interface">
        <div className="container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare className="w-4 h-4" />
              Chat Assistant
            </button>
            <button 
              className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <Activity className="w-4 h-4" />
              Health Analytics
            </button>
          </div>

          {activeTab === 'chat' ? (
            <div className="chat-container">
              <div className="chat-header">
                <div className="assistant-info">
                  <div className="avatar">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3>MediVerse Health Assistant</h3>
                    <p>Powered by ElevenLabs AI</p>
                  </div>
                </div>
                <div className="input-mode-toggle">
                  <button 
                    className={`mode-button ${inputMode === 'text' ? 'active' : ''}`}
                    onClick={() => setInputMode('text')}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button 
                    className={`mode-button ${inputMode === 'voice' ? 'active' : ''}`}
                    onClick={() => setInputMode('voice')}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="chat-messages">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`message ${message.sender} ${message.urgent ? 'urgent' : ''}`}
                  >
                    <div className="avatar">
                      {message.sender === 'bot' ? (
                        <Bot className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div className="message-content">
                      <p>{message.text}</p>
                      <div className="message-time">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="message bot">
                    <div className="avatar">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input">
                {inputMode === 'voice' ? (
                  <button 
                    className={`voice-input-button ${isListening ? 'listening' : ''}`}
                    onClick={toggleVoiceInput}
                  >
                    <Mic className="w-5 h-5" />
                    {isListening ? 'Listening...' : 'Tap to Speak'}
                  </button>
                ) : (
                  <>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask a health question..."
                    />
                    <button 
                      className="send-button"
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="analytics-container">
              <div className="analytics-header">
                <h3>Your Health Dashboard</h3>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
              </div>
              
              <div className="metrics-grid">
                {healthMetrics.map(metric => (
                  <div key={metric.name} className="metric-card">
                    <div className="metric-icon">{metric.icon}</div>
                    <div className="metric-info">
                      <h4>{metric.name}</h4>
                      <div className="metric-value">
                        {metric.value} <span>{metric.unit}</span>
                      </div>
                    </div>
                    <div className={`metric-trend ${metric.trend}`}>
                      {metric.trend === 'improving' ? '↑ Improving' : 
                       metric.trend === 'declining' ? '↓ Declining' : '→ Stable'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="health-insights">
                <h4>AI-Generated Insights</h4>
                <div className="insights-container">
                  <div className="insight positive">
                    <div className="insight-icon">💪</div>
                    <p>Your physical activity levels are excellent this week. Keep it up!</p>
                  </div>
                  <div className="insight warning">
                    <div className="insight-icon">⚠️</div>
                    <p>Sleep duration has decreased by 15% compared to last week. Consider improving sleep hygiene.</p>
                  </div>
                  <div className="insight neutral">
                    <div className="insight-icon">🩺</div>
                    <p>Your blood pressure is within normal range. Continue monitoring weekly.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="assistant-features">
        <div className="container">
          <h2>Advanced Health Assistance Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3>Voice Interaction</h3>
              <p>Natural voice conversations powered by ElevenLabs' lifelike speech synthesis for hands-free health queries.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Activity className="w-6 h-6" />
              </div>
              <h3>Health Analytics</h3>
              <p>Visual dashboard tracking your vital metrics with AI-generated personalized insights and trends.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3>Symptom Assessment</h3>
              <p>Preliminary evaluation of symptoms with guidance on when to seek professional medical attention.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="disclaimer">
        <div className="container">
          <div className="disclaimer-card">
            <AlertCircle className="w-5 h-5" />
            <p>
              <strong>Important Notice:</strong> The Health Assistant provides general information only and is not a 
              substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your 
              physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}