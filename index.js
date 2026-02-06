
const html = document.documentElement;
const body = document.body;

const header = document.querySelector(".header");

/* Mega (desktop) */
const travelBtn = document.getElementById("travelBtn");
const mega = document.getElementById("mega");
const megaClose = document.getElementById("megaClose");
const blurOverlay = document.getElementById("blurOverlay");

/* Drawer (mobile) */
const hamburger = document.getElementById("hamburger");
const drawer = document.getElementById("drawer");
const drawerClose = document.getElementById("drawerClose");

/* Accordions (mobile) */
const accTravel = document.getElementById("accTravel");
const accTravelPanel = document.getElementById("accTravelPanel");
const accCustomer = document.getElementById("accCustomer");
const accCustomerPanel = document.getElementById("accCustomerPanel");

/* Destinations dropdown */
const dropdown = document.getElementById("dropdown");
const dropdownInput = document.getElementById("dropdownInput");
const dropdownList = document.getElementById("dropdownList");
const chips = document.getElementById("chips");
const dropdownBtn = dropdown?.querySelector(".dropdown-btn");

/* Ages */
const ageWrap = document.getElementById("ageWrap");
const addAgeBtn = document.getElementById("addAgeBtn");

/* Tabs */
const singleTripBtn = document.getElementById("singleTrip");
const multiTripBtn  = document.getElementById("multiTrip");

/* ===================== SCROLL LOCK (only when mega/drawer open) ===================== */
let scrollY = 0;
function stopScroll(){
  scrollY = window.scrollY || 0;
  html.classList.add("lock");
  body.classList.add("lock");
  body.style.top = `-${scrollY}px`;
}
function startScroll(){
  html.classList.remove("lock");
  body.classList.remove("lock");
  body.style.top = "";
  window.scrollTo(0, scrollY);
}

/* Allow wheel inside .chips when locked */
function blockScrollEvents(e){
  if (!body.classList.contains("lock")) return;
  
  // ✅ Allow chips to scroll
  if (e.target.closest(".chips")) return;
  
  // ✅ Allow drawer panel to scroll
  const panel = drawer?.querySelector(".drawer-panel");
  if (panel && panel.contains(e.target)) return;
  
  // ✅ Allow mega menu to scroll
  if (mega && mega.contains(e.target)) return;
  
  e.preventDefault();
}

window.addEventListener("wheel", blockScrollEvents, { passive:false });
window.addEventListener("touchmove", blockScrollEvents, { passive:false });

/* ===================== HEADER HEIGHT SYNC ===================== */
function updateHeaderHeight(){
  if (!header) return;
  document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
}
window.addEventListener("load", updateHeaderHeight);
window.addEventListener("resize", updateHeaderHeight);
updateHeaderHeight();

/* ===================== MEGA MENU (DESKTOP) ===================== */
function openMega(){
  if (!mega) return;
  mega.classList.add("open");
  mega.setAttribute("aria-hidden", "false");
  header?.classList.add("travel-active");
  travelBtn?.setAttribute("aria-expanded", "true");
  blurOverlay?.classList.add("show");
  stopScroll();
}
function closeMega(){
  if (!mega) return;
  mega.classList.remove("open");
  mega.setAttribute("aria-hidden", "true");
  header?.classList.remove("travel-active");
  travelBtn?.setAttribute("aria-expanded", "false");
  blurOverlay?.classList.remove("show");
  startScroll();
}

travelBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (window.matchMedia("(max-width: 700px)").matches) return;
  mega.classList.contains("open") ? closeMega() : openMega();
});

megaClose?.addEventListener("click", (e) => {
  e.stopPropagation();
  closeMega();
});
blurOverlay?.addEventListener("click", closeMega);

/* ===================== DRAWER (MOBILE) ===================== */
function openDrawer(){
  if (!drawer) return;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  hamburger?.setAttribute("aria-expanded", "true");
  stopScroll();
}
function closeDrawer(){
  if (!drawer) return;
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  hamburger?.setAttribute("aria-expanded", "false");
  startScroll();
}

hamburger?.addEventListener("click", (e) => {
  e.stopPropagation();
  openDrawer();
});
drawerClose?.addEventListener("click", closeDrawer);
drawer?.addEventListener("click", (e) => {
  if (e.target === drawer) closeDrawer();
});

/* ===================== ACCORDIONS (MOBILE) ===================== */
function setupAccordion(btn, panel){
  if (!btn || !panel) return;
  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!isOpen));
    panel.classList.toggle("open", !isOpen);
    const icon = btn.querySelector(".acc-icon");
    if (icon) icon.textContent = !isOpen ? "⌃" : "⌄";
  });
}
setupAccordion(accTravel, accTravelPanel);
setupAccordion(accCustomer, accCustomerPanel);

/* ===================== DROPDOWN HELPERS ===================== */
function ensureNoResultItem(){
  if (!dropdownList) return null;
  let noItem = dropdownList.querySelector('li[data-noresult="true"]');
  if (!noItem){
    noItem = document.createElement("li");
    noItem.dataset.noresult = "true";
    noItem.textContent = "Destination not found";
    noItem.style.color = "#777";
    noItem.style.pointerEvents = "none";
    dropdownList.appendChild(noItem);
  }
  return noItem;
}

function openDropdown(){
  dropdown?.classList.add("open");
  dropdownList?.removeAttribute("hidden");
}
function closeDropdown(){
  dropdown?.classList.remove("open");
  dropdownList?.setAttribute("hidden", "");
}

function filterList(query){
  if (!dropdownList) return;
  const q = (query || "").toLowerCase().trim();
  const items = [...dropdownList.querySelectorAll("li")].filter(li => li.dataset.noresult !== "true");
  let visible = 0;

  items.forEach(li => {
    const text = (li.dataset.value || li.textContent || "").toLowerCase();
    const show = text.includes(q);
    li.style.display = show ? "" : "none";
    if (show) visible++;
  });

  const noItem = ensureNoResultItem();
  if (noItem) noItem.style.display = (visible === 0) ? "" : "none";
}

/* open/close on click */
dropdown?.addEventListener("click", (e) => {
  const onArrow = e.target.closest(".dropdown-btn");
  const onInput = e.target === dropdownInput;
  if (!onArrow && !onInput) return;
  e.preventDefault();
  e.stopPropagation();
  dropdown.classList.contains("open") ? closeDropdown() : openDropdown();
});

/* search */
dropdownInput?.addEventListener("input", () => {
  openDropdown();
  filterList(dropdownInput.value);
});

/* ===================== TRIP TYPE (Single/Multi) ===================== */
let tripType = "single";

// Initialize tabs
if (singleTripBtn && multiTripBtn) {
  singleTripBtn.classList.add("active");
  multiTripBtn.classList.remove("active");

  singleTripBtn.addEventListener("click", () => {
    tripType = "single";
    singleTripBtn.classList.add("active");
    multiTripBtn.classList.remove("active");
    
    // Remove all chips except first one for single trip
    const allChips = chips.querySelectorAll(".chip");
    allChips.forEach((chip, index) => {
      if (index > 0) chip.remove();
    });
  });

  multiTripBtn.addEventListener("click", () => {
    tripType = "multi";
    multiTripBtn.classList.add("active");
    singleTripBtn.classList.remove("active");
  });
}

/* ===================== SELECT ITEM -> CHIP (ONLY ONE LISTENER) ===================== */
if (dropdownList) {
  dropdownList.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li || li.dataset.noresult === "true") return;

    const value = (li.dataset.value || li.textContent || "").trim();
    if (!value) return;

    const currentCount = chips.querySelectorAll(".chip").length;

    // 🔒 Single Trip = only 1
    if (tripType === "single" && currentCount >= 1) {
      alert("Single Trip allows only one destination");
      return;
    }

    // 🔒 Multi Trip = max 3
    if (tripType === "multi" && currentCount >=3) {
      alert("Multi Trip allows maximum 3 destinations");
      return;
    }

    // ❌ prevent duplicate
    const exists = [...chips.querySelectorAll(".chip")]
      .some(ch => ch.dataset.value === value);
    if (exists) return;

    // ✅ add chip
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.dataset.value = value;
    chip.innerHTML = `${value} <button type="button" class="x">×</button>`;

    chip.querySelector(".x").addEventListener("click", () => chip.remove());
    chips.appendChild(chip);

    if (dropdownInput) dropdownInput.value = "";
    closeDropdown();
  });
}

/* ===================== AGE ADD/REMOVE ===================== */
addAgeBtn?.addEventListener("click", () => {
  if (!ageWrap) return;
  const row = document.createElement("div");
  row.className = "age-row";
  row.innerHTML = `
    <input class="control age-input" type="number" min="0" />
    <button type="button" class="remove-btn" aria-label="Remove traveller">×</button>
  `;
  row.querySelector(".remove-btn")?.addEventListener("click", () => row.remove());
  ageWrap.appendChild(row);
});

/* ===================== OUTSIDE CLICK + ESC ===================== */
document.addEventListener("click", (e) => {
  if (dropdown && !dropdown.contains(e.target)) closeDropdown();
  if (mega?.classList.contains("open") && !mega.contains(e.target) && !travelBtn?.contains(e.target)) closeMega();

  const panel = drawer?.querySelector(".drawer-panel");
  if (drawer?.classList.contains("open") && panel && !panel.contains(e.target) && !hamburger?.contains(e.target)) closeDrawer();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape"){
    closeDropdown();
    closeMega();
    closeDrawer();
  }
});

/* init */
ensureNoResultItem();
filterList("");
/* ===== FORCE: chips ke andar scroll allow ===== */