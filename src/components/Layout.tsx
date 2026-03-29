import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Calendar, 
  MessageSquare, 
  User, 
  LogOut,
  Bell,
  Search,
  Plus,
  Menu,
  X,
  Check,
  Trash2,
  ExternalLink,
  Microscope,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Notification, Theme } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
}

export function Sidebar({ activeTab, setActiveTab, onLogout, isOpen, onClose, theme }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'materials', label: 'Materials', icon: BookOpen },
    { id: 'faculty', label: 'Faculty', icon: Users },
    { id: 'research', label: 'Research', icon: Microscope },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'chat', label: 'Faculty Chat', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "fixed inset-y-0 left-0 w-72 flex flex-col border-r transition-transform duration-300 z-[70] lg:relative lg:translate-x-0 lg:w-64 shadow-2xl lg:shadow-none",
        theme === 'dark' ? "bg-zinc-950 border-zinc-800 text-zinc-400" : "bg-white border-zinc-200 text-zinc-600",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-400 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-600/20 group-hover:scale-110 transition-transform">R</div>
            <div>
              <h1 className={cn("text-xl font-black tracking-tighter leading-none", theme === 'dark' ? "text-white" : "text-zinc-900")}>rimtify</h1>
              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Faculty Portal</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl lg:hidden text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group text-left relative overflow-hidden",
                activeTab === item.id 
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" 
                  : theme === 'dark' ? "hover:bg-zinc-900 hover:text-zinc-200" : "hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              {activeTab === item.id && (
                <motion.div 
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 -z-10"
                />
              )}
              <item.icon size={20} className={cn(
                "transition-all duration-300",
                activeTab === item.id ? "text-white scale-110" : "text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 group-hover:scale-110"
              )} />
              <span className={cn(
                "font-bold text-sm tracking-tight",
                activeTab === item.id ? "text-white" : "text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300"
              )}>{item.label}</span>
              
              {activeTab === item.id && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-glow"
                />
              )}
            </button>
          ))}
        </nav>

        <div className={cn("p-6 border-t", theme === 'dark' ? "border-zinc-800" : "border-zinc-100")}>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-300 text-zinc-500 font-bold text-sm group"
          >
            <div className="p-2 rounded-lg group-hover:bg-rose-500/20 transition-colors">
              <LogOut size={20} />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

interface HeaderProps {
  title: string;
  user: { name: string; department: string };
  onMenuClick: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onNotificationClick: (link?: string) => void;
  theme: Theme;
  onThemeToggle: () => void;
}

export function Header({ 
  title, 
  user, 
  onMenuClick, 
  notifications, 
  onMarkAsRead, 
  onClearAll,
  onNotificationClick,
  theme,
  onThemeToggle
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className={cn(
      "h-16 lg:h-20 border-b flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 transition-colors",
      theme === 'dark' ? "bg-zinc-950/80 border-zinc-800" : "bg-white/80 border-zinc-200",
      "backdrop-blur-md"
    )}>
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl lg:hidden text-zinc-600 dark:text-zinc-400"
        >
          <Menu size={20} />
        </button>
        <h2 className={cn("text-lg lg:text-2xl font-bold capitalize truncate max-w-[150px] sm:max-w-none", theme === 'dark' ? "text-white" : "text-zinc-900")}>{title}</h2>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-6">
        <button 
          onClick={onThemeToggle}
          className={cn(
            "p-2 rounded-xl transition-all",
            theme === 'dark' ? "text-yellow-400 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-100"
          )}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input 
            type="text" 
            placeholder="Search everything..." 
            className={cn(
              "pl-10 pr-4 py-2 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500 w-48 lg:w-64 transition-all",
              theme === 'dark' ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-900"
            )}
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl relative transition-all",
              showNotifications && "bg-zinc-100 dark:bg-zinc-800 text-orange-600"
            )}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border-2 border-white dark:border-zinc-950"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={cn(
                    "absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 rounded-3xl border shadow-2xl z-50 overflow-hidden",
                    theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
                  )}
                >
                  <div className={cn("p-4 border-b flex items-center justify-between", theme === 'dark' ? "bg-zinc-900/50 border-zinc-800" : "bg-zinc-50/50 border-zinc-100")}>
                    <h3 className={cn("font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>Notifications</h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={onClearAll}
                        className="text-[10px] font-bold text-zinc-400 uppercase hover:text-zinc-600 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-400">
                          <Bell size={20} />
                        </div>
                        <p className="text-sm text-zinc-500">No notifications yet</p>
                      </div>
                    ) : (
                      <div className={cn("divide-y", theme === 'dark' ? "divide-zinc-800" : "divide-zinc-100")}>
                        {notifications.map((n) => (
                          <div 
                            key={n.id} 
                            className={cn(
                              "p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer relative group",
                              !n.read && (theme === 'dark' ? "bg-orange-950/20" : "bg-orange-50/30")
                            )}
                            onClick={() => {
                              onMarkAsRead(n.id);
                              if (n.link) {
                                onNotificationClick(n.link);
                                setShowNotifications(false);
                              }
                            }}
                          >
                            <div className="flex gap-3">
                              <div className={cn(
                                "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                                n.type === 'announcement' ? "bg-blue-500" : 
                                n.type === 'deadline' ? "bg-orange-500" : "bg-zinc-400"
                              )} />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-0.5">
                                  <h4 className={cn(
                                    "text-sm font-bold",
                                    n.read ? "text-zinc-500" : (theme === 'dark' ? "text-white" : "text-zinc-900")
                                  )}>{n.title}</h4>
                                  <span className="text-[10px] text-zinc-400 font-medium">
                                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{n.content}</p>
                                {n.link && (
                                  <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                                    View Details <ExternalLink size={10} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        
        <div className={cn("flex items-center gap-2 pl-2 lg:pl-6 border-l", theme === 'dark' ? "border-zinc-800" : "border-zinc-200")}>
          <div className="text-right hidden sm:block">
            <p className={cn("text-sm font-semibold truncate max-w-[80px] lg:max-w-[120px]", theme === 'dark' ? "text-white" : "text-zinc-900")}>{user.name}</p>
            <p className="text-[10px] text-zinc-500 uppercase font-bold">{user.department}</p>
          </div>
          <div className={cn("w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden border", theme === 'dark' ? "border-zinc-700" : "border-zinc-300")}>
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
              alt="Avatar" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
