document.addEventListener('DOMContentLoaded', () => {
  const tickerItemsEl = document.querySelector('#clan-news-ticker .items');
  if (!tickerItemsEl) return;

  fetch('/assets/data/news.json')
    .then((r) => {
      if (!r.ok) throw new Error(`news.json ${r.status}`);
      return r.json();
    })
    .then((items) => {
      if (!Array.isArray(items) || items.length === 0) return;

      const texts = items
        .map((n) => n.text)
        .filter((t) => t && t.trim().length > 0);
      if (texts.length === 0) return;

      const speedSeconds = 40; // kannst du später variabel machen
      const separator = '   ●   ';

      tickerItemsEl.innerHTML = texts.join(separator);
      tickerItemsEl.style.animationDuration = `${speedSeconds}s`;
    })
    .catch((err) => {
      console.error('[Clan News Ticker] Fehler beim Laden von news.json:', err);
    });
});