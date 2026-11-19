const header = document.querySelector(".site-header");
const menuToggle = header.querySelector(".nav-toggle");
const mobileNav = window.matchMedia("(max-width: 740px)");

header.dataset.enhanced = "";
menuToggle.hidden = false;

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
});

header.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || menuToggle.getAttribute("aria-expanded") !== "true") return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.focus();
});

mobileNav.addEventListener("change", () => {
  menuToggle.setAttribute("aria-expanded", "false");
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const hasNativeTransitions = location.protocol !== "file:" && "CSSViewTransitionRule" in window;

if (!hasNativeTransitions) {
  const content = document.querySelector("main");
  let departure;
  document.documentElement.dataset.navigationFallback = "";

  document.addEventListener("click", async (event) => {
    if (reducedMotion.matches || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest("a[href]");
    if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;

    const destination = new URL(link.href);
    if (destination.origin !== location.origin || destination.protocol !== location.protocol ||
        (destination.pathname === location.pathname && destination.search === location.search)) return;

    event.preventDefault();
    if (departure) return;

    departure = content.animate(
      [{ opacity: getComputedStyle(content).opacity }, { opacity: .42 }],
      { duration: 120, easing: "ease-in", fill: "forwards" }
    );
    try {
      await departure.finished;
    } catch {
      return;
    }
    location.assign(destination.href);
  });

  window.addEventListener("pageshow", () => {
    departure?.cancel();
    departure = undefined;
  });
}
