/*
  Simple rotating news ticker for a container on your webpage.
  Usage:
    1. Add a container element with an id, for example:
         <div id="news-ticker"></div>
    2. Include this script.
    3. Start it by calling:
         startNewsTicker("news-ticker", "https://feedurl.com/x/y/x")
  The script fetches items from your n8n webhook feed and cycles through them.
*/

console.log("Ticker script loaded");

function startNewsTicker(containerId, feedUrl) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="ticker-box">
      <div class="ticker-headline"></div>
      <div class="ticker-sub"></div>
    </div>
  `;

  const headlineEl = container.querySelector(".ticker-headline");
  const subEl = container.querySelector(".ticker-sub");

  Object.assign(headlineEl.style, {
    fontSize: "1.2rem",
    fontWeight: "bold",
    opacity: "1",
    transition: "opacity 0.6s",
    cursor: "default"
  });

  Object.assign(subEl.style, {
    fontSize: "0.95rem",
    marginTop: "0.3rem",
    opacity: "1",
    transition: "opacity 0.6s"
  });

  headlineEl.textContent = "Loading...";
  subEl.textContent = "";

  function formatDate(d) {
    const [m, day, y] = d.trim().split("/").map(Number);
    return new Date(y, m - 1, day).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  async function loadAndRun() {
    const FEED_URL = window.NEWS_TICKER_FEED_URL;
    try {
      const res = await fetch(FEED_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("Bad response");
      let data = await res.json();

      data = data.filter(i => i.Headline && i.Headline.trim().length > 0);

      if (data.length === 0) {
        headlineEl.textContent = "Coming soon";
        subEl.textContent = "";
        return;
      }

      let idx = 0;

      function showItem() {
        const item = data[idx];

        headlineEl.style.opacity = 0;
        subEl.style.opacity = 0;

        setTimeout(() => {
          headlineEl.textContent = item.Headline;
          subEl.textContent = `${item.Place}: ${formatDate(item.Date)}`;
          headlineEl.style.opacity = 1;
          subEl.style.opacity = 1;
        }, 600);

        idx = (idx + 1) % data.length;
      }

      showItem();
      setInterval(showItem, 3500);
    } catch (err) {
      headlineEl.textContent = "Coming soon";
      subEl.textContent = "";
      console.error(err);
    }
  }

  loadAndRun();
}
