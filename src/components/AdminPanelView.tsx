import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, Users, Cpu, DollarSign, Activity, Flag, Server, Check } from 'lucide-react';

export const AdminPanelView: React.FC = () => {
  const { agents } = useApp();

  const [activeModel, setActiveModel] = useState('llama-3.3-70b-versatile');
  const [featureFlags, setFeatureFlags] = useState([
    { id: 'flag_1', name: 'Groq Voice Streaming STT', enabled: true },
    { id: 'flag_2', name: 'High-Velocity Vector RAG', enabled: true },
    { id: 'flag_3', name: 'WhatsApp Business Gateway', enabled: true },
    { id: 'flag_4', name: 'Experimental Code Sandbox', enabled: false },
  ]);

  const toggleFlag = (id: string) => {
    setFeatureFlags(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-purple-400" /> Super Admin Platform Operations Panel
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Platform-wide metrics, Groq AI Model Controls, Feature Flags, System Logs & Global Revenue.
          </p>
        </div>
      </div>

      {/* Admin Revenue & Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Recurring Revenue', val: '$42,850 /mo', icon: DollarSign, color: 'text-emerald-400' },
          { label: 'Total SaaS Tenants', val: '312 Companies', icon: Users, color: 'text-brand-400' },
          { label: 'Groq LLM Tokens / Day', val: '4.2 Million', icon: Cpu, color: 'text-purple-400' },
          { label: 'Cluster Health Index', val: '99.98%', icon: Server, color: 'text-cyan-400' },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{m.label}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className="text-xl font-extrabold text-white font-mono">{m.val}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Control Engine */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-400" /> Global AI LLM Model Engine Override
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Active Default Groq Model</label>
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
            >
              <option value="llama-3.3-70b-versatile">Groq Llama-3.3 70B Versatile</option>
              <option value="mixtral-8x7b-32768">Groq Mixtral 8x7B (32k Context)</option>
              <option value="llama3-8b-8192">Groq Llama-3 8B (Low Latency)</option>
            </select>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
            <Flag className="w-4 h-4 text-amber-400" /> System Feature Flags & Beta Gates
          </h3>

          <div className="space-y-2">
            {featureFlags.map((flag) => (
              <label key={flag.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-xs font-semibold text-slate-200">{flag.name}</span>
                <input
                  type="checkbox"
                  checked={flag.enabled}
                  onChange={() => toggleFlag(flag.id)}
                  className="rounded border-slate-700 text-brand-500"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
