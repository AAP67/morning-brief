import json
import time
from groq import AsyncGroq
from models.brief import RawArticle, ExtractedArticle
from config import get_settings


EXTRACTION_PROMPT = """You are a news analyst. For each article below, extract a summary and entities.

Articles:
{articles}

Respond with ONLY this JSON (no other text):
{{"results": [{{"summary": "2 sentence summary", "key_entities": ["entity1", "entity2"]}}]}}

Return one object per article in the results array, in the same order."""


async def extract_articles(raw_articles: list[RawArticle]) -> tuple[list[ExtractedArticle], dict]:
    """
    Stage 1: Use Groq (Llama 3) to rapidly extract summaries and entities.
    Batches articles for efficiency.
    Returns (extracted_articles, metrics).
    """
    settings = get_settings()
    client = AsyncGroq(api_key=settings.groq_api_key)
    extracted = []
    metrics = {"latency_ms": 0, "tokens": 0}

    # Process in batches of 5
    batch_size = 5
    for i in range(0, len(raw_articles), batch_size):
        batch = raw_articles[i:i + batch_size]
        articles_text = "\n---\n".join(
            f"Title: {a.title}\nSource: {a.source}\nContent: {a.content[:500]}"
            for a in batch
        )

        start = time.time()
        try:
            response = await client.chat.completions.create(
                model=settings.groq_model,
                messages=[
                    {"role": "system", "content": "You extract article summaries. Always respond with valid JSON."},
                    {"role": "user", "content": EXTRACTION_PROMPT.format(articles=articles_text)},
                ],
                temperature=0.1,
                max_tokens=2000,
                response_format={"type": "json_object"},
            )

            elapsed = (time.time() - start) * 1000
            metrics["latency_ms"] += elapsed
            metrics["tokens"] += response.usage.total_tokens if response.usage else 0

            content = response.choices[0].message.content
            parsed = json.loads(content)

            # Handle both {"results": [...]} and [...] formats
            if isinstance(parsed, list):
                results = parsed
            elif isinstance(parsed, dict):
                results = parsed.get("results", parsed.get("articles", list(parsed.values())[0] if parsed else []))
            else:
                results = []

            for article, result in zip(batch, results):
                extracted.append(ExtractedArticle(
                    title=article.title,
                    source=article.source,
                    url=article.url,
                    summary=result.get("summary", article.content[:200]),
                    key_entities=result.get("key_entities", []),
                    category=article.category,
                    published_at=article.published_at,
                ))

        except Exception as e:
            print(f"[Stage 1 - Groq] Batch error: {e}")
            # Fallback: pass through without extraction
            for article in batch:
                extracted.append(ExtractedArticle(
                    title=article.title,
                    source=article.source,
                    url=article.url,
                    summary=article.content[:200],
                    key_entities=[],
                    category=article.category,
                    published_at=article.published_at,
                ))

    return extracted, metrics
