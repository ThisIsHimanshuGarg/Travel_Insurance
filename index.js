
// Navbar toggle

/* ================= MOBILE DRAWER ================= */

/* ================= MOBILE DRAWER ================= */
const hamburger = document.getElementById("hamburger");
const drawer = document.getElementById("drawer");
const drawerClose = document.getElementById("drawerClose");

const openDrawer = () => {
  if (!drawer) return;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  hamburger?.setAttribute("aria-expanded", "true");
};

const closeDrawer = () => {
  if (!drawer) return;
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  hamburger?.setAttribute("aria-expanded", "false");
};

hamburger?.addEventListener("click", (e) => {
  e.stopPropagation();
  openDrawer();
});
drawerClose?.addEventListener("click", closeDrawer);

drawer?.addEventListener("click", (e) => {
  if (e.target === drawer) closeDrawer();
});

/* ================= ACCORDIONS (MOBILE) ================= */
function setupAccordion(btnId, panelId) {
  const btn = document.getElementById(btnId);
  const panel = document.getElementById(panelId);
  if (!btn || !panel) return;

  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!isOpen));
    panel.classList.toggle("open", !isOpen);

    const icon = btn.querySelector(".acc-icon");
    if (icon) icon.textContent = !isOpen ? "⌃" : "⌄";
  });
}

setupAccordion("accTravel", "accTravelPanel");
setupAccordion("accCustomer", "accCustomerPanel");

/* ================= DESTINATION DROPDOWN + CHIPS ================= */
const dropdown = document.getElementById("dropdown");
const dropdownInput = document.getElementById("dropdownInput");
const dropdownList = document.getElementById("dropdownList");
const chips = document.getElementById("chips");

dropdownInput?.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown?.classList.toggle("open");
});

dropdownList?.querySelectorAll("li").forEach((item) => {
  item.addEventListener("click", () => {
    const value = item.dataset.value;
    if (!value) return;

    // prevent duplicate
    const already = [...(chips?.querySelectorAll(".chip") || [])]
      .some((ch) => ch.dataset.value === value);

    if (already) {
      dropdown?.classList.remove("open");
      return;
    }

    const chip = document.createElement("span");
    chip.className = "chip";
    chip.dataset.value = value;
    chip.innerHTML = `${value} <button type="button" class="x">×</button>`;

    chip.querySelector(".x").addEventListener("click", () => chip.remove());
    chips?.appendChild(chip);

    dropdown?.classList.remove("open");
  });
});

/* ================= AGE ADD/REMOVE ================= */
const ageWrap = document.getElementById("ageWrap");
const addAgeBtn = document.getElementById("addAgeBtn");

addAgeBtn?.addEventListener("click", () => {
  if (!ageWrap) return;

  const row = document.createElement("div");
  row.className = "age-row";

  row.innerHTML = `
    <input class="control age-input" type="number" min="0" />
    <button type="button" class="remove-btn" aria-label="Remove traveller">×</button>
  `;

  row.querySelector(".remove-btn").addEventListener("click", () => row.remove());
  ageWrap.appendChild(row);
});

/* ================= DESKTOP MEGA MENU (FINAL) ================= */
const header = document.querySelector(".header");
const travelBtn = document.getElementById("travelBtn");
const mega = document.getElementById("mega");
const megaClose = document.getElementById("megaClose");

function openMega() {
  if (!mega) return;
  mega.classList.add("open");
  mega.setAttribute("aria-hidden", "false");
  header?.classList.add("travel-active");
  travelBtn?.setAttribute("aria-expanded", "true");
}

function closeMega() {
  if (!mega) return;
  mega.classList.remove("open");
  mega.setAttribute("aria-hidden", "true");
  header?.classList.remove("travel-active");
  travelBtn?.setAttribute("aria-expanded", "false");
}

travelBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  // Only desktop (mobile me drawer use hota hai)
  if (window.matchMedia("(max-width: 700px)").matches) return;

  mega?.classList.contains("open") ? closeMega() : openMega();
});

megaClose?.addEventListener("click", (e) => {
  e.stopPropagation();
  closeMega();
});

/* ================= GLOBAL OUTSIDE CLICK + ESC ================= */
document.addEventListener("click", (e) => {
  // close dropdown
  if (dropdown && !dropdown.contains(e.target)) dropdown.classList.remove("open");

  // close mega (desktop)
  if (mega?.classList.contains("open") && !mega.contains(e.target) && !travelBtn?.contains(e.target)) {
    closeMega();
  }

  // close drawer (mobile)
  if (drawer?.classList.contains("open") && !drawer.querySelector(".drawer-panel")?.contains(e.target) && !hamburger?.contains(e.target)) {
    closeDrawer();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeDrawer();
    closeMega();
    dropdown?.classList.remove("open");
  }
});
