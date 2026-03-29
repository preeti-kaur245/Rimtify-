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
  Upload,
  Clock
} from 'lucide-react';
import { Material, MaterialCategory, AccessLevel, Theme } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface MaterialsProps {
  materials: Material[];
  onAdd: (material: Material) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
  theme: Theme;
}

export function Materials({ materials, onAdd, onDelete, onDownload, theme }: MaterialsProps) {
  const [filter, setFilter] = useState<MaterialCategory | 'All'>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({
    category: 'Notes',
    accessLevel: 'public',
    tags: []
  });

  const filteredMaterials = filter === 'All' 
    ? materials 
    : materials.filter(m => m.category === filter);

  const categories: (MaterialCategory | 'All')[] = ['All', 'Notes', 'Assignments', 'Slides', 'Reference'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !newMaterial.title) return;

    setIsUploading(true);
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const material: Material = {
      id: Date.now().toString(),
      title: newMaterial.title || selectedFile?.name.split('.')[0] || 'Untitled',
      subject: newMaterial.subject || 'General',
      category: newMaterial.category as MaterialCategory,
      semester: newMaterial.semester || '1',
      accessLevel: newMaterial.accessLevel as AccessLevel,
      description: newMaterial.description || '',
      tags: newMaterial.tags || [],
      fileName: selectedFile?.name || 'document.pdf',
      fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '2.4 MB',
      uploadDate: new Date().toISOString(),
      downloadCount: 0,
      dueDate: newMaterial.dueDate,
    };
    onAdd(material);
    setIsUploading(false);
    setUploadProgress(0);
    setIsAdding(false);
    setSelectedFile(null);
    setNewMaterial({ category: 'Notes', accessLevel: 'public', tags: [] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-1 lg:gap-2 p-1 bg-zinc-100 rounded-xl overflow-x-auto max-w-full no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all whitespace-nowrap",
                filter === cat ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition-all font-semibold shadow-lg shadow-orange-600/20"
        >
          <Plus size={20} />
          Upload Material
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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
              <p className="text-sm text-zinc-500 mb-2">{m.subject} • Sem {m.semester}</p>
              
              {m.dueDate && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md w-fit mb-4">
                  <Clock size={12} />
                  DUE: {new Date(m.dueDate).toLocaleDateString()}
                </div>
              )}

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
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
              "rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto",
              theme === 'dark' ? "bg-zinc-900" : "bg-white"
            )}
          >
            <form onSubmit={handleSubmit} className="p-5 lg:p-8 space-y-4 lg:space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={cn("text-xl lg:text-2xl font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>Upload New Material</h3>
                <button type="button" onClick={() => setIsAdding(false)} className={cn("p-2 rounded-full", theme === 'dark' ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-zinc-100 text-zinc-500")}>
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">File</label>
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-4 lg:p-8 transition-all flex flex-col items-center justify-center gap-2 lg:gap-3 cursor-pointer",
                    selectedFile 
                      ? (theme === 'dark' ? "border-orange-600 bg-orange-900/10" : "border-orange-600 bg-orange-50") 
                      : (theme === 'dark' ? "border-zinc-800 hover:border-orange-400 hover:bg-zinc-800/50" : "border-zinc-200 hover:border-orange-400 hover:bg-zinc-50")
                  )}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload size={24} className={selectedFile ? "text-orange-600" : "text-zinc-400"} />
                  <div className="text-center">
                    <p className={cn("text-xs lg:text-sm font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>
                      {selectedFile ? selectedFile.name : "Click to select or drag and drop"}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : "PDF, PPT, DOC, MP4, ZIP, Images"}
                    </p>
                  </div>
                  <input 
                    id="file-upload"
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-1 lg:space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Title</label>
                  <input 
                    required
                    type="text" 
                    className={cn(
                      "w-full rounded-xl px-4 py-2.5 lg:py-3 text-sm focus:ring-2 focus:ring-orange-500 border transition-all",
                      theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                    )}
                    placeholder="e.g. Advanced Calculus Notes"
                    onChange={e => setNewMaterial({...newMaterial, title: e.target.value})}
                  />
                </div>
                <div className="space-y-1 lg:space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Subject</label>
                  <input 
                    required
                    type="text" 
                    className={cn(
                      "w-full rounded-xl px-4 py-2.5 lg:py-3 text-sm focus:ring-2 focus:ring-orange-500 border transition-all",
                      theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                    )}
                    placeholder="e.g. Mathematics"
                    onChange={e => setNewMaterial({...newMaterial, subject: e.target.value})}
                  />
                </div>
                <div className="space-y-1 lg:space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Category</label>
                  <select 
                    className={cn(
                      "w-full rounded-xl px-4 py-2.5 lg:py-3 text-sm focus:ring-2 focus:ring-orange-500 border transition-all",
                      theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                    )}
                    onChange={e => setNewMaterial({...newMaterial, category: e.target.value as MaterialCategory})}
                  >
                    <option value="Notes">Notes</option>
                    <option value="Assignments">Assignments</option>
                    <option value="Slides">Slides</option>
                    <option value="Reference">Reference</option>
                  </select>
                </div>
                <div className="space-y-1 lg:space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Semester</label>
                  <input 
                    type="number" 
                    min="1" max="8"
                    className={cn(
                      "w-full rounded-xl px-4 py-2.5 lg:py-3 text-sm focus:ring-2 focus:ring-orange-500 border transition-all",
                      theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                    )}
                    onChange={e => setNewMaterial({...newMaterial, semester: e.target.value})}
                  />
                </div>
                {newMaterial.category === 'Assignments' && (
                  <div className="space-y-1 lg:space-y-2 sm:col-span-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Due Date</label>
                    <input 
                      required
                      type="date" 
                      className={cn(
                        "w-full rounded-xl px-4 py-2.5 lg:py-3 text-sm focus:ring-2 focus:ring-orange-500 border transition-all",
                        theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                      )}
                      onChange={e => setNewMaterial({...newMaterial, dueDate: e.target.value})}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Access Level</label>
                <div className="flex gap-3 lg:gap-4">
                  <button 
                    type="button"
                    onClick={() => setNewMaterial({...newMaterial, accessLevel: 'public'})}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 lg:py-3 rounded-xl border-2 transition-all text-xs lg:text-sm font-semibold",
                      newMaterial.accessLevel === 'public' ? "border-orange-600 bg-orange-600/10 text-orange-600" : (theme === 'dark' ? "border-zinc-800 text-zinc-500" : "border-zinc-100 text-zinc-400")
                    )}
                  >
                    <Eye size={16} /> Public
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewMaterial({...newMaterial, accessLevel: 'private'})}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 lg:py-3 rounded-xl border-2 transition-all text-xs lg:text-sm font-semibold",
                      newMaterial.accessLevel === 'private' ? "border-orange-600 bg-orange-600/10 text-orange-600" : (theme === 'dark' ? "border-zinc-800 text-zinc-500" : "border-zinc-100 text-zinc-400")
                    )}
                  >
                    <EyeOff size={16} /> Private
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Description</label>
                <textarea 
                  className={cn(
                    "w-full rounded-xl px-4 py-2.5 lg:py-3 text-sm focus:ring-2 focus:ring-orange-500 border transition-all h-20 lg:h-24 resize-none",
                    theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                  )}
                  placeholder="Briefly describe the content..."
                  onChange={e => setNewMaterial({...newMaterial, description: e.target.value})}
                ></textarea>
              </div>

              <div className="flex gap-3 lg:gap-4 pt-2 lg:pt-4">
                <button 
                  type="button" 
                  disabled={isUploading}
                  onClick={() => setIsAdding(false)}
                  className={cn("flex-1 py-3 lg:py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 text-sm", theme === 'dark' ? "text-zinc-400 hover:bg-zinc-800" : "text-zinc-500 hover:bg-zinc-100")}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUploading || (!selectedFile && !newMaterial.title)}
                  className="flex-1 py-3 lg:py-3.5 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 disabled:opacity-50 relative overflow-hidden text-sm"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px]">Uploading {uploadProgress}%</span>
                      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-white"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    "Upload Now"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
