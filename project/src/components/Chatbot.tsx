import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm CropAI Assistant. I can help you with information about this project. Ask me anything!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('who made') || message.includes('creator') || message.includes('developer')) {
      return "This project was developed by Aditya, Harsh, Atharva & Sairaj as their Final Year Project 2025 from AI&DS Department, TSEC Mumbai University.";
    }
    
    if (message.includes('what') && (message.includes('project') || message.includes('website'))) {
      return "This is a RAG-Enabled Early Disease & Pest Detection system for crops. It uses AI and machine learning to identify crop diseases and pests from images and provides treatment recommendations.";
    }
    
    if (message.includes('how') && (message.includes('use') || message.includes('work') || message.includes('steps'))) {
      return "Here's how to use CropAI:\n1. Click 'Upload Crop Image' or 'Use Camera'\n2. Select or capture a clear image of your crop\n3. Click 'Analyze Image'\n4. Get instant AI-powered diagnosis and treatment recommendations!";
    }
    
    if (message.includes('technology') || message.includes('tech') || message.includes('ai')) {
      return "CropAI uses advanced technologies including:\n• Convolutional Neural Networks (CNN) for image analysis\n• Retrieval-Augmented Generation (RAG) for contextual responses\n• Computer Vision for crop disease detection\n• Generative AI for treatment recommendations";
    }
    
    if (message.includes('contact') || message.includes('reach') || message.includes('email')) {
      return "You can contact the team at:\n📧 Email: adit1809pro@gmail.com\n📞 Phone: +91 8369561904\n📍 Location: TSEC, Mumbai\nOr visit the Contact page for more options!";
    }
    
    if (message.includes('accuracy') || message.includes('reliable') || message.includes('trust')) {
      return "CropAI uses trained CNN models with high accuracy rates. However, this is a student project for educational purposes. For critical agricultural decisions, please consult with agricultural experts.";
    }
    
    if (message.includes('free') || message.includes('cost') || message.includes('price')) {
      return "Yes! CropAI is completely free to use. This is an educational project created by students to help farmers and agricultural enthusiasts.";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Welcome to CropAI. I'm here to help you understand how our crop disease detection system works. What would you like to know?";
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're welcome! Feel free to ask if you have any other questions about CropAI or crop disease detection.";
    }
    
    return "I can help you with information about:\n• Who created this project\n• What CropAI does\n• How to use the system\n• Technologies used\n• Contact information\n• And more! Just ask me anything about CropAI.";
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const userMessage: Message = {
        id: messages.length + 1,
        text: inputText,
        isBot: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      setTimeout(() => {
        const botResponse: Message = {
          id: messages.length + 2,
          text: getBotResponse(inputText),
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
      
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (chatWindowRef.current) {
      const rect = chatWindowRef.current.getBoundingClientRect();
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <>
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110 z-50"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 z-50"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: isMinimized ? '300px' : '400px',
            height: isMinimized ? '60px' : '500px',
            cursor: isDragging ? 'grabbing' : 'default'
          }}
        >
          {/* Header */}
          <div
            className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">CropAI Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-green-700 p-1 rounded"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-green-700 p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.isBot
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-green-600 text-white'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about CropAI..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;