import json
import time
import google.generativeai as genai
from models.brief import ExtractedArticle, ScoredArticle
from models.profile import UserProfile
from config import get_settings


SCORING_PROMPT = """You are a relevance scoring engine. Score each article's relevance to this professional's profile.

PROFESSIONAL PROFILE:
{profile}

ARTICLES:
{articles}

For each article, respond with a JSON array:
[{{
  "relevance_score": 0.0-1.0,
  "relevance_reason": "1 sentence why this matters to them",
  "section_tag": "one of: top_stories | market_moves | industry_signals | tracked_companies | worth_knowing"
}}]

Score higher if the article directly relates to their role, industry, tracked companies, or topics of interest.
Score lower for generic news with no professional relevance."""


async def score_articles(
    articles: list[ExtractedArticle],
    profile: UserProfile,
    min_score: float = 0.3,
) -> tuple[list[ScoredArticle], dict]:
    """
    Stage 2: Use Gemini to score article relevance against user profile.
    Returns (scored_articles, metrics) filtered by min_score.
    """
    settings = get_settings()
    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel(settings.gemini_model)

    scored = []
    metrics = {"latency_ms": 0, "tokens": 0}

    # Process in batches of 8 (Gemini handles larger context)
    batch_size = 8
    for i in range(0, len(articles), batch_size):
        batch = articles[i:i + batch_size]
        articles_text = "\n---\n".join(
            f"[{j}] {a.title} ({a.source})\nSummary: {a.summary}\nEntities: {', '.join(a.key_entities)}"
            for j, a in enumerate(batch)
        )

        start = time.time()
        try:
            response = model.generate_content(
                SCORING_PROMPT.format(
                    profile=profile.to_prompt_context(),
                    articles=articles_text,
                ),
                generation_config=genai.GenerationConfig(
                    temperature=0.2,
                    max_output_tokens=2000,
                    response_mime_type="application/json",
                ),
            )

            elapsed = (time.time() - start) * 1000
            metrics["latency_ms"] += elapsed
            # Gemini doesn't expose token counts the same way
            metrics["tokens"] += len(response.text) // 4  # rough estimate

            results = json.loads(response.text)
            if isinstance(results, dict):
                results = results.get("results", results.get("articles", []))

            for article, result in zip(batch, results):
                score = float(result.get("relevance_score", 0))
                if score >= min_score:
                    scored.append(ScoredArticle(
                        article=article,
                        relevance_score=score,
                        relevance_reason=result.get("relevance_reason", ""),
                        section_tag=result.get("section_tag", "worth_knowing"),
                    ))

        except Exception as e:
            print(f"[Stage 2 - Gemini] Batch error: {e}")
            # Fallback: include all with neutral score
            for article in batch:
                scored.append(ScoredArticle(
                    article=article,
                    relevance_score=0.5,
                    relevance_reason="Could not score",
                    section_tag="worth_knowing",
                ))

    # Sort by relevance, take top N
    scored.sort(key=lambda x: x.relevance_score, reverse=True)
    return scored[:settings.brief_max_sections * 3], metrics
