import React, { useState } from 'react';
import { 
  Plus, 
  Clock, 
  MapPin, 
  BookOpen, 
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ScheduleItem, Theme } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ScheduleProps {
  schedule: ScheduleItem[];
  onAdd: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
}

export function Schedule({ schedule, onAdd, onDelete, theme }: ScheduleProps & { theme: Theme }) {
  const [isAdding, setIsAdding] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>(window.innerWidth < 1024 ? 'list' : 'grid');
  const [newItem, setNewItem] = useState<Partial<ScheduleItem>>({
    day: 0,
    color: 'bg-orange-500'
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = Array.from({ length: 10 }, (_, i) => `${i + 8}:00`);

  const colors = [
    { name: 'Orange', class: 'bg-orange-500' },
    { name: 'Blue', class: 'bg-blue-500' },
    { name: 'Purple', class: 'bg-purple-500' },
    { name: 'Emerald', class: 'bg-emerald-500' },
    { name: 'Rose', class: 'bg-rose-500' },
    { name: 'Indigo', class: 'bg-indigo-500' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: ScheduleItem = {
      id: Date.now().toString(),
      subject: newItem.subject || 'Untitled Class',
      room: newItem.room || 'TBD',
      day: Number(newItem.day) || 0,
      startTime: newItem.startTime || '08:00',
      endTime: newItem.endTime || '09:00',
      color: newItem.color || 'bg-orange-500',
    };
    onAdd(item);
    setIsAdding(false);
    setNewItem({ day: 0, color: 'bg-orange-500' });
  };

  const getItemsForDay = (dayIndex: number) => {
    return schedule.filter(item => item.day === dayIndex).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className={cn("p-2 rounded-lg transition-all", theme === 'dark' ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-zinc-100 text-zinc-600")}>
              <ChevronLeft size={20} />
            </button>
            <h3 className={cn("text-lg font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>Weekly Timetable</h3>
            <button className={cn("p-2 rounded-lg transition-all", theme === 'dark' ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-zinc-100 text-zinc-600")}>
              <ChevronRight size={20} />
            </button>
          </div>
          <div className={cn("flex p-1 rounded-xl", theme === 'dark' ? "bg-zinc-800" : "bg-zinc-100")}>
            <button 
              onClick={() => setView('grid')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                view === 'grid' 
                  ? (theme === 'dark' ? "bg-zinc-700 text-white shadow-sm" : "bg-white text-zinc-900 shadow-sm")
                  : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              Grid
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                view === 'list' 
                  ? (theme === 'dark' ? "bg-zinc-700 text-white shadow-sm" : "bg-white text-zinc-900 shadow-sm")
                  : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              List
            </button>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition-all font-semibold shadow-lg shadow-orange-600/20"
        >
          <Plus size={20} />
          Add Class
        </button>
      </div>

      {view === 'grid' ? (
        <div className={cn(
          "rounded-3xl border overflow-hidden shadow-sm overflow-x-auto",
          theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
        )}>
          <div className="min-w-[800px]">
            <div className={cn("grid grid-cols-6 border-b", theme === 'dark' ? "border-zinc-800" : "border-zinc-200")}>
              <div className={cn("p-4 border-r", theme === 'dark' ? "bg-zinc-800/50 border-zinc-800" : "bg-zinc-50 border-zinc-200")}></div>
              {days.map((day, i) => (
                <div key={day} className={cn("p-4 text-center border-r last:border-r-0", theme === 'dark' ? "bg-zinc-800/50 border-zinc-800" : "bg-zinc-50 border-zinc-200")}>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{day}</span>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="grid grid-cols-6">
                <div className={cn("border-r", theme === 'dark' ? "border-zinc-800" : "border-zinc-200")}>
                  {timeSlots.map(time => (
                    <div key={time} className={cn("h-24 p-2 text-right border-b last:border-b-0", theme === 'dark' ? "border-zinc-800/50" : "border-zinc-100")}>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">{time}</span>
                    </div>
                  ))}
                </div>
                {days.map((_, dayIndex) => (
                  <div key={dayIndex} className={cn("relative border-r last:border-r-0 h-full", theme === 'dark' ? "border-zinc-800" : "border-zinc-200")}>
                    {getItemsForDay(dayIndex).map(item => {
                      const startHour = parseInt(item.startTime.split(':')[0]);
                      const startMin = parseInt(item.startTime.split(':')[1]);
                      const endHour = parseInt(item.endTime.split(':')[0]);
                      const endMin = parseInt(item.endTime.split(':')[1]);
                      
                      const top = ((startHour - 8) * 96) + (startMin / 60 * 96);
                      const height = ((endHour - startHour) * 96) + ((endMin - startMin) / 60 * 96);

                      return (
                        <div 
                          key={item.id}
                          className={cn(
                            "absolute left-1 right-1 rounded-xl p-3 text-white shadow-md overflow-hidden group cursor-pointer transition-all hover:scale-[1.02] z-10",
                            item.color
                          )}
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-xs font-bold leading-tight line-clamp-2">{item.subject}</p>
                            <button 
                              onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded transition-all"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] opacity-80 font-medium">
                            <MapPin size={10} />
                            {item.room}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] opacity-80 font-medium mt-0.5">
                            <Clock size={10} />
                            {item.startTime} - {item.endTime}
                          </div>
                        </div>
                      );
                    })}
                    {timeSlots.map(time => (
                      <div key={time} className={cn("h-24 border-b last:border-b-0", theme === 'dark' ? "border-zinc-800/50" : "border-zinc-100")}></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {days.map((day, dayIndex) => {
            const items = getItemsForDay(dayIndex);
            if (items.length === 0) return null;
            return (
              <div key={day} className="space-y-3">
                <h4 className={cn("text-xs font-bold uppercase tracking-widest px-2", theme === 'dark' ? "text-zinc-500" : "text-zinc-400")}>{day}</h4>
                <div className="grid grid-cols-1 gap-3">
                  {items.map(item => (
                    <div 
                      key={item.id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border transition-all",
                        theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
                      )}
                    >
                      <div className={cn("w-1.5 h-12 rounded-full", item.color)}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className={cn("font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>{item.subject}</h5>
                          <button 
                            onClick={() => onDelete(item.id)}
                            className={cn("p-2 rounded-lg transition-all", theme === 'dark' ? "hover:bg-zinc-800 text-zinc-500 hover:text-red-400" : "hover:bg-zinc-100 text-zinc-400 hover:text-red-500")}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <Clock size={14} className="text-orange-500" />
                            {item.startTime} - {item.endTime}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <MapPin size={14} className="text-blue-500" />
                            {item.room}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={cn("rounded-3xl w-full max-w-md overflow-hidden shadow-2xl", theme === 'dark' ? "bg-zinc-900" : "bg-white")}>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={cn("text-2xl font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>Add Class</h3>
                <button type="button" onClick={() => setIsAdding(false)} className={cn("p-2 rounded-full", theme === 'dark' ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-zinc-100 text-zinc-500")}>
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Subject</label>
                  <input 
                    required
                    type="text" 
                    className={cn(
                      "w-full rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 border transition-all",
                      theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                    )}
                    placeholder="e.g. Data Structures"
                    onChange={e => setNewItem({...newItem, subject: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Room</label>
                    <input 
                      required
                      type="text" 
                      className={cn(
                        "w-full rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 border transition-all",
                        theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                      )}
                      placeholder="e.g. Lab 302"
                      onChange={e => setNewItem({...newItem, room: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Day</label>
                    <select 
                      className={cn(
                        "w-full rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 border transition-all",
                        theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                      )}
                      onChange={e => setNewItem({...newItem, day: Number(e.target.value)})}
                    >
                      {days.map((day, i) => (
                        <option key={day} value={i}>{day}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Start Time</label>
                    <input 
                      required
                      type="time" 
                      className={cn(
                        "w-full rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 border transition-all",
                        theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                      )}
                      onChange={e => setNewItem({...newItem, startTime: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">End Time</label>
                    <input 
                      required
                      type="time" 
                      className={cn(
                        "w-full rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 border transition-all",
                        theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                      )}
                      onChange={e => setNewItem({...newItem, endTime: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Color Theme</label>
                  <div className="flex gap-2">
                    {colors.map(c => (
                      <button
                        key={c.class}
                        type="button"
                        onClick={() => setNewItem({...newItem, color: c.class})}
                        className={cn(
                          "w-8 h-8 rounded-full transition-all border-2",
                          newItem.color === c.class ? (theme === 'dark' ? "border-white scale-110" : "border-zinc-900 scale-110") : "border-transparent",
                          c.class
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className={cn("flex-1 py-3.5 rounded-xl font-bold transition-all", theme === 'dark' ? "text-zinc-400 hover:bg-zinc-800" : "text-zinc-500 hover:bg-zinc-100")}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3.5 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
                >
                  Add to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
