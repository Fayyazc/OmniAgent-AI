import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { queryGroqAPI } from '../services/groqApi';
import { EmailItem } from '../types';
import { Mail, Sparkles, Send, ShieldAlert, CheckCircle2, Clock, Inbox, RefreshCw } from 'lucide-react';

export const EmailAssistantView: React.FC = () => {
  const { emails, selectedAgent } = useApp();

  const [selectedEmail, setSelectedEmail] = useState<EmailItem>(emails[0]);
  const [draftReply, setDraftReply] = useState(selectedEmail?.suggestedReply || '');
  const [generating, setGenerating] = useState(false);
  const [sentAlert, setSentAlert] = useState(false);

  const handleGenerateReply = async () => {
    if (!selectedEmail) return;
    setGenerating(true);

    const prompt = `Read this inbound client email and draft a professional executive reply:\nSender: ${selectedEmail.sender}\nSubject: ${selectedEmail.subject}\nBody: ${selectedEmail.body}`;

    const res = await queryGroqAPI(
      [{ role: 'user', content: prompt }],
      selectedAgent.systemPrompt,
      selectedAgent.model
    );

    setDraftReply(res.text);
    setGenerating(false);
  };

  const handleSendEmail = () => {
    setSentAlert(true);
    setTimeout(() => setSentAlert(false), 2000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-brand-400" /> Executive AI Email Triage & Assistant
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Connect GSuite, Outlook or IMAP. AI reads, triages spam, drafts replies, and schedules follow-ups.
          </p>
        </div>
      </div>

      {sentAlert && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Email dispatched via Connected Mail Server!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Inbox List */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Inbox className="w-4 h-4 text-brand-400" /> Inbound Mailbox ({emails.length})
            </h3>
          </div>

          <div className="space-y-2">
            {emails.map((email) => (
              <div
                key={email.id}
                onClick={() => {
                  setSelectedEmail(email);
                  setDraftReply(email.suggestedReply || '');
                }}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${
                  selectedEmail.id === email.id
                    ? 'bg-slate-800 border-brand-500/40 shadow-md'
                    : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">{email.sender}</span>
                  <span className="text-[10px] text-slate-400">{email.date}</span>
                </div>
                <div className="text-xs font-semibold text-brand-300 truncate mt-0.5">{email.subject}</div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-1">{email.snippet}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Email & AI Drafter */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{selectedEmail.subject}</span>
                <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 text-[10px] uppercase font-bold">
                  {selectedEmail.category}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                From: <span className="text-slate-200 font-medium">{selectedEmail.sender}</span> ({selectedEmail.senderEmail})
              </div>
            </div>

            {/* Email Body */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {selectedEmail.body}
            </div>

            {/* AI Draft Reply Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" /> AI Drafted Response ({selectedAgent.name})
                </label>
                <button
                  onClick={handleGenerateReply}
                  disabled={generating}
                  className="text-[11px] text-brand-400 hover:underline flex items-center gap-1"
                >
                  {generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Re-Draft with Groq
                </button>
              </div>

              <textarea
                rows={5}
                value={draftReply}
                onChange={(e) => setDraftReply(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500 font-sans"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              onClick={() => alert(`Auto Follow-up Scheduled in Calendar for ${selectedEmail.sender}`)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Schedule Auto Follow-Up
            </button>

            <button
              onClick={handleSendEmail}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold text-xs flex items-center gap-1.5 hover:shadow-lg transition-all"
            >
              <Send className="w-3.5 h-3.5" /> Send Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
