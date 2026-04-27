/* ────────────────────────────────────────────────────────────
   Site Settings Loader
   Lädt CMS-gepflegte Einstellungen aus assets/data/site-settings.json
   und wendet sie auf das bestehende DOM an.

   >>> HIER WERDEN DIE SITE-SETTINGS GELADEN <<<
   Quelle: /assets/data/site-settings.json
   ──────────────────────────────────────────────────────────── */

(function () {
  const SETTINGS_URL = '/assets/data/site-settings.json';

  async function loadSiteSettings() {
    try {
      // >>> Site-Settings werden hier per fetch geladen <<<
      const res = await fetch(SETTINGS_URL, { cache: 'no-cache' });
      if (!res.ok) throw new Error('site-settings.json not reachable: ' + res.status);
      const settings = await res.json();
      applyHeaderBanner(settings);
    } catch (err) {
      console.warn('[site-settings] konnten nicht geladen werden:', err);
    }
  }

  function applyHeaderBanner(settings) {
    const banner = settings && settings.headerBanner;
    if (!banner || !banner.image) return;

    const img = document.getElementById('header-banner-img');
    if (!img) return;

    img.src = banner.image;
    if (banner.alt) img.alt = banner.alt;

    const section = document.getElementById('header-banner');
    if (section) section.style.display = '';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSiteSettings);
  } else {
    loadSiteSettings();
  }
})();
