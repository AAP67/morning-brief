import httpx
from models.brief import RawArticle


async def fetch_market_data(tickers: list[str] | None = None) -> list[RawArticle]:
    """Fetch market headlines and price moves via Yahoo Finance RSS."""
    default_tickers = ["AAPL", "GOOGL", "MSFT", "AMZN", "^GSPC"]
    tickers = tickers or default_tickers
    articles = []

    # Yahoo Finance RSS for market news
    feed_url = "https://feeds.finance.yahoo.com/rss/2.0/headline?s={}&region=US&lang=en-US"

    async with httpx.AsyncClient(timeout=15) as client:
        for ticker in tickers[:5]:
            try:
                import feedparser
                resp = await client.get(feed_url.format(ticker))
                feed = feedparser.parse(resp.text)
                for entry in feed.entries[:3]:
                    articles.append(RawArticle(
                        title=entry.get("title", ""),
                        source=f"Yahoo Finance ({ticker})",
                        url=entry.get("link", ""),
                        content=entry.get("summary", ""),
                        published_at=entry.get("published"),
                        category="markets",
                    ))
            except Exception as e:
                print(f"[Markets] Error fetching {ticker}: {e}")

    return articles
