import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Send, CheckCircle2, Shield, Bot, UserCheck, Sparkles } from 'lucide-react';

export const MessagingAssistantView: React.FC = () => {
  const { selectedAgent } = useApp();

  const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'slack' | 'telegram'>('whatsapp');
  const [autoRespond, setAutoRespond] = useState(true);
  const [messages, setMessages] = useState([
    { id: '1', sender: 'Customer', text: 'Hi, does OmniAgent support instant WhatsApp order confirmation?', time: '14:20' },
    { id: '2', sender: `${selectedAgent.name} (AI Bot)`, text: 'Hello! Yes, OmniAgent integrates directly with WhatsApp Business API to dispatch instant confirmations, invoices, and tracking links.', time: '14:21' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    const userMsg = { id: String(Date.now()), sender: 'Operator', text: input, time: 'Now' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const aiReply = {
        id: String(Date.now() + 1),
        sender: `${selectedAgent.name} (AI Auto-Responder)`,
        text: `Understood! Routing payload to ${activeChannel.toUpperCase()} webhook gateway.`,
        time: 'Now'
      };
      setMessages(prev => [...prev, aiReply]);
    }, 600);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-brand-400" /> Business Messaging Bot Assistant
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automate WhatsApp, Slack, Telegram & SMS inquiries, catalogs, order confirmations & human escalation.
          </p>
        </div>

        {/* Integration Channel Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['whatsapp', 'slack', 'telegram'] as const).map(ch => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeChannel === ch ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Main Bot Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings & Rules */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
            Automation Rules & Escalation
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-xs text-slate-200 font-semibold">Auto-Reply Enable</span>
              <input
                type="checkbox"
                checked={autoRespond}
                onChange={(e) => setAutoRespond(e.target.checked)}
                className="rounded border-slate-700 text-brand-500"
              />
            </label>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-300">Human Escalation Trigger</div>
              <p className="text-[11px] text-slate-400">
                If confidence falls below 85% or client requests human agent, AI notifies operator immediately.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-300">Supported Integrations</div>
              <div className="text-[11px] text-slate-400 space-y-1">
                <div>• WhatsApp Business API (Meta Approved)</div>
                <div>• Slack Workspace Webhooks</div>
                <div>• Telegram Bot API</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulator Chat Window */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between h-[450px]">
          <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" /> Channel Simulator: {activeChannel.toUpperCase()}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Live Webhook Connected</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-xl max-w-md text-xs space-y-1 ${
                  m.sender.includes('AI')
                    ? 'bg-slate-950 border border-slate-800 text-slate-100'
                    : 'bg-brand-600/30 border border-brand-500/30 text-white ml-auto'
                }`}
              >
                <div className="font-bold text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{m.sender}</span>
                  <span>{m.time}</span>
                </div>
                <p>{m.text}</p>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Simulate customer message or send manual reply..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 transition-all flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
