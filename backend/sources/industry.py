import httpx
from models.brief import RawArticle


async def fetch_hackernews(max_items: int = 10) -> list[RawArticle]:
    """Fetch top stories from Hacker News API."""
    articles = []
    async with httpx.AsyncClient(timeout=15) as client:
        try:
            resp = await client.get("https://hacker-news.firebaseio.com/v0/topstories.json")
            story_ids = resp.json()[:max_items]

            for sid in story_ids:
                item_resp = await client.get(f"https://hacker-news.firebaseio.com/v0/item/{sid}.json")
                item = item_resp.json()
                if item and item.get("title"):
                    articles.append(RawArticle(
                        title=item["title"],
                        source="Hacker News",
                        url=item.get("url", f"https://news.ycombinator.com/item?id={sid}"),
                        content=item.get("text", item["title"]),
                        category="industry",
                    ))
        except Exception as e:
            print(f"[HN] Error: {e}")
    return articles


async def fetch_github_trending() -> list[RawArticle]:
    """Fetch trending repos via GitHub API (search by recent stars)."""
    articles = []
    async with httpx.AsyncClient(timeout=15) as client:
        try:
            resp = await client.get(
                "https://api.github.com/search/repositories",
                params={"q": "created:>2024-01-01", "sort": "stars", "order": "desc", "per_page": 5},
                headers={"Accept": "application/vnd.github.v3+json"},
            )
            data = resp.json()
            for repo in data.get("items", []):
                articles.append(RawArticle(
                    title=f"{repo['full_name']} ⭐ {repo['stargazers_count']}",
                    source="GitHub Trending",
                    url=repo["html_url"],
                    content=repo.get("description", "") or "No description",
                    category="industry",
                ))
        except Exception as e:
            print(f"[GitHub] Error: {e}")
    return articles


async def fetch_industry_signals() -> list[RawArticle]:
    """Aggregate all industry signal sources."""
    hn = await fetch_hackernews(10)
    gh = await fetch_github_trending()
    return hn + gh
