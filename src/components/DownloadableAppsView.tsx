import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Monitor, Smartphone, CheckCircle2, ShieldCheck, WifiOff, RefreshCw, Cpu } from 'lucide-react';

export const DownloadableAppsView: React.FC = () => {
  const { selectedAgent } = useApp();

  const [offlineMode, setOfflineMode] = useState(false);
  const [downloadingOS, setDownloadingOS] = useState<string | null>(null);

  const platforms = [
    { name: 'Windows Agent', version: 'v2.4.1 (.exe)', os: 'Windows 10 / 11 (64-bit)', icon: Monitor, file: 'OmniAgent_Setup_x64.exe' },
    { name: 'macOS Desktop', version: 'v2.4.1 (.dmg)', os: 'Apple Silicon M1/M2/M3 & Intel', icon: Monitor, file: 'OmniAgent_Mac_Universal.dmg' },
    { name: 'Linux System Tray', version: 'v2.4.1 (.AppImage)', os: 'Ubuntu, Fedora, Debian', icon: Monitor, file: 'OmniAgent_Linux_x64.AppImage' },
    { name: 'Android App', version: 'v2.4.0 (.apk)', os: 'Android 10+', icon: Smartphone, file: 'OmniAgent_Mobile.apk' },
    { name: 'iOS Mobile Agent', version: 'v2.4.0 (TestFlight)', os: 'iOS 15+', icon: Smartphone, file: 'App Store Download' },
  ];

  const handleDownload = (osName: string) => {
    setDownloadingOS(osName);
    setTimeout(() => {
      setDownloadingOS(null);
      alert(`Download started for OmniAgent ${osName} binary package.`);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Download className="w-6 h-6 text-brand-400" /> Downloadable Desktop & Mobile AI Employee
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Install OmniAgent AI natively on Windows, macOS, Linux, Android, and iOS with background system tray sync.
          </p>
        </div>

        {/* Offline Mode Switcher */}
        <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
          <input
            type="checkbox"
            checked={offlineMode}
            onChange={(e) => setOfflineMode(e.target.checked)}
            className="rounded border-slate-700 text-brand-500"
          />
          <div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5 text-amber-400" /> Offline Mode Simulator
            </div>
            <div className="text-[10px] text-slate-400">Cache local documents & tasks without cloud API.</div>
          </div>
        </label>
      </div>

      {/* Desktop Tray Simulator Preview */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="px-2.5 py-1 rounded bg-brand-500/20 text-brand-300 text-[10px] uppercase font-bold tracking-wider w-fit">
            System Tray Native Companion
          </div>
          <h3 className="text-lg font-bold text-white">Always-On Desktop Employee Tray</h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Your active AI agent ({selectedAgent.name}) sits in your OS system tray, responding to global hotkeys (Alt+Space), reading highlighted text, and performing auto-tasks.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 w-full md:w-80 shadow-2xl space-y-3 font-sans text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <img src={selectedAgent.avatar} alt={selectedAgent.name} className="w-6 h-6 rounded-full object-cover" />
              <span className="font-bold text-slate-100">{selectedAgent.name} (Tray)</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-300">
            <div className="p-2 rounded bg-slate-900 flex justify-between">
              <span>Cloud Sync:</span> <span className="text-emerald-400 font-bold">100% Synced</span>
            </div>
            <div className="p-2 rounded bg-slate-900 flex justify-between">
              <span>Global Hotkey:</span> <kbd className="font-mono text-brand-400 bg-slate-950 px-1 rounded">Alt + Space</kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Downloads Platform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{p.version}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-100">{p.name}</h3>
                <p className="text-xs text-slate-400">{p.os}</p>
              </div>

              <button
                onClick={() => handleDownload(p.name)}
                disabled={downloadingOS === p.name}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                {downloadingOS === p.name ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-400" />
                    <span>Preparing Binary...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-brand-400" />
                    <span>Download {p.file}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
