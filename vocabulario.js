// Este script NO crea contenido: solo maneja el audio y el scroll.
const card = document.getElementById("card");
const playIcon  = '<i class="ti ti-player-play"></i>';
const pauseIcon = '<i class="ti ti-player-pause"></i>';

let currentAudio = null;
let currentBtn   = null;

function resetBtn(btn) {
  btn.innerHTML = playIcon;
  btn.classList.remove("playing");
}

// Audio: funciona con cualquier botón .play-btn que tenga data-audio
card.addEventListener("click", (e) => {
  const btn = e.target.closest(".play-btn");
  if (!btn) return;

  // Si ya hay un audio sonando, se detiene
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    resetBtn(currentBtn);
    const same = currentBtn === btn;
    currentAudio = null;
    currentBtn = null;
    if (same) return;
  }

  const audio = new Audio(btn.dataset.audio);
  currentAudio = audio;
  currentBtn = btn;

  btn.innerHTML = pauseIcon;
  btn.classList.add("playing");

  // Recuerda la última palabra estudiada en la URL (?word=One)
  const word = btn.closest(".word-entry")?.dataset.word;
  if (word) history.replaceState(null, "", `?word=${encodeURIComponent(word)}`);

  audio.play().catch(() => resetBtn(btn));
  audio.addEventListener("ended", () => {
    resetBtn(btn);
    currentAudio = null;
    currentBtn = null;
  });
});

// Scroll: al cargar, baja hasta la última palabra estudiada
const savedWord = new URLSearchParams(window.location.search).get("word");
if (savedWord) {
  const target = [...document.querySelectorAll(".word-entry")]
    .find(el => el.dataset.word === savedWord);
  if (target) {
    setTimeout(() => {
      card.scrollTo({ top: target.offsetTop - 16, behavior: "smooth" });
    }, 100);
  }
}
