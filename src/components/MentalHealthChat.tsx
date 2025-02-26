'use client';

import { useState, useRef, useEffect } from 'react';
import { getRelevantTips, emergencyResources } from '@/utils/mentalHealthResources';

interface Message {
  text: string;
  isUser: boolean;
  tips?: string[];
}

export default function MentalHealthChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    hasIntroduced: false,
    lastTopic: '',
    messageCount: 0
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getContextualResponse = (userMessage: string, context: typeof conversationContext) => {
    const message = userMessage.toLowerCase();

    // First-time greeting
    if (!context.hasIntroduced && message.match(/^(hi|hello|hey|good|hi there)/i)) {
      setConversationContext(prev => ({ ...prev, hasIntroduced: true }));
      return "Hi there! 👋 I'm your mental health friend. I'm here to listen and chat with you about anything that's on your mind. How are you feeling today?";
    }

    // Follow-up to how are you feeling
    if (context.messageCount === 1 && context.hasIntroduced) {
      if (message.match(/good|great|okay|fine|alright|well/i)) {
        return "That's good to hear! Remember, I'm here if you ever want to talk about anything specific. What's been helping you feel that way?";
      } else if (message.match(/bad|not good|terrible|awful|sad|depressed|anxious|stressed/i)) {
        setConversationContext(prev => ({ ...prev, lastTopic: 'negative_emotion' }));
        return "I hear you, and it's completely okay to feel that way. Sometimes just acknowledging our feelings is an important first step. Would you like to tell me more about what's been going on?";
      }
    }

    // If they're sharing a problem
    if (message.length > 30 || message.includes('because') || message.includes('feel')) {
      const responses = [
        "Thank you for opening up to me about this. It takes courage to share these feelings. What do you think would help you feel even a tiny bit better right now?",
        "I can hear how challenging this is for you. You're not alone in feeling this way. What kind of support would be most helpful at this moment?",
        "It makes sense that you're feeling this way. Sometimes talking about it can help - would you like to explore this a bit more?",
        "I'm really glad you're sharing this with me. Let's take it one step at a time. What's the hardest part about this for you?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // If they're asking for advice
    if (message.match(/advice|help|don't know|what.*(should|can) i do/i)) {
      return "Before I share some suggestions, I want to make sure I understand what you're going through. Could you tell me a bit more about the situation?";
    }

    // For shorter responses or questions
    const contextualResponses = [
      "Can you tell me more about that?",
      "How long have you been feeling this way?",
      "What thoughts come up when you think about this?",
      "That sounds really challenging. What helps you cope when you feel this way?",
      "I'm here to listen. Would you like to explore this further?"
    ];
    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const userMessage = newMessage.trim();
    setNewMessage('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      // Get contextual response based on conversation state
      const response = getContextualResponse(userMessage, conversationContext);
      
      // Update conversation context
      setConversationContext(prev => ({
        ...prev,
        messageCount: prev.messageCount + 1,
        lastTopic: userMessage.toLowerCase()
      }));

      // Get relevant tips if the message suggests emotional distress
      const tips = userMessage.length > 20 ? getRelevantTips(userMessage) : [];
      
      setMessages(prev => [...prev, { 
        text: response, 
        isUser: false,
        tips: tips.length > 0 ? tips : undefined
      }]);

      // Check for crisis keywords
      if (userMessage.match(/suicide|kill|die|end it|harm|hurt myself/i)) {
        setMessages(prev => [...prev, { 
          text: emergencyResources.join('\n'), 
          isUser: false 
        }]);
      }
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
                <div className="space-y-2 max-w-[80%]">
                  <div
                    className={`p-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                  {message.tips && (
                    <div className="bg-white/5 p-3 rounded-xl space-y-2">
                      <p className="text-blue-300 font-medium">Helpful tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-white/90">
                        {message.tips.map((tip, i) => (
                          <li key={i} className="text-sm">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
