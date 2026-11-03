export function viennaDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Vienna', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function isShortNewsVisible(publishDate, expiryDate, today) {
  return publishDate <= today && today <= expiryDate;
}

export function isChronicleVisible(archiveAfter, today) {
  return today > archiveAfter;
}

export function updateNewsVisibility(root = document, today = viennaDateKey()) {
  let shortCount = 0;
  let chronicleCount = 0;
  root.querySelectorAll('[data-short-news]').forEach((card) => {
    const visible = isShortNewsVisible(card.dataset.publishDate, card.dataset.expireDate, today);
    card.hidden = !visible;
    if (visible) shortCount += 1;
  });
  root.querySelectorAll('[data-chronicle-news]').forEach((card) => {
    const visible = chronicleCount < 7 && isChronicleVisible(card.dataset.archiveAfter, today);
    card.hidden = !visible;
    if (visible) chronicleCount += 1;
  });
  const shortEmpty = root.querySelector('[data-short-empty]');
  const chronicleEmpty = root.querySelector('[data-chronicle-empty]');
  if (shortEmpty) shortEmpty.hidden = shortCount > 0;
  if (chronicleEmpty) chronicleEmpty.hidden = chronicleCount > 0;
}

if (typeof document !== 'undefined') {
  let lastDate = viennaDateKey();
  updateNewsVisibility(document, lastDate);
  setInterval(() => {
    const today = viennaDateKey();
    if (today !== lastDate) {
      lastDate = today;
      location.reload();
    }
  }, 60_000);
}
