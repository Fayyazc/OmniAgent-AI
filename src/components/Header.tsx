import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Search, Bell, Sun, Moon, Sparkles, Shield, UserCheck, 
  Bot, ChevronDown, Check, Zap 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    userRole, setUserRole, theme, toggleTheme, 
    currentUser, selectedAgent, setSelectedAgent, 
    agents, setIsSearchOpen, notifications, markNotificationsRead 
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleColors: Record<UserRole, { bg: string; text: string; label: string }> = {
    super_admin: { bg: 'bg-purple-500/20 border-purple-500/30', text: 'text-purple-400', label: 'Super Admin' },
    business_owner: { bg: 'bg-blue-500/20 border-blue-500/30', text: 'text-blue-400', label: 'Business Owner' },
    team_member: { bg: 'bg-emerald-500/20 border-emerald-500/30', text: 'text-emerald-400', label: 'Team Member' },
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between">
      {/* Search trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-400 text-sm transition-all shadow-inner"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="flex-1 text-left hidden sm:inline">Search AI documents, emails, tasks...</span>
          <span className="flex-1 text-left sm:hidden">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-900 rounded border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-3">
        {/* Active AI Employee Selector */}
        <div className="relative">
          <button
            onClick={() => setShowAgentDropdown(!showAgentDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 hover:border-slate-600 transition-all text-xs font-medium"
          >
            <img src={selectedAgent.avatar} alt={selectedAgent.name} className="w-5 h-5 rounded-full object-cover border border-brand-500" />
            <span className="hidden md:inline text-slate-200">{selectedAgent.name}</span>
            <span className="px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 text-[10px] uppercase tracking-wider font-bold">
              AI
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showAgentDropdown && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Active AI Employee
              </div>
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => {
                    setSelectedAgent(agent);
                    setShowAgentDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                    selectedAgent.id === agent.id ? 'bg-brand-600/20 border border-brand-500/30' : 'hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={agent.avatar} alt={agent.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-medium text-slate-100">{agent.name}</div>
                      <div className="text-[10px] text-slate-400">{agent.department} Lead</div>
                    </div>
                  </div>
                  {selectedAgent.id === agent.id && <Check className="w-4 h-4 text-brand-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${roleColors[userRole].bg} ${roleColors[userRole].text}`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{roleColors[userRole].label}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Portal Perspective
              </div>
              {(['super_admin', 'business_owner', 'team_member'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setUserRole(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    userRole === r ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <span className="capitalize">{r.replace('_', ' ')}</span>
                  {userRole === r && <Check className="w-3.5 h-3.5 text-brand-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500 animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200">System Activity & Alerts</span>
                <button
                  onClick={markNotificationsRead}
                  className="text-[10px] text-brand-400 hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2 rounded-lg text-xs ${n.read ? 'bg-slate-950/40 text-slate-400' : 'bg-slate-800/80 text-slate-200 border-l-2 border-brand-500'}`}
                  >
                    <div className="font-medium">{n.title}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30" />
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-200">{currentUser.name}</div>
            <div className="text-[10px] text-slate-400">{currentUser.companyName}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
