import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { User, Briefcase, Tag, Building2, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { UserProfile } from '../lib/types';
import { api } from '../lib/api';

const INDUSTRIES = ['AI/ML', 'Fintech', 'SaaS', 'Healthcare', 'E-commerce', 'Crypto/Web3', 'Climate', 'Enterprise'];
const ROLES = ['Founder/CEO', 'Chief of Staff', 'PM/Product', 'Engineering Lead', 'Ops/BizOps', 'Investor/VC', 'Strategy', 'Marketing'];
const TONES = [
  { value: 'executive', label: 'Executive', desc: 'Crisp, direct, no fluff' },
  { value: 'casual', label: 'Casual', desc: 'Like a smart friend' },
  { value: 'technical', label: 'Technical', desc: 'Numbers and specifics' },
  { value: 'analytical', label: 'Analytical', desc: 'Strategy-focused' },
] as const;

export default function Onboarding() {
  const navigate = useNavigate();
  const { saveProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    uid: 'user-' + Date.now(),
    name: '',
    role: '',
    industry: '',
    topics: [],
    companies_tracked: [],
    sources_enabled: ['news', 'markets', 'industry'],
    tone: 'executive',
    length: 'medium',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    delivery_channel: 'app',
  });
  const [topicInput, setTopicInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');

  const addTopic = () => {
    if (topicInput.trim() && (profile.topics?.length || 0) < 10) {
      setProfile(p => ({ ...p, topics: [...(p.topics || []), topicInput.trim()] }));
      setTopicInput('');
    }
  };

  const addCompany = () => {
    if (companyInput.trim() && (profile.companies_tracked?.length || 0) < 10) {
      setProfile(p => ({ ...p, companies_tracked: [...(p.companies_tracked || []), companyInput.trim()] }));
      setCompanyInput('');
    }
  };

  const handleSave = () => {
    saveProfile(profile as UserProfile);
    navigate('/app');
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold tracking-tight">
          Set up your <span className="gradient-text">profile</span>
        </h1>
        <p className="text-muted mt-2 text-sm font-body">
          Tell us about your role so we can personalize your morning brief.
        </p>
      </motion.div>

      {/* Progress */}
      <div className="flex gap-1.5 mt-8 mb-10">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-accent-lime' : 'bg-surface-3'}`}
          />
        ))}
      </div>

      {/* Step 0: Identity */}
      {step === 0 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <User className="w-4 h-4 text-muted" /> Name
            </label>
            <input
              value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent-lime/40 transition-colors font-body"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted" /> Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => (
                <button
                  key={r}
                  onClick={() => setProfile(p => ({ ...p, role: r }))}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-body transition-all ${
                    profile.role === r
                      ? 'border-accent-lime/40 bg-accent-lime/10 text-accent-lime'
                      : 'border-border bg-surface-2 text-zinc-400 hover:border-zinc-600 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted" /> Industry
            </label>
            <div className="grid grid-cols-2 gap-2">
              {INDUSTRIES.map(ind => (
                <button
                  key={ind}
                  onClick={() => setProfile(p => ({ ...p, industry: ind }))}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-body transition-all ${
                    profile.industry === ind
                      ? 'border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan'
                      : 'border-border bg-surface-2 text-zinc-400 hover:border-zinc-600 hover:text-white'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(1)}
            disabled={!profile.name || !profile.role || !profile.industry}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-lime text-surface-0 font-display font-semibold text-sm hover:bg-accent-lime/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Step 1: Interests */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted" /> Topics you follow
            </label>
            <div className="flex gap-2">
              <input
                value={topicInput}
                onChange={e => setTopicInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTopic()}
                placeholder="e.g. LLMs, fundraising, product-market fit"
                className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent-lime/40 transition-colors font-body text-sm"
              />
              <button onClick={addTopic} className="px-4 py-3 rounded-xl bg-surface-3 hover:bg-surface-4 text-sm font-medium transition-colors">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.topics?.map((t, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-accent-lime/10 border border-accent-lime/20 text-accent-lime text-xs font-mono flex items-center gap-1.5">
                  {t}
                  <button onClick={() => setProfile(p => ({ ...p, topics: p.topics?.filter((_, j) => j !== i) }))} className="hover:text-white">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted" /> Companies to track
            </label>
            <div className="flex gap-2">
              <input
                value={companyInput}
                onChange={e => setCompanyInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCompany()}
                placeholder="e.g. OpenAI, Stripe, Anthropic"
                className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent-cyan/40 transition-colors font-body text-sm"
              />
              <button onClick={addCompany} className="px-4 py-3 rounded-xl bg-surface-3 hover:bg-surface-4 text-sm font-medium transition-colors">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.companies_tracked?.map((c, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-mono flex items-center gap-1.5">
                  {c}
                  <button onClick={() => setProfile(p => ({ ...p, companies_tracked: p.companies_tracked?.filter((_, j) => j !== i) }))} className="hover:text-white">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="px-6 py-3 rounded-xl bg-surface-3 hover:bg-surface-4 text-sm font-medium transition-colors">Back</button>
            <button
              onClick={() => setStep(2)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-lime text-surface-0 font-display font-semibold text-sm hover:bg-accent-lime/90 transition-colors"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Preferences */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-muted" /> Brief tone
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setProfile(p => ({ ...p, tone: t.value }))}
                  className={`px-4 py-3 rounded-xl border text-left transition-all ${
                    profile.tone === t.value
                      ? 'border-accent-violet/40 bg-accent-violet/10'
                      : 'border-border bg-surface-2 hover:border-zinc-600'
                  }`}
                >
                  <p className={`text-sm font-medium ${profile.tone === t.value ? 'text-accent-violet' : 'text-zinc-300'}`}>{t.label}</p>
                  <p className="text-xs text-muted mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Brief length</label>
            <div className="grid grid-cols-3 gap-2">
              {(['short', 'medium', 'detailed'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setProfile(p => ({ ...p, length: l }))}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-body capitalize transition-all ${
                    profile.length === l
                      ? 'border-accent-lime/40 bg-accent-lime/10 text-accent-lime'
                      : 'border-border bg-surface-2 text-zinc-400 hover:border-zinc-600 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Profile summary */}
          <div className="glass-card p-5 space-y-3 gradient-border">
            <h4 className="text-sm font-display font-semibold text-zinc-300">Profile summary</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs font-mono">
              <span className="text-muted">Name</span><span>{profile.name}</span>
              <span className="text-muted">Role</span><span>{profile.role}</span>
              <span className="text-muted">Industry</span><span>{profile.industry}</span>
              <span className="text-muted">Topics</span><span>{profile.topics?.join(', ') || '—'}</span>
              <span className="text-muted">Tracking</span><span>{profile.companies_tracked?.join(', ') || '—'}</span>
              <span className="text-muted">Tone</span><span className="capitalize">{profile.tone}</span>
              <span className="text-muted">Length</span><span className="capitalize">{profile.length}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl bg-surface-3 hover:bg-surface-4 text-sm font-medium transition-colors">Back</button>
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-lime text-surface-0 font-display font-semibold text-sm hover:bg-accent-lime/90 transition-colors"
            >
              <Zap className="w-4 h-4" />
              Save & generate brief
            </button>
          </div>
        </motion.div>
      )}
    </main>
  );
}
