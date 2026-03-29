import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const STAGES = [
  { label: 'Fetching sources', model: 'NewsAPI + RSS + HN', color: 'text-zinc-400' },
  { label: 'Extracting & parsing', model: 'Groq (Llama 3)', color: 'text-accent-orange' },
  { label: 'Scoring relevance', model: 'Gemini', color: 'text-accent-cyan' },
  { label: 'Writing your brief', model: 'Claude', color: 'text-accent-violet' },
];

interface LoadingBriefProps {
  currentStage?: number;
}

export default function LoadingBrief({ currentStage = 0 }: LoadingBriefProps) {
  return (
    <div className="space-y-8">
      {/* Animated header */}
      <div className="text-center space-y-4 py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 mx-auto rounded-xl bg-accent-lime/10 border border-accent-lime/20 flex items-center justify-center"
        >
          <Zap className="w-6 h-6 text-accent-lime" />
        </motion.div>
        <h2 className="font-display font-bold text-xl">Generating your brief</h2>
        <p className="text-sm text-muted">Running the 3-model pipeline</p>
      </div>

      {/* Pipeline stages */}
      <div className="max-w-md mx-auto space-y-3">
        {STAGES.map((stage, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.3 }}
            className="glass-card p-4 flex items-center gap-4"
          >
            <div className="relative">
              {i <= currentStage ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 rounded-full bg-accent-lime/20 flex items-center justify-center"
                >
                  <div className="w-3 h-3 rounded-full bg-accent-lime" />
                </motion.div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-surface-4" />
                </div>
              )}
              {i === currentStage && (
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 w-8 h-8 rounded-full bg-accent-lime/20"
                />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${i <= currentStage ? 'text-white' : 'text-muted'}`}>
                {stage.label}
              </p>
              <p className={`text-xs font-mono ${stage.color} opacity-70`}>{stage.model}</p>
            </div>
            {i < currentStage && (
              <span className="text-xs font-mono text-accent-lime">done</span>
            )}
            {i === currentStage && (
              <div className="shimmer-bg h-4 w-16 rounded" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Skeleton cards */}
      <div className="space-y-4 mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-6 space-y-3">
            <div className="shimmer-bg h-5 w-48 rounded" />
            <div className="shimmer-bg h-4 w-full rounded" />
            <div className="shimmer-bg h-4 w-3/4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
