interface ModelBadgeProps {
  model: string;
  stage: string;
  latency?: number;
  tokens?: number;
}

const MODEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  groq: { bg: 'bg-accent-orange/10', text: 'text-accent-orange', border: 'border-accent-orange/20' },
  gemini: { bg: 'bg-accent-cyan/10', text: 'text-accent-cyan', border: 'border-accent-cyan/20' },
  claude: { bg: 'bg-accent-violet/10', text: 'text-accent-violet', border: 'border-accent-violet/20' },
};

export default function ModelBadge({ model, stage, latency, tokens }: ModelBadgeProps) {
  const key = model.toLowerCase().includes('groq') ? 'groq'
    : model.toLowerCase().includes('gemini') ? 'gemini'
    : 'claude';
  const colors = MODEL_COLORS[key];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${colors.bg} ${colors.border}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${colors.text} bg-current`} />
      <span className={`text-xs font-mono font-medium ${colors.text}`}>{stage}</span>
      {latency !== undefined && (
        <span className="text-xs font-mono text-muted">{(latency / 1000).toFixed(1)}s</span>
      )}
      {tokens !== undefined && (
        <span className="text-xs font-mono text-muted">{tokens.toLocaleString()} tok</span>
      )}
    </div>
  );
}
