import { motion } from 'framer-motion';
import { Clock, Coins, FileText, Filter } from 'lucide-react';
import { PipelineMetrics } from '../lib/types';
import ModelBadge from './ModelBadge';

interface MetricsPanelProps {
  metrics: PipelineMetrics;
}

function StatCard({ icon: Icon, label, value, accent }: {
  icon: any; label: string; value: string; accent: string;
}) {
  return (
    <div className="glass-card p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-muted font-medium uppercase tracking-wider">{label}</p>
        <p className="text-lg font-display font-semibold">{value}</p>
      </div>
    </div>
  );
}

export default function MetricsPanel({ metrics }: MetricsPanelProps) {
  const totalSeconds = (metrics.total_latency_ms / 1000).toFixed(1);
  const costCents = (metrics.total_estimated_cost * 100).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-sm text-muted uppercase tracking-wider">
          Pipeline metrics
        </h3>
        <div className="flex gap-1.5">
          <ModelBadge model="groq" stage="Extract" latency={metrics.stage_1_latency_ms} />
          <ModelBadge model="gemini" stage="Score" latency={metrics.stage_2_latency_ms} />
          <ModelBadge model="claude" stage="Write" latency={metrics.stage_3_latency_ms} />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Clock}
          label="Total time"
          value={`${totalSeconds}s`}
          accent="bg-accent-lime/10 text-accent-lime"
        />
        <StatCard
          icon={Coins}
          label="Cost"
          value={`${costCents}¢`}
          accent="bg-accent-cyan/10 text-accent-cyan"
        />
        <StatCard
          icon={FileText}
          label="Sources"
          value={`${metrics.articles_fetched}`}
          accent="bg-accent-orange/10 text-accent-orange"
        />
        <StatCard
          icon={Filter}
          label="After scoring"
          value={`${metrics.articles_after_scoring}`}
          accent="bg-accent-violet/10 text-accent-violet"
        />
      </div>

      {/* Pipeline bar */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-1 h-6 rounded-full overflow-hidden bg-surface-3">
          {[
            { width: metrics.stage_1_latency_ms, color: 'bg-accent-orange', label: 'Groq' },
            { width: metrics.stage_2_latency_ms, color: 'bg-accent-cyan', label: 'Gemini' },
            { width: metrics.stage_3_latency_ms, color: 'bg-accent-violet', label: 'Claude' },
          ].map((stage, i) => {
            const pct = Math.max((stage.width / metrics.total_latency_ms) * 100, 2);
            return (
              <motion.div
                key={i}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.5 + i * 0.15, duration: 0.6, ease: 'easeOut' }}
                className={`h-full ${stage.color} rounded-full relative group cursor-default`}
                title={`${stage.label}: ${(stage.width / 1000).toFixed(1)}s`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs font-mono text-muted">
          <span>0s</span>
          <span>{totalSeconds}s</span>
        </div>
      </div>
    </motion.div>
  );
}
