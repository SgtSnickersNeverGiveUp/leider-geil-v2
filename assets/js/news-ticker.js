document.addEventListener('DOMContentLoaded', () => {
  const tickerItemsEl = document.querySelector('#clan-news-ticker .items');
  if (!tickerItemsEl) return;

  const NEWS_DIR = '/assets/data/news/';
  const INDEX_URL = `${NEWS_DIR}index.json`;

  const renderItems = (items) => {
    const texts = items
      .map((n) => {
        const rawText = n && n.text && String(n.text).trim();
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

        const gameKey = game.toLowerCase().replace(/\s+/g, '-');
        const labelClass = `ticker-label ticker-label--${gameKey}`;

        return `<span class="${labelClass}">[${labelText}]</span> ${rawText}`;
      })
      .filter((t) => t && t.trim().length > 0);

    if (texts.length === 0) return;

    const speedSeconds = 40;
    const separator = '   ●   ';

    tickerItemsEl.innerHTML = texts.join(separator);
    tickerItemsEl.style.animationDuration = `${speedSeconds}s`;
  };

  const fetchJson = (url) =>
    fetch(url).then((r) => {
      if (!r.ok) throw new Error(`${url} ${r.status}`);
      return r.json();
    });

  fetchJson(INDEX_URL)
    .then((index) => {
      const files = Array.isArray(index) ? index : index && index.files;
      if (!Array.isArray(files) || files.length === 0) return [];

      return Promise.all(
        files.map((file) =>
          fetchJson(`${NEWS_DIR}${file}`).catch((err) => {
            console.warn('[News Ticker] Konnte Eintrag nicht laden:', file, err);
            return null;
          })
        )
      );
    })
    .then((entries) => {
      const items = (entries || [])
        .filter((e) => e && typeof e === 'object')
        .sort((a, b) => {
          const ta = Date.parse(a.createdAt || '') || 0;
          const tb = Date.parse(b.createdAt || '') || 0;
          return tb - ta;
        });

      if (items.length === 0) return;
      renderItems(items);
    })
    .catch((err) => {
      console.error('[News Ticker] Fehler beim Laden der News-Einträge:', err);
    });
});
