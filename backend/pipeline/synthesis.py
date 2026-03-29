import json
import time
from anthropic import AsyncAnthropic
from models.brief import ScoredArticle, MorningBrief, BriefSection
from models.profile import UserProfile, BriefTone, BriefLength
from config import get_settings
from datetime import datetime


TONE_INSTRUCTIONS = {
    BriefTone.EXECUTIVE: "Write like a sharp chief of staff briefing a CEO. Crisp, direct, no fluff. Lead with what matters.",
    BriefTone.CASUAL: "Write like a smart friend catching them up over coffee. Warm, conversational, with personality.",
    BriefTone.TECHNICAL: "Write for an engineer or technical leader. Include specifics, numbers, and technical context.",
    BriefTone.ANALYTICAL: "Write like a strategy analyst. Include implications, comparisons, and forward-looking takes.",
}

LENGTH_TARGETS = {
    BriefLength.SHORT: "Keep the entire brief under 300 words. Be ruthlessly concise.",
    BriefLength.MEDIUM: "Target ~600 words total. Balance depth with brevity.",
    BriefLength.DETAILED: "Go up to 1000 words. Provide deeper analysis and context.",
}


SYNTHESIS_PROMPT = """You are crafting a personalized morning brief for a professional.

PROFILE:
{profile}

TODAY'S DATE: {date}

TONE: {tone_instruction}
LENGTH: {length_instruction}

SCORED & RANKED ARTICLES (by relevance to this person):
{articles}

Write a morning brief with:
1. A short, personalized greeting (use their name and role context)
2. 3-5 sections, each with a bold title and 2-4 sentences synthesizing the relevant articles
3. A brief sign-off with one forward-looking thought

Group articles by their section_tag. Weave multiple sources into cohesive narratives — don't just list summaries.

Respond in JSON:
{{
  "greeting": "...",
  "sections": [
    {{"title": "...", "content": "...", "source_urls": ["..."]}}
  ],
  "sign_off": "..."
}}"""


async def synthesize_brief(
    scored_articles: list[ScoredArticle],
    profile: UserProfile,
) -> tuple[MorningBrief, dict]:
    """
    Stage 3: Use Claude to synthesize scored articles into a polished morning brief.
    Returns (brief, metrics).
    """
    settings = get_settings()
    client = AsyncAnthropic(api_key=settings.anthropic_api_key)
    metrics = {"latency_ms": 0, "tokens": 0}

    articles_text = "\n---\n".join(
        f"[{a.section_tag}] (relevance: {a.relevance_score:.2f}) {a.article.title}\n"
        f"Source: {a.article.source}\n"
        f"Summary: {a.article.summary}\n"
        f"Why it matters: {a.relevance_reason}\n"
        f"URL: {a.article.url}"
        for a in scored_articles
    )

    today = datetime.now().strftime("%A, %B %d, %Y")

    start = time.time()
    try:
        response = await client.messages.create(
            model=settings.claude_model,
            max_tokens=2000,
            messages=[{
                "role": "user",
                "content": SYNTHESIS_PROMPT.format(
                    profile=profile.to_prompt_context(),
                    date=today,
                    tone_instruction=TONE_INSTRUCTIONS[profile.tone],
                    length_instruction=LENGTH_TARGETS[profile.length],
                    articles=articles_text,
                ),
            }],
        )

        elapsed = (time.time() - start) * 1000
        metrics["latency_ms"] = elapsed
        metrics["tokens"] = response.usage.input_tokens + response.usage.output_tokens

        content = response.content[0].text
        # Strip markdown fences if present
        if content.startswith("```"):
            content = content.split("\n", 1)[1].rsplit("```", 1)[0]
        parsed = json.loads(content)

        brief = MorningBrief(
            uid=profile.uid,
            date=today,
            greeting=parsed["greeting"],
            sections=[BriefSection(**s) for s in parsed["sections"]],
            sign_off=parsed["sign_off"],
        )

        return brief, metrics

    except Exception as e:
        print(f"[Stage 3 - Claude] Error: {e}")
        # Fallback brief
        fallback = MorningBrief(
            uid=profile.uid,
            date=today,
            greeting=f"Good morning — here's what caught our eye today.",
            sections=[
                BriefSection(
                    title="Today's highlights",
                    content="\n".join(f"• {a.article.title} — {a.article.summary}" for a in scored_articles[:5]),
                    source_urls=[a.article.url for a in scored_articles[:5]],
                )
            ],
            sign_off="More tomorrow.",
        )
        return fallback, metrics
