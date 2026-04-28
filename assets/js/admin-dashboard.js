// assets/js/admin-dashboard.js

const NEWSAPIURL = "/.netlify/functions/news";
const SETTINGSAPI = "/.netlify/functions/settings";

function renderAdminUI() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <h2>News Ticker Verwaltung</h2>
    <p>Hier kannst du die Einträge für den News‑Ticker der Startseite verwalten.</p>

    <div id="status" style="margin: 1rem 0; color: #555;"></div>

    <div style="margin-bottom: 1rem;">
      abel for="ticker-speed">
        Ticker‑Geschwindigkeit (Sekunden für eine Runde):
      </label>
      <input id="ticker-speed" type="number" min="5" max="120" step="5" value="40" />
    </div>

    <div style="margin-bottom: 1rem;">
      abel for="ticker-separator">
        Trenner zwischen Nachrichten:
      </label>
      <input id="ticker-separator" type="text" value=" • " />
    </div>

    <hr style="margin: 1.5rem 0;" />

    <button id="news-add">Eintrag hinzufügen</button>

    <form id="news-form" style="margin-top: 1rem;">
      <div id="news-list"></div>

      <button type="button" id="news-save" style="margin-top: 1rem;">
        News Ticker speichern
      </button>
    </form>
  `;
}

async function loadTickerSettings() {
  const statusEl = document.getElementById("status");
  const speedInput = document.getElementById("ticker-speed");
  const sepInput = document.getElementById("ticker-separator");

  if (!statusEl) return;
  statusEl.textContent = "Lade Einstellungen...";

  try {
    const res = await fetch(SETTINGSAPI);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const settings = await res.json();

    if (speedInput) speedInput.value = settings.tickerSpeedSeconds ?? 40;
    if (sepInput) sepInput.value = settings.tickerSeparator ?? " • ";

    statusEl.textContent = "Einstellungen geladen.";
  } catch (err) {
    console.error("Ticker Settings laden fehlgeschlagen", err);
    statusEl.textContent = "Fehler beim Laden der Einstellungen.";
  }
}

function renderNewsAdmin() {
  const listEl = document.getElementById("news-list");
  if (!listEl) return;

  const news = window.lgNews || [];
  listEl.innerHTML = news
    .map(
      (n, i) => `
      <div style="margin-bottom: 0.75rem; border: 1px solid #ccc; padding: 0.5rem;">
        abel>Eintrag ${i + 1}</label>
        <div style="display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.25rem;">
          <textarea
            rows="2"
            data-index="${i}"
            placeholder="Ticker-Text..."
            style="width: 100%;"
          >${n.text || ""}</textarea>

          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <select data-type-index="${i}">
              <option value="info" ${n.type === "info" ? "selected" : ""}>Info</option>
              <option value="event" ${n.type === "event" ? "selected" : ""}>Event</option>
              <option value="member" ${n.type === "member" ? "selected" : ""}>Member</option>
              <option value="birthday" ${n.type === "birthday" ? "selected" : ""}>Birthday</option>
              <option value="ranked" ${n.type === "ranked" ? "selected" : ""}>Ranked</option>
            </select>

            <button type="button" data-news-remove="${i}">Löschen</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

async function loadNewsIntoAdmin() {
  const listEl = document.getElementById("news-list");
  const statusEl = document.getElementById("status");

  if (!listEl || !statusEl) return;
  statusEl.textContent = "Lade News...";

  try {
    const res = await fetch(NEWSAPIURL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    window.lgNews = Array.isArray(data) ? data : [];
    renderNewsAdmin();
    statusEl.textContent = "News geladen.";
  } catch (err) {
    console.error("News Admin load", err);
    statusEl.textContent = "Fehler beim Laden der News.";
  }
}

function initNewsAdmin() {
  renderAdminUI();

  const addBtn = document.getElementById("news-add");
  const saveBtn = document.getElementById("news-save");
  const listEl = document.getElementById("news-list");
  const statusEl = document.getElementById("status");

  if (!addBtn || !saveBtn || !listEl || !statusEl) return;

  window.lgNews = [];

  loadTickerSettings();
  loadNewsIntoAdmin();

  addBtn.addEventListener("click", () => {
    window.lgNews = window.lgNews || [];
    window.lgNews.push({ text: "", type: "info" });
    renderNewsAdmin();
  });

  listEl.addEventListener("input", (e) => {
    const idx = e.target.getAttribute("data-index");
    if (idx !== null) {
      window.lgNews[Number(idx)].text = e.target.value;
    }
  });

  listEl.addEventListener("change", (e) => {
    const idx = e.target.getAttribute("data-type-index");
    if (idx !== null) {
      window.lgNews[Number(idx)].type = e.target.value;
    }
  });

  listEl.addEventListener("click", (e) => {
    const idx = e.target.getAttribute("data-news-remove");
    if (idx !== null) {
      window.lgNews.splice(Number(idx), 1);
      renderNewsAdmin();
    }
  });

  saveBtn.addEventListener("click", async () => {
    const speedInput = document.getElementById("ticker-speed");
    const sepInput = document.getElementById("ticker-separator");

    const tickerSpeedSeconds = speedInput ? Number(speedInput.value) || 40 : 40;
    const tickerSeparator = sepInput ? sepInput.value : " • ";

    statusEl.textContent = "Speichere...";

    try {
      const newsToSave = Array.isArray(window.lgNews) ? window.lgNews : [];

      const resNews = await fetch(NEWSAPIURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsToSave),
      });
      if (!resNews.ok) throw new Error("News HTTP " + resNews.status);

      const resSettings = await fetch(SETTINGSAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickerSpeedSeconds, tickerSeparator }),
      });
      if (!resSettings.ok) throw new Error("Settings HTTP " + resSettings.status);

      statusEl.textContent = "Gespeichert.";
    } catch (err) {
      console.error("NewsTicker save", err);
      statusEl.textContent = "Fehler beim Speichern.";
    }
  });
}

document.addEventListener("DOMContentLoaded", initNewsAdmin);