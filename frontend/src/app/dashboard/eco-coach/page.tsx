'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function EcoCoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm your AI Eco Coach. Ask me anything about sustainability, carbon reduction, or your environmental impact. I'm here to help you make greener choices! 🌱",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Mock AI response (would call /api/v1/ai/chat in production)
    setTimeout(() => {
      const responses = [
        "Great question! Reducing meat consumption by even 2 meals per week can lower your food-related emissions by approximately 20%. Try plant-based alternatives like lentil curry or bean tacos — they're delicious and sustainable! 🥗",
        "Your transportation emissions can be significantly reduced by using public transit just 3 days a week. This alone could save roughly 1,200 kg CO₂ per year. Consider a monthly transit pass — it's often cheaper than gas too! 🚌",
        "LED bulbs use 75% less energy than incandescent ones and last 25 times longer. Switching all your home lighting could save about 50 kg CO₂ annually. Smart plugs can also help by cutting phantom power usage. 💡",
        "Composting food waste instead of sending it to landfill reduces methane emissions significantly. A home compost bin is easy to set up and produces nutrient-rich soil for your garden. Start with vegetable scraps and coffee grounds! 🌿",
      ];
      const reply: Message = {
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
      };
      setMessages((prev) => [...prev, reply]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
          <Brain className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-bold">AI Eco Coach</h1>
          <p className="text-xs text-muted-foreground">
            Powered by Google Gemini • Sustainability Expert
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto glass-card p-4 space-y-4 mb-4" role="log" aria-label="Chat messages">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'gradient-bg text-white rounded-br-md'
                  : 'bg-muted rounded-bl-md'
              }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4" aria-hidden="true" />
              </div>
            )}
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md p-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="glass-card p-3 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-2.5 rounded-lg bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
          placeholder="Ask about sustainability, emissions, or eco-friendly tips..."
          aria-label="Chat message input"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-lg gradient-bg text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
