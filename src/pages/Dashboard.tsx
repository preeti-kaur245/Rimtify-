import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Bell, 
  ArrowUpRight, 
  Clock,
  MessageSquare,
  FileText,
  Plus,
  TrendingUp,
  MoreVertical,
  CheckCircle2,
  Circle,
  Trash2,
  LayoutDashboard,
  Zap,
  Star
} from 'lucide-react';
import { Material, FacultyMember, ScheduleItem, Announcement, Note, Notification, Task, Theme, FacultyMessage } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface DashboardProps {
  materials: Material[];
  faculty: FacultyMember[];
  schedule: ScheduleItem[];
  announcements: Announcement[];
  notes: Note[];
  notifications: Notification[];
  tasks: Task[];
  facultyMessages: FacultyMessage[];
  onAddAnnouncement: (a: Announcement) => void;
  onSelectNote: (n: Note) => void;
  onCreateNote: () => void;
  onToggleTask: (id: string) => void;
  onAddTask: (t: Task) => void;
  onDeleteTask: (id: string) => void;
  theme: Theme;
}

export function Dashboard({ 
  materials, 
  faculty, 
  schedule, 
  announcements, 
  notes,
  notifications,
  tasks,
  facultyMessages,
  onAddAnnouncement,
  onSelectNote,
  onCreateNote,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  theme
}: DashboardProps) {
  const stats = [
    { label: 'Total Materials', value: materials.length, icon: BookOpen, color: 'bg-blue-500', trend: '+12%' },
    { label: 'Faculty Members', value: faculty.length, icon: Users, color: 'bg-emerald-500', trend: 'Active' },
    { label: 'Classes Today', value: schedule.filter(s => s.day === new Date().getDay() - 1).length, icon: Calendar, color: 'bg-orange-500', trend: 'On track' },
    { label: 'Total Downloads', value: materials.reduce((acc, m) => acc + m.downloadCount, 0), icon: TrendingUp, color: 'bg-purple-500', trend: '+24%' },
  ];

  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [announcementType, setAnnouncementType] = useState<'info' | 'urgent' | 'success'>('info');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handlePostAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    onAddAnnouncement({
      id: Date.now().toString(),
      title: announcementType === 'urgent' ? 'Urgent Update' : announcementType === 'success' ? 'Good News' : 'New Update',
      content: newAnnouncement,
      type: announcementType,
      timestamp: new Date().toISOString()
    });
    setNewAnnouncement('');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      priority: 'medium'
    });
    setNewTaskTitle('');
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  const chartData = [
    { name: 'Mon', count: 4 },
    { name: 'Tue', count: 7 },
    { name: 'Wed', count: 5 },
    { name: 'Thu', count: 8 },
    { name: 'Fri', count: 6 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={cn("text-3xl font-bold tracking-tight", theme === 'dark' ? "text-white" : "text-zinc-900")}>
            Welcome back, Dr. Miller! 👋
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Here's what's happening in your department today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold",
            theme === 'dark' ? "bg-zinc-900 border-zinc-800 text-zinc-400" : "bg-white border-zinc-200 text-zinc-600"
          )}>
            <Clock size={16} className="text-orange-500" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className={cn(
              "p-5 sm:p-6 rounded-3xl border shadow-sm hover:shadow-md transition-all",
              theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
            )}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={cn("p-2.5 sm:p-3 rounded-2xl text-white shadow-lg", stat.color)}>
                <stat.icon size={20} className="sm:w-6 sm:h-6" />
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-1 rounded-full",
                theme === 'dark' ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"
              )}>{stat.trend}</span>
            </div>
            <p className="text-zinc-500 text-xs sm:text-sm font-medium">{stat.label}</p>
            <h3 className={cn("text-2xl sm:text-3xl font-bold mt-1", theme === 'dark' ? "text-white" : "text-zinc-900")}>{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Main Content Area (8 cols) */}
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          
          {/* Post Announcement Bento Box */}
          <div className="bg-zinc-950 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl shadow-zinc-950/20">
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-orange-500/20 rounded-xl">
                  <Zap size={16} className="text-orange-500 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Quick Broadcast</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">Broadcast to Faculty</h3>
              <p className="text-zinc-400 text-xs sm:text-sm lg:text-base mb-6 sm:mb-8 leading-relaxed">Instantly share updates, urgent news, or success stories with your entire department.</p>
              
              <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
                {(['info', 'urgent', 'success'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setAnnouncementType(type)}
                    className={cn(
                      "px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all border",
                      announcementType === type 
                        ? (type === 'urgent' ? "bg-rose-500 border-rose-500 text-white" : type === 'success' ? "bg-emerald-500 border-emerald-500 text-white" : "bg-blue-500 border-blue-500 text-white")
                        : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                  placeholder="What's on your mind?"
                  className="flex-1 bg-white/5 border-white/10 rounded-2xl px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 placeholder:text-zinc-600 transition-all"
                />
                <button 
                  onClick={handlePostAnnouncement}
                  className="bg-orange-600 text-white px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/40 active:scale-95 text-xs sm:text-sm lg:text-base"
                >
                  Post Now
                </button>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/20 rounded-full blur-[100px]"></div>
            <div className="absolute top-10 right-10 opacity-10 hidden sm:block">
              <Bell size={120} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Analytics Chart Bento Box */}
            <div className={cn(
              "rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border shadow-sm",
              theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
            )}>
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div>
                  <h3 className={cn("text-base sm:text-lg font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>Material Engagement</h3>
                  <p className="text-[10px] sm:text-xs text-zinc-500">Weekly upload activity</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <TrendingUp size={16} className="text-blue-500 sm:w-5 sm:h-5" />
                </div>
              </div>
              <div className="h-40 sm:h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#27272a' : '#f4f4f5'} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#71717a' }} 
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        backgroundColor: theme === 'dark' ? '#18181b' : '#fff',
                        color: theme === 'dark' ? '#fff' : '#000'
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={20}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Task Manager Bento Box */}
            <div className={cn(
              "rounded-[2.5rem] p-8 border shadow-sm",
              theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
            )}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={cn("text-lg font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>My Tasks</h3>
                <span className="text-[10px] font-bold bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full">
                  {tasks.filter(t => !t.completed).length} Pending
                </span>
              </div>
              
              <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add a task..."
                  className={cn(
                    "flex-1 text-xs border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500",
                    theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                  )}
                />
                <button type="submit" className="p-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all">
                  <Plus size={18} />
                </button>
              </form>

              <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <button onClick={() => onToggleTask(task.id)} className="text-zinc-400 hover:text-orange-500 transition-colors">
                        {task.completed ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} />}
                      </button>
                      <span className={cn(
                        "text-xs transition-all",
                        task.completed ? "text-zinc-400 line-through" : (theme === 'dark' ? "text-zinc-300" : "text-zinc-700")
                      )}>
                        {task.title}
                      </span>
                    </div>
                    <button onClick={() => onDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-500 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Notes Bento Box */}
          <div className={cn(
            "rounded-[2.5rem] p-8 border shadow-sm",
            theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
          )}>
            <div className="flex items-center justify-between mb-8">
              <h3 className={cn("text-xl font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>Recent Notes</h3>
              <button 
                onClick={onCreateNote}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <Plus size={16} /> New Note
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {notes.slice(0, 4).map((note) => (
                <div 
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  className={cn(
                    "p-5 rounded-2xl border transition-all cursor-pointer group",
                    theme === 'dark' ? "bg-zinc-800/50 border-zinc-700 hover:border-orange-500" : "bg-zinc-50 border-zinc-100 hover:border-orange-500"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-white dark:bg-zinc-800 text-zinc-600 rounded-lg group-hover:text-orange-600 transition-colors shadow-sm">
                      <FileText size={20} />
                    </div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">{new Date(note.lastSaved).toLocaleDateString()}</span>
                  </div>
                  <h4 className={cn("font-bold mb-1", theme === 'dark' ? "text-white" : "text-zinc-900")}>{note.title}</h4>
                  <p className="text-xs text-zinc-500 line-clamp-2" dangerouslySetInnerHTML={{ __html: note.content.replace(/<[^>]*>?/gm, '') }}></p>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="col-span-2 p-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 text-center">
                  <p className="text-zinc-500 text-sm">No notes yet. Start writing your first lecture notes!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Area (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:space-y-8">
          
          {/* Unread Notifications Summary */}
          {unreadNotifications.length > 0 && (
            <div className={cn(
              "rounded-[2.5rem] p-8 border shadow-sm relative overflow-hidden",
              theme === 'dark' ? "bg-orange-950/20 border-orange-900/30" : "bg-orange-50 border-orange-100"
            )}>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-orange-500 rounded-xl text-white">
                  <Bell size={18} />
                </div>
                <h3 className={cn("font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>Alerts</h3>
                <span className="ml-auto text-[10px] font-bold bg-orange-500 text-white px-2 py-1 rounded-full">
                  {unreadNotifications.length}
                </span>
              </div>
              <div className="space-y-3 relative z-10">
                {unreadNotifications.slice(0, 3).map(notif => (
                  <div key={notif.id} className={cn(
                    "p-4 rounded-2xl border shadow-sm",
                    theme === 'dark' ? "bg-zinc-900 border-orange-900/20" : "bg-white border-orange-100"
                  )}>
                    <h4 className={cn("text-xs font-bold mb-1", theme === 'dark' ? "text-white" : "text-zinc-900")}>{notif.title}</h4>
                    <p className="text-[10px] text-zinc-500 line-clamp-1">{notif.content}</p>
                  </div>
                ))}
                {unreadNotifications.length > 3 && (
                  <p className="text-[10px] text-orange-600 font-bold text-center mt-4">
                    + {unreadNotifications.length - 3} more notifications
                  </p>
                )}
              </div>
              <div className="absolute -right-10 -top-10 opacity-5">
                <Bell size={120} className="text-orange-500" />
              </div>
            </div>
          )}

          {/* Recent Chat Bento Box */}
          <div className={cn(
            "rounded-[2.5rem] p-8 border shadow-sm",
            theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
          )}>
            <div className="flex items-center justify-between mb-8">
              <h3 className={cn("font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>Recent Chat</h3>
              <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-xl">
                <MessageSquare size={18} className="text-orange-600" />
              </div>
            </div>
            <div className="space-y-4">
              {facultyMessages.slice(-3).reverse().map(msg => (
                <div key={msg.id} className={cn(
                  "p-4 rounded-2xl border transition-all hover:shadow-md cursor-pointer",
                  theme === 'dark' ? "bg-zinc-800/50 border-zinc-700 hover:border-orange-500" : "bg-zinc-50 border-zinc-100 hover:border-orange-500"
                )}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                      {msg.sender.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={cn("text-xs font-bold truncate", theme === 'dark' ? "text-white" : "text-zinc-900")}>{msg.sender}</h4>
                      <p className="text-[10px] text-zinc-500">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-1">{msg.content}</p>
                </div>
              ))}
              {facultyMessages.length === 0 && (
                <p className="text-xs text-zinc-400 text-center py-4 italic">No recent messages.</p>
              )}
            </div>
          </div>

          {/* Today's Classes Bento Box */}
          <div className={cn(
            "rounded-[2.5rem] p-8 border shadow-sm",
            theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
          )}>
            <div className="flex items-center justify-between mb-8">
              <h3 className={cn("font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>Today's Classes</h3>
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                <Calendar size={18} className="text-zinc-500" />
              </div>
            </div>
            <div className="space-y-4">
              {schedule.filter(s => s.day === new Date().getDay() - 1).map(item => (
                <div key={item.id} className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl transition-colors",
                  theme === 'dark' ? "hover:bg-zinc-800" : "hover:bg-zinc-50"
                )}>
                  <div className={cn("w-2 h-12 rounded-full", item.color)}></div>
                  <div className="flex-1">
                    <h4 className={cn("text-sm font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>{item.subject}</h4>
                    <p className="text-xs text-zinc-500">{item.startTime} - {item.endTime} • {item.room}</p>
                  </div>
                  <ArrowUpRight size={16} className="text-zinc-300" />
                </div>
              ))}
              {schedule.filter(s => s.day === new Date().getDay() - 1).length === 0 && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar size={20} className="text-zinc-400" />
                  </div>
                  <p className="text-xs text-zinc-400 italic">No classes scheduled for today.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Announcements Bento Box */}
          <div className={cn(
            "rounded-[2.5rem] p-8 border shadow-sm",
            theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
          )}>
            <div className="flex items-center justify-between mb-8">
              <h3 className={cn("font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>Announcements</h3>
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                <Bell size={18} className="text-zinc-500" />
              </div>
            </div>
            <div className="space-y-6">
              {announcements.slice(0, 3).map(ann => (
                <div key={ann.id} className="relative pl-6 border-l-2 border-zinc-100 dark:border-zinc-800">
                  <div className={cn(
                    "absolute -left-[5px] top-0 w-2 h-2 rounded-full",
                    ann.type === 'urgent' ? "bg-rose-500" : ann.type === 'success' ? "bg-emerald-500" : "bg-blue-500"
                  )}></div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={cn("text-xs font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>{ann.title}</h4>
                    <span className="text-[10px] text-zinc-400 font-medium">{new Date(ann.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{ann.content}</p>
                </div>
              ))}
              {announcements.length === 0 && (
                <p className="text-xs text-zinc-400 italic text-center py-8">No announcements yet.</p>
              )}
            </div>
          </div>

          {/* Quick Stats Bento Box */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Faculty Insight</span>
              </div>
              <h3 className="text-xl font-bold mb-2">High Engagement</h3>
              <p className="text-white/70 text-xs leading-relaxed mb-6">Your materials have been downloaded 24% more this week than last week.</p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-purple-600 bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-900">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-bold">+12 others</span>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
