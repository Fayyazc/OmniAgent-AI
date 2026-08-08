import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Star, Download, Check, Sparkles, Plus } from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const { marketplaceItems, toggleInstallSkill } = useApp();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-brand-400" /> AI Skills & Automations Marketplace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Discover, install, or publish custom AI Skills, Prompt Packs, Document Templates & Integrations.
          </p>
        </div>

        <button
          onClick={() => alert('Developer Publishing Console: Submit your AI Skill or Template for review.')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold text-xs flex items-center gap-2 hover:shadow-lg transition-all w-fit"
        >
          <Plus className="w-4 h-4" /> Publish New AI Skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplaceItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-bold uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="text-xs font-bold text-white font-mono">{item.price}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-100">{item.title}</h3>
                <div className="text-[11px] text-slate-400">By {item.author}</div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.rating}
                </span>
                <span>• {item.downloads} installs</span>
              </div>

              <button
                onClick={() => toggleInstallSkill(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  item.installed
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-brand-600 hover:bg-brand-500 text-white'
                }`}
              >
                {item.installed ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Installed
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" /> Install Skill
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
