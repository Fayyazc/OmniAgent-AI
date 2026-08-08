import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIEmployee } from '../types';
import { Bot, Sparkles, Shield, Cpu, Volume2, Check, Sliders, CheckCircle2 } from 'lucide-react';

export const AgentBuilderView: React.FC = () => {
  const { addAgent, setCurrentTab } = useApp();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Operations');
  const [voiceProfile, setVoiceProfile] = useState('Rachel (Professional Warm)');
  const [model, setModel] = useState('llama-3.3-70b-versatile');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [canSendEmails, setCanSendEmails] = useState(true);
  const [canMakeCalls, setCanMakeCalls] = useState(true);
  const [canAccessFiles, setCanAccessFiles] = useState(true);
  const [canScheduleMeetings, setCanScheduleMeetings] = useState(true);
  const [canManageTasks, setCanManageTasks] = useState(true);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const avatars = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !title) return;

    const newAgent: AIEmployee = {
      id: `agent_${Date.now()}`,
      name,
      title,
      avatar: selectedAvatar,
      department,
      status: 'online',
      voiceProfile,
      model,
      systemPrompt: systemPrompt || `You are ${name}, an AI ${title} for ${department}.`,
      permissions: {
        canSendEmails,
        canMakeCalls,
        canAccessFiles,
        canScheduleMeetings,
        canManageTasks
      },
      stats: {
        tasksCompleted: 0,
        callsHandled: 0,
        documentsCreated: 0,
        messagesProcessed: 0
      }
    };

    addAgent(newAgent);
    setCreatedSuccess(true);

    setTimeout(() => {
      setCreatedSuccess(false);
      setCurrentTab('ai_chat');
    }, 1200);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-brand-400" /> Create & Configure AI Employee
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build a custom AI workforce member with specific permissions, voice traits, and Groq LLM intelligence.
          </p>
        </div>
      </div>

      {createdSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">AI Employee successfully deployed! Launching AI Chat Studio...</span>
        </div>
      )}

      <form onSubmit={handleCreate} className="space-y-6">
        {/* Basic Profile */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
            1. Employee Identity & Appearance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Victoria Chase"
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title / Designation</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Legal Compliance & Contract Specialist"
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500"
              >
                <option value="Operations">Operations</option>
                <option value="Sales">Sales & Marketing</option>
                <option value="Legal">Legal & Finance</option>
                <option value="Support">Customer Support</option>
                <option value="Engineering">Engineering & IT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Selection</label>
              <div className="flex items-center gap-2">
                {avatars.map((av, idx) => (
                  <img
                    key={idx}
                    src={av}
                    alt="Avatar"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-9 h-9 rounded-full object-cover cursor-pointer border-2 transition-all ${
                      selectedAvatar === av ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Engine & Voice Config */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-400" /> 2. Groq LLM & Voice Intelligence
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">AI Model Engine (Groq)</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500"
              >
                <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile (Recommended)</option>
                <option value="mixtral-8x7b-32768">Mixtral 8x7B (High Context)</option>
                <option value="llama3-8b-8192">Llama 3 8B (Ultra Fast)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-purple-400" /> Voice Synthesis Persona
              </label>
              <select
                value={voiceProfile}
                onChange={(e) => setVoiceProfile(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500"
              >
                <option value="Rachel (Professional Warm)">Rachel (Professional Warm)</option>
                <option value="Adam (Confident Executive)">Adam (Confident Executive)</option>
                <option value="Emma (Calm Empathic)">Emma (Calm Empathic)</option>
                <option value="Brian (Technical Authoritative)">Brian (Technical Authoritative)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">System Instructions & Behavior Prompt</label>
            <textarea
              rows={3}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="e.g. You are Victoria, an executive legal AI assistant responsible for drafting contract terms, verifying compliance, and triaging partner inquiries."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Security & Access Permissions */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" /> 3. Security & Operational Scope
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'Can Send Emails', state: canSendEmails, setter: setCanSendEmails },
              { label: 'Can Make AI Voice Calls', state: canMakeCalls, setter: setCanMakeCalls },
              { label: 'Can Access Vault Files', state: canAccessFiles, setter: setCanAccessFiles },
              { label: 'Can Schedule Calendar', state: canScheduleMeetings, setter: setCanScheduleMeetings },
              { label: 'Can Manage Kanban Tasks', state: canManageTasks, setter: setCanManageTasks },
            ].map((perm, i) => (
              <label key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={perm.state}
                  onChange={(e) => perm.setter(e.target.checked)}
                  className="rounded border-slate-700 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-xs text-slate-200 font-medium">{perm.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-purple-600 text-white font-bold text-xs hover:shadow-xl hover:shadow-brand-500/25 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Deploy AI Employee Now
          </button>
        </div>
      </form>
    </div>
  );
};
