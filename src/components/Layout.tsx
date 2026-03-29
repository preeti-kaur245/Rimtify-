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
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'materials', label: 'Materials', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'chat', label: 'Faculty Chat', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="w-64 h-screen bg-zinc-950 text-zinc-400 flex flex-col border-r border-zinc-800">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
        <h1 className="text-xl font-bold text-white tracking-tight">rimtify</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-orange-600/10 text-orange-500" 
                : "hover:bg-zinc-900 hover:text-zinc-200"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-colors",
              activeTab === item.id ? "text-orange-500" : "text-zinc-500 group-hover:text-zinc-300"
            )} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 text-zinc-500"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

interface HeaderProps {
  title: string;
  user: { name: string; department: string };
}

export function Header({ title, user }: HeaderProps) {
  return (
    <header className="h-20 border-b border-zinc-200 bg-white flex items-center justify-between px-8">
      <h2 className="text-2xl font-bold text-zinc-900 capitalize">{title}</h2>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search everything..." 
            className="pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-full text-sm focus:ring-2 focus:ring-orange-500 w-64 transition-all"
          />
        </div>
        
        <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-zinc-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-zinc-900">{user.name}</p>
            <p className="text-xs text-zinc-500">{user.department}</p>
          </div>
          <div className="w-10 h-10 bg-zinc-200 rounded-full overflow-hidden border border-zinc-300">
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
