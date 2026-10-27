"use strict";

const invitation = document.getElementById("invitation");
const gate = document.getElementById("invite-gate");
const openButton = document.getElementById("open-invitation");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const music = document.getElementById("background-music");
const musicToggle = document.getElementById("music-toggle");
const languageButtons = [...document.querySelectorAll(".language-toggle")];
let currentLanguage = "hi";

// Hindi remains the source copy in the HTML, so the invitation is readable without JS.
const englishCopy = [
  [".gate-kicker, .invocation", ["Shri Adinathay Namah", "Shri Adinathay Namah"]],
  [".wax-seal .sr-only", ["Open the invitation"]],
  [".gate-prompt", ["Touch the seal to open your invitation"]],
  [".site-nav a", ["Family", "Events"]],
  [".header-date", ["20–21 November 2026"]],
  [".hero__eyebrow", ["With the infinite grace of Lord Adinath"]],
  [".hero__name", ["Saksham", "Kanika"]],
  [".hero__message", ["With joy in our hearts, we invite you to celebrate the wedding of Saksham and Kanika. Your presence and blessings will make this occasion truly special."]],
  [".hero__details > span:not(.hero__details-separator)", [
    '<i class="fa-regular fa-calendar" aria-hidden="true"></i> 20 &amp; 21 November 2026',
    '<i class="fa-solid fa-location-dot" aria-hidden="true"></i> Saharanpur, Uttar Pradesh'
  ]],
  [".hero .button--gold", ['View the celebrations <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>']],
  [".hero__scroll-cue", ["<span></span> Scroll to explore"]],
  [".countdown-panel .section-kicker", ["Counting down to the celebration"]],
  ["#countdown-title", ["Until the engagement"]],
  [".countdown-panel__intro > p:last-child", ["20 November 2026 · 10:00 AM"]],
  [".countdown__unit span", ["Days", "Hours", "Minutes", "Seconds"]],
  [".families .section-kicker", ["With our families' blessings"]],
  ["#families-title", ["A heartfelt invitation"]],
  [".family-verse", ["Salutations to the Arihants, Siddhas, Acharyas, Upadhyayas and Sadhus.<br />Salutations to the Jain temple, sacred image, scriptures and faith."]],
  [".family-card__label", ["Groom's family", "Bride's family"]],
  [".family-card h3", ["Saksham Jain", "Kanika"]],
  [".family-card__detail span", ["Grandparents", "Parents", "Parents"]],
  [".family-card__detail p", [
    "Smt. Kaushal Jain &amp; Late Shri Sukhmal Chand Jain",
    "Smt. Neelam Jain &amp; Shri Kamal Pradeep Jain",
    "Smt. Mamta Gupta &amp; Shri Rakesh Kumar Gupta"
  ]],
  [".family-card__address", [
    '<i class="fa-solid fa-location-dot" aria-hidden="true"></i> Malhipur family · Pawan Vihar, Saharanpur',
    '<i class="fa-solid fa-location-dot" aria-hidden="true"></i> Kankarkui, Saharanpur'
  ]],
  [".family-invitation", ["Please grace the occasion and bless the couple as they begin their life together."]],
  [".celebrations .section-kicker", ["May the blessings of the twenty-four Tirthankaras bring joy and remove every obstacle."]],
  ["#celebrations-title", ["Wedding celebrations"]],
  [".celebrations .section-heading > p:not(.section-kicker)", ["Scratch the golden cards to reveal the dates."]],
  [".event-card__topline span", ["01 / Friday", "Hotel The Oasis", "02 / Saturday", "Wedding day"]],
  [".event-card h3", ["Engagement <span>&amp;</span> Ladies Sangeet", "Wedding <span>day</span> celebrations"]],
  [".scratch-date__answer span", ["November<br />2026", "November<br />2026"]],
  [".event-card__meta p span", [
    "Engagement <strong>10:00 AM</strong><br />Ladies Sangeet <strong>6:00 PM</strong>",
    "<strong>Hotel The Oasis</strong><br />Delhi Road, Saharanpur",
    "Mandha <strong>10:00 AM</strong><br />Ghurchari <strong>5:00 PM</strong>",
    "<strong>Hotel The Oasis</strong><br />Delhi Road, Saharanpur",
    "<strong>Meal before sunset</strong><br />Phoolwari Garden, Delhi Road, Saharanpur"
  ]],
  [".event-card > .button", ['Get directions <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>']],
  [".event-card__actions a", ["Directions to Oasis", "Directions to Phoolwari"]],
  [".site-footer .section-kicker", ["A little invitation from Arika Jain"]],
  ["#footer-title", ["Your blessings are our gift"]],
  [".site-footer__message", ["May the music of celebration fill the air;<br />Arika can't wait to welcome you to her Saksham Mamu's wedding."]],
  [".well-wishers > p:first-child", ["With warm regards"]],
  [".well-wishers li a", [
    "Kamal Pradeep Jain <span>· 9927818963</span>",
    "Sakshi &amp; Rishabh Jain <span>· 8285481525</span>"
  ]],
  [".well-wishers__regards", ["With love · Jain family, Malhipur"]],
  [".site-footer__copyright", ["20–21 November 2026 · Saharanpur"]]
];

