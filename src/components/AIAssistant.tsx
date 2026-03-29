import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Sparkles, X, MessageSquare } from 'lucide-react';
import { ChatMessage, Theme } from '../types';
import { getAIResponse } from '../services/ai';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AIAssistantProps {
  anthropicKey?: string;
  materialCount: number;
  userName: string;
  theme: Theme;
}

export function AIAssistant({ anthropicKey, materialCount, userName, theme }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${userName}! I'm your Rimtify AI Assistant. I see you have ${materialCount} materials uploaded. How can I help you with your academic work today?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAIResponse(input, messages.map(m => ({ role: m.role, content: m.content })), anthropicKey);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 w-14 h-14 bg-orange-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform z-40"
      >
        <Sparkles size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "fixed inset-x-0 bottom-0 h-[80vh] lg:inset-auto lg:bottom-24 lg:right-8 lg:w-96 lg:h-[600px] rounded-t-[2.5rem] lg:rounded-3xl shadow-2xl border flex flex-col overflow-hidden z-50",
              theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
            )}
          >
            <div className="p-4 bg-zinc-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Rimtify AI Assistant</h3>
                  <p className="text-[10px] text-zinc-400">Powered by {anthropicKey ? 'Claude' : 'Gemini'}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-zinc-800 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className={cn(
              "flex-1 overflow-y-auto p-4 space-y-4",
              theme === 'dark' ? "bg-zinc-950" : "bg-zinc-50"
            )}>
              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex gap-3 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    msg.role === 'user' ? (theme === 'dark' ? "bg-zinc-800 text-zinc-400" : "bg-zinc-200 text-zinc-600") : (theme === 'dark' ? "bg-orange-900/30 text-orange-400" : "bg-orange-100 text-orange-600")
                  )}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm shadow-sm",
                    msg.role === 'user' ? "bg-orange-600 text-white rounded-tr-none" : (theme === 'dark' ? "bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700" : "bg-white text-zinc-800 rounded-tl-none border border-zinc-200")
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    theme === 'dark' ? "bg-orange-900/30 text-orange-400" : "bg-orange-100 text-orange-600"
                  )}>
                    <Bot size={16} />
                  </div>
                  <div className={cn(
                    "p-3 rounded-2xl rounded-tl-none border shadow-sm",
                    theme === 'dark' ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200"
                  )}>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={cn(
              "p-4 border-t",
              theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
            )}>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything..."
                  className={cn(
                    "flex-1 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 border-none",
                    theme === 'dark' ? "bg-zinc-800 text-white placeholder:text-zinc-500" : "bg-zinc-100 text-zinc-900 placeholder:text-zinc-400"
                  )}
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-orange-600 text-white p-2 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
