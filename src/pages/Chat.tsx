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
  Smile,
  FileText,
  Image as ImageIcon,
  CheckCheck,
  Plus,
  ChevronDown,
  Reply,
  Trash2,
  Download,
  Circle
} from 'lucide-react';
import { FacultyMessage } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ChatProps {
  messages: FacultyMessage[];
  onSendMessage: (msg: FacultyMessage) => void;
  userName: string;
  theme?: 'light' | 'dark';
}

export function Chat({ messages, onSendMessage, userName, theme = 'light' }: ChatProps) {
  const [input, setInput] = useState('');
  const [activeChannel, setActiveChannel] = useState('faculty-general');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [replyingTo, setReplyingTo] = useState<FacultyMessage | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChannel]);

  const handleSend = (type: 'text' | 'file' | 'image' = 'text', fileData?: { name: string, size: string }) => {
    if (type === 'text' && !input.trim()) return;
    
    const msg: FacultyMessage = {
      id: Date.now().toString(),
      sender: userName,
      role: 'faculty',
      content: type === 'text' ? input : `Shared a ${type}: ${fileData?.name}`,
      timestamp: new Date().toISOString(),
      channelId: activeChannel,
      type,
      fileName: fileData?.name,
      fileSize: fileData?.size,
      replyTo: replyingTo?.id
    };
    
    onSendMessage(msg);
    if (type === 'text') setInput('');
    setShowFileOptions(false);
    setShowEmojiPicker(false);
    setReplyingTo(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      handleSend(isImage ? 'image' : 'file', { 
        name: file.name, 
        size: (file.size / 1024).toFixed(1) + ' KB' 
      });
    }
  };

  const channels = [
    { id: 'faculty-general', name: 'Faculty General', icon: Hash, desc: 'General discussion for all faculty' },
    { id: 'department-news', name: 'Department News', icon: MessageSquare, desc: 'Official news and updates' },
    { id: 'student-queries', name: 'Student Queries', icon: Users, desc: 'Address student concerns here' },
  ];

  const directMessages = [
    { id: 'dm-sarah', name: 'Dr. Sarah Smith', status: 'online' },
    { id: 'dm-james', name: 'Prof. James Wilson', status: 'online' },
    { id: 'dm-dean', name: 'Dean Office', status: 'offline' },
  ];

  const filteredMessages = messages
    .filter(m => (m.channelId || 'faculty-general') === activeChannel)
    .filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()) || m.sender.toLowerCase().includes(searchQuery.toLowerCase()));

  const groupMessagesByDate = (msgs: FacultyMessage[]) => {
    const groups: { [key: string]: FacultyMessage[] } = {};
    msgs.forEach(m => {
      const date = new Date(m.timestamp).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(m);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(filteredMessages);

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👏', '🙌', '✅', '🚀'];

  const isDark = theme === 'dark';

  return (
    <div className={cn(
      "flex flex-col lg:flex-row h-[calc(100vh-120px)] lg:h-[calc(100vh-160px)] rounded-3xl border overflow-hidden shadow-xl transition-colors duration-300",
      isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
    )}>
      {/* Sidebar */}
      <div className={cn(
        "w-full lg:w-72 border-b lg:border-b-0 lg:border-r flex flex-col max-h-[160px] lg:max-h-none overflow-y-auto no-scrollbar transition-colors duration-300",
        isDark ? "bg-zinc-950/50 border-zinc-800" : "bg-zinc-50/50 border-zinc-100"
      )}>
        <div className="p-4 lg:p-6 space-y-6">
          <button className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-3 rounded-2xl hover:bg-orange-700 transition-all font-bold shadow-lg shadow-orange-600/20 mb-2">
            <Plus size={18} />
            New Message
          </button>

          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className={cn("text-[10px] lg:text-xs font-bold uppercase tracking-widest", isDark ? "text-zinc-500" : "text-zinc-400")}>Channels</h3>
              <button className={cn("p-1 rounded-md transition-colors", isDark ? "hover:bg-zinc-800 text-zinc-500" : "hover:bg-zinc-200 text-zinc-400")}><Plus size={14} /></button>
            </div>
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible no-scrollbar">
              {channels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={cn(
                    "flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl transition-all text-xs lg:text-sm font-medium whitespace-nowrap",
                    activeChannel === channel.id 
                      ? (isDark ? "bg-zinc-800 text-orange-500 shadow-lg" : "bg-white text-orange-600 shadow-sm ring-1 ring-zinc-200") 
                      : (isDark ? "text-zinc-500 hover:bg-zinc-900" : "text-zinc-500 hover:bg-zinc-100")
                  )}
                >
                  <channel.icon size={16} className={activeChannel === channel.id ? "text-orange-500" : (isDark ? "text-zinc-600" : "text-zinc-400")} />
                  {channel.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="flex items-center justify-between mb-4">
              <h3 className={cn("text-xs font-bold uppercase tracking-widest", isDark ? "text-zinc-500" : "text-zinc-400")}>Direct Messages</h3>
              <button className={cn("p-1 rounded-md transition-colors", isDark ? "hover:bg-zinc-800 text-zinc-500" : "hover:bg-zinc-200 text-zinc-400")}><Plus size={14} /></button>
            </div>
            <div className="space-y-1">
              {directMessages.map(dm => (
                <button
                  key={dm.id}
                  onClick={() => setActiveChannel(dm.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium",
                    activeChannel === dm.id 
                      ? (isDark ? "bg-zinc-800 text-orange-500 shadow-lg" : "bg-white text-orange-600 shadow-sm ring-1 ring-zinc-200") 
                      : (isDark ? "text-zinc-500 hover:bg-zinc-900" : "text-zinc-500 hover:bg-zinc-100")
                  )}
                >
                  <div className="relative">
                    <div className={cn("w-8 h-8 rounded-lg border overflow-hidden", isDark ? "bg-zinc-800 border-zinc-700" : "bg-zinc-200 border-zinc-300")}>
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dm.name}`} alt={dm.name} referrerPolicy="no-referrer" />
                    </div>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2",
                      isDark ? "border-zinc-900" : "border-white",
                      dm.status === 'online' ? "bg-emerald-500" : "bg-zinc-400"
                    )}></div>
                  </div>
                  <span className="truncate">{dm.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={cn("flex-1 flex flex-col overflow-hidden relative transition-colors duration-300", isDark ? "bg-zinc-900" : "bg-white")}>
        {/* Header */}
        <div className={cn(
          "p-4 lg:px-8 lg:py-6 border-b flex items-center justify-between backdrop-blur-md z-10 transition-colors duration-300",
          isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-white/80 border-zinc-100"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-2xl", isDark ? "bg-orange-500/10 text-orange-500" : "bg-orange-50 text-orange-600")}>
              {activeChannel.startsWith('dm-') ? <User size={20} /> : <Hash size={20} />}
            </div>
            <div>
              <h3 className={cn("font-bold text-sm lg:text-lg tracking-tight", isDark ? "text-white" : "text-zinc-900")}>
                {channels.find(c => c.id === activeChannel)?.name || directMessages.find(d => d.id === activeChannel)?.name}
              </h3>
              <div className="flex items-center gap-2">
                <Circle size={8} className="fill-emerald-500 text-emerald-500" />
                <p className={cn("text-[10px] lg:text-xs font-medium", isDark ? "text-zinc-500" : "text-zinc-500")}>Active now</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search messages..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "pl-10 pr-4 py-2 border-none rounded-2xl text-xs w-48 lg:w-64 focus:ring-2 focus:ring-orange-500/20 transition-all",
                  isDark ? "bg-zinc-800 text-white placeholder-zinc-600" : "bg-zinc-100 text-zinc-900 placeholder-zinc-400"
                )} 
              />
            </div>
            <button className={cn("p-2.5 rounded-xl transition-all", isDark ? "text-zinc-500 hover:bg-zinc-800" : "text-zinc-400 hover:bg-zinc-100")}>
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 scroll-smooth no-scrollbar">
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date} className="space-y-8">
              <div className="flex items-center gap-4">
                <div className={cn("flex-1 h-px", isDark ? "bg-zinc-800" : "bg-zinc-100")}></div>
                <span className={cn("text-[10px] font-bold uppercase tracking-widest", isDark ? "text-zinc-600" : "text-zinc-400")}>
                  {new Date(date).toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : date}
                </span>
                <div className={cn("flex-1 h-px", isDark ? "bg-zinc-800" : "bg-zinc-100")}></div>
              </div>
              
              {msgs.map((msg, idx) => {
                const isMe = msg.sender === userName;
                const showHeader = idx === 0 || msgs[idx - 1].sender !== msg.sender;

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={cn(
                      "flex gap-3 lg:gap-4 group",
                      isMe ? "flex-row-reverse" : ""
                    )}
                  >
                    {!isMe && showHeader && (
                      <div className={cn("w-10 h-10 rounded-2xl border overflow-hidden flex-shrink-0 shadow-sm", isDark ? "bg-zinc-800 border-zinc-700" : "bg-zinc-100 border-zinc-200")}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender}`} alt={msg.sender} referrerPolicy="no-referrer" />
                      </div>
                    )}
                    {!isMe && !showHeader && <div className="w-10 flex-shrink-0"></div>}
                    
                    <div className={cn(
                      "max-w-[85%] lg:max-w-[70%] flex flex-col",
                      isMe ? "items-end" : "items-start"
                    )}>
                      {!isMe && showHeader && (
                        <div className="flex items-center gap-2 mb-1.5 px-1">
                          <span className={cn("text-xs font-bold", isDark ? "text-zinc-200" : "text-zinc-900")}>{msg.sender}</span>
                          <span className="text-[10px] text-zinc-500 font-medium">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      )}
                      
                      <div className={cn(
                        "relative group/msg",
                        isMe ? "items-end" : "items-start"
                      )}>
                        {msg.replyTo && (
                          <div className={cn(
                            "mb-1 p-2 rounded-xl text-[10px] border-l-2 border-orange-500 opacity-60 max-w-full truncate",
                            isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-50 text-zinc-500"
                          )}>
                            <span className="font-bold block mb-0.5">
                              {messages.find(m => m.id === msg.replyTo)?.sender || 'Unknown'}
                            </span>
                            {messages.find(m => m.id === msg.replyTo)?.content || 'Original message deleted'}
                          </div>
                        )}
                        <div className={cn(
                          "p-3 lg:p-4 rounded-2xl text-sm shadow-sm transition-all relative",
                          isMe 
                            ? (isDark ? "bg-orange-600 text-white rounded-tr-none hover:bg-orange-700" : "bg-zinc-900 text-white rounded-tr-none hover:bg-zinc-800") 
                            : (isDark ? "bg-zinc-800 text-zinc-200 rounded-tl-none hover:bg-zinc-700" : "bg-zinc-100 text-zinc-800 rounded-tl-none hover:bg-zinc-200")
                        )}>
                          {msg.type === 'file' || msg.type === 'image' ? (
                            <div className="flex items-center gap-3 min-w-[200px]">
                              <div className={cn(
                                "p-2.5 rounded-xl",
                                isMe ? (isDark ? "bg-white/10" : "bg-white/10") : (isDark ? "bg-zinc-900" : "bg-white")
                              )}>
                                {msg.type === 'image' ? <ImageIcon size={20} /> : <FileText size={20} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate text-xs">{msg.fileName}</p>
                                <p className={cn("text-[10px]", isMe ? "text-white/60" : "text-zinc-500")}>{msg.fileSize}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="leading-relaxed">{msg.content}</p>
                          )}

                          {/* Quick Actions on Hover */}
                          <div className={cn(
                            "absolute top-0 opacity-0 group-hover/msg:opacity-100 transition-all flex items-center gap-1 bg-white dark:bg-zinc-800 shadow-xl border border-zinc-100 dark:border-zinc-700 rounded-lg p-1 z-10",
                            isMe ? "right-full mr-2" : "left-full ml-2"
                          )}>
                            <button 
                              onClick={() => setReplyingTo(msg)}
                              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md text-zinc-500 transition-all"
                              title="Reply"
                            >
                              <Reply size={14} />
                            </button>
                            <button 
                              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md text-zinc-500 transition-all"
                              title="React"
                            >
                              <Smile size={14} />
                            </button>
                            {isMe && (
                              <button 
                                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-zinc-500 hover:text-red-500 transition-all"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {isMe && (
                          <div className="flex items-center gap-1 mt-1 px-1">
                            <span className="text-[10px] text-zinc-500 font-medium">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <CheckCheck size={12} className="text-orange-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4 items-center animate-pulse">
              <div className={cn("w-8 h-8 rounded-xl", isDark ? "bg-zinc-800" : "bg-zinc-100")}></div>
              <div className="flex gap-1">
                <div className={cn("w-1.5 h-1.5 rounded-full animate-bounce", isDark ? "bg-zinc-700" : "bg-zinc-300")}></div>
                <div className={cn("w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.2s]", isDark ? "bg-zinc-700" : "bg-zinc-300")}></div>
                <div className={cn("w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.4s]", isDark ? "bg-zinc-700" : "bg-zinc-300")}></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className={cn("p-4 lg:p-8 border-t transition-colors duration-300", isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-white/80 border-zinc-100")}>
          <div className="relative">
            <AnimatePresence>
              {replyingTo && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={cn(
                    "mb-3 p-3 rounded-2xl flex items-center justify-between border-l-4 border-orange-500",
                    isDark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-700"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-orange-500 uppercase mb-0.5">Replying to {replyingTo.sender}</p>
                    <p className="text-xs truncate opacity-70">{replyingTo.content}</p>
                  </div>
                  <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors">
                    <Plus size={16} className="rotate-45 text-zinc-400" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Emoji Picker Popover */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={cn(
                    "absolute bottom-full left-0 mb-4 p-3 rounded-2xl shadow-2xl border grid grid-cols-5 gap-2 z-50",
                    isDark ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-100"
                  )}
                >
                  {emojis.map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => {
                        setInput(prev => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                      className={cn("w-10 h-10 flex items-center justify-center rounded-xl text-xl transition-colors", isDark ? "hover:bg-zinc-700" : "hover:bg-zinc-100")}
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* File Options Popover */}
            <AnimatePresence>
              {showFileOptions && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={cn(
                    "absolute bottom-full left-0 mb-4 p-2 rounded-2xl shadow-2xl border flex flex-col gap-1 z-50 min-w-[160px]",
                    isDark ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-100"
                  )}
                >
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={cn("flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors", isDark ? "hover:bg-zinc-700 text-zinc-300" : "hover:bg-zinc-50 text-zinc-600")}
                  >
                    <ImageIcon size={18} className="text-blue-500" />
                    <span>Upload Image</span>
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={cn("flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors", isDark ? "hover:bg-zinc-700 text-zinc-300" : "hover:bg-zinc-50 text-zinc-600")}
                  >
                    <FileText size={18} className="text-orange-500" />
                    <span>Upload File</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={cn(
              "border rounded-[2rem] p-2 flex items-end gap-2 transition-all",
              isDark 
                ? "bg-zinc-950/50 border-zinc-800 focus-within:ring-orange-500/20 focus-within:border-orange-500/50" 
                : "bg-zinc-50 border-zinc-200 focus-within:ring-4 focus-within:ring-orange-500/5 focus-within:border-orange-500/30"
            )}>
              <div className="flex items-center gap-1 p-1">
                <button 
                  onClick={() => setShowFileOptions(!showFileOptions)}
                  className={cn(
                    "p-2.5 rounded-full transition-all",
                    showFileOptions 
                      ? (isDark ? "bg-zinc-800 text-white" : "bg-zinc-200 text-zinc-900") 
                      : (isDark ? "text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800" : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200")
                  )}
                >
                  <Plus size={22} />
                </button>
              </div>
              
              <div className="flex-1 min-w-0">
                <textarea 
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (e.target.value.length > 0 && !isTyping) {
                      setIsTyping(true);
                      setTimeout(() => setIsTyping(false), 2000);
                    }
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder={`Message ${activeChannel.startsWith('dm-') ? '@' : '#'}${channels.find(c => c.id === activeChannel)?.name || directMessages.find(d => d.id === activeChannel)?.name}`}
                  className={cn(
                    "w-full bg-transparent border-none focus:ring-0 text-sm py-3 px-1 resize-none min-h-[48px] max-h-32 no-scrollbar",
                    isDark ? "text-white placeholder-zinc-700" : "text-zinc-900 placeholder-zinc-400"
                  )}
                />
              </div>

              <div className="flex items-center gap-1 p-1">
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={cn(
                    "p-2.5 rounded-full transition-all",
                    showEmojiPicker 
                      ? (isDark ? "bg-zinc-800 text-white" : "bg-zinc-200 text-zinc-900") 
                      : (isDark ? "text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800" : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200")
                  )}
                >
                  <Smile size={22} />
                </button>
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className={cn(
                    "p-3 rounded-full transition-all shadow-lg",
                    input.trim() 
                      ? "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-600/20" 
                      : (isDark ? "bg-zinc-800 text-zinc-700 cursor-not-allowed shadow-none" : "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none")
                  )}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </div>
          <p className={cn("text-[10px] mt-3 text-center font-medium", isDark ? "text-zinc-600" : "text-zinc-400")}>
            Press <kbd className={cn("px-1.5 py-0.5 rounded border", isDark ? "bg-zinc-800 border-zinc-700 text-zinc-400" : "bg-zinc-100 border-zinc-200 text-zinc-500")}>Enter</kbd> to send, <kbd className={cn("px-1.5 py-0.5 rounded border", isDark ? "bg-zinc-800 border-zinc-700 text-zinc-400" : "bg-zinc-100 border-zinc-200 text-zinc-500")}>Shift + Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}
