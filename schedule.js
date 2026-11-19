const schedule = document.querySelector(".schedule");
const filters = schedule.querySelector(".schedule-filters");
const days = [...schedule.querySelectorAll("[data-day]")];
const status = schedule.querySelector("[data-schedule-status]");
const empty = schedule.querySelector("[data-empty-schedule]");
const queryCategory = new URLSearchParams(location.search).get("category");
const categoryInput = [...filters.elements.category].find((option) => option.value === queryCategory);

if (categoryInput) categoryInput.checked = true;

function updateSchedule() {
  const activeDay = filters.elements.day.value;
  const category = filters.elements.category.value;
  let count = 0;
  let dayName = "";

  for (const day of days) {
    const active = day.dataset.day === activeDay;
    day.hidden = !active;
    if (!active) continue;

    dayName = day.querySelector("h2").textContent;
    for (const session of day.querySelectorAll("[data-category]")) {
      session.hidden = category !== "all" && session.dataset.category !== category;
      if (!session.hidden) count += 1;
    }
    day.hidden = count === 0;
  }

  empty.hidden = count > 0;
  status.textContent = `${dayName}. Занятий найдено: ${count}.`;
}

updateSchedule();
filters.hidden = false;
schedule.dataset.filtered = "";
filters.addEventListener("change", updateSchedule);
window.addEventListener("pageshow", updateSchedule);
