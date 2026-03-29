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
import { ScheduleItem } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ScheduleProps {
  schedule: ScheduleItem[];
  onAdd: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
}

export function Schedule({ schedule, onAdd, onDelete }: ScheduleProps) {
  const [isAdding, setIsAdding] = useState(false);
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
    return schedule.filter(item => item.day === dayIndex);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-zinc-100 rounded-lg transition-all"><ChevronLeft size={20} /></button>
          <h3 className="text-lg font-bold text-zinc-900">Weekly Timetable</h3>
          <button className="p-2 hover:bg-zinc-100 rounded-lg transition-all"><ChevronRight size={20} /></button>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition-all font-semibold shadow-lg shadow-orange-600/20"
        >
          <Plus size={20} />
          Add Class
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-6 border-b border-zinc-200">
          <div className="p-4 bg-zinc-50 border-r border-zinc-200"></div>
          {days.map((day, i) => (
            <div key={day} className="p-4 bg-zinc-50 text-center border-r border-zinc-200 last:border-r-0">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{day}</span>
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="grid grid-cols-6">
            <div className="border-r border-zinc-200">
              {timeSlots.map(time => (
                <div key={time} className="h-24 p-2 text-right border-b border-zinc-100 last:border-b-0">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">{time}</span>
                </div>
              ))}
            </div>
            {days.map((_, dayIndex) => (
              <div key={dayIndex} className="relative border-r border-zinc-200 last:border-r-0 h-full">
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
                  <div key={time} className="h-24 border-b border-zinc-100 last:border-b-0"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-zinc-900">Add Class</h3>
                <button type="button" onClick={() => setIsAdding(false)} className="p-2 hover:bg-zinc-100 rounded-full">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Subject</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
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
                      className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g. Lab 302"
                      onChange={e => setNewItem({...newItem, room: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Day</label>
                    <select 
                      className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
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
                      className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
                      onChange={e => setNewItem({...newItem, startTime: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">End Time</label>
                    <input 
                      required
                      type="time" 
                      className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
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
                          newItem.color === c.class ? "border-zinc-900 scale-110" : "border-transparent",
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
                  className="flex-1 py-3.5 rounded-xl font-bold text-zinc-500 hover:bg-zinc-100 transition-all"
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
