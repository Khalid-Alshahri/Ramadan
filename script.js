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

function showLockedMessage(day, reason, title) {
  const modal = document.getElementById("locked-modal");
  const message = document.getElementById("locked-message");
  const modalTitle = modal ? modal.querySelector("h2") : null;

  if (!modal || !message) return;

  if (modalTitle) {
    modalTitle.textContent = title || "الباب لم يُفتح بعد";
  }

  message.textContent =
    reason ||
    "سيُفتح هذا الباب في وقته المحدد من رمضان، ترقّب موقفًا جديدًا من التاريخ يحمل عبرة وأثرًا.";

  modal.hidden = false;
}

function buildGates() {
  const grid = document.querySelector(".gates-grid");
  const label = document.getElementById("current-day-label");

  if (!grid) return;

  const links = window.DOOR_LINKS || {};

  /*
    فتح يدوي:
    الآن مفتوح: 1 و 2 و 3 فقط.
    إذا أردت فتح الباب الرابع لاحقًا اجعلها:
    const manualOpenDays = [1, 2, 3, 4];
  */
  const manualOpenDays = [1, 2, 3];

  if (label) {
    label.textContent = `الأبواب المفتوحة: ${manualOpenDays.join("، ")}`;
  }

  grid.innerHTML = "";

  for (let day = 1; day <= 30; day++) {
    const isAllowedByDate = manualOpenDays.includes(day);
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
        showLockedMessage(
          day,
          "سيُفتح هذا الباب في وقته المحدد من رمضان، ترقّب موقفًا جديدًا من التاريخ يحمل عبرة وأثرًا.",
          "الباب لم يُفتح بعد"
        );
      } else {
        showLockedMessage(
          day,
          "وصل موعد هذا الباب، وسيتم رفع محتواه قريبًا بإذن الله.",
          "المحتوى قيد التجهيز"
        );
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