import React, { useState } from 'react';
import { 
  Microscope, 
  Search, 
  ExternalLink, 
  Users, 
  TrendingUp, 
  BookOpen,
  Plus,
  ArrowUpRight,
  FlaskConical,
  Globe,
  Share2
} from 'lucide-react';
import { Theme } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ResearchProps {
  theme: Theme;
}

export function Research({ theme }: ResearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const trendingPapers = [
    { id: '1', title: 'Quantum Neural Networks: A Survey', authors: 'Dr. Sarah Connor, et al.', journal: 'Nature AI', year: '2025', citations: 124, tags: ['Quantum', 'AI'] },
    { id: '2', title: 'Sustainable Energy in Smart Cities', authors: 'Dr. John Doe', journal: 'IEEE Smart Grid', year: '2026', citations: 45, tags: ['Energy', 'IoT'] },
    { id: '3', title: 'Ethical Implications of Generative AI', authors: 'Dr. Jane Smith', journal: 'Ethics in Tech', year: '2025', citations: 89, tags: ['Ethics', 'AI'] },
  ];

  const collaborations = [
    { id: '1', project: 'Next-Gen Blockchain Security', lead: 'Dr. Robert Miller', department: 'CS', needed: 'Cryptography Expert', status: 'Open' },
    { id: '2', project: 'Climate Data Analysis', lead: 'Dr. Emily White', department: 'Physics', needed: 'Data Scientist', status: 'In Progress' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={cn("text-3xl font-bold mb-2", theme === 'dark' ? "text-white" : "text-zinc-900")}>Research Hub</h1>
          <p className="text-zinc-500">Discover trending papers and find collaboration opportunities.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search papers, projects, researchers..."
            className={cn(
              "w-full pl-12 pr-4 py-3 rounded-2xl border transition-all focus:ring-2 focus:ring-orange-500",
              theme === 'dark' ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"
            )}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trending Papers - Large Span */}
        <div className={cn(
          "lg:col-span-8 rounded-3xl border p-8",
          theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-950/30 text-orange-600 rounded-lg">
                <TrendingUp size={20} />
              </div>
              <h3 className={cn("text-xl font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>Trending Research</h3>
            </div>
            <button className="text-sm font-bold text-orange-600 hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="space-y-6">
            {trendingPapers.map(paper => (
              <div key={paper.id} className={cn(
                "group p-6 rounded-2xl border transition-all hover:border-orange-500/50",
                theme === 'dark' ? "bg-zinc-800/50 border-zinc-700" : "bg-zinc-50 border-zinc-100"
              )}>
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      {paper.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h4 className={cn("text-lg font-bold group-hover:text-orange-600 transition-colors", theme === 'dark' ? "text-white" : "text-zinc-900")}>
                      {paper.title}
                    </h4>
                    <p className="text-sm text-zinc-500">{paper.authors} • {paper.journal} ({paper.year})</p>
                  </div>
                  <button className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-400 hover:text-orange-600 transition-all shadow-sm">
                    <Share2 size={18} />
                  </button>
                </div>
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-700/50">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <BookOpen size={14} /> {paper.citations} Citations
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Globe size={14} /> Open Access
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration Board - Side Span */}
        <div className={cn(
          "lg:col-span-4 rounded-3xl border p-8",
          theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950/30 text-blue-600 rounded-lg">
                <Users size={20} />
              </div>
              <h3 className={cn("text-xl font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>Collaborations</h3>
            </div>
            <button className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400">
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {collaborations.map(collab => (
              <div key={collab.id} className={cn(
                "p-5 rounded-2xl border transition-all",
                theme === 'dark' ? "bg-zinc-800/50 border-zinc-700" : "bg-zinc-50 border-zinc-100"
              )}>
                <div className="flex items-center justify-between mb-3">
                  <span className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase",
                    collab.status === 'Open' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                  )}>
                    {collab.status}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400">{collab.department}</span>
                </div>
                <h4 className={cn("font-bold mb-1", theme === 'dark' ? "text-white" : "text-zinc-900")}>{collab.project}</h4>
                <p className="text-xs text-zinc-500 mb-4">Lead: {collab.lead}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Looking for:</span>
                  <span className="text-xs font-bold text-orange-600">{collab.needed}</span>
                </div>
                <button className="w-full mt-4 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all">
                  Apply to Join
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Resources - Bottom Span */}
        <div className={cn(
          "lg:col-span-12 rounded-3xl border p-8",
          theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-purple-100 dark:bg-purple-950/30 text-purple-600 rounded-lg">
              <FlaskConical size={20} />
            </div>
            <h3 className={cn("text-xl font-bold", theme === 'dark' ? "text-white" : "text-zinc-900")}>Researcher Resources</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Grant Opportunities', desc: 'Find funding for your next project', icon: Globe },
              { title: 'Lab Reservations', desc: 'Book time in university labs', icon: Microscope },
              { title: 'Publication Guide', desc: 'How to submit to top journals', icon: BookOpen },
              { title: 'Ethics Board', desc: 'Submit your research for review', icon: FlaskConical },
            ].map((res, i) => (
              <div key={i} className={cn(
                "p-6 rounded-2xl border flex flex-col items-start gap-4 group cursor-pointer hover:border-orange-500/50 transition-all",
                theme === 'dark' ? "bg-zinc-800/50 border-zinc-700" : "bg-zinc-50 border-zinc-100"
              )}>
                <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl shadow-sm group-hover:text-orange-600 transition-colors">
                  <res.icon size={24} />
                </div>
                <div>
                  <h4 className={cn("font-bold mb-1", theme === 'dark' ? "text-white" : "text-zinc-900")}>{res.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">{res.desc}</p>
                </div>
                <div className="mt-auto pt-4 w-full flex justify-end">
                  <ExternalLink size={16} className="text-zinc-400 group-hover:text-orange-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
