from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.profile import UserProfile
from models.brief import MorningBrief
from pipeline.orchestrator import run_pipeline
from firebase_client import get_profile, save_profile, save_brief, get_briefs
from config import get_settings

app = FastAPI(
    title="Morning Brief API",
    description="Multi-model AI morning brief generator",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health ──

@app.get("/health")
async def health():
    settings = get_settings()
    return {
        "status": "ok",
        "models": {
            "groq": settings.groq_model,
            "gemini": settings.gemini_model,
            "claude": settings.claude_model,
        },
    }


# ── Profiles ──

@app.post("/profiles", response_model=UserProfile)
async def create_profile(profile: UserProfile):
    """Create or update a user profile."""
    await save_profile(profile)
    return profile


@app.get("/profiles/{uid}", response_model=UserProfile)
async def read_profile(uid: str):
    """Get a user profile."""
    profile = await get_profile(uid)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


# ── Brief Generation ──

@app.post("/briefs/generate/{uid}")
async def generate_brief(uid: str):
    """Generate a morning brief for a user. This is the main endpoint."""
    profile = await get_profile(uid)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Create one first.")

    try:
        brief, metrics = await run_pipeline(profile)
        doc_id = await save_brief(brief)
        return {
            "brief_id": doc_id,
            "brief": brief.model_dump(),
            "metrics": metrics.model_dump(),
        }
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")


@app.post("/briefs/preview")
async def preview_brief(profile: UserProfile):
    """Generate a brief without saving — for onboarding preview."""
    try:
        brief, metrics = await run_pipeline(profile)
        return {
            "brief": brief.model_dump(),
            "metrics": metrics.model_dump(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")


@app.get("/briefs/{uid}")
async def list_briefs(uid: str, limit: int = 10):
    """Get recent briefs for a user."""
    briefs = await get_briefs(uid, limit)
    return {"briefs": briefs, "count": len(briefs)}


# ── Debug / Demo ──

@app.post("/demo/generate")
async def demo_generate():
    """Generate a brief with a demo profile — no Firebase needed."""
    demo_profile = UserProfile(
        uid="demo",
        name="Demo User",
        role="Startup Founder",
        industry="AI/ML",
        topics=["LLMs", "fundraising", "product-market fit", "AI agents"],
        companies_tracked=["OpenAI", "Anthropic", "Mistral"],
        tone="executive",
        length="medium",
    )
    try:
        brief, metrics = await run_pipeline(demo_profile)
        return {
            "brief": brief.model_dump(),
            "metrics": metrics.model_dump(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