const translatedContent = englishCopy.map(([selector, english]) => {
  const nodes = [...document.querySelectorAll(selector)];
  if (nodes.length !== english.length) throw new Error(`Translation target mismatch: ${selector}`);
  return { nodes, english, hindi: nodes.map((node) => node.innerHTML) };
});

const englishAria = [
  ["#invite-gate", ["Open the wedding invitation"]],
  [".brand", ["Saksham and Kanika, back to top"]],
  [".site-nav", ["Main navigation"]],
  [".hero__details", ["Wedding dates and location"]],
  [".countdown", ["Time until the engagement"]],
  [".scratch-date__answer", ["Friday, 20 November 2026", "Saturday, 21 November 2026"]],
  [".scratch-date__canvas", ["Scratch or press Enter to reveal 20 November", "Scratch or press Enter to reveal 21 November"]],
  [".event-card > .button", ["Get directions to Hotel The Oasis in a new tab"]],
  [".event-card__actions a", ["Get directions to Hotel The Oasis in a new tab", "Get directions to Phoolwari Garden in a new tab"]],
  [".site-footer__monogram", ["Saksham and Kanika"]]
];

const translatedAria = englishAria.map(([selector, english]) => {
  const nodes = [...document.querySelectorAll(selector)];
  if (nodes.length !== english.length) throw new Error(`Translation target mismatch: ${selector}`);
  return { nodes, english, hindi: nodes.map((node) => node.getAttribute("aria-label")) };
});

function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  document.title = language === "en" ? "Saksham & Kanika | Wedding Invitation" : "सक्षम एवं कनिका | विवाह निमंत्रण";
  document.querySelector('meta[name="description"]').content = language === "en"
    ? "Celebrate the wedding of Saksham and Kanika in Saharanpur on 20–21 November 2026."
    : "सक्षम एवं कनिका के शुभ विवाह का डिजिटल निमंत्रण और 20–21 नवम्बर 2026 के कार्यक्रम।";

  for (const { nodes, english, hindi } of translatedContent) {
    nodes.forEach((node, index) => { node.innerHTML = language === "en" ? english[index] : hindi[index]; });
  }
  for (const { nodes, english, hindi } of translatedAria) {
    nodes.forEach((node, index) => node.setAttribute("aria-label", language === "en" ? english[index] : hindi[index]));
  }

  languageButtons.forEach((button) => {
    button.textContent = language === "en" ? "हिन्दी" : "English";
    button.lang = language === "en" ? "hi" : "en";
    button.setAttribute("aria-label", language === "en" ? "हिन्दी में देखें" : "Switch to English");
  });

  document.querySelectorAll("[data-scratch-date]").forEach((panel) => {
    panel.querySelector(".scratch-date__shortcut").textContent = panel.classList.contains("is-revealed")
      ? (language === "en" ? "Date revealed" : "तिथि दिखाई गई")
      : (language === "en" ? "Tap to reveal the date" : "तिथि देखने के लिए छुएँ");
  });
  syncMusicControl();
  lastAnnouncementLanguage = null;
  if (weddingStart <= Date.now()) {
    countdownAnnouncement.textContent = language === "en" ? "The celebrations have begun." : "मांगलिक कार्यक्रम आरम्भ हो गए हैं।";
  }
  document.dispatchEvent(new Event("invitation-language-change"));
}

