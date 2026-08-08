import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { queryGroqAPI } from '../services/groqApi';
import { ChatMessage } from '../types';
import { 
  Send, Bot, Mic, MicOff, Volume2, Paperclip, 
  Copy, Download, Sparkles, Brain, Check, RefreshCw, Cpu
} from 'lucide-react';

export const AIChatView: React.FC = () => {
  const { selectedAgent } = useApp();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      content: `Hello! I am ${selectedAgent.name}, your ${selectedAgent.title}. I am powered by Groq's high-speed Llama 3.3 model. How can I assist you with operations, documents, calls, or task management today?`,
      timestamp: '10:00 AM',
      reasoning: 'Model initialized with system prompt context and active workspace permissions.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const historyForApi = messages.map(m => ({
      role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
      content: m.content
    }));
    historyForApi.push({ role: 'user', content: userText });

    const response = await queryGroqAPI(
      historyForApi,
      selectedAgent.systemPrompt,
      selectedAgent.model
    );

    const aiMsg: ChatMessage = {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      content: response.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reasoning: response.reasoning,
      agentId: selectedAgent.id
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleSpeechInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser window. Using keyboard input mode.');
    }
  };

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const exportChat = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messages, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `OmniAgent_Chat_${selectedAgent.name}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col justify-between p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shadow-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={selectedAgent.avatar} alt={selectedAgent.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-500/40" />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-100">{selectedAgent.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-bold uppercase tracking-wider">
                {selectedAgent.department}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Cpu className="w-3.5 h-3.5 text-brand-400" /> {selectedAgent.model} • {selectedAgent.voiceProfile}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportChat}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
            title="Export Chat History"
          >
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4 space-y-2 shadow-lg relative ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
              }`}
            >
              {/* Reasoning Trace if AI */}
              {msg.sender === 'ai' && msg.reasoning && (
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2 mb-2 font-mono">
                  <Brain className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>{msg.reasoning}</span>
                </div>
              )}

              {/* Message Content */}
              <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {msg.content}
              </div>

              {/* Footer bar */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/10 mt-2">
                <span>{msg.timestamp}</span>
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeakText(msg.content)}
                      className="hover:text-brand-300 transition-colors p-1"
                      title="Read Aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.content)}
                      className="hover:text-brand-300 transition-colors p-1"
                      title="Copy text"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 w-fit text-xs text-slate-300">
            <RefreshCw className="w-4 h-4 text-brand-400 animate-spin" />
            <span>{selectedAgent.name} is reasoning with Groq LLM...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="relative shrink-0">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            title="Attach file or context"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSpeechInput}
            className={`p-2 rounded-xl transition-all ${
              isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Voice Speech to Text"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${selectedAgent.name} to draft documents, execute calls, analyze spreadsheets...`}
            className="flex-1 bg-transparent border-none text-slate-100 text-xs focus:outline-none placeholder-slate-500 px-2"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:opacity-90 disabled:opacity-40 text-white font-medium text-xs transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/20"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
