# Morning Brief — Multi-Model AI Morning Brief Engine

A personalized morning brief generator that orchestrates **3 AI models** across a pipeline — each doing what it's best at — to deliver a tailored intelligence brief for any professional, for under a penny.

**[Live Demo](https://morning-brief-sandy.vercel.app)** · **[API](https://morning-brief-production-08d3.up.railway.app/health)**

---

## How It Works

| Stage | Model | Purpose | Avg Latency |
|-------|-------|---------|-------------|
| 1. Extract & Parse | **Groq** (Llama 3.3 70B) | Fast summarization of 35+ raw articles | ~8s |
| 2. Score & Rank | **Gemini** (3.1 Flash Lite) | Relevance scoring against user profile | ~12s |
| 3. Synthesize Brief | **Claude** (Sonnet) | Editorial writing — polished, personalized brief | ~16s |

**Total: ~35s | Cost: <1¢ per brief**

## Architecture

```
Data Sources (NewsAPI, RSS, Yahoo Finance, HN, GitHub)
        │  parallel fetch
        ▼
   ┌─────────────────────┐
   │  Stage 1: Groq      │  Extract summaries + entities
   │  (Llama 3.3 — fast) │  Batched in groups of 5
   └─────────┬───────────┘
             │
   ┌─────────▼───────────┐     ┌──────────────┐
   │  Stage 2: Gemini    │◄────│ User Profile  │
   │  (Flash — scoring)  │     │ (localStorage)│
   └─────────┬───────────┘     └──────────────┘
             │  top articles by relevance
   ┌─────────▼───────────┐
   │  Stage 3: Claude    │  Editorial synthesis
   │  (Sonnet — writing) │  Tone + length matched
   └─────────┬───────────┘
             │
             ▼
      Morning Brief → Dashboard + Metrics
```

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # Fill in your API keys
python main.py          # Starts on http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev             # Starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` to the backend automatically.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Service health + model config |
| `POST` | `/profiles` | Create/update user profile |
| `GET` | `/profiles/{uid}` | Get user profile |
| `POST` | `/briefs/generate/{uid}` | Generate brief for user |
| `POST` | `/briefs/preview` | Preview brief (no save) |
| `GET` | `/briefs/{uid}` | List past briefs |
| `POST` | `/demo/generate` | Demo brief (no Firebase needed) |

## Profile Schema

```json
{
  "uid": "user123",
  "name": "Karan",
  "role": "Chief of Staff",
  "industry": "AI/ML",
  "topics": ["LLMs", "fundraising", "product-market fit"],
  "companies_tracked": ["OpenAI", "Anthropic", "Stripe"],
  "tone": "executive",
  "length": "medium",
  "delivery_channel": "app"
}

```

Profiles support 4 tone options (executive, casual, technical, analytical) and 3 length settings (short, medium, detailed).

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Backend | Python, FastAPI, async pipeline |
| Models | Groq (Llama 3.3), Gemini (Flash Lite), Claude (Sonnet) |
| Deployment | Vercel (frontend), Railway (backend) |

## Required API Keys

| Service | Get a key | Notes |
|---------|-----------|-------|
| Groq | [console.groq.com](https://console.groq.com) | Free tier available |
| Google AI (Gemini) | [aistudio.google.com](https://aistudio.google.com/apikey) | Free tier available |
| Anthropic (Claude) | [console.anthropic.com](https://console.anthropic.com) | Pay-as-you-go |
| NewsAPI | [newsapi.org](https://newsapi.org) | Free tier: 100 req/day |

## License

MIT
