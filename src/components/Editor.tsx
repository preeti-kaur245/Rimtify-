import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Save, Sparkles, Clock } from 'lucide-react';
import { Note } from '../types';
import { getSuggestContent } from '../services/ai';

interface EditorProps {
  note: Note;
  onSave: (note: Note) => void;
  anthropicKey?: string;
}

export function Editor({ note, onSave, anthropicKey }: EditorProps) {
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
    <div className="flex flex-col h-full bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title..."
          className="text-lg font-bold bg-transparent border-none focus:ring-0 w-full"
        />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mr-4">
            <Clock size={14} />
            {isSaving ? 'Saving...' : `Last saved: ${new Date(note.lastSaved).toLocaleTimeString()}`}
          </div>
          <button 
            onClick={handleAISuggest}
            disabled={isSuggesting}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all disabled:opacity-50 text-sm font-medium shadow-sm"
          >
            <Sparkles size={16} />
            {isSuggesting ? 'Thinking...' : 'AI Suggest'}
          </button>
          <button 
            onClick={handleSave}
            className="p-2 text-zinc-500 hover:bg-zinc-200 rounded-lg transition-all"
          >
            <Save size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
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
