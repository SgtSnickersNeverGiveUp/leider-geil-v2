// Daten kommen ausschließlich aus GET /api/news (CMS-News).
// Liefert die API ein leeres Array, wird einfach kein Text angezeigt – es gibt
// bewusst keinen Demo- oder Fallback-Text mehr.
document.addEventListener('DOMContentLoaded', () => {
  const tickerItemsEl = document.querySelector('#clan-news-ticker .items');
  if (!tickerItemsEl) return;

  fetch('/api/news')
    .then((r) => {
      if (!r.ok) throw new Error(`/api/news ${r.status}`);
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

          let labelText = '';
          if (game && type) {
            labelText = `${game} · ${type}`;
          } else if (game) {
            labelText = game;
          } else if (type) {
            labelText = type;
          }

          if (!labelText) {
            return rawText;
          }

          const gameKey = game.toLowerCase().replace(/\s+/g, '-'); // "ARC Raiders" -> "arc-raiders"

          const labelClass = `ticker-label ticker-label--${gameKey}`;

          return `<span class="${labelClass}">[${labelText}]</span> ${rawText}`;
        })
        .filter((t) => t && t.trim().length > 0);

      if (texts.length === 0) return;

      const speedSeconds = 40; // ggf. in SITE_CONFIG auslagern
      const separator = '   ●   ';

      tickerItemsEl.innerHTML = texts.join(separator);
      tickerItemsEl.style.animationDuration = `${speedSeconds}s`;
    })
    .catch((error) => {
      console.warn('Failed to load news from /api/news', error);
    });
});
