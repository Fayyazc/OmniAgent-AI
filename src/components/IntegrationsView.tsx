import React, { useState } from 'react';
import { IntegrationPlugin } from '../types';
import { Plug, Check, Plus, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const [plugins, setPlugins] = useState<IntegrationPlugin[]>([
    { id: 'p1', name: 'Google Workspace', category: 'Workspace', icon: '🌐', status: 'connected', description: 'Two-way sync for Gmail inbox, Google Calendar events, and Google Drive files.' },
    { id: 'p2', name: 'Microsoft 365', category: 'Workspace', icon: '💻', status: 'connected', description: 'Integration with Outlook email, Teams webhooks, and OneDrive vault.' },
    { id: 'p3', name: 'Slack Workspace', category: 'Communication', icon: '💬', status: 'connected', description: 'Post automated AI notifications, order receipts, and alert updates to Slack channels.' },
    { id: 'p4', name: 'WhatsApp Business API', category: 'Communication', icon: '📱', status: 'connected', description: 'Meta-approved business gateway for catalog dispatch, confirmations, and human escalation.' },
    { id: 'p5', name: 'Notion Knowledge Hub', category: 'Workspace', icon: '📝', status: 'available', description: 'Index Notion workspace pages into RAG vector store for instant QA.' },
    { id: 'p6', name: 'Trello & Jira Sync', category: 'CRM', icon: '📋', status: 'available', description: 'Sync AI Kanban task cards automatically with Trello boards and Jira sprints.' },
    { id: 'p7', name: 'GitHub Enterprise', category: 'Developer', icon: '🐙', status: 'connected', description: 'Automate issue triage, PR summaries, and repository documentation.' },
    { id: 'p8', name: 'Stripe Payments', category: 'Finance', icon: '💳', status: 'connected', description: 'Read vendor invoices, charge receipts, and reconcile revenue metrics.' },
  ]);

  const toggleConnect = (id: string) => {
    setPlugins(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'connected' ? 'available' : 'connected' } : p));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Plug className="w-6 h-6 text-brand-400" /> Connected Apps & Plugin Integration Architecture
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorize and manage third-party service connections for your autonomous AI workforce.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plugins.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{p.name}</h3>
                    <div className="text-[10px] text-slate-400">{p.category}</div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  p.status === 'connected' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {p.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Plugin API v2.4</span>

              <button
                onClick={() => toggleConnect(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  p.status === 'connected'
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    : 'bg-brand-600 hover:bg-brand-500 text-white shadow-md'
                }`}
              >
                {p.status === 'connected' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Authorized
                  </>
                ) : (
                  <>
                    <Plug className="w-3.5 h-3.5" /> Authorize App
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
