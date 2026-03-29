import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Save, Sparkles, Clock } from 'lucide-react';
import { Note, Theme } from '../types';
import { getSuggestContent } from '../services/ai';
import { cn } from '../lib/utils';

interface EditorProps {
  note: Note;
  onSave: (note: Note) => void;
  anthropicKey?: string;
  theme: Theme;
}

export function Editor({ note, onSave, anthropicKey, theme }: EditorProps) {
  const [content, setContent] = useState(note.content);
  const [title, setTitle] = useState(note.title);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const lastSavedRef = useRef(Date.now());

  useEffect(() => {
    setContent(note.content);
    setTitle(note.title);
  }, [note.id]);

  // Auto-save every 1.2 seconds if changed
  useEffect(() => {
    const timer = setInterval(() => {
      if (content !== note.content || title !== note.title) {
        handleSave();
      }
    }, 1200);
    return () => clearInterval(timer);
  }, [content, title, note]);

  const handleSave = () => {
    setIsSaving(true);
    onSave({
      ...note,
      title,
      content,
      lastSaved: new Date().toISOString()
    });
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleAISuggest = async () => {
    if (isSuggesting) return;
    setIsSuggesting(true);
    try {
      const suggestion = await getSuggestContent(content, anthropicKey);
      setContent(prev => prev + `<p><br></p><p><strong>AI Suggestion:</strong></p><p>${suggestion}</p>`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSuggesting(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['code-block', 'blockquote'],
      ['link', 'image'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  return (
    <div className={cn(
      "flex flex-col h-full rounded-2xl border overflow-hidden shadow-sm",
      theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
    )}>
      <div className={cn(
        "p-3 lg:p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3",
        theme === 'dark' ? "bg-zinc-800/50 border-zinc-800" : "bg-zinc-50/50 border-zinc-200"
      )}>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title..."
          className={cn(
            "text-base lg:text-lg font-bold bg-transparent border-none focus:ring-0 w-full",
            theme === 'dark' ? "text-white" : "text-zinc-900"
          )}
        />
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-[10px] lg:text-xs text-zinc-400">
            <Clock size={12} className="lg:w-[14px] lg:h-[14px]" />
            {isSaving ? 'Saving...' : `Saved: ${new Date(note.lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleAISuggest}
              disabled={isSuggesting}
              className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all disabled:opacity-50 text-[10px] lg:text-sm font-medium shadow-sm"
            >
              <Sparkles size={14} className="lg:w-[16px] lg:h-[16px]" />
              {isSuggesting ? 'Thinking...' : 'AI Suggest'}
            </button>
            <button 
              onClick={handleSave}
              className={cn(
                "p-1.5 lg:p-2 rounded-lg transition-all",
                theme === 'dark' ? "text-zinc-400 hover:bg-zinc-800" : "text-zinc-500 hover:bg-zinc-200"
              )}
            >
              <Save size={18} className="lg:w-5 lg:h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className={cn(
        "flex-1 overflow-y-auto",
        theme === 'dark' ? "quill-dark" : ""
      )}>
        <ReactQuill 
          theme="snow" 
          value={content} 
          onChange={setContent} 
          modules={modules}
          className="h-full"
        />
      </div>
    </div>
  );
}
