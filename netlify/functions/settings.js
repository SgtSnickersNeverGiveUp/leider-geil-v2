// netlify/functions/settings.js
const fs = require('fs');
const path = require('path');

exports.handler = async () => {
  try {
    // Pfad zu deiner JSON-Datei mit Settings
    const settingsPath = path.join(__dirname, '../../assets/data/site-settings.json');
    const raw = fs.readFileSync(settingsPath, 'utf-8');
    const data = JSON.parse(raw);

    // Aus deiner JSON:
    // {
    //   "headerBanner": {
    //     "image": "/assets/img/uploads/....jpg",
    //     "alt": "PUBG ARC RAIDERS Banner"
    //   }
    //   ...
    // }

    const bannerUrl = data.headerBanner?.image || null;
    const bannerAlt = data.headerBanner?.alt || '';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bannerUrl,
        bannerAlt,
        // Optional: Defaults für Ticker, falls du sie später brauchst
        tickerSpeedSeconds: data.tickerSpeedSeconds || 40,
        tickerSeparator: data.tickerSeparator || ' | '
      })
    };
  } catch (err) {
    console.error('Settings Function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Settings laden fehlgeschlagen' })
    };
  }
};
