const LS_SEEN = "kit-compliments-seen";
const LS_DATE = "kit-compliments-date";
const LS_CURRENT = "kit-compliments-current";

// storage must implement getItem(key) / setItem(key, value) — pass localStorage in the browser.
// today must be a YYYY-MM-DD string.
function pickCompliment(compliments, storage, today) {
  const storedDate = storage.getItem(LS_DATE);
  const storedCurrent = storage.getItem(LS_CURRENT);

  // Same day — return the same compliment
  if (storedDate === today && storedCurrent !== null) {
    const idx = parseInt(storedCurrent, 10);
    if (idx >= 0 && idx < compliments.length) {
      return { index: idx, text: compliments[idx] };
    }
  }

  // New day — pick the next unseen compliment
  let seen = [];
  try {
    seen = JSON.parse(storage.getItem(LS_SEEN) || "[]");
  } catch (_) {
    seen = [];
  }

  // Find first unseen by text — new additions are automatically unseen
  let nextIdx = compliments.findIndex((text) => !seen.includes(text));

  // All seen — reset and cycle
  if (nextIdx === -1) {
    seen = [];
    nextIdx = 0;
  }

  seen.push(compliments[nextIdx]);
  storage.setItem(LS_SEEN, JSON.stringify(seen));
  storage.setItem(LS_DATE, today);
  storage.setItem(LS_CURRENT, String(nextIdx));

  return { index: nextIdx, text: compliments[nextIdx] };
}

if (typeof module !== "undefined") {
  module.exports = { pickCompliment, LS_SEEN, LS_DATE, LS_CURRENT };
}
