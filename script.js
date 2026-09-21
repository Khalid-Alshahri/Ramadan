function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getRamadanDay(startDateString) {
  const start = parseLocalDate(startDateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = today - start;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, Math.min(30, diffDays + 1));
}

function showLockedMessage(day, reason) {
  const modal = document.getElementById("locked-modal");
  const message = document.getElementById("locked-message");

  if (!modal || !message) return;

  message.textContent = reason || `باب ${day} لم يُفتح بعد.`;
  modal.hidden = false;
}

function buildGates() {
  const grid = document.querySelector(".gates-grid");
  const label = document.getElementById("current-day-label");

  if (!grid) return;

  const config = window.RAMADAN_CONFIG || {};
  const links = window.DOOR_LINKS || {};
  const currentDay = getRamadanDay(config.ramadanStartDate || "2026-08-29");

  if (label) {
    label.textContent = currentDay === 0 ? "لم يبدأ بعد" : `اليوم ${currentDay}`;
  }

  grid.innerHTML = "";

  for (let day = 1; day <= 30; day++) {
    const isAllowedByDate = day <= currentDay;
    const hasPage = Boolean(links[String(day)]);
    const isOpen = isAllowedByDate && hasPage;

    const gate = document.createElement("button");
    gate.className = `gate ${isOpen ? "open" : "locked"}`;
    gate.setAttribute("type", "button");
    gate.setAttribute("aria-label", `باب ${day}`);

    gate.innerHTML = `
      <div class="gate-inner">
        <div class="gate-number">${String(day).padStart(2, "0")}</div>
        <div class="lock-icon">${isOpen ? "◈" : "🔒"}</div>
        <div class="gate-status">${isOpen ? "مفتوح" : "مغلق"}</div>
      </div>
    `;

    gate.addEventListener("click", () => {
      if (isOpen) {
        window.location.href = links[String(day)];
        return;
      }

      if (!isAllowedByDate) {
        showLockedMessage(day, `هذا الباب يفتح في اليوم ${day}.`);
      } else {
        showLockedMessage(day, "موعد هذا الباب وصل، لكن ملفه لم يُرفع بعد.");
      }
    });

    grid.appendChild(gate);
  }
}

function initModal() {
  const close = document.getElementById("modal-close");
  const modal = document.getElementById("locked-modal");

  if (!close || !modal) return;

  close.addEventListener("click", () => {
    modal.hidden = true;
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.hidden = true;
    }
  });
}

function initIntroMode() {
  const params = new URLSearchParams(window.location.search);
  const showGates = params.get("showGates") === "1";

  if (showGates) {
    document.body.classList.remove("intro-mode");

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });
  }
}

function initStartButton() {
  const startButton = document.getElementById("start-button");

  if (!startButton) return;

  startButton.addEventListener("click", () => {
    document.body.classList.remove("intro-mode");

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });
  });
}

buildGates();
initModal();
initIntroMode();
initStartButton();