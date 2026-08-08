import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KnowledgeSource } from '../types';
import { Database, Plus, Link, FileText, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

export const KnowledgeBaseView: React.FC = () => {
  const { knowledgeSources, addKnowledgeSource } = useApp();

  const [name, setName] = useState('');
  const [urlOrSize, setUrlOrSize] = useState('');
  const [type, setType] = useState<KnowledgeSource['type']>('pdf');
  const [strictGrounding, setStrictGrounding] = useState(true);

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const source: KnowledgeSource = {
      id: `k_${Date.now()}`,
      name,
      type,
      sizeOrUrl: urlOrSize || '2.4 MB',
      status: 'indexed',
      tokenCount: Math.floor(Math.random() * 50000) + 10000,
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    addKnowledgeSource(source);
    setName('');
    setUrlOrSize('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-brand-400" /> Authorized Knowledge Base (RAG System)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Index PDFs, DOCX, Websites, FAQs, and Manuals. AI grounds responses strictly in authorized sources.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Addition Form */}
        <form onSubmit={handleAddSource} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
            Index New Knowledge Source
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Source Name / Identifier</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Master_Security_Compliance_2026.pdf"
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Source Format</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500 capitalize"
            >
              <option value="pdf">PDF Document</option>
              <option value="docx">Word Document (.docx)</option>
              <option value="website">Web URL Crawler</option>
              <option value="faq">FAQ Data Sheet</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">File Size or Web URL</label>
            <input
              type="text"
              value={urlOrSize}
              onChange={(e) => setUrlOrSize(e.target.value)}
              placeholder="e.g. https://docs.company.com or 4.5 MB"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={strictGrounding}
              onChange={(e) => setStrictGrounding(e.target.checked)}
              className="rounded border-slate-700 text-brand-500"
            />
            <div>
              <div className="text-xs font-semibold text-slate-200">Strict Knowledge Grounding</div>
              <div className="text-[10px] text-slate-400">Force AI to reply ONLY using indexed sources.</div>
            </div>
          </label>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-purple-600 text-white font-bold text-xs hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Index Source into Vector Store
          </button>
        </form>

        {/* Knowledge Sources List */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-slate-200">Indexed Corporate Vector Embeddings</h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">227,000 Tokens Vectorized</span>
          </div>

          <div className="space-y-3">
            {knowledgeSources.map((src) => (
              <div
                key={src.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                    {src.type === 'website' ? <Link className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-100">{src.name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="uppercase font-semibold text-brand-400">{src.type}</span> • {src.sizeOrUrl} • {src.tokenCount.toLocaleString()} Tokens
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Indexed
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
