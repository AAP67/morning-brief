from pydantic import BaseModel
from typing import Optional
from enum import Enum


class BriefTone(str, Enum):
    EXECUTIVE = "executive"
    CASUAL = "casual"
    TECHNICAL = "technical"
    ANALYTICAL = "analytical"


class BriefLength(str, Enum):
    SHORT = "short"       # ~300 words
    MEDIUM = "medium"     # ~600 words
    DETAILED = "detailed" # ~1000 words


class UserProfile(BaseModel):
    uid: str
    name: str
    role: str                              # e.g. "Chief of Staff", "PM", "Founder"
    industry: str                          # e.g. "AI/ML", "Fintech", "Healthcare"
    company: Optional[str] = None
    topics: list[str] = []                 # e.g. ["LLMs", "fundraising", "crypto"]
    companies_tracked: list[str] = []      # e.g. ["OpenAI", "Anthropic", "Stripe"]
    sources_enabled: list[str] = ["news", "markets", "industry"]
    tone: BriefTone = BriefTone.EXECUTIVE
    length: BriefLength = BriefLength.MEDIUM
    timezone: str = "America/Los_Angeles"
    delivery_channel: str = "app"          # "app" | "email" | "slack"
    email: Optional[str] = None
    created_at: Optional[str] = None

    def to_prompt_context(self) -> str:
        """Serialize profile into a string for LLM prompts."""
        parts = [
            f"Role: {self.role}",
            f"Industry: {self.industry}",
        ]
        if self.company:
            parts.append(f"Company: {self.company}")
        if self.topics:
            parts.append(f"Topics of interest: {', '.join(self.topics)}")
        if self.companies_tracked:
            parts.append(f"Companies tracked: {', '.join(self.companies_tracked)}")
        parts.append(f"Preferred tone: {self.tone.value}")
        parts.append(f"Preferred length: {self.length.value}")
        return "\n".join(parts)
