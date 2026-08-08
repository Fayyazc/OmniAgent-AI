import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, FileText, Mail, CheckSquare, Folder, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, documents, emails, tasks, files, setCurrentTab } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const matchedDocs = documents.filter(d => d.title.toLowerCase().includes(query.toLowerCase()));
  const matchedEmails = emails.filter(e => e.subject.toLowerCase().includes(query.toLowerCase()) || e.sender.toLowerCase().includes(query.toLowerCase()));
  const matchedTasks = tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
  const matchedFiles = files.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-4 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Search className="w-5 h-5 text-brand-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search across documents, emails, tasks, files..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button onClick={() => setIsSearchOpen(false)} className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded">Esc</button>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-4 text-xs pr-1">
          {matchedDocs.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Documents</div>
              {matchedDocs.map(d => (
                <div
                  key={d.id}
                  onClick={() => {
                    setCurrentTab('document_generator');
                    setIsSearchOpen(false);
                  }}
                  className="p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between cursor-pointer text-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-brand-400" />
                    <span>{d.title}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                </div>
              ))}
            </div>
          )}

          {matchedEmails.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Emails</div>
              {matchedEmails.map(e => (
                <div
                  key={e.id}
                  onClick={() => {
                    setCurrentTab('email_assistant');
                    setIsSearchOpen(false);
                  }}
                  className="p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between cursor-pointer text-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{e.subject} ({e.sender})</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                </div>
              ))}
            </div>
          )}

          {matchedTasks.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tasks</div>
              {matchedTasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => {
                    setCurrentTab('task_management');
                    setIsSearchOpen(false);
                  }}
                  className="p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between cursor-pointer text-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-3.5 h-3.5 text-purple-400" />
                    <span>{t.title}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
