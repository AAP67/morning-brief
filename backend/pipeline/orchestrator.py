import asyncio
import time
from models.profile import UserProfile
from models.brief import MorningBrief, PipelineMetrics
from pipeline.ingestion import extract_articles
from pipeline.scoring import score_articles
from pipeline.synthesis import synthesize_brief
from sources.news import fetch_news
from sources.markets import fetch_market_data
from sources.industry import fetch_industry_signals


async def run_pipeline(profile: UserProfile) -> tuple[MorningBrief, PipelineMetrics]:
    """
    Execute the full 3-stage morning brief pipeline:
      1. Fetch sources → Groq extraction
      2. Gemini relevance scoring against profile
      3. Claude editorial synthesis

    Returns the final brief and pipeline performance metrics.
    """
    metrics = PipelineMetrics()
    pipeline_start = time.time()

    # ── Fetch from all enabled sources (parallel) ──
    fetch_tasks = []
    if "news" in profile.sources_enabled:
        fetch_tasks.append(fetch_news(profile.topics))
    if "markets" in profile.sources_enabled:
        fetch_tasks.append(fetch_market_data(profile.companies_tracked or None))
    if "industry" in profile.sources_enabled:
        fetch_tasks.append(fetch_industry_signals())

    source_results = await asyncio.gather(*fetch_tasks, return_exceptions=True)
    raw_articles = []
    for result in source_results:
        if isinstance(result, list):
            raw_articles.extend(result)
        elif isinstance(result, Exception):
            print(f"[Pipeline] Source fetch error: {result}")

    metrics.articles_fetched = len(raw_articles)
    print(f"[Pipeline] Fetched {len(raw_articles)} articles from {len(fetch_tasks)} sources")

    if not raw_articles:
        raise ValueError("No articles fetched from any source")

    # ── Stage 1: Groq extraction ──
    extracted, stage1_metrics = await extract_articles(raw_articles)
    metrics.stage_1_latency_ms = stage1_metrics["latency_ms"]
    metrics.stage_1_tokens = stage1_metrics["tokens"]
    print(f"[Pipeline] Stage 1 complete: {len(extracted)} extracted in {metrics.stage_1_latency_ms:.0f}ms")

    # ── Stage 2: Gemini scoring ──
    scored, stage2_metrics = await score_articles(extracted, profile)
    metrics.stage_2_latency_ms = stage2_metrics["latency_ms"]
    metrics.stage_2_tokens = stage2_metrics["tokens"]
    metrics.articles_after_scoring = len(scored)
    print(f"[Pipeline] Stage 2 complete: {len(scored)} relevant articles in {metrics.stage_2_latency_ms:.0f}ms")

    if not scored:
        raise ValueError("No articles passed relevance scoring")

    # ── Stage 3: Claude synthesis ──
    brief, stage3_metrics = await synthesize_brief(scored, profile)
    metrics.stage_3_latency_ms = stage3_metrics["latency_ms"]
    metrics.stage_3_tokens = stage3_metrics["tokens"]
    print(f"[Pipeline] Stage 3 complete: brief generated in {metrics.stage_3_latency_ms:.0f}ms")

    # ── Finalize ──
    metrics.total_latency_ms = (time.time() - pipeline_start) * 1000
    metrics.total_estimated_cost = _estimate_cost(metrics)
    brief.pipeline_meta = metrics.model_dump()

    print(f"[Pipeline] Total: {metrics.total_latency_ms:.0f}ms | Est. cost: ${metrics.total_estimated_cost:.4f}")
    return brief, metrics


def _estimate_cost(m: PipelineMetrics) -> float:
    """Rough cost estimate based on token counts and model pricing."""
    groq_cost = m.stage_1_tokens * 0.0000008      # ~$0.80/M tokens
    gemini_cost = m.stage_2_tokens * 0.0000005     # ~$0.50/M tokens (Flash)
    claude_cost = m.stage_3_tokens * 0.000003      # ~$3/M tokens (Sonnet)
    return groq_cost + gemini_cost + claude_cost
