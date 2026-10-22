"use strict";

const invitation = document.getElementById("invitation");
const gate = document.getElementById("invite-gate");
const openButton = document.getElementById("open-invitation");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const music = document.getElementById("background-music");
const musicToggle = document.getElementById("music-toggle");

invitation.inert = true;
music.volume = 0.28;

let invitationOpened = false;

function syncMusicControl() {
  const playing = !music.paused && !music.ended;
  musicToggle.setAttribute("aria-pressed", String(playing));
  musicToggle.setAttribute("aria-label", playing ? "Pause background music" : "Play background music");
  musicToggle.querySelector("i").className = playing ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
  musicToggle.querySelector("span").textContent = playing ? "Music on" : "Music off";
}

async function playMusic() {
  try {
    await music.play();
  } catch {
    // Playback can be declined by browser settings; the visible control allows a retry.
  }
  syncMusicControl();
}

musicToggle.addEventListener("click", () => {
  if (music.paused) {
    playMusic();
  } else {
    music.pause();
  }
});
music.addEventListener("play", syncMusicControl);
music.addEventListener("pause", syncMusicControl);
music.addEventListener("error", syncMusicControl);

function finishOpening() {
  if (invitationOpened) return;
  invitationOpened = true;
  gate.hidden = true;
  invitation.inert = false;
  musicToggle.hidden = false;
  syncMusicControl();
  document.body.classList.remove("is-locked");
  window.scrollTo(0, 0);

  const heading = document.getElementById("couple-name");
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
}

openButton.addEventListener("click", () => {
  if (openButton.disabled) return;
  openButton.disabled = true;
  playMusic();

  if (reducedMotion.matches) {
    finishOpening();
    return;
  }

  if (window.gsap) {
    const timeline = window.gsap.timeline({ onComplete: finishOpening });
    timeline
      .to(openButton, { autoAlpha: 0, duration: 0.22, ease: "power1.out" }, 0)
      .to(".gate-kicker, .gate-prompt", { autoAlpha: 0, duration: 0.3 }, 0)
      .to(".gate-door--left", { rotationY: -112, duration: 1.3, ease: "power3.inOut" }, 0.12)
      .to(".gate-door--right", { rotationY: 112, duration: 1.3, ease: "power3.inOut" }, 0.12)
      .to(".gate-reveal", { scale: 1, duration: 1.5, ease: "power2.out" }, 0.12)
      .to(gate, { yPercent: -105, autoAlpha: 0, duration: 0.86, ease: "power3.inOut" }, 1.38);
  } else {
    gate.classList.add("is-opening");
    window.setTimeout(() => gate.classList.add("is-leaving"), 1400);
    window.setTimeout(finishOpening, 2300);
  }
});

const weddingStart = new Date("2026-11-20T11:00:00+05:30").getTime();
const clockFields = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};
const countdownAnnouncement = document.getElementById("countdown-announcement");
let lastAnnouncedMinute = null;

function updateCountdown() {
  const remaining = Math.max(0, weddingStart - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  for (const [unit, value] of Object.entries({ days, hours, minutes, seconds })) {
    clockFields[unit].textContent = String(value).padStart(2, "0");
  }

  if (remaining === 0) {
    countdownAnnouncement.textContent = "The celebrations have begun.";
    return;
  }

  const currentMinute = Math.floor(totalSeconds / 60);
  if (currentMinute !== lastAnnouncedMinute) {
    countdownAnnouncement.textContent = `${days} days, ${hours} hours and ${minutes} minutes until the first celebration.`;
    lastAnnouncedMinute = currentMinute;
  }

  window.setTimeout(updateCountdown, 1000 - (Date.now() % 1000) + 10);
}

updateCountdown();

document.querySelectorAll("[data-scratch-date]").forEach((panel) => {
  const canvas = panel.querySelector("canvas");
  const answer = panel.querySelector(".scratch-date__answer");
  const shortcut = panel.querySelector(".scratch-date__shortcut");
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    canvas.remove();
    shortcut.remove();
    return;
  }

  const bounds = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(bounds.width * ratio);
  canvas.height = Math.round(bounds.height * ratio);
  context.scale(ratio, ratio);

  const foil = context.createLinearGradient(0, 0, bounds.width, bounds.height);
  foil.addColorStop(0, "#a37122");
  foil.addColorStop(0.26, "#f8e3a0");
  foil.addColorStop(0.55, "#c5993b");
  foil.addColorStop(0.82, "#f4d77a");
  foil.addColorStop(1, "#936318");
  context.fillStyle = foil;
  context.fillRect(0, 0, bounds.width, bounds.height);

  context.strokeStyle = "rgba(79, 40, 10, 0.1)";
  context.lineWidth = 1;
  for (let x = -bounds.height; x < bounds.width; x += 15) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + bounds.height, bounds.height);
    context.stroke();
  }

  context.fillStyle = "#4d2b20";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = '600 13px "DM Sans", Arial, sans-serif';
  context.fillText("SCRATCH TO REVEAL", bounds.width / 2, bounds.height / 2 - 9);
  context.font = '500 10px "DM Sans", Arial, sans-serif';
  context.fillText("YOUR CELEBRATION DATE", bounds.width / 2, bounds.height / 2 + 16);

  let scratching = false;
  let lastPoint = null;

  function revealDate() {
    if (panel.classList.contains("is-revealed")) return;
    panel.classList.add("is-revealed");
    shortcut.textContent = "Date revealed";
    shortcut.disabled = true;
    canvas.tabIndex = -1;
    canvas.setAttribute("aria-hidden", "true");
    answer.tabIndex = -1;
    answer.focus({ preventScroll: true });
  }

  function pointFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function eraseTo(point) {
    context.globalCompositeOperation = "destination-out";
    context.strokeStyle = "#000";
    context.lineWidth = 34;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    lastPoint = point;
  }

  function enoughScratched() {
    const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    let sampled = 0;
    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        cleared += data[(y * width + x) * 4 + 3] < 128 ? 1 : 0;
        sampled++;
      }
    }
    return cleared / sampled >= 0.33;
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (panel.classList.contains("is-revealed")) return;
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    scratching = true;
    lastPoint = pointFromEvent(event);
    eraseTo(lastPoint);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!scratching) return;
    event.preventDefault();
    eraseTo(pointFromEvent(event));
  });

  function finishScratch() {
    if (!scratching) return;
    scratching = false;
    lastPoint = null;
    if (enoughScratched()) revealDate();
  }

  canvas.addEventListener("pointerup", finishScratch);
  canvas.addEventListener("pointercancel", finishScratch);
  canvas.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      revealDate();
    }
  });
  shortcut.addEventListener("click", revealDate);
});
