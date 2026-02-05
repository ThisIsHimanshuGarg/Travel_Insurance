const modal = document.getElementById("editModal");

const open1 = document.getElementById("openEdit");
const open2 = document.getElementById("openEdit2");

const closeBtn = document.getElementById("closeEdit");
const cancelBtn = document.getElementById("cancelBtn");

const form = document.getElementById("editForm");

const destInput = document.getElementById("destInput");
const startInput = document.getElementById("startInput");
const endInput = document.getElementById("endInput");
const ageInput = document.getElementById("ageInput");

const destText = document.getElementById("destText");
const dateText = document.getElementById("dateText");
const ageText = document.getElementById("ageText");

const destText2 = document.getElementById("destText2");
const dateText2 = document.getElementById("dateText2");
const ageText2 = document.getElementById("ageText2");

function formatDate(iso){
  // yyyy-mm-dd -> dd/mm/yyyy
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function ddmmyyyyToIso(ddmmyyyy){
  // dd/mm/yyyy -> yyyy-mm-dd
  const [d, m, y] = ddmmyyyy.trim().split("/");
  return `${y}-${m}-${d}`;
}

function openModal(){
  // Fill current values
  destInput.value = destText.textContent.trim();
  ageInput.value = ageText.textContent.trim();

  const current = dateText.textContent.trim(); // "dd/mm/yyyy - dd/mm/yyyy"
  const parts = current.split("-");
  if(parts.length === 2){
    startInput.value = ddmmyyyyToIso(parts[0]);
    endInput.value = ddmmyyyyToIso(parts[1]);
  }

  modal.classList.add("show");
}

function closeModal(){
  modal.classList.remove("show");
}

open1.addEventListener("click", (e)=>{ e.preventDefault(); openModal(); });
open2.addEventListener("click", (e)=>{ e.preventDefault(); openModal(); });

closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

// click outside modal closes it
modal.addEventListener("click", (e)=>{
  if(e.target === modal) closeModal();
});

// Save changes
form.addEventListener("submit", (e)=>{
  e.preventDefault();

  if(endInput.value < startInput.value){
    alert("End date cannot be before start date.");
    return;
  }

  const newDest = destInput.value.trim();
  const newAge = ageInput.value.trim();
  const newDates = `${formatDate(startInput.value)} - ${formatDate(endInput.value)}`;

  // Update summary
  destText.textContent = newDest;
  ageText.textContent = newAge;
  dateText.textContent = newDates;

  // Update mobile trip details
  destText2.textContent = newDest;
  ageText2.textContent = newAge;
  dateText2.textContent = newDates;

  closeModal();
});
