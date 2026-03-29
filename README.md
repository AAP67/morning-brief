# Morning Brief — Multi-Model AI Morning Brief Engine

A personalized morning brief generator that orchestrates **3 AI models** across a pipeline:

| Stage | Model | Purpose |
|-------|-------|---------|
| 1. Extract & Parse | **Groq** (Llama 3) | Fast, cheap summarization of raw articles |
| 2. Score & Rank | **Gemini** (Flash) | Relevance scoring against user profile |
| 3. Synthesize Brief | **Claude** (Sonnet) | Editorial writing — polished, personalized brief |

## Quick Start

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # Fill in your API keys
python main.py          # Starts on http://localhost:8000
```

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

## Architecture

```
Data Sources (NewsAPI, RSS, Yahoo Finance, HN, GitHub)
        │
        ▼
   ┌─────────────────────┐
   │  Stage 1: Groq      │  Extract summaries + entities
   │  (Llama 3 — fast)   │  Batched, ~200ms
   └─────────┬───────────┘
             │
   ┌─────────▼───────────┐     ┌──────────────┐
   │  Stage 2: Gemini    │◄────│ User Profile  │
   │  (Flash — scoring)  │     │ (Firebase)    │
   └─────────┬───────────┘     └──────────────┘
             │
   ┌─────────▼───────────┐
   │  Stage 3: Claude    │  Editorial synthesis
   │  (Sonnet — writing) │  Tone + length matched
   └─────────┬───────────┘
             │
             ▼
      Morning Brief → Firebase + Delivery
```

## Required API Keys

- **Groq**: https://console.groq.com
- **Google AI (Gemini)**: https://aistudio.google.com/apikey
- **Anthropic (Claude)**: https://console.anthropic.com
- **NewsAPI**: https://newsapi.org (free tier: 100 req/day)
- **Firebase**: Service account JSON from Firebase Console

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

## Stack

- **Backend**: Python, FastAPI, async pipeline
- **Models**: Groq, Gemini, Claude (multi-model orchestration)
- **Storage**: Firebase Firestore
- **Frontend**: React + Vite + Tailwind (coming soon)
