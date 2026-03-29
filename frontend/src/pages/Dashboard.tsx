import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, RefreshCw, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { MorningBrief, PipelineMetrics } from '../lib/types';
import BriefView from '../components/BriefView';
import MetricsPanel from '../components/MetricsPanel';
import LoadingBrief from '../components/LoadingBrief';
import { useProfile } from '../hooks/useProfile';

export default function Dashboard() {
  const { profile, hasCustomProfile } = useProfile();
  const [brief, setBrief] = useState<MorningBrief | null>(null);
  const [metrics, setMetrics] = useState<PipelineMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const generateBrief = async () => {
    setLoading(true);
    setError(null);
    setLoadingStage(0);

    const stageTimer = setInterval(() => {
      setLoadingStage((s) => Math.min(s + 1, 3));
    }, 3000);

    try {
      const res = hasCustomProfile
        ? await api.previewBrief(profile)
        : await api.generateDemo();
      setBrief(res.brief);
      setMetrics(res.metrics);
    } catch (e: any) {
      setError(e.message || 'Failed to generate brief');
    } finally {
      clearInterval(stageTimer);
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">
              Good morning
              <span className="gradient-text ml-1">.</span>
            </h1>
            <p className="text-muted mt-2 text-sm font-body">
              Your AI-powered intelligence brief, generated in seconds.
            </p>
          </div>

          <button
            onClick={generateBrief}
            disabled={loading}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-lime/10 hover:bg-accent-lime/20 border border-accent-lime/20 hover:border-accent-lime/40 text-accent-lime font-display font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Generate brief
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body"
        >
          {error}
        </motion.div>
      )}

      {loading && <LoadingBrief currentStage={loadingStage} />}

      {!loading && brief && metrics && (
        <div className="space-y-10">
          <BriefView brief={brief} />
          <div className="border-t border-border pt-8">
            <MetricsPanel metrics={metrics} />
          </div>
        </div>
      )}

      {!loading && !brief && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-surface-2 border border-border flex items-center justify-center mb-6">
            <Zap className="w-10 h-10 text-muted" />
          </div>
          <h2 className="font-display font-semibold text-xl text-zinc-300">No brief yet</h2>
          <p className="text-muted text-sm mt-2 mb-8 max-w-sm mx-auto font-body">
            Hit generate to run the 3-model pipeline and create your first personalized morning brief.
          </p>
          <button
            onClick={generateBrief}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-lime text-surface-0 font-display font-semibold text-sm hover:bg-accent-lime/90 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Generate your first brief
          </button>

          <div className="mt-12 flex justify-center gap-3">
            {[
              { name: 'Groq', desc: 'Extract', color: 'text-accent-orange border-accent-orange/20 bg-accent-orange/5' },
              { name: 'Gemini', desc: 'Score', color: 'text-accent-cyan border-accent-cyan/20 bg-accent-cyan/5' },
              { name: 'Claude', desc: 'Write', color: 'text-accent-violet border-accent-violet/20 bg-accent-violet/5' },
            ].map((m) => (
              <div key={m.name} className={`px-4 py-2 rounded-full border ${m.color} text-xs font-mono`}>
                {m.name} → {m.desc}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </main>
  );
}