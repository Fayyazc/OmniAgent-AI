import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { queryGroqAPI } from '../services/groqApi';
import { 
  PhoneCall, PhoneOff, Mic, Volume2, Sparkles, 
  UserCheck, Play, Pause, Activity, CheckCircle2, RefreshCw
} from 'lucide-react';

export const VoiceAIView: React.FC = () => {
  const { selectedAgent, callLogs } = useApp();

  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 492-9012');
  const [liveTranscript, setLiveTranscript] = useState<{ speaker: string; text: string }[]>([]);
  const [summary, setSummary] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);

  useEffect(() => {
    let interval: any;
    if (callActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [callActive]);

  const startCall = () => {
    setCallActive(true);
    setLiveTranscript([
      { speaker: `${selectedAgent.name} (AI)`, text: `Hello! This is ${selectedAgent.name} from OmniAgent AI. How may I assist you with your subscription or business scheduling today?` }
    ]);
  };

  const endCall = async () => {
    setCallActive(false);
    setGeneratingSummary(true);

    const fullText = liveTranscript.map(t => `${t.speaker}: ${t.text}`).join('\n');
    const result = await queryGroqAPI(
      [{ role: 'user', content: `Provide an executive call summary and action items for this phone call transcript:\n${fullText}` }],
      selectedAgent.systemPrompt,
      selectedAgent.model
    );

    setSummary(result.text);
    setGeneratingSummary(false);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-brand-400" /> Voice AI Call Studio & Automatic Dialer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate real-time inbound & outbound AI calls, live transcription, sentiment analysis & automated follow-ups.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Call Control Panel */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
              Outbound Dialer Console
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-400">Assigned AI Agent</div>
              <div className="font-bold text-slate-100 flex items-center gap-2">
                <img src={selectedAgent.avatar} alt={selectedAgent.name} className="w-5 h-5 rounded-full object-cover" />
                {selectedAgent.name} ({selectedAgent.voiceProfile})
              </div>
            </div>

            {/* Audio Waveform Simulator */}
            {callActive && (
              <div className="p-4 rounded-xl bg-brand-950/40 border border-brand-500/30 flex flex-col items-center justify-center space-y-2">
                <div className="flex items-center gap-1">
                  {[...Array(12)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1 bg-brand-400 rounded-full animate-pulse"
                      style={{
                        height: `${Math.floor(Math.random() * 24) + 8}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                <div className="text-xs font-mono font-bold text-brand-300">
                  Call Active • {formatTime(callDuration)}
                </div>
              </div>
            )}
          </div>

          <div>
            {!callActive ? (
              <button
                onClick={startCall}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <PhoneCall className="w-4 h-4" /> Start AI Voice Call
              </button>
            ) : (
              <button
                onClick={endCall}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:opacity-90 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
              >
                <PhoneOff className="w-4 h-4" /> End Call & Summarize
              </button>
            )}
          </div>
        </div>

        {/* Live Call Transcript & Summary */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" /> Live Transcript Stream
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">STT Voice Engine: Active</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 h-48 overflow-y-auto space-y-2">
              {liveTranscript.length > 0 ? (
                liveTranscript.map((t, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="font-bold text-brand-400">{t.speaker}: </span>
                    <span className="text-slate-300">{t.text}</span>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                  No active call stream. Click "Start AI Voice Call" to simulate an outbound voice conversation.
                </div>
              )}
            </div>

            {/* AI Summary Box */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> Groq AI Call Summary
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans min-h-[90px]">
                {generatingSummary ? (
                  <div className="flex items-center gap-2 text-slate-400">
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-400" />
                    <span>Analyzing sentiment and building action items...</span>
                  </div>
                ) : summary ? (
                  summary
                ) : (
                  <span className="text-slate-500">Summary will automatically generate when call concludes.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
