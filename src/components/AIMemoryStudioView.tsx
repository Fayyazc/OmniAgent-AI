import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MemoryItem } from '../types';
import { Brain, Plus, Trash2, Edit2, Check, Search, Sparkles, BookOpen } from 'lucide-react';

export const AIMemoryStudioView: React.FC = () => {
  const { selectedAgent } = useApp();

  const [memories, setMemories] = useState<MemoryItem[]>([
    {
      id: 'm1',
      category: 'preference',
      title: 'Executive PDF Design & Formatting Preference',
      content: 'Always format PDF documents using dark navy accent headers, 10pt Inter font, and explicit financial tables.',
      updatedAt: '2026-08-04',
      importance: 'high'
    },
    {
      id: 'm2',
      category: 'business_info',
      title: 'Company Registration & Tax Identification',
      content: 'OmniCorp Solutions Inc. EIN: 94-2049182. HQ Address: 100 Tech Plaza, San Francisco CA.',
      updatedAt: '2026-08-01',
      importance: 'high'
    },
    {
      id: 'm3',
      category: 'workflow',
      title: 'Monthly Expense Audit Protocol',
      content: 'Reconcile vendor invoices against Stripe charge settlement logs on the 1st of every month.',
      updatedAt: '2026-08-03',
      importance: 'medium'
    },
    {
      id: 'm4',
      category: 'prompt',
      title: 'Enterprise RFP Quotation Prompt Preset',
      content: 'Draft a 3-page RFP quotation emphasizing 99.9% uptime SLA, Groq API rate limits, and 24/7 dedicated support.',
      updatedAt: '2026-08-02',
      importance: 'medium'
    }
  ]);

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // New memory form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryItem['category']>('preference');
  const [newContent, setNewContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredMemories = memories.filter(m => {
    const matchesTab = activeTab === 'all' || m.category === activeTab;
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const item: MemoryItem = {
      id: `mem_${Date.now()}`,
      category: newCategory,
      title: newTitle,
      content: newContent,
      updatedAt: new Date().toISOString().split('T')[0],
      importance: 'high'
    };

    setMemories(prev => [item, ...prev]);
    setNewTitle('');
    setNewContent('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdateContent = (id: string, newText: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, content: newText } : m));
    setEditingId(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" /> AI Long-Term Memory & Preferences Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            View, edit, or delete stored user preferences, business information, favorite prompts, and saved workflows.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold text-xs flex items-center gap-2 hover:shadow-lg transition-all w-fit"
        >
          <Plus className="w-4 h-4" /> Add Custom Memory
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddMemory} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in shadow-2xl">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Add User Preference or Business Context</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Memory Title (e.g. Preferred Email Signature Format)"
              required
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none capitalize"
            >
              <option value="preference">User Preference</option>
              <option value="business_info">Business Information</option>
              <option value="workflow">Saved Workflow Protocol</option>
              <option value="prompt">Favorite Prompt Template</option>
            </select>
          </div>

          <textarea
            rows={3}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Specify precise context details for AI grounding..."
            required
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none"
          />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400">Cancel</button>
            <button type="submit" className="px-4 py-1.5 rounded-lg bg-brand-600 text-xs text-white font-bold">Save to Memory Vector Store</button>
          </div>
        </form>
      )}

      {/* Filter Tabs & Search */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search AI memory items by keyword..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {['all', 'preference', 'business_info', 'workflow', 'prompt'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                activeTab === cat ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Memory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-md flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                  {mem.category.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-mono text-slate-500">Updated {mem.updatedAt}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-100">{mem.title}</h3>

              {editingId === mem.id ? (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    defaultValue={mem.content}
                    id={`edit_${mem.id}`}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2.5 py-1 rounded bg-slate-800 text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const el = document.getElementById(`edit_${mem.id}`) as HTMLTextAreaElement;
                        if (el) handleUpdateContent(mem.id, el.value);
                      }}
                      className="px-3 py-1 rounded bg-brand-600 text-xs text-white font-bold"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {mem.content}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Vector Grounded
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingId(mem.id)}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Edit Memory"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(mem.id)}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400"
                  title="Delete Memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
