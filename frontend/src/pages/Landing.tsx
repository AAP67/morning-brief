import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Cpu, Brain, PenTool, Clock, Coins, BarChart3 } from 'lucide-react';

const PIPELINE_STAGES = [
  {
    icon: Cpu,
    model: 'Groq',
    label: 'Extract & parse',
    desc: 'Llama 3.3 rapidly summarizes raw articles and extracts key entities from 30+ sources in parallel.',
    color: 'text-accent-orange',
    bg: 'bg-accent-orange/10',
    border: 'border-accent-orange/20',
    glow: 'shadow-[0_0_40px_-10px_rgba(251,146,60,0.15)]',
  },
  {
    icon: Brain,
    model: 'Gemini',
    label: 'Score & rank',
    desc: 'Gemini Flash scores every article against your professional profile — role, industry, topics, tracked companies.',
    color: 'text-accent-cyan',
    bg: 'bg-accent-cyan/10',
    border: 'border-accent-cyan/20',
    glow: 'shadow-[0_0_40px_-10px_rgba(34,211,238,0.15)]',
  },
  {
    icon: PenTool,
    model: 'Claude',
    label: 'Synthesize brief',
    desc: 'Claude weaves the top-ranked stories into a coherent, personalized morning brief matched to your preferred tone.',
    color: 'text-accent-violet',
    bg: 'bg-accent-violet/10',
    border: 'border-accent-violet/20',
    glow: 'shadow-[0_0_40px_-10px_rgba(167,139,250,0.15)]',
  },
];

const STATS = [
  { icon: Clock, value: '~30s', label: 'Generation time' },
  { icon: Coins, value: '<1¢', label: 'Cost per brief' },
  { icon: BarChart3, value: '35+', label: 'Sources scanned' },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-surface-0/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-lime/10 border border-accent-lime/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-accent-lime" />
            </div>
            <span className="font-display font-semibold text-lg tracking-tight">
              morning<span className="text-accent-lime">brief</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-white hover:bg-white/5 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/onboarding"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-lime text-surface-0 font-display font-semibold text-sm hover:bg-accent-lime/90 transition-colors"
            >
              Get started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Grid + glow background */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-radial from-accent-lime/[0.04] via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-border text-xs font-mono text-muted mb-8">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-accent-orange" />
                <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                <div className="w-2 h-2 rounded-full bg-accent-violet" />
              </div>
              Powered by 3 AI models
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight leading-[1.1]">
              Your morning intel,
              <br />
              <span className="gradient-text">generated in seconds</span>
            </h1>

            <p className="mt-6 text-lg text-zinc-400 font-body max-w-2xl mx-auto leading-relaxed">
              A multi-model AI pipeline that scans 35+ sources, scores them against your
              professional profile, and synthesizes a personalized morning brief — for less than a penny.
            </p>

            <div className="flex items-center justify-center gap-4 mt-10">
              <Link
                to="/onboarding"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-lime text-surface-0 font-display font-semibold text-sm hover:bg-accent-lime/90 transition-colors"
              >
                <Zap className="w-4 h-4" />
                Create your brief
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="https://github.com/AAP67/morning-brief"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-white/5 border border-border text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                View on GitHub
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-8 mt-16"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <stat.icon className="w-4 h-4 text-accent-lime" />
                  <span className="text-2xl font-display font-bold">{stat.value}</span>
                </div>
                <p className="text-xs text-muted font-mono mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Pipeline section */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-display font-bold tracking-tight">
              Three models, one brief
            </h2>
            <p className="mt-3 text-zinc-400 font-body">
              Each model does what it's best at — speed, reasoning, or writing.
            </p>
          </motion.div>

          <div className="space-y-6">
            {PIPELINE_STAGES.map((stage, i) => (
              <motion.div
                key={stage.model}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`glass-card p-6 border-l-2 ${stage.border} ${stage.glow} hover:bg-white/[0.02] transition-colors`}
              >
                <div className="flex items-start gap-5">
                  <div className={`w-12 h-12 rounded-xl ${stage.bg} flex items-center justify-center flex-shrink-0`}>
                    <stage.icon className={`w-6 h-6 ${stage.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full ${stage.bg} ${stage.color} border ${stage.border}`}>
                        Stage {i + 1}
                      </span>
                      <h3 className="font-display font-semibold text-lg">{stage.label}</h3>
                    </div>
                    <p className="text-sm text-zinc-400 font-body leading-relaxed">{stage.desc}</p>
                  </div>
                  <div className={`text-right flex-shrink-0`}>
                    <p className={`text-sm font-mono font-medium ${stage.color}`}>{stage.model}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Connector arrows */}
          <div className="flex justify-center my-2">
            <div className="w-px h-6 bg-border" />
          </div>
        </section>

        {/* Tech stack */}
        <section className="max-w-4xl mx-auto px-6 py-20 border-t border-border">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl font-display font-bold tracking-tight mb-4">Built with</h2>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {['Python', 'FastAPI', 'React', 'TypeScript', 'Tailwind', 'Framer Motion', 'Firebase', 'Groq SDK', 'Gemini API', 'Anthropic API'].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-full bg-white/5 border border-border text-sm font-mono text-zinc-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Final CTA */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card gradient-border p-12 text-center glow-lime"
          >
            <h2 className="text-3xl font-display font-bold tracking-tight">
              Ready for your first brief?
            </h2>
            <p className="mt-3 text-zinc-400 font-body">
              Set up your profile in 30 seconds. Your personalized brief is one click away.
            </p>
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-xl bg-accent-lime text-surface-0 font-display font-semibold hover:bg-accent-lime/90 transition-colors"
            >
              <Zap className="w-5 h-5" />
              Get started
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="max-w-4xl mx-auto px-6 py-10 border-t border-border text-center">
          <p className="text-xs text-muted font-mono">
            Built by Karan · Multi-model AI pipeline showcase
          </p>
        </footer>
      </div>
    </div>
  );
}