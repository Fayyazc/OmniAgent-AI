import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WorkflowNode } from '../types';
import { 
  GitBranch, Play, Plus, Trash2, ArrowDown, CheckCircle2, 
  RefreshCw, Sparkles, Mail, FileText, Bell, Database, Zap
} from 'lucide-react';

export const WorkflowBuilderView: React.FC = () => {
  const { selectedAgent } = useApp();

  const [workflowName, setWorkflowName] = useState('New Customer Order & Invoice Automation');
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: 'n1', type: 'trigger', title: 'New Customer Order Received', desc: 'Webhook Trigger from Stripe or E-Commerce Store', icon: 'Zap' },
    { id: 'n2', type: 'decision', title: 'Groq AI Order Analysis', desc: 'Evaluate line items, taxes, discounts, and customer tier', icon: 'Sparkles' },
    { id: 'n3', type: 'action', title: 'Generate PDF Invoice', desc: 'Auto-create invoice PDF document via Document Suite', icon: 'FileText' },
    { id: 'n4', type: 'action', title: 'Send Automated Email to Client', desc: 'Dispatch invoice PDF attachment via GSuite/Outlook', icon: 'Mail' },
    { id: 'n5', type: 'notification', title: 'Notify Team on Slack', desc: 'Post order summary & revenue metrics to #sales channel', icon: 'Bell' },
  ]);

  const prebuiltWorkflows = [
    {
      name: 'Customer Order → PDF Invoice → Email → Slack',
      nodes: [
        { id: 'n1', type: 'trigger', title: 'New Order Received', desc: 'Stripe Webhook', icon: 'Zap' },
        { id: 'n2', type: 'decision', title: 'AI Tax & Discount Calculation', desc: 'Groq Reasoning', icon: 'Sparkles' },
        { id: 'n3', type: 'action', title: 'Generate PDF Invoice', desc: 'Document Suite', icon: 'FileText' },
        { id: 'n4', type: 'action', title: 'Email PDF to Client', desc: 'Email Assistant', icon: 'Mail' },
        { id: 'n5', type: 'notification', title: 'Post Slack Alert', desc: 'Slack Bot Gateway', icon: 'Bell' }
      ]
    },
    {
      name: 'Inbound Call → STT Transcript → Summary → Calendar',
      nodes: [
        { id: 'n1', type: 'trigger', title: 'Inbound Phone Call Ended', desc: 'Voice AI Dialer', icon: 'Zap' },
        { id: 'n2', type: 'decision', title: 'Groq Speech Summary', desc: 'Extract Action Items', icon: 'Sparkles' },
        { id: 'n3', type: 'action', title: 'Schedule Follow-Up Event', desc: 'Smart Calendar', icon: 'FileText' },
        { id: 'n4', type: 'notification', title: 'Send Mobile Notification', desc: 'Desktop Tray Agent', icon: 'Bell' }
      ]
    }
  ];

  const handleRunWorkflow = () => {
    setIsExecuting(true);
    setActiveStepIndex(0);

    nodes.forEach((_, idx) => {
      setTimeout(() => {
        setActiveStepIndex(idx);
        if (idx === nodes.length - 1) {
          setTimeout(() => {
            setIsExecuting(false);
            setActiveStepIndex(null);
            alert(`Workflow "${workflowName}" executed successfully across 5 nodes!`);
          }, 800);
        }
      }, (idx + 1) * 900);
    });
  };

  const addNode = (type: WorkflowNode['type']) => {
    const newNode: WorkflowNode = {
      id: `n_${Date.now()}`,
      type,
      title: `Custom ${type.toUpperCase()} Step`,
      desc: 'Configured by Workflow Builder',
      icon: type === 'trigger' ? 'Zap' : type === 'decision' ? 'Sparkles' : type === 'action' ? 'FileText' : 'Bell'
    };
    setNodes(prev => [...prev, newNode]);
  };

  const removeNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
  };

  const nodeColors: Record<WorkflowNode['type'], { bg: string; text: string; border: string }> = {
    trigger: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    decision: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
    action: { bg: 'bg-brand-500/10', text: 'text-brand-400', border: 'border-brand-500/30' },
    notification: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-brand-400" /> Visual Drag-and-Drop Workflow Builder
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build autonomous node automations: Trigger → AI Decision → Action → Notification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunWorkflow}
            disabled={isExecuting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs hover:shadow-lg transition-all flex items-center gap-2"
          >
            {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isExecuting ? 'Executing Nodes...' : 'Test Run Workflow'}</span>
          </button>
        </div>
      </div>

      {/* Preset Workflow Template Selector */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-300">Preset Automation Templates:</span>
        <div className="flex items-center gap-2 overflow-x-auto">
          {prebuiltWorkflows.map((tmpl, i) => (
            <button
              key={i}
              onClick={() => {
                setWorkflowName(tmpl.name);
                setNodes(tmpl.nodes as any);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold whitespace-nowrap border border-slate-700 transition-all"
            >
              {tmpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nodes Flow List */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-sm font-extrabold text-white bg-transparent border-none focus:outline-none w-full"
            />
            <span className="text-xs text-brand-400 font-mono font-bold whitespace-nowrap">{nodes.length} Steps</span>
          </div>

          <div className="space-y-3">
            {nodes.map((node, index) => {
              const active = activeStepIndex === index;
              const completed = activeStepIndex !== null && activeStepIndex > index;
              const style = nodeColors[node.type];

              return (
                <React.Fragment key={node.id}>
                  <div
                    className={`p-4 rounded-xl border transition-all relative ${style.bg} ${
                      active ? 'border-brand-400 ring-2 ring-brand-500/40 shadow-xl scale-[1.02]' : completed ? 'border-emerald-500/50 opacity-90' : style.border
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${style.text}`}>
                          {node.type}
                        </span>
                        <h4 className="text-xs font-bold text-white">{node.title}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {active && (
                          <span className="text-[10px] text-brand-300 font-mono font-bold animate-pulse flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Executing
                          </span>
                        )}
                        {completed && (
                          <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        )}
                        <button
                          onClick={() => removeNode(node.id)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1">{node.desc}</p>
                  </div>

                  {index < nodes.length - 1 && (
                    <div className="flex justify-center my-1">
                      <ArrowDown className="w-4 h-4 text-slate-600" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Add Nodes Palette */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
              Add Workflow Nodes
            </h3>

            <div className="space-y-2">
              {[
                { type: 'trigger' as const, label: 'Trigger Node', desc: 'Webhook, Order, Phone Call' },
                { type: 'decision' as const, label: 'AI Decision Node', desc: 'Groq LLM Reasoning & Filter' },
                { type: 'action' as const, label: 'Action Node', desc: 'PDF, Email, CRM Update' },
                { type: 'notification' as const, label: 'Notification Node', desc: 'Slack, WhatsApp, Desktop Tray' },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={() => addNode(btn.type)}
                  className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-slate-100 group-hover:text-brand-400">{btn.label}</div>
                  <div className="text-[10px] text-slate-400">{btn.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">Assigned AI Employee</div>
            <div className="text-brand-400 font-bold">{selectedAgent.name} ({selectedAgent.model})</div>
          </div>
        </div>
      </div>
    </div>
  );
};