invitation.inert = true;
music.volume = 0.28;

let invitationOpened = false;

function syncMusicControl() {
  const playing = !music.paused && !music.ended;
  musicToggle.setAttribute("aria-pressed", String(playing));
  musicToggle.setAttribute("aria-label", currentLanguage === "en"
    ? (playing ? "Pause music" : "Play music")
    : (playing ? "संगीत रोकें" : "संगीत चलाएँ"));
  musicToggle.querySelector("i").className = playing ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
  musicToggle.querySelector("span").textContent = currentLanguage === "en"
    ? (playing ? "Music on" : "Music off")
    : (playing ? "संगीत चालू" : "संगीत बंद");
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

const weddingStart = new Date("2026-11-20T10:00:00+05:30").getTime();
const clockFields = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};
const countdownAnnouncement = document.getElementById("countdown-announcement");
let lastAnnouncedMinute = null;
let lastAnnouncementLanguage = null;

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
    countdownAnnouncement.textContent = currentLanguage === "en" ? "The celebrations have begun." : "मांगलिक कार्यक्रम आरम्भ हो गए हैं।";
    return;
  }

  const currentMinute = Math.floor(totalSeconds / 60);
  if (currentMinute !== lastAnnouncedMinute || currentLanguage !== lastAnnouncementLanguage) {
    countdownAnnouncement.textContent = currentLanguage === "en"
      ? `${days} days, ${hours} hours and ${minutes} minutes until the engagement.`
      : `सगाई तक ${days} दिन, ${hours} घंटे और ${minutes} मिनट शेष हैं।`;
    lastAnnouncedMinute = currentMinute;
    lastAnnouncementLanguage = currentLanguage;
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

  let scratching = false;
  let scratchStarted = false;
  let lastPoint = null;

  function paintFoil() {
    context.globalCompositeOperation = "source-over";
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
    context.font = currentLanguage === "en" ? '600 17px "DM Sans", sans-serif' : '600 15px "Noto Serif Devanagari", serif';
    context.fillText(currentLanguage === "en" ? "Reveal the date" : "शुभ तिथि देखें", bounds.width / 2, bounds.height / 2 - 9);
    context.font = currentLanguage === "en" ? '500 12px "DM Sans", sans-serif' : '500 11px "Noto Serif Devanagari", serif';
    context.fillText(currentLanguage === "en" ? "Scratch the golden layer" : "सुनहरी परत खुरचें", bounds.width / 2, bounds.height / 2 + 16);
  }

  paintFoil();
  document.addEventListener("invitation-language-change", () => {
    if (!scratchStarted && !panel.classList.contains("is-revealed")) paintFoil();
  });

  function revealDate() {
    if (panel.classList.contains("is-revealed")) return;
    panel.classList.add("is-revealed");
    shortcut.textContent = currentLanguage === "en" ? "Date revealed" : "तिथि दिखाई गई";
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
    scratchStarted = true;
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

languageButtons.forEach((button) => button.addEventListener("click", () => {
  const language = currentLanguage === "hi" ? "en" : "hi";
  const url = new URL(window.location.href);
  if (language === "en") url.searchParams.set("lang", "en");
  else url.searchParams.delete("lang");
  window.history.replaceState(null, "", url);
  setLanguage(language);
}));

setLanguage(new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "hi");
