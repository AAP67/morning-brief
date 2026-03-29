import { motion } from 'framer-motion';
import { ExternalLink, Bookmark, Share2 } from 'lucide-react';
import { MorningBrief } from '../lib/types';

interface BriefViewProps {
  brief: MorningBrief;
}

const SECTION_ACCENTS = [
  'border-l-accent-lime',
  'border-l-accent-cyan',
  'border-l-accent-violet',
  'border-l-accent-orange',
  'border-l-accent-pink',
];

export default function BriefView({ brief }: BriefViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Date + Actions */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted font-mono uppercase tracking-widest">{brief.date}</p>
          <h2 className="text-2xl font-display font-bold mt-1 gradient-text">Your morning brief</h2>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-colors" title="Bookmark">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-colors" title="Share">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 glow-lime"
      >
        <p className="text-lg font-body leading-relaxed text-zinc-200">{brief.greeting}</p>
      </motion.div>

      {/* Sections */}
      <div className="space-y-4">
        {brief.sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className={`glass-card p-6 border-l-2 ${SECTION_ACCENTS[i % SECTION_ACCENTS.length]} hover:bg-white/[0.02] transition-colors`}
          >
            <h3 className="font-display font-semibold text-base mb-3">{section.title}</h3>
            <p className="text-sm text-zinc-300 leading-relaxed font-body">{section.content}</p>

            {section.source_urls.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {section.source_urls.slice(0, 3).map((url, j) => {
                  let domain = '';
                  try { domain = new URL(url).hostname.replace('www.', ''); } catch { domain = 'source'; }
                  return (
                    <a
                      key={j}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-xs text-muted hover:text-white transition-colors font-mono"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {domain}
                    </a>
                  );
                })}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Sign-off */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-6"
      >
        <p className="text-sm text-muted italic font-body">{brief.sign_off}</p>
        <div className="mt-4 flex justify-center gap-1">
          {['groq', 'gemini', 'claude'].map((m, i) => (
            <div
              key={m}
              className={`w-2 h-2 rounded-full ${
                i === 0 ? 'bg-accent-orange' : i === 1 ? 'bg-accent-cyan' : 'bg-accent-violet'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted/50 mt-2 font-mono">powered by 3 models</p>
      </motion.div>
    </motion.div>
  );
}
