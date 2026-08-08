import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { queryGroqAPI } from '../services/groqApi';
import { Sparkles, Copy, Check, RefreshCw, Share2, FileText } from 'lucide-react';

export const ContentCreatorView: React.FC = () => {
  const { selectedAgent } = useApp();

  const [template, setTemplate] = useState('seo_article');
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('Enterprise Executives & SaaS Founders');
  const [output, setOutput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const templates = [
    { id: 'seo_article', name: 'SEO Article & Blog Post' },
    { id: 'fb_ad', name: 'Facebook & Instagram Ad Copy' },
    { id: 'google_ad', name: 'Google Ads Search Campaign' },
    { id: 'linkedin_post', name: 'LinkedIn Executive Thought Leadership' },
    { id: 'email_newsletter', name: 'Sales & Product Launch Newsletter' },
    { id: 'landing_page', name: 'High-Converting Landing Page Headline' },
  ];

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || generating) return;

    setGenerating(true);

    const prompt = `Write a high-converting, professional marketing content piece for the template: "${template.toUpperCase()}".
Topic / Product: "${topic}"
Target Audience: "${targetAudience}"
Format properly with headlines, hooks, call to action, and emojis where appropriate.`;

    const result = await queryGroqAPI(
      [{ role: 'user', content: prompt }],
      selectedAgent.systemPrompt,
      selectedAgent.model
    );

    setOutput(result.text);
    setGenerating(false);
  };

  const copyContent = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-400" /> AI Marketing & Content Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate high-performing SEO articles, Facebook Ads, LinkedIn posts, email newsletters, and landing pages.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <form onSubmit={handleGenerateContent} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
            Content Parameters
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Content Template</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500"
            >
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Topic or Product Description</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. AI Employees for automating B2B SaaS operations"
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-purple-600 text-white font-bold text-xs hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Copy with Groq...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Content Copy</span>
              </>
            )}
          </button>
        </form>

        {/* Output Box */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-slate-200">Generated Marketing Output</h3>
            {output && (
              <button
                onClick={copyContent}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Copy
              </button>
            )}
          </div>

          <div className="flex-1 bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans overflow-y-auto max-h-[380px] whitespace-pre-wrap">
            {output ? (
              output
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12">
                <Sparkles className="w-8 h-8 stroke-1 mb-2 text-brand-400" />
                <span>Fill parameters and click Generate Content Copy</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
