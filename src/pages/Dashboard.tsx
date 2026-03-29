import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Bell, 
  ArrowUpRight, 
  Clock,
  FileText,
  Plus,
  TrendingUp,
  MoreVertical
} from 'lucide-react';
import { Material, Student, ScheduleItem, Announcement, Note } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface DashboardProps {
  materials: Material[];
  students: Student[];
  schedule: ScheduleItem[];
  announcements: Announcement[];
  notes: Note[];
  onAddAnnouncement: (a: Announcement) => void;
  onSelectNote: (n: Note) => void;
  onCreateNote: () => void;
}

export function Dashboard({ 
  materials, 
  students, 
  schedule, 
  announcements, 
  notes,
  onAddAnnouncement,
  onSelectNote,
  onCreateNote
}: DashboardProps) {
  const stats = [
    { label: 'Total Materials', value: materials.length, icon: BookOpen, color: 'bg-blue-500', trend: '+12%' },
    { label: 'Active Students', value: students.filter(s => s.status === 'active').length, icon: Users, color: 'bg-emerald-500', trend: '+5%' },
    { label: 'Classes Today', value: schedule.filter(s => s.day === new Date().getDay() - 1).length, icon: Calendar, color: 'bg-orange-500', trend: 'On track' },
    { label: 'Total Downloads', value: materials.reduce((acc, m) => acc + m.downloadCount, 0), icon: TrendingUp, color: 'bg-purple-500', trend: '+24%' },
  ];

  const [newAnnouncement, setNewAnnouncement] = useState('');

  const handlePostAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    onAddAnnouncement({
      id: Date.now().toString(),
      title: 'New Update',
      content: newAnnouncement,
      type: 'info',
      timestamp: new Date().toISOString()
    });
    setNewAnnouncement('');
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-2xl text-white shadow-lg", stat.color)}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold text-zinc-900 mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Announcements & Notes */}
        <div className="lg:col-span-2 space-y-8">
          {/* Post Announcement */}
          <div className="bg-zinc-950 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Post an Announcement</h3>
              <p className="text-zinc-400 text-sm mb-6">Keep your students and faculty updated with the latest news.</p>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 bg-white/10 border-white/20 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-orange-500 placeholder:text-zinc-500"
                />
                <button 
                  onClick={handlePostAnnouncement}
                  className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
                >
                  Post
                </button>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl"></div>
          </div>

          {/* Recent Notes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-zinc-900">Recent Notes</h3>
              <button 
                onClick={onCreateNote}
                className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <Plus size={16} /> New Note
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.slice(0, 4).map((note) => (
                <div 
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  className="bg-white p-5 rounded-2xl border border-zinc-200 hover:border-orange-500 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-zinc-100 text-zinc-600 rounded-lg group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                      <FileText size={20} />
                    </div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">{new Date(note.lastSaved).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-zinc-900 mb-1">{note.title}</h4>
                  <p className="text-xs text-zinc-500 line-clamp-2" dangerouslySetInnerHTML={{ __html: note.content.replace(/<[^>]*>?/gm, '') }}></p>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="col-span-2 p-12 bg-zinc-50 rounded-2xl border border-dashed border-zinc-300 text-center">
                  <p className="text-zinc-500 text-sm">No notes yet. Start writing your first lecture notes!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Schedule & Announcements */}
        <div className="space-y-8">
          {/* Today's Classes */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-zinc-900">Today's Classes</h3>
              <button className="p-2 hover:bg-zinc-100 rounded-lg transition-all"><MoreVertical size={18} /></button>
            </div>
            <div className="space-y-4">
              {schedule.filter(s => s.day === new Date().getDay() - 1).map(item => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-zinc-50 transition-colors">
                  <div className={cn("w-2 h-12 rounded-full", item.color)}></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-zinc-900">{item.subject}</h4>
                    <p className="text-xs text-zinc-500">{item.startTime} - {item.endTime} • {item.room}</p>
                  </div>
                  <ArrowUpRight size={16} className="text-zinc-300" />
                </div>
              ))}
              {schedule.filter(s => s.day === new Date().getDay() - 1).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-xs text-zinc-400 italic">No classes scheduled for today.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Announcements */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-6">Announcements</h3>
            <div className="space-y-6">
              {announcements.slice(0, 3).map(ann => (
                <div key={ann.id} className="relative pl-6 border-l-2 border-zinc-100">
                  <div className={cn(
                    "absolute -left-[5px] top-0 w-2 h-2 rounded-full",
                    ann.type === 'urgent' ? "bg-rose-500" : ann.type === 'success' ? "bg-emerald-500" : "bg-blue-500"
                  )}></div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-zinc-900">{ann.title}</h4>
                    <span className="text-[10px] text-zinc-400 font-medium">{new Date(ann.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{ann.content}</p>
                </div>
              ))}
              {announcements.length === 0 && (
                <p className="text-xs text-zinc-400 italic text-center">No announcements yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
