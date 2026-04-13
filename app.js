function todayString() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
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

  const { text } = pickCompliment(compliments, localStorage, todayString());

  document.getElementById("compliment-text").textContent = text;
  document.getElementById("compliment-date").textContent = formatDate();

  startConfetti();
}

document.addEventListener("DOMContentLoaded", init);
