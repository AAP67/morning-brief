from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RawArticle(BaseModel):
    """Raw article from a source, pre-processing."""
    title: str
    source: str
    url: str
    content: str
    published_at: Optional[str] = None
    category: str = "general"  # news | markets | industry


class ExtractedArticle(BaseModel):
    """Stage 1 output: Groq-extracted summary."""
    title: str
    source: str
    url: str
    summary: str                # 2-3 sentence summary
    key_entities: list[str]     # companies, people, technologies mentioned
    category: str
    published_at: Optional[str] = None


class ScoredArticle(BaseModel):
    """Stage 2 output: Gemini-scored relevance."""
    article: ExtractedArticle
    relevance_score: float      # 0.0 - 1.0
    relevance_reason: str       # why it matters to this user
    section_tag: str            # which brief section it belongs to


class BriefSection(BaseModel):
    """A section of the final brief."""
    title: str
    content: str
    source_urls: list[str] = []


class MorningBrief(BaseModel):
    """Stage 3 output: the final brief."""
    uid: str
    date: str
    greeting: str
    sections: list[BriefSection]
    sign_off: str
    generated_at: str = datetime.utcnow().isoformat()
    pipeline_meta: dict = {}    # latency, tokens, cost per stage


class PipelineMetrics(BaseModel):
    """Track performance across the pipeline."""
    stage_1_latency_ms: float = 0
    stage_1_tokens: int = 0
    stage_2_latency_ms: float = 0
    stage_2_tokens: int = 0
    stage_3_latency_ms: float = 0
    stage_3_tokens: int = 0
    total_latency_ms: float = 0
    articles_fetched: int = 0
    articles_after_scoring: int = 0
    total_estimated_cost: float = 0
