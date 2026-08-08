import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar as CalendarIcon, Clock, Plus, Users, Video, Globe } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { selectedAgent } = useApp();

  const [events, setEvents] = useState([
    { id: '1', title: 'Demo Call with TechCorp CEO', time: '10:00 AM - 10:45 AM', date: 'Today', attendees: ['David Miller (AI)', 'Robert Vance'], type: 'meeting' },
    { id: '2', title: 'Q3 AWS Cost Audit Review', time: '02:00 PM - 03:00 PM', date: 'Today', attendees: ['Sarah Connor (AI)', 'Alex Vance'], type: 'deadline' },
    { id: '3', title: 'Automated Stripe Settlement Sync', time: '05:00 PM', date: 'Tomorrow', attendees: ['System Bot'], type: 'reminder' }
  ]);

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('11:00 AM');
  const [showAdd, setShowAdd] = useState(false);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setEvents(prev => [
      ...prev,
      { id: String(Date.now()), title, time, date: 'Today', attendees: [`${selectedAgent.name} (AI)`], type: 'meeting' }
    ]);
    setTitle('');
    setShowAdd(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-brand-400" /> AI Executive Calendar & Meeting Scheduler
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Google Calendar & Outlook two-way sync with automated time zone detection and AI booking assistant.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold text-xs flex items-center gap-2 hover:shadow-lg transition-all w-fit"
        >
          <Plus className="w-4 h-4" /> Schedule AI Meeting
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddEvent} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting Topic or Deadline..."
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none"
            />
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400">Cancel</button>
            <button type="submit" className="px-4 py-1.5 rounded-lg bg-brand-600 text-xs text-white font-bold">Add Event</button>
          </div>
        </form>
      )}

      {/* Calendar View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-sm font-bold text-slate-200">August 2026</span>
            <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
              <Globe className="w-3.5 h-3.5 text-brand-400" /> UTC +05:00 (Auto-Detected)
            </div>
          </div>

          <div className="space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-100">{ev.title}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{ev.date} • {ev.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono px-2 py-1 rounded bg-slate-800">
                    {ev.attendees.join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sync Settings */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
            Connected Calendar Integrations
          </h3>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-200">Google Calendar</div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Connected</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-200">Microsoft Outlook 365</div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
