import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, Bot, PhoneCall, CheckCircle2, FileText, 
  MessageSquare, TrendingUp, Sparkles, ArrowUpRight, 
  Clock, ShieldAlert, Cpu, Play
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

const usageData = [
  { name: 'Mon', calls: 34, tasks: 45, docs: 12, messages: 320 },
  { name: 'Tue', calls: 52, tasks: 68, docs: 24, messages: 450 },
  { name: 'Wed', calls: 48, tasks: 82, docs: 18, messages: 510 },
  { name: 'Thu', calls: 61, tasks: 94, docs: 31, messages: 620 },
  { name: 'Fri', calls: 75, tasks: 110, docs: 42, messages: 840 },
  { name: 'Sat', calls: 28, tasks: 35, docs: 9,  messages: 210 },
  { name: 'Sun', calls: 19, tasks: 22, docs: 6,  messages: 160 },
];

export const DashboardView: React.FC = () => {
  const { agents, setCurrentTab, setSelectedAgent, currentUser } = useApp();

  const kpis = [
    { label: 'Total Team Members', value: '48 Users', change: '+12%', icon: Users, color: 'from-blue-500 to-indigo-600' },
    { label: 'Active AI Employees', value: `${agents.length} Online`, change: '100% Operational', icon: Bot, color: 'from-brand-500 to-cyan-500' },
    { label: 'AI Voice Calls Handled', value: '412 Calls', change: '+28% this week', icon: PhoneCall, color: 'from-emerald-500 to-teal-600' },
    { label: 'Tasks Completed', value: '1,177 Tasks', change: '+34% vs last week', icon: CheckCircle2, color: 'from-purple-500 to-pink-600' },
    { label: 'Documents Generated', value: '214 Files', change: 'Word, PDF & Excel', icon: FileText, color: 'from-amber-500 to-orange-600' },
    { label: 'Messages Processed', value: '5,540 Msgs', change: 'WhatsApp & Email', icon: MessageSquare, color: 'from-rose-500 to-red-600' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950/80 border border-slate-800 p-6 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" /> Enterprise SaaS Platform
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl">
              Your AI employees are actively processing business tasks, summarizing voice calls, triaging emails, and generating client proposals in real-time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('agent_builder')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-medium text-xs hover:shadow-lg hover:shadow-brand-500/25 transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4" /> Deploy New AI Employee
            </button>
            <button
              onClick={() => setCurrentTab('ai_chat')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-all flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 text-brand-400" /> Open AI Chat
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">{kpi.label}</span>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${kpi.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xl font-bold text-slate-100">{kpi.value}</div>
                <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> {kpi.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts & Active Employees Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Usage Analytics Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100">AI Productivity & Activity Trends</h3>
              <p className="text-xs text-slate-400">Weekly breakdown of AI calls, tasks, documents, and messages</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              <Cpu className="w-3.5 h-3.5 text-brand-400" /> Groq Llama-3.3 Engine
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0c87e4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0c87e4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="tasks" stroke="#a855f7" fillOpacity={1} fill="url(#colorTasks)" name="Tasks Completed" />
                <Area type="monotone" dataKey="calls" stroke="#0c87e4" fillOpacity={1} fill="url(#colorCalls)" name="AI Calls" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active AI Employees Roster */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-100">Deployed AI Employees</h3>
              <button
                onClick={() => setCurrentTab('agent_builder')}
                className="text-[11px] text-brand-400 hover:underline font-medium"
              >
                + Add Agent
              </button>
            </div>

            <div className="space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => {
                    setSelectedAgent(agent);
                    setCurrentTab('ai_chat');
                  }}
                  className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full object-cover" />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-100 group-hover:text-brand-400 transition-colors">
                        {agent.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{agent.title}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-bold text-slate-200">{agent.stats.tasksCompleted} Tasks</div>
                    <div className="text-[9px] text-slate-400">{agent.stats.callsHandled} Calls</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Overall Efficiency</span>
            <span className="font-bold text-emerald-400">99.8% Uptime</span>
          </div>
        </div>
      </div>

      {/* Quick Access Feature Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Document Generator', desc: 'Create Word, Excel, PDF, SOPs', tab: 'document_generator', color: 'text-brand-400' },
          { title: 'Voice AI Dialer', desc: 'Simulate live inbound/outbound calls', tab: 'voice_ai', color: 'text-purple-400' },
          { title: 'Email & Messaging', desc: 'Auto-triage inboxes and WhatsApp', tab: 'email_assistant', color: 'text-emerald-400' },
          { title: 'Knowledge Base (RAG)', desc: 'Index PDFs, Word docs & Websites', tab: 'knowledge_base', color: 'text-amber-400' },
        ].map((tile, i) => (
          <div
            key={i}
            onClick={() => setCurrentTab(tile.tab as any)}
            className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <div className={`text-xs font-bold ${tile.color} group-hover:underline flex items-center gap-1`}>
                {tile.title} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{tile.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
