import React, { useState } from 'react';
import { 
  Plus, 
  FileText, 
  Download, 
  Trash2, 
  Filter, 
  MoreVertical,
  Eye,
  EyeOff,
  Tag,
  Upload
} from 'lucide-react';
import { Material, MaterialCategory, AccessLevel } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface MaterialsProps {
  materials: Material[];
  onAdd: (material: Material) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}

export function Materials({ materials, onAdd, onDelete, onDownload }: MaterialsProps) {
  const [filter, setFilter] = useState<MaterialCategory | 'All'>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({
    category: 'Notes',
    accessLevel: 'public',
    tags: []
  });

  const filteredMaterials = filter === 'All' 
    ? materials 
    : materials.filter(m => m.category === filter);

  const categories: (MaterialCategory | 'All')[] = ['All', 'Notes', 'Assignments', 'Slides', 'Reference'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const material: Material = {
      id: Date.now().toString(),
      title: newMaterial.title || 'Untitled',
      subject: newMaterial.subject || 'General',
      category: newMaterial.category as MaterialCategory,
      semester: newMaterial.semester || '1',
      accessLevel: newMaterial.accessLevel as AccessLevel,
      description: newMaterial.description || '',
      tags: newMaterial.tags || [],
      fileName: 'document.pdf',
      fileSize: '2.4 MB',
      uploadDate: new Date().toISOString(),
      downloadCount: 0,
    };
    onAdd(material);
    setIsAdding(false);
    setNewMaterial({ category: 'Notes', accessLevel: 'public', tags: [] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 p-1 bg-zinc-100 rounded-xl">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                filter === cat ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition-all font-semibold shadow-lg shadow-orange-600/20"
        >
          <Plus size={20} />
          Upload Material
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMaterials.map((m) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={m.id}
              className="bg-white rounded-2xl border border-zinc-200 p-5 hover:shadow-xl transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "p-3 rounded-xl",
                  m.category === 'Notes' ? "bg-blue-50 text-blue-600" :
                  m.category === 'Assignments' ? "bg-purple-50 text-purple-600" :
                  m.category === 'Slides' ? "bg-orange-50 text-orange-600" : "bg-zinc-50 text-zinc-600"
                )}>
                  <FileText size={24} />
                </div>
                <div className="flex items-center gap-2">
                  {m.accessLevel === 'private' ? <EyeOff size={16} className="text-zinc-400" /> : <Eye size={16} className="text-zinc-400" />}
                  <button onClick={() => onDelete(m.id)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-zinc-900 mb-1 line-clamp-1">{m.title}</h3>
              <p className="text-sm text-zinc-500 mb-4">{m.subject} • Sem {m.semester}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {m.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Size</span>
                    <span className="text-xs font-semibold text-zinc-700">{m.fileSize}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Downloads</span>
                    <span className="text-xs font-semibold text-zinc-700">{m.downloadCount}</span>
                  </div>
                </div>
                <button 
                  onClick={() => onDownload(m.id)}
                  className="p-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all"
                >
                  <Download size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-zinc-900">Upload New Material</h3>
                <button type="button" onClick={() => setIsAdding(false)} className="p-2 hover:bg-zinc-100 rounded-full">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Title</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. Advanced Calculus Notes"
                    onChange={e => setNewMaterial({...newMaterial, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Subject</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. Mathematics"
                    onChange={e => setNewMaterial({...newMaterial, subject: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Category</label>
                  <select 
                    className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
                    onChange={e => setNewMaterial({...newMaterial, category: e.target.value as MaterialCategory})}
                  >
                    <option value="Notes">Notes</option>
                    <option value="Assignments">Assignments</option>
                    <option value="Slides">Slides</option>
                    <option value="Reference">Reference</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Semester</label>
                  <input 
                    type="number" 
                    min="1" max="8"
                    className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
                    onChange={e => setNewMaterial({...newMaterial, semester: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Access Level</label>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setNewMaterial({...newMaterial, accessLevel: 'public'})}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all",
                      newMaterial.accessLevel === 'public' ? "border-orange-600 bg-orange-50 text-orange-600" : "border-zinc-100 text-zinc-400"
                    )}
                  >
                    <Eye size={18} /> Public
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewMaterial({...newMaterial, accessLevel: 'private'})}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all",
                      newMaterial.accessLevel === 'private' ? "border-orange-600 bg-orange-50 text-orange-600" : "border-zinc-100 text-zinc-400"
                    )}
                  >
                    <EyeOff size={18} /> Private
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Description</label>
                <textarea 
                  className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                  placeholder="Briefly describe the content..."
                  onChange={e => setNewMaterial({...newMaterial, description: e.target.value})}
                ></textarea>
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
                  Upload Now
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
