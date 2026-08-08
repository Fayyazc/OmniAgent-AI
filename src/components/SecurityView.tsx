import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, Key, Download, Trash2, CheckCircle2, UserCheck, Shield } from 'lucide-react';

export const SecurityView: React.FC = () => {
  const { auditLogs, currentUser } = useApp();

  const [twoFa, setTwoFa] = useState(currentUser.twoFactorEnabled);
  const [apiKey, setApiKey] = useState('omni_live_94820184029481029');
  const [copiedKey, setCopiedKey] = useState(false);

  const oauthProviders = [
    { name: 'Google Workspace', status: 'Connected', connectedEmail: currentUser.email },
    { name: 'Microsoft 365 Azure AD', status: 'Connected', connectedEmail: currentUser.email },
    { name: 'GitHub Enterprise', status: 'Connected', connectedEmail: 'alex-vance-dev' },
    { name: 'Apple ID Single Sign-On', status: 'Available', connectedEmail: '-' },
  ];

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 1500);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ user: currentUser, logs: auditLogs }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `GDPR_OmniAgent_Export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-brand-400" /> Security, OAuth & Audit Compliance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage 2FA authentication, OAuth single sign-on, API key scopes, SOC 2 audit logs & GDPR data export.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication & 2FA */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
            OAuth & 2FA Single Sign-On
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-slate-200">Two-Factor Authentication (2FA)</div>
                <div className="text-[10px] text-slate-400">TOTP Authenticator app requirement.</div>
              </div>
              <input
                type="checkbox"
                checked={twoFa}
                onChange={(e) => setTwoFa(e.target.checked)}
                className="rounded border-slate-700 text-brand-500"
              />
            </label>

            {oauthProviders.map((provider, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-100">{provider.name}</div>
                  <div className="text-[10px] text-slate-400">{provider.connectedEmail}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  provider.status === 'Connected' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {provider.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* API Keys & GDPR Controls */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
              API Keys & Data Governance
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">OmniAgent API Token</label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value={apiKey}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono"
                />
                <button
                  onClick={handleCopyKey}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  {copiedKey ? 'Copied!' : 'Copy Key'}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-200">GDPR Compliance & Right to be Forgotten</div>
              <p className="text-[11px] text-slate-400">
                Export all encrypted records, vector embeddings, and transcript logs into standard JSON/CSV formats.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleExportData}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5 text-brand-400" /> Export Full Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Inspector */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
          SOC 2 Immutable Audit Trail Logs
        </h3>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <div>
                  <div className="font-semibold text-slate-100">{log.action}</div>
                  <div className="text-[10px] text-slate-400">Actor: {log.actor} • IP: {log.ip}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
