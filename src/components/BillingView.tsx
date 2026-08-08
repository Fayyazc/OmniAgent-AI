import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, Check, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const BillingView: React.FC = () => {
  const { currentUser } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [selectedPlanTitle, setSelectedPlanTitle] = useState('');

  const plans = [
    { name: 'Free', price: '$0', desc: 'Try OmniAgent AI with 1 basic employee.', features: ['1 AI Employee', '100 Groq LLM Messages/mo', 'Basic PDF Export', 'Community Support'] },
    { name: 'Starter', price: billingCycle === 'yearly' ? '$29' : '$39', desc: 'Ideal for solo entrepreneurs and freelancers.', features: ['3 AI Employees', '5,000 Groq LLM Messages/mo', 'Voice Call Simulator', 'PDF & Excel Generator', 'Email Assistant'] },
    { name: 'Professional', price: billingCycle === 'yearly' ? '$79' : '$99', desc: 'Best for small businesses and growing teams.', features: ['10 AI Employees', '25,000 Groq LLM Messages/mo', 'WhatsApp & Slack Bot Integrations', 'RAG Vector Store (50 MB)', 'Priority Groq Rate Limits'] },
    { name: 'Business', price: billingCycle === 'yearly' ? '$199' : '$249', popular: true, desc: 'Complete automation platform for mid-market.', features: ['Unlimited AI Employees', '100,000 Groq LLM Messages/mo', 'Outbound Voice Dialer & STT', 'Custom Knowledge Base RAG', 'Role-Based Access Control (RBAC)'] },
    { name: 'Enterprise', price: 'Custom', desc: 'Dedicated cloud infrastructure & SLA.', features: ['Unlimited Everything', 'Dedicated Groq Throughput', 'On-Prem / Private VPC Deployment', 'HIPAA & SOC 2 Vault', '24/7 Dedicated TAM Support'] },
  ];

  const handleSelectPlan = (planName: string) => {
    setSelectedPlanTitle(planName);
    setShowStripeModal(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-brand-400" /> Subscription Plans & Stripe Billing
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your OmniAgent AI SaaS tier, billing invoices, payment methods, and Groq usage caps.
          </p>
        </div>

        {/* Monthly / Yearly Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 w-fit">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              billingCycle === 'monthly' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              billingCycle === 'yearly' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Yearly (Save 20%)
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-slate-900/80 border transition-all flex flex-col justify-between space-y-4 relative ${
              plan.popular ? 'border-brand-500 shadow-xl shadow-brand-500/10 ring-1 ring-brand-500' : 'border-slate-800'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-brand-500 text-white text-[9px] font-bold uppercase tracking-wider">
                Most Popular
              </span>
            )}

            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-white">{plan.name}</h3>
              <div className="text-2xl font-black text-brand-400 font-mono">{plan.price}</div>
              <p className="text-[11px] text-slate-400">{plan.desc}</p>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan(plan.name)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                plan.name === 'Business'
                  ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white hover:opacity-90 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {plan.name === currentUser.plan ? 'Current Active Tier' : 'Upgrade Plan'}
            </button>
          </div>
        ))}
      </div>

      {/* Stripe Payment Modal Demo */}
      {showStripeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-400" /> Stripe Secure Checkout
              </h3>
              <button onClick={() => setShowStripeModal(false)} className="text-xs text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl text-xs space-y-1 border border-slate-800">
              <div className="text-slate-400">Selected Plan: <span className="font-bold text-white">{selectedPlanTitle} Tier</span></div>
              <div className="text-slate-400">Billing Cycle: <span className="font-bold text-brand-400 uppercase">{billingCycle}</span></div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cardholder Name</label>
                <input type="text" defaultValue={currentUser.name} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100" />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Card Number (Stripe Test)</label>
                <input type="text" defaultValue="4242 •••• •••• 4242" className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono" />
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Successfully processed Stripe payment for ${selectedPlanTitle} plan!`);
                setShowStripeModal(false);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs hover:shadow-lg transition-all"
            >
              Confirm Subscription Upgrade
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
