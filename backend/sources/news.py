import httpx
import feedparser
from models.brief import RawArticle
from config import get_settings


async def fetch_newsapi(topics: list[str], max_results: int = 10) -> list[RawArticle]:
    """Fetch articles from NewsAPI based on user topics."""
    settings = get_settings()
    if not settings.newsapi_key:
        return []

    query = " OR ".join(topics[:5])
    articles = []

    async with httpx.AsyncClient(timeout=15) as client:
        try:
            resp = await client.get(
                "https://newsapi.org/v2/everything",
                params={
                    "q": query,
                    "sortBy": "publishedAt",
                    "pageSize": max_results,
                    "language": "en",
                    "apiKey": settings.newsapi_key,
                },
            )
            data = resp.json()
            for item in data.get("articles", []):
                articles.append(RawArticle(
                    title=item.get("title", ""),
                    source=item.get("source", {}).get("name", "Unknown"),
                    url=item.get("url", ""),
                    content=item.get("description", "") or item.get("content", ""),
                    published_at=item.get("publishedAt"),
                    category="news",
                ))
        except Exception as e:
            print(f"[NewsAPI] Error: {e}")

    return articles


async def fetch_rss_feeds(feed_urls: list[str] | None = None) -> list[RawArticle]:
    """Fetch from RSS feeds (HN, TechCrunch, etc.)."""
    default_feeds = [
        "https://hnrss.org/frontpage",
        "https://feeds.arstechnica.com/arstechnica/technology-lab",
    ]
    urls = feed_urls or default_feeds
    articles = []

    for url in urls:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:5]:
                articles.append(RawArticle(
                    title=entry.get("title", ""),
                    source=feed.feed.get("title", url),
                    url=entry.get("link", ""),
                    content=entry.get("summary", ""),
                    published_at=entry.get("published"),
                    category="news",
                ))
        except Exception as e:
            print(f"[RSS] Error fetching {url}: {e}")

    return articles


async def fetch_news(topics: list[str], max_results: int = 10) -> list[RawArticle]:
    """Aggregate news from all sources."""
    newsapi = await fetch_newsapi(topics, max_results)
    rss = await fetch_rss_feeds()
    return newsapi + rss
