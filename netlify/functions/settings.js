exports.handler = async (event, context) => {
  try {
    // Nur GET zulassen (optional)
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    // Statische Demo-Daten – hier kannst du später echte Daten einbauen
    const settings = {
      bannerUrl: null,          // oder eine echte Bild-URL
      newsTickerText: '',
      tickerSpeedSeconds: 40,
      tickerSeparator: ' • ',
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    };
  } catch (err) {
    console.error('settings function error', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
