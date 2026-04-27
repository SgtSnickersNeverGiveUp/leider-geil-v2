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
        .map((n) => {
          const rawText = n.text && n.text.trim();
          if (!rawText) return null;

          const game = (n.game || '').trim();
          const type = (n.type || '').trim();

          let label = '';
          if (game && type) {
            label = `[${game} · ${type}] `;
          } else if (game) {
            label = `[${game}] `;
          } else if (type) {
            label = `[${type}] `;
          }

          return `${label}${rawText}`;
        })
        .filter((t) => t && t.trim().length > 0);

      if (texts.length === 0) return;

      const speedSeconds = 40; // ggf. in SITE_CONFIG auslagern
      const separator = '   ●   ';

      tickerItemsEl.innerHTML = texts.join(separator);
      tickerItemsEl.style.animationDuration = `${speedSeconds}s`;
    })
    .catch((err) => {
      console.error('[Clan News Ticker] Fehler beim Laden von news.json:', err);
    });
});