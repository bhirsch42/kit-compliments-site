const LS_SEEN = "kit-compliments-seen";
const LS_DATE = "kit-compliments-date";
const LS_CURRENT = "kit-compliments-current";

function todayString() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function pickCompliment(compliments) {
  const today = todayString();
  const storedDate = localStorage.getItem(LS_DATE);
  const storedCurrent = localStorage.getItem(LS_CURRENT);

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
    seen = JSON.parse(localStorage.getItem(LS_SEEN) || "[]");
  } catch (_) {
    seen = [];
  }

  // Find first unseen
  let nextIdx = compliments.findIndex((_, i) => !seen.includes(i));

  // All seen — reset
  if (nextIdx === -1) {
    seen = [];
    nextIdx = 0;
  }

  seen.push(nextIdx);
  localStorage.setItem(LS_SEEN, JSON.stringify(seen));
  localStorage.setItem(LS_DATE, today);
  localStorage.setItem(LS_CURRENT, String(nextIdx));

  return { index: nextIdx, text: compliments[nextIdx] };
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function startConfetti() {
  var duration = 999999999 * 1000;
  var animationEnd = Date.now() + duration;
  var skew = 1;
  var frameIndex = 0;

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  var myCanvas = document.createElement("canvas");
  myCanvas.style.position = "fixed";
  myCanvas.style.top = "0";
  myCanvas.style.left = "0";
  myCanvas.style.width = "100vw";
  myCanvas.style.height = "100vh";
  myCanvas.style.pointerEvents = "none";
  myCanvas.style.zIndex = "1000";
  myCanvas.style.opacity = "0";
  myCanvas.style.transition = "opacity 2s ease-in-out";
  document.body.appendChild(myCanvas);

  setTimeout(function () {
    myCanvas.style.opacity = "0.05";
  }, 100);

  var myConfetti = confetti.create(myCanvas, { resize: true, useWorker: true });

  (function frame() {
    frameIndex++;
    skew = Math.max(0.8, skew - 0.001);

    if (frameIndex % 10 === 0) {
      myConfetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: 4000,
        origin: { x: Math.random(), y: -0.05 },
        colors: ["#ffffff"],
        shapes: ["circle"],
        gravity: randomInRange(0.1, 0.3),
        scalar: randomInRange(0.4, 1),
        drift: randomInRange(-0.4, 0.4),
        flat: true,
      });
    }

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  })();
}

async function init() {
  const response = await fetch("compliments.json");
  const compliments = await response.json();

  const { text } = pickCompliment(compliments);

  document.getElementById("compliment-text").textContent = text;
  document.getElementById("compliment-date").textContent = formatDate();

  startConfetti();
}

document.addEventListener("DOMContentLoaded", init);
