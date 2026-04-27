// Clan News Ticker
// -----------------
// Datenquelle: Decap CMS Folder Collection "News" unter assets/data/news/.
// Pro News-Eintrag liegt dort eine eigene JSON-Datei (Felder: id, game,
// type, text, createdAt). Die Netlify Function /api/news liest diesen
// Ordner serverseitig aus, fuegt die Eintraege zu einem Array zusammen
// und sortiert sie nach createdAt absteigend (neueste zuerst).
//
// Falls noch keine News gepflegt sind, liefert /api/news ein leeres
// Array zurueck und der Ticker bleibt einfach leer (keine Fehlermeldung
// im Frontend).

document.addEventListener('DOMContentLoaded', () => {
  const tickerItemsEl = document.querySelector('#clan-news-ticker .items');
  if (!tickerItemsEl) return;

  // News werden ausschliesslich aus assets/data/news/ (CMS) bezogen.
  fetch('/api/news', { headers: { accept: 'application/json' } })
    .then((r) => (r && r.ok ? r.json() : []))
    .then((items) => {
      if (!Array.isArray(items) || items.length === 0) {
        tickerItemsEl.innerHTML = '';
        return;
      }

      const texts = items
        .map((n) => {
          const rawText = n && n.text ? String(n.text).trim() : '';
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

      if (texts.length === 0) {
        tickerItemsEl.innerHTML = '';
        return;
      }

      const speedSeconds = 40; // ggf. in SITE_CONFIG auslagern
      const separator = '   ●   ';

      tickerItemsEl.innerHTML = texts.join(separator);
      tickerItemsEl.style.animationDuration = `${speedSeconds}s`;
    })
    .catch(() => {
      // Stillschweigend leeren – keine Frontend-Fehlermeldung.
      tickerItemsEl.innerHTML = '';
    });
});
