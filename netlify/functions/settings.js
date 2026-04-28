exports.handler = async (event) => {
  try {
    const settings = {
      bannerUrl: "https://luminous-souffle-5656c2.netlify.app/assets/img/banner-test.jpg",
      newsTickerText: "Scrims am Freitag 20:00 Uhr – Anmeldung im Discord.",
      tickerSpeedSeconds: 40,
      tickerSeparator: " • "
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    };
  } catch (err) {
    console.error("settings error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
