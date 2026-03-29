import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Building2, 
  GraduationCap, 
  Key, 
  ShieldCheck,
  Save,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';

interface ProfileProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

export function Profile({ profile, onUpdate }: ProfileProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="h-32 bg-gradient-to-r from-orange-600 to-orange-400"></div>
        <div className="px-4 sm:px-8 pb-6 sm:pb-8">
          <div className="relative -mt-10 sm:-mt-12 mb-4 sm:mb-6 flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-6 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-32 sm:h-32 bg-white rounded-3xl p-1 shadow-xl">
              <div className="w-full h-full bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="pb-1 sm:pb-2">
              <h2 className="text-xl sm:text-3xl font-bold text-zinc-900">{profile.name}</h2>
              <p className="text-xs sm:text-base text-zinc-500 font-medium">{profile.department} • {profile.university}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest">Personal Information</h3>
                
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <User size={12} /> Full Name
                  </label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <Mail size={12} /> Email Address
                  </label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest">Academic Details</h3>
                
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <Building2 size={12} /> Department
                  </label>
                  <input 
                    type="text" 
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                    className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <GraduationCap size={12} /> University
                  </label>
                  <input 
                    type="text" 
                    value={formData.university}
                    onChange={e => setFormData({...formData, university: e.target.value})}
                    className="w-full bg-zinc-50 border-zinc-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 sm:pt-8 border-t border-zinc-100">
              <div className="bg-zinc-50 rounded-3xl p-5 sm:p-8 border border-zinc-200">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-900 text-white rounded-xl">
                      <Key size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-zinc-900">Anthropic API Key</h3>
                      <p className="text-[10px] sm:text-xs text-zinc-500">Enable Claude AI features</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-emerald-600 text-[10px] font-bold bg-emerald-50 px-3 py-1.5 rounded-full">
                    <ShieldCheck size={14} /> Secure Storage
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      type="password" 
                      value={formData.anthropicKey || ''}
                      onChange={e => setFormData({...formData, anthropicKey: e.target.value})}
                      placeholder="sk-ant-api03-..."
                      className="w-full bg-white border-zinc-200 rounded-xl px-4 py-2.5 sm:py-3 pr-12 focus:ring-2 focus:ring-orange-500 font-mono text-xs sm:text-sm"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
                      <Key size={16} />
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={14} />
                    <p className="text-[10px] sm:text-xs text-orange-800 leading-relaxed">
                      Your API key is stored locally in your browser. 
                      If not provided, Rimtify will default to Gemini AI.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4">
              {isSaved && (
                <span className="text-emerald-600 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-right-4">
                  Changes saved successfully!
                </span>
              )}
              <button 
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 text-white px-8 py-3 rounded-xl hover:bg-zinc-800 transition-all font-bold shadow-lg text-sm"
              >
                <Save size={18} />
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
