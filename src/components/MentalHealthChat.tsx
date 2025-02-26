'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

export default function MentalHealthChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const userMessage = newMessage.trim().toLowerCase();
    setNewMessage('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      // Handle greetings
      if (userMessage.match(/^(hi|hello|hey|good morning|good evening|good afternoon)$/i)) {
        setMessages(prev => [...prev, { 
          text: "Hi! I'm here to chat and support you. How are you feeling today?", 
          isUser: false 
        }]);
        setIsLoading(false);
        return;
      }

      // Handle "I am sad" or similar emotions
      if (userMessage.match(/^(i'?m|i am|feeling|feel)\s+(sad|depressed|down|upset|anxious|worried|stressed)/i)) {
        const responses = [
          "I hear you, and it's completely valid to feel that way. Would you like to tell me more about what's making you feel this way?",
          "I'm here to listen. Can you share what's been happening that's making you feel this way? Sometimes talking about it can help.",
          "That must be really difficult. Would you like to explore what's contributing to these feelings? I'm here to support you.",
          "Thank you for sharing that with me. It takes courage to express these feelings. What do you think triggered these emotions?"
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        setMessages(prev => [...prev, { text: response, isUser: false }]);
        setIsLoading(false);
        return;
      }

      // Handle "I need help" or similar requests
      if (userMessage.match(/^(i need|help|can you|please)/i)) {
        const responses = [
          "I'm here to help. What kind of support would be most helpful right now?",
          "You're taking a positive step by reaching out. What's on your mind?",
          "I'm listening and I want to help. Can you tell me more about what you're going through?",
          "Thank you for reaching out. Let's work through this together. What's troubling you?"
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        setMessages(prev => [...prev, { text: response, isUser: false }]);
        setIsLoading(false);
        return;
      }

      // For other messages, use a supportive response
      const supportiveResponses = [
        "I'm listening. Can you tell me more about that?",
        "Thank you for sharing. How long have you been feeling this way?",
        "That sounds challenging. What do you think would help you feel better right now?",
        "I hear you. Would you like to explore this further?",
        "Your feelings are valid. What kind of support would be most helpful?",
        "I'm here to support you. Would you like to talk more about what's on your mind?"
      ];
      
      const response = supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
      setMessages(prev => [...prev, { text: response, isUser: false }]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "I'm here to listen and support you. Would you like to tell me more?", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 p-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        title="Open mental health chat"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 h-96 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col">
          {/* Chat header */}
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              Mental Health Friend
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-2xl bg-white/10 text-white">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20 focus:border-white/40 rounded-lg focus:outline-none text-white placeholder-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="p-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
