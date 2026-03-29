import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Mail, 
  MoreVertical, 
  UserPlus,
  Building,
  Briefcase,
  Circle
} from 'lucide-react';
import { FacultyMember, Theme } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface FacultyProps {
  faculty: FacultyMember[];
  onAdd: (f: FacultyMember) => void;
  onUpdate: (f: FacultyMember) => void;
  theme: Theme;
}

export function Faculty({ faculty, onAdd, onUpdate, theme }: FacultyProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [viewingFaculty, setViewingFaculty] = useState<FacultyMember | null>(null);
  const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(null);
  const [newFaculty, setNewFaculty] = useState<Partial<FacultyMember>>({
    status: 'online',
    department: 'Computer Science',
    researchInterests: []
  });

  const filteredFaculty = faculty.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaculty) {
      onUpdate(editingFaculty);
      setEditingFaculty(null);
    } else {
      const f: FacultyMember = {
        id: Date.now().toString(),
        name: newFaculty.name || 'Unknown',
        designation: newFaculty.designation || 'Lecturer',
        department: newFaculty.department || 'General',
        email: newFaculty.email || '',
        status: newFaculty.status as any || 'online',
        bio: newFaculty.bio || '',
        researchInterests: newFaculty.researchInterests || [],
      };
      onAdd(f);
      setIsAdding(false);
      setNewFaculty({ status: 'online', department: 'Computer Science', researchInterests: [] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search faculty by name, department..."
            className={cn(
              "w-full pl-12 pr-4 py-3 rounded-2xl border transition-all focus:ring-2 focus:ring-orange-500",
              theme === 'dark' ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"
            )}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-2xl hover:bg-orange-700 transition-all font-bold shadow-lg shadow-orange-600/20"
        >
          <UserPlus size={20} />
          Add Faculty
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredFaculty.map((f) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={f.id}
              className={cn(
                "rounded-3xl border p-6 hover:shadow-xl transition-all group relative overflow-hidden",
                theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
              )}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-2xl">
                    {f.name.charAt(0)}
                  </div>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2",
                    theme === 'dark' ? "border-zinc-900" : "border-white",
                    f.status === 'online' ? "bg-emerald-500" : f.status === 'busy' ? "bg-rose-500" : "bg-zinc-400"
                  )}></div>
                </div>
                <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                  <MoreVertical size={18} className="text-zinc-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className={cn("text-lg font-bold mb-1", theme === 'dark' ? "text-white" : "text-zinc-900")}>{f.name}</h3>
                  <p className="text-sm text-zinc-500 flex items-center gap-1.5">
                    <Briefcase size={14} /> {f.designation}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Building size={14} />
                    <span>{f.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Mail size={14} />
                    <span>{f.email}</span>
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <button 
                    onClick={() => setViewingFaculty(f)}
                    className="flex-1 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/30 transition-all"
                  >
                    View Profile
                  </button>
                  <button 
                    onClick={() => setEditingFaculty(f)}
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/30 transition-all"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* View Profile Modal */}
      <AnimatePresence>
        {viewingFaculty && (
          <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={cn(
                "rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl",
                theme === 'dark' ? "bg-zinc-900" : "bg-white"
              )}
            >
              <div className="p-8 space-y-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-3xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-4xl">
                      {viewingFaculty.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className={cn("text-3xl font-bold mb-1", theme === 'dark' ? "text-white" : "text-zinc-900")}>
                        {viewingFaculty.name}
                      </h3>
                      <p className="text-zinc-500 font-medium">{viewingFaculty.designation}</p>
                    </div>
                  </div>
                  <button onClick={() => setViewingFaculty(null)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                    <Plus size={24} className="rotate-45" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-4 lg:space-y-6">
                    <div>
                      <h4 className="text-[10px] lg:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 lg:mb-3">About</h4>
                      <p className={cn("text-xs lg:text-sm leading-relaxed", theme === 'dark' ? "text-zinc-300" : "text-zinc-600")}>
                        {viewingFaculty.bio || "No biography provided."}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] lg:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 lg:mb-3">Contact</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-xs lg:text-sm text-zinc-500">
                          <Mail size={14} /> {viewingFaculty.email}
                        </div>
                        <div className="flex items-center gap-3 text-xs lg:text-sm text-zinc-500">
                          <Building size={14} /> {viewingFaculty.department}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 lg:space-y-6">
                    <div>
                      <h4 className="text-[10px] lg:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 lg:mb-3">Research Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {viewingFaculty.researchInterests?.length ? viewingFaculty.researchInterests.map(interest => (
                          <span key={interest} className="px-2.5 py-1 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-[10px] lg:text-xs font-bold rounded-lg border border-orange-100 dark:border-orange-900/50">
                            {interest}
                          </span>
                        )) : <span className="text-xs text-zinc-400 italic">No interests listed.</span>}
                      </div>
                    </div>
                    <div className="p-4 lg:p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                      <h4 className="text-xs lg:text-sm font-bold mb-3 lg:mb-4">Availability</h4>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full",
                          viewingFaculty.status === 'online' ? "bg-emerald-500" : viewingFaculty.status === 'busy' ? "bg-rose-500" : "bg-zinc-400"
                        )}></div>
                        <span className="text-xs lg:text-sm font-medium capitalize">{viewingFaculty.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => setViewingFaculty(null)}
                    className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all"
                  >
                    Close Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Faculty Modal */}
      {(isAdding || editingFaculty) && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl",
              theme === 'dark' ? "bg-zinc-900" : "bg-white"
            )}
          >
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={cn("text-2xl font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>
                  {editingFaculty ? "Edit Faculty Member" : "Add Faculty Member"}
                </h3>
                <button 
                  type="button" 
                  onClick={() => { setIsAdding(false); setEditingFaculty(null); }} 
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Full Name</label>
                  <input 
                    required
                    type="text" 
                    className={cn(
                      "w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500",
                      theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                    )}
                    placeholder="e.g. Dr. Robert Miller"
                    value={editingFaculty ? editingFaculty.name : newFaculty.name || ''}
                    onChange={e => editingFaculty ? setEditingFaculty({...editingFaculty, name: e.target.value}) : setNewFaculty({...newFaculty, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Designation</label>
                  <input 
                    required
                    type="text" 
                    className={cn(
                      "w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500",
                      theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                    )}
                    placeholder="e.g. Associate Professor"
                    value={editingFaculty ? editingFaculty.designation : newFaculty.designation || ''}
                    onChange={e => editingFaculty ? setEditingFaculty({...editingFaculty, designation: e.target.value}) : setNewFaculty({...newFaculty, designation: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Department</label>
                  <select 
                    className={cn(
                      "w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500",
                      theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                    )}
                    value={editingFaculty ? editingFaculty.department : newFaculty.department || ''}
                    onChange={e => editingFaculty ? setEditingFaculty({...editingFaculty, department: e.target.value}) : setNewFaculty({...newFaculty, department: e.target.value})}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Email Address</label>
                  <input 
                    required
                    type="email" 
                    className={cn(
                      "w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500",
                      theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                    )}
                    placeholder="robert@university.edu"
                    value={editingFaculty ? editingFaculty.email : newFaculty.email || ''}
                    onChange={e => editingFaculty ? setEditingFaculty({...editingFaculty, email: e.target.value}) : setNewFaculty({...newFaculty, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Biography</label>
                  <textarea 
                    className={cn(
                      "w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 h-24 resize-none",
                      theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                    )}
                    placeholder="Brief bio..."
                    value={editingFaculty ? editingFaculty.bio : newFaculty.bio || ''}
                    onChange={e => editingFaculty ? setEditingFaculty({...editingFaculty, bio: e.target.value}) : setNewFaculty({...newFaculty, bio: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Research Interests (comma separated)</label>
                  <input 
                    type="text" 
                    className={cn(
                      "w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500",
                      theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                    )}
                    placeholder="e.g. AI, Machine Learning, Data Science"
                    value={editingFaculty ? editingFaculty.researchInterests?.join(', ') : newFaculty.researchInterests?.join(', ') || ''}
                    onChange={e => {
                      const interests = e.target.value.split(',').map(i => i.trim()).filter(i => i !== '');
                      editingFaculty ? setEditingFaculty({...editingFaculty, researchInterests: interests}) : setNewFaculty({...newFaculty, researchInterests: interests});
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => { setIsAdding(false); setEditingFaculty(null); }}
                  className="flex-1 py-3.5 rounded-xl font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3.5 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
                >
                  {editingFaculty ? "Save Changes" : "Add Member"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
