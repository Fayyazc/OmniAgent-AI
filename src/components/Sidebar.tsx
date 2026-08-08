import React from 'react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';
import { 
  LayoutDashboard, UserPlus, MessageSquareCode, FileText, 
  FolderKanban, Mail, MessageCircle, PhoneCall, Sparkles, 
  Calendar, CheckSquare, Database, Download, ShoppingBag, 
  CreditCard, ShieldCheck, Sliders, Cpu, Activity, Terminal,
  GitBranch, Brain, Plug
} from 'lucide-react';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
  adminOnly?: boolean;
}

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, userRole } = useApp();

  const mainNav: NavItem[] = [
    { id: 'os_dashboard', label: 'OS Control Center', icon: LayoutDashboard, badge: 'OS v2.4' },
    { id: 'workflow_builder', label: 'Workflow Builder', icon: GitBranch, badge: 'Nodes' },
    { id: 'ai_memory', label: 'AI Memory Studio', icon: Brain },
    { id: 'pc_voice_agent', label: 'PC Voice Automation', icon: Terminal },
    { id: 'ai_chat', label: 'AI Chat Studio', icon: MessageSquareCode },
    { id: 'document_generator', label: 'Document Suite', icon: FileText },
    { id: 'file_manager', label: 'File Vault & OCR', icon: FolderKanban },
    { id: 'email_assistant', label: 'Email Assistant', icon: Mail },
    { id: 'messaging_assistant', label: 'Business Messaging', icon: MessageCircle },
    { id: 'voice_ai', label: 'Voice AI Dialer', icon: PhoneCall },
    { id: 'content_creator', label: 'Content Generator', icon: Sparkles },
    { id: 'calendar', label: 'Smart Calendar', icon: Calendar },
    { id: 'task_management', label: 'AI Kanban Tasks', icon: CheckSquare },
    { id: 'knowledge_base', label: 'Knowledge Base (RAG)', icon: Database },
    { id: 'integrations', label: 'Apps & Plugins', icon: Plug },
  ];

  const secondaryNav: NavItem[] = [
    { id: 'downloads', label: 'Download Desktop/App', icon: Download },
    { id: 'marketplace', label: 'Skills Marketplace', icon: ShoppingBag },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'security', label: 'Security & OAuth', icon: ShieldCheck },
    { id: 'admin_panel', label: 'Super Admin Panel', icon: Sliders, adminOnly: true },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/90 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto select-none">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-base font-extrabold text-white tracking-wide flex items-center gap-1">
              OmniAgent <span className="text-brand-400">OS</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-tighter">
              Groq Powered • Digital Employee
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Autonomous OS Operations
          </div>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                  active
                    ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md shadow-brand-600/25 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-brand-400/20 text-brand-300 border border-brand-400/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Platform & Governance
          </div>
          {secondaryNav.map((item) => {
            if (item.adminOnly && userRole !== 'super_admin') return null;
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                  active
                    ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md shadow-brand-600/25 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-slate-300">OmniAgent OS Engine</span>
          </div>
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>
    </aside>
  );
};
