import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  User, 
  MessageSquare, 
  Users, 
  Hash,
  Search,
  MoreVertical,
  Paperclip,
  Smile
} from 'lucide-react';
import { FacultyMessage } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ChatProps {
  messages: FacultyMessage[];
  onSendMessage: (msg: FacultyMessage) => void;
  userName: string;
}

export function Chat({ messages, onSendMessage, userName }: ChatProps) {
  const [input, setInput] = useState('');
  const [activeChannel, setActiveChannel] = useState('faculty-general');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChannel]);

  const handleSend = () => {
    if (!input.trim()) return;
    const msg: FacultyMessage = {
      id: Date.now().toString(),
      sender: userName,
      role: 'faculty',
      content: input,
      timestamp: new Date().toISOString()
    };
    onSendMessage(msg);
    setInput('');
  };

  const channels = [
    { id: 'faculty-general', name: 'Faculty General', icon: Hash },
    { id: 'department-news', name: 'Department News', icon: MessageSquare },
    { id: 'student-queries', name: 'Student Queries', icon: Users },
  ];

  return (
    <div className="flex h-[calc(100vh-160px)] bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
      {/* Sidebar */}
      <div className="w-64 border-r border-zinc-100 bg-zinc-50/50 flex flex-col">
        <div className="p-6">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Channels</h3>
          <div className="space-y-1">
            {channels.map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                  activeChannel === channel.id ? "bg-white text-orange-600 shadow-sm" : "text-zinc-500 hover:bg-zinc-100"
                )}
              >
                <channel.icon size={18} />
                {channel.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-auto p-6 border-t border-zinc-100">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Direct Messages</h3>
          <div className="space-y-3">
            {['Dr. Sarah Smith', 'Prof. James Wilson', 'Dean Office'].map(name => (
              <div key={name} className="flex items-center gap-3 cursor-pointer group">
                <div className="w-8 h-8 bg-zinc-200 rounded-lg border border-zinc-300 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt={name} referrerPolicy="no-referrer" />
                </div>
                <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">{name}</span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full ml-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <Hash size={20} />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900">{channels.find(c => c.id === activeChannel)?.name}</h3>
              <p className="text-xs text-zinc-500">24 faculty members online</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input type="text" placeholder="Search messages..." className="pl-9 pr-4 py-2 bg-zinc-100 border-none rounded-full text-xs w-48" />
            </div>
            <button className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-lg transition-all">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((msg, idx) => {
            const isMe = msg.sender === userName;
            const showHeader = idx === 0 || messages[idx - 1].sender !== msg.sender;

            return (
              <div key={msg.id} className={cn(
                "flex gap-4",
                isMe ? "flex-row-reverse" : ""
              )}>
                {!isMe && showHeader && (
                  <div className="w-10 h-10 bg-zinc-100 rounded-xl border border-zinc-200 overflow-hidden flex-shrink-0">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender}`} alt={msg.sender} referrerPolicy="no-referrer" />
                  </div>
                )}
                {!isMe && !showHeader && <div className="w-10 flex-shrink-0"></div>}
                
                <div className={cn(
                  "max-w-[70%]",
                  isMe ? "items-end" : "items-start"
                )}>
                  {!isMe && showHeader && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-zinc-900">{msg.sender}</span>
                      <span className="text-[10px] text-zinc-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                  <div className={cn(
                    "p-4 rounded-2xl text-sm shadow-sm",
                    isMe ? "bg-zinc-900 text-white rounded-tr-none" : "bg-zinc-100 text-zinc-800 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 border-t border-zinc-100">
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-2 flex items-end gap-2">
            <div className="flex flex-col flex-1">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder={`Message #${channels.find(c => c.id === activeChannel)?.name}`}
                className="w-full bg-transparent border-none focus:ring-0 text-sm p-3 resize-none min-h-[44px] max-h-32"
              />
              <div className="flex items-center gap-1 px-2 pb-1">
                <button className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200 rounded-lg transition-all"><Paperclip size={18} /></button>
                <button className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200 rounded-lg transition-all"><Smile size={18} /></button>
              </div>
            </div>
            <button 
              onClick={handleSend}
              className="bg-orange-600 text-white p-3 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
