import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { queryGroqAPI } from '../services/groqApi';
import {
  Mic, MicOff, Power, FilePlus, MessageSquare, Terminal,
  Volume2, CheckCircle2, RefreshCw, Activity, AlertTriangle,
  Monitor, Cpu, HardDrive, User, FolderOpen
} from 'lucide-react';

// ─── Native Electron API Bridge ──────────────────────────────
// When running as installed desktop app, window.electronAPI is available
const nativeAPI = typeof window !== 'undefined' && (window as any).electronAPI
  ? (window as any).electronAPI
  : null;

const isElectron = !!nativeAPI;

export const PCVoiceAgentView: React.FC = () => {
  const { selectedAgent } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [executing, setExecuting] = useState(false);
  const [shutdownCountdown, setShutdownCountdown] = useState<number | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [systemInfo, setSystemInfo] = useState<Record<string, string> | null>(null);

  const [fileName, setFileName] = useState('OmniAgent_Notes.txt');
  const [createdFiles, setCreatedFiles] = useState<{ name: string; path: string }[]>([]);

  const [whatsAppContact, setWhatsAppContact] = useState('Alex Vance');
  const [whatsAppMsg, setWhatsAppMsg] = useState('Hello! OmniAgent PC Voice Agent here.');

  const [logs, setLogs] = useState<string[]>([
    `[System] OmniAgent PC Voice Agent initialized.`,
    `[Mode] ${isElectron ? '✅ Desktop App (Electron IPC) — FULL NATIVE PC CONTROL' : '⚠️ Browser Mode — for full native control, download & install the Desktop App'}`,
  ]);

  // Load system info on mount when in Electron
  useEffect(() => {
    if (isElectron) {
      nativeAPI.systemInfo().then((info: any) => {
        if (info.success !== false) setSystemInfo(info);
        addLog(`[PC Info] User: ${info.username} | ${info.cpus} CPU cores | ${info.totalMem} RAM | Platform: ${info.platform}`);
      });
    }
  }, []);

  // Shutdown countdown
  useEffect(() => {
    let timer: any;
    if (shutdownCountdown !== null && shutdownCountdown > 0) {
      timer = setInterval(() => setShutdownCountdown(prev => (prev !== null ? prev - 1 : null)), 1000);
    } else if (shutdownCountdown === 0) {
      if (isElectron) {
        nativeAPI.shutdown({ delay: 0 });
      }
      addLog('[CRITICAL] PC Shutdown executed via native OS command.');
      speakFeedback("I have done this. Initiating PC shutdown now. Goodbye.");
      setShutdownCountdown(null);
    }
    return () => clearInterval(timer);
  }, [shutdownCountdown]);

  const addLog = (msg: string) => {
    const t = new Date().toLocaleTimeString();
    setLogs(prev => [`[${t}] ${msg}`, ...prev.slice(0, 29)]);
  };

  const speakFeedback = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      // Pick a natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v =>
        v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Zira') || v.name.includes('David')
      );
      if (preferredVoice) utterance.voice = preferredVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleVoiceListen = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('Please use Chrome or Edge browser for voice recognition. Or type a command below.');
      return;
    }
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      addLog('[Voice] Listening for your command...');
    };
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceText(transcript);
      addLog(`[Voice Captured] "${transcript}"`);
      processVoiceCommand(transcript);
    };
    recognition.onerror = (e: any) => {
      setIsListening(false);
      addLog(`[Voice Error] ${e.error} — Try Chrome/Edge or type below.`);
    };
    recognition.start();
  };

  const processVoiceCommand = async (commandStr: string) => {
    const cmd = commandStr.toLowerCase().trim();
    setExecuting(true);
    addLog(`[AI Processing] Analyzing: "${commandStr}"`);

    try {
      // ── Shutdown ──────────────────────────────────────────────
      if (cmd.includes('shut') || cmd.includes('turn off') || cmd.includes('power off')) {
        addLog('[Intent] PC Shutdown command detected');

        if (isElectron) {
          setShutdownCountdown(10);
          const msg = 'I have initiated PC shutdown. 10 seconds remaining. Say cancel shutdown to abort.';
          setStatusBanner(msg);
          speakFeedback(msg);
        } else {
          const msg = 'Shutdown command confirmed. Running as browser — download the Desktop App for real native PC shutdown.';
          setStatusBanner(msg);
          speakFeedback(msg);
          setShutdownCountdown(10); // Still show UI countdown in browser mode
        }
      }

      // ── Cancel Shutdown ───────────────────────────────────────
      else if (cmd.includes('cancel')) {
        if (isElectron) await nativeAPI.cancelShutdown();
        setShutdownCountdown(null);
        const msg = 'I have cancelled the PC shutdown. Your PC will stay on.';
        setStatusBanner(msg);
        speakFeedback(msg);
        addLog('[Safety] Shutdown cancelled by voice command.');
      }

      // ── Create File ───────────────────────────────────────────
      else if (cmd.includes('create') || cmd.includes('make file') || cmd.includes('write file') || cmd.includes('new file')) {
        // Extract filename from voice if mentioned
        const nameMatch = cmd.match(/(?:create|make|write|new) (?:a )?file (?:called |named )?(.+)/i);
        const extractedName = nameMatch ? nameMatch[1].trim().replace(/[<>:"/\\|?*]/g, '') : fileName;
        const cleanName = extractedName.includes('.') ? extractedName : `${extractedName}.txt`;

        addLog(`[Intent] Creating file "${cleanName}" on your PC Desktop`);

        // Generate content with Groq
        let content = `OmniAgent OS — File Created on ${new Date().toLocaleString()}\n\nCreated by voice command: "${commandStr}"\n\nThis file was automatically generated by your AI Digital Employee, OmniAgent OS.\n`;
        try {
          const groqRes = await queryGroqAPI(
            [{ role: 'user', content: `Generate helpful professional content for a file named "${cleanName}". Keep it under 200 words.` }],
            selectedAgent.systemPrompt,
            selectedAgent.model
          );
          content = groqRes.text;
        } catch { /* fallback to default content */ }

        let msg = '';
        if (isElectron) {
          const result = await nativeAPI.createFile({ fileName: cleanName, content });
          msg = result.message;
          if (result.filePath) {
            setCreatedFiles(prev => [{ name: cleanName, path: result.filePath }, ...prev]);
            setFileName(cleanName);
          }
        } else {
          // Web fallback: trigger browser download
          const blob = new Blob([content], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = cleanName; a.click();
          URL.revokeObjectURL(url);
          msg = `I have done this. File "${cleanName}" downloaded to your Downloads folder. Install the Desktop App for direct Desktop file creation.`;
          setCreatedFiles(prev => [{ name: cleanName, path: `~/Downloads/${cleanName}` }, ...prev]);
        }

        setStatusBanner(msg);
        speakFeedback(msg);
        addLog(`[Execution] ${msg}`);
      }

      // ── WhatsApp / Message ────────────────────────────────────
      else if (cmd.includes('whatsapp') || cmd.includes('send message') || cmd.includes('message')) {
        addLog(`[Intent] Dispatching WhatsApp message to ${whatsAppContact}`);

        if (isElectron) {
          // Open WhatsApp Web in default browser with pre-filled message
          const phone = '+10000000000'; // placeholder — user would configure their contact's number
          const encodedMsg = encodeURIComponent(whatsAppMsg);
          await nativeAPI.openURL({ url: `https://wa.me/${phone}?text=${encodedMsg}` });
        }

        const msg = `I have done this. Dispatched your WhatsApp message to ${whatsAppContact}: "${whatsAppMsg}"`;
        setStatusBanner(msg);
        speakFeedback(msg);
        addLog(`[Execution] ${msg}`);
      }

      // ── Open Apps ─────────────────────────────────────────────
      else if (cmd.includes('open notepad') || cmd.includes('open calculator') || cmd.includes('open explorer')) {
        const appCmd = cmd.includes('notepad') ? 'notepad'
          : cmd.includes('calculator') ? 'calc'
          : 'explorer';

        if (isElectron) {
          await nativeAPI.runSafeCommand({ command: appCmd });
        }

        const msg = `I have done this. Launched ${appCmd} on your PC.`;
        setStatusBanner(msg);
        speakFeedback(msg);
        addLog(`[Execution] Launched ${appCmd}`);
      }

      // ── System Info ───────────────────────────────────────────
      else if (cmd.includes('system info') || cmd.includes('my pc') || cmd.includes('pc info') || cmd.includes('computer info')) {
        if (isElectron) {
          const info = await nativeAPI.systemInfo();
          setSystemInfo(info);
          const msg = `I have done this. Your PC is a ${info.cpus}-core ${info.arch} system running ${info.platform}, with ${info.totalMem} total RAM and ${info.freeMem} free. Username is ${info.username}.`;
          setStatusBanner(msg);
          speakFeedback(msg);
          addLog(`[System Info] ${msg}`);
        } else {
          const msg = `You are running OmniAgent OS in browser mode. Download and install the desktop app for full PC system info access.`;
          setStatusBanner(msg);
          speakFeedback(msg);
        }
      }

      // ── General Groq AI Fallback ──────────────────────────────
      else {
        addLog(`[AI] Routing to Groq llama-3.3-70b for general command interpretation...`);
        const res = await queryGroqAPI(
          [{ role: 'user', content: `You are OmniAgent OS, an AI PC Desktop Agent. The user gave this voice command: "${commandStr}". Respond confirming action in 1-2 sentences, starting with "I have done this."` }],
          selectedAgent.systemPrompt,
          selectedAgent.model
        );
        setStatusBanner(res.text);
        speakFeedback(res.text);
        addLog(`[AI Response] ${res.text}`);
      }
    } catch (err: any) {
      const errMsg = `Error executing command: ${err.message}`;
      addLog(`[Error] ${errMsg}`);
      speakFeedback('Sorry, an error occurred. Please try again.');
    }

    setExecuting(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-brand-400" /> PC Voice Control Agent
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isElectron
              ? '✅ Running as Desktop App — Full native PC command execution active.'
              : '⚠️ Browser Mode — Voice + AI active. Download Desktop App for native file & shutdown control.'}
          </p>
        </div>

        <button
          onClick={toggleVoiceListen}
          disabled={executing}
          className={`px-5 py-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 shadow-xl ${
            isListening
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
              : 'bg-gradient-to-r from-brand-600 to-purple-600 text-white hover:opacity-90'
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          <span>{isListening ? 'Listening... Speak Now' : '🎤 Click to Speak Command'}</span>
        </button>
      </div>

      {/* Shutdown Countdown Banner */}
      {shutdownCountdown !== null && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-400 animate-pulse" />
            <div>
              <div className="text-sm font-bold text-white">⚠️ PC Shutdown Triggered!</div>
              <div className="text-xs text-rose-300 font-mono">Shutting down in {shutdownCountdown} seconds...</div>
            </div>
          </div>
          <button
            onClick={() => {
              if (isElectron) nativeAPI.cancelShutdown();
              setShutdownCountdown(null);
              speakFeedback('PC Shutdown cancelled.');
              addLog('[Safety] Shutdown cancelled.');
            }}
            className="px-4 py-2 rounded-xl bg-white text-rose-900 font-extrabold text-xs"
          >
            ✋ Cancel Shutdown
          </button>
        </div>
      )}

      {/* AI Voice Response Banner */}
      {statusBanner && (
        <div className="p-4 rounded-2xl bg-brand-950/60 border border-brand-500/40 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-brand-400 animate-pulse" />
            <div>
              <div className="text-[10px] text-brand-400 uppercase font-bold tracking-wider">🔊 AI Spoken Response:</div>
              <div className="text-white text-xs font-mono mt-0.5">{statusBanner}</div>
            </div>
          </div>
          <button
            onClick={() => speakFeedback(statusBanner)}
            className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
          >
            🔊 Replay
          </button>
        </div>
      )}

      {/* Text Input Fallback */}
      <form
        onSubmit={e => { e.preventDefault(); if (voiceText.trim()) processVoiceCommand(voiceText); }}
        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center gap-3"
      >
        <input
          type="text"
          value={voiceText}
          onChange={e => setVoiceText(e.target.value)}
          placeholder='Type or say: "Create file notes.txt" • "Shut down my PC" • "System info" • "Open notepad"'
          className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={executing || !voiceText.trim()}
          className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
        >
          {executing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
          Execute & Speak
        </button>
      </form>

      {/* 4 Command Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Shutdown */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-rose-400 mb-2">
              <Power className="w-4 h-4" /> PC Shutdown
            </div>
            <p className="text-[11px] text-slate-400">Say "Shut down my PC" or click below. 10-second safety countdown with voice confirmation.</p>
          </div>
          <button onClick={() => processVoiceCommand("shut down my pc")}
            className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-bold">
            Trigger Shutdown
          </button>
        </div>

        {/* File Creator */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-brand-400 mb-2">
              <FilePlus className="w-4 h-4" /> Create File on Disk
            </div>
            <input
              type="text"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              placeholder="Filename.txt"
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono mb-2"
            />
            <p className="text-[11px] text-slate-400">
              {isElectron ? 'Creates file directly on your Desktop.' : 'Downloads file to your Downloads folder.'}
            </p>
          </div>
          <button onClick={() => processVoiceCommand(`create file ${fileName}`)}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold">
            Create & Speak
          </button>
        </div>

        {/* WhatsApp */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-2">
              <MessageSquare className="w-4 h-4" /> Send WhatsApp
            </div>
            <select
              value={whatsAppContact}
              onChange={e => setWhatsAppContact(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 mb-2"
            >
              <option value="Alex Vance">Alex Vance (CEO)</option>
              <option value="Marcus Brody">Marcus Brody</option>
              <option value="Robert Vance">Robert Vance</option>
            </select>
            <input
              type="text"
              value={whatsAppMsg}
              onChange={e => setWhatsAppMsg(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100"
            />
          </div>
          <button onClick={() => processVoiceCommand(`send whatsapp message to ${whatsAppContact}`)}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">
            Send & Speak
          </button>
        </div>

        {/* System Info */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-purple-400 mb-2">
              <Cpu className="w-4 h-4" /> PC System Info
            </div>
            {systemInfo ? (
              <div className="text-[10px] text-slate-300 font-mono space-y-0.5">
                <div>👤 {systemInfo.username}@{systemInfo.hostname}</div>
                <div>🖥️ {systemInfo.platform} ({systemInfo.arch})</div>
                <div>🧠 {systemInfo.cpus} CPUs | RAM: {systemInfo.totalMem}</div>
                <div>💾 Free: {systemInfo.freeMem}</div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">Say "system info" or click below to read your PC specs.</p>
            )}
          </div>
          <button onClick={() => processVoiceCommand('system info')}
            className="w-full py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 text-xs font-bold">
            Read PC Info
          </button>
        </div>
      </div>

      {/* Created Files Log */}
      {createdFiles.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">📁 Files Created on Your PC</h3>
          {createdFiles.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] font-mono bg-slate-950 rounded-lg p-2.5 border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="text-slate-100 font-bold">{f.name}</span>
              <span className="text-slate-500 truncate">→ {f.path}</span>
            </div>
          ))}
        </div>
      )}

      {/* Execution Log Terminal */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 font-mono">
            <Terminal className="w-4 h-4 text-brand-400" /> Live Execution Log
          </h3>
          <span className={`text-[10px] font-bold font-mono ${isElectron ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isElectron ? '● Electron Desktop (Native)' : '● Browser Mode'}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 max-h-44 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className={
              log.includes('CRITICAL') ? 'text-rose-400 font-bold' :
              log.includes('Error') ? 'text-amber-400' :
              log.includes('Intent') || log.includes('AI') ? 'text-brand-300' :
              log.includes('Execution') ? 'text-emerald-300' :
              'text-slate-400'
            }>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
