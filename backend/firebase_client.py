import firebase_admin
from firebase_admin import credentials, firestore
from models.profile import UserProfile
from models.brief import MorningBrief
from config import get_settings
from typing import Optional


_db = None


def get_db():
    global _db
    if _db is None:
        settings = get_settings()
        try:
            cred = credentials.Certificate(settings.firebase_credentials_path)
            firebase_admin.initialize_app(cred)
        except ValueError:
            pass  # Already initialized
        _db = firestore.client()
    return _db


async def get_profile(uid: str) -> Optional[UserProfile]:
    """Fetch user profile from Firestore."""
    db = get_db()
    doc = db.collection("profiles").document(uid).get()
    if doc.exists:
        data = doc.to_dict()
        data["uid"] = uid
        return UserProfile(**data)
    return None


async def save_profile(profile: UserProfile) -> None:
    """Save or update user profile."""
    db = get_db()
    data = profile.model_dump(exclude={"uid"})
    db.collection("profiles").document(profile.uid).set(data, merge=True)


async def save_brief(brief: MorningBrief) -> str:
    """Save generated brief to Firestore. Returns doc ID."""
    db = get_db()
    data = brief.model_dump()
    doc_ref = db.collection("briefs").document()
    doc_ref.set(data)
    return doc_ref.id


async def get_briefs(uid: str, limit: int = 10) -> list[dict]:
    """Fetch recent briefs for a user."""
    db = get_db()
    docs = (
        db.collection("briefs")
        .where("uid", "==", uid)
        .order_by("generated_at", direction=firestore.Query.DESCENDING)
        .limit(limit)
        .stream()
    )
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]
