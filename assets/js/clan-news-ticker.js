document.addEventListener('DOMContentLoaded', () => {
  const tickerItemsEl = document.querySelector('#clan-news-ticker .items');
  if (!tickerItemsEl) return;

  const texts = [
    'Willkommen bei Leider Geil',
    'Scrim am Freitag, 21:00 Uhr',
    'ARC Raiders Raid Night – jeden Samstag'
  ];

  const speedSeconds = 40;
  const separator = '   ●   ';

  tickerItemsEl.innerHTML = texts.join(separator);
  tickerItemsEl.style.animationDuration = `${speedSeconds}s`;
});