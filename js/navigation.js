/**
 * navigation.js
 * Reusable layout system for authenticated pages:
 * - Identical sidebar + topbar markup injected via JS (no per-page duplication)
 * - Active nav state based on current filename
 * - Responsive behavior: collapsed on tablet, off-canvas on mobile
 */

const NAV_ITEMS = [
  { href: "dashboard.html", label: "Dashboard", icon: "dashboard" },
  { href: "feed.html", label: "News Feed", icon: "feed" },
  { href: "events.html", label: "Events", icon: "event" },
  { href: "jobs.html", label: "Job Board", icon: "work" },
  { href: "directory.html", label: "Directory", icon: "groups" },
  { href: "settings.html", label: "Settings", icon: "settings" },
];

const PAGE_TITLES = new Map([
  ...NAV_ITEMS.map((i) => [i.href.toLowerCase(), i.label]),
  ["profile.html", "Profile"],
]);

function getCurrentPage() {
  const path = window.location.pathname;
  const file = path.split("/").pop() || "index.html";
  return file.toLowerCase();
}

function setActiveNavState() {
  const current = getCurrentPage();
  const links = document.querySelectorAll("[data-nav-link]");

  links.forEach((link) => {
    const href = (link.getAttribute("href") || "").split("/").pop()?.toLowerCase();
    const isActive = href && href === current;
    link.classList.toggle("is-active", Boolean(isActive));
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function renderSidebar() {
  const items = NAV_ITEMS.map(
    (item) => `
      <a class="nav-link" data-nav-link href="./${item.href}">
        <span class="nav-icon" aria-hidden="true">
          <span class="material-symbols-outlined">${item.icon}</span>
        </span>
        <span class="nav-label">${item.label}</span>
      </a>
    `
  ).join("");

  return `
    <a class="sidebar__brand" href="./dashboard.html">
      <span class="nav-icon" aria-hidden="true">
        <span class="material-symbols-outlined">school</span>
      </span>
      <span class="nav-label">Alumni Portal</span>
    </a>
    <nav class="sidebar__nav" aria-label="Sidebar">
      ${items}
    </nav>
  `;
}

function renderTopbar() {
  return `
    <div class="topbar__inner">
      <div class="topbar__left">
        <button class="icon-btn" type="button" data-sidebar-toggle aria-label="Toggle sidebar">
          <span class="material-symbols-outlined" aria-hidden="true">menu</span>
        </button>
        <h1 class="topbar__title" data-page-title>Alumni Portal</h1>
      </div>

      <div class="topbar__search">
        <form role="search" aria-label="Global search" data-global-search>
          <label class="sr-only" for="global-search-input">Search</label>
          <input
            class="input-field"
            id="global-search-input"
            name="q"
            type="search"
            placeholder="Search alumni, events, jobs…"
            autocomplete="off"
          />
        </form>
      </div>

      <div class="topbar__right">
        <button class="icon-btn" type="button" aria-label="Notifications">
          <span class="material-symbols-outlined" aria-hidden="true">notifications</span>
        </button>
        <a class="topbar__user" href="./profile.html" aria-label="Open profile">
          <span class="topbar__avatar" aria-hidden="true">RS</span>
          <span class="topbar__meta">
            <span class="topbar__name">Robert Chen</span>
            <span class="topbar__detail">Class of ’98</span>
          </span>
        </a>
      </div>
    </div>
  `;
}

function renderBottomNav() {
  const bottomItems = [
    { href: "dashboard.html", label: "Home", icon: "dashboard" },
    { href: "feed.html", label: "Feed", icon: "feed" },
    { href: "events.html", label: "Events", icon: "event" },
    { href: "jobs.html", label: "Jobs", icon: "work" },
    { href: "directory.html", label: "People", icon: "groups" },
  ];

  const links = bottomItems
    .map(
      (i) => `
      <a class="bottom-nav__link" data-nav-link href="./${i.href}">
        <span class="material-symbols-outlined" aria-hidden="true">${i.icon}</span>
        <span>${i.label}</span>
      </a>
    `
    )
    .join("");

  return `<nav class="bottom-nav" aria-label="Bottom navigation">${links}</nav>`;
}

function applyStoredSidebarState(layoutEl) {
  const raw = window.localStorage.getItem("alumniportal.sidebar");
  if (!raw) return;
  try {
    const state = JSON.parse(raw);
    if (state?.collapsed) layoutEl.classList.add("is-collapsed");
    if (state?.expanded) layoutEl.classList.add("is-expanded");
  } catch {
    // ignore
  }
}

function persistSidebarState(layoutEl) {
  const collapsed = layoutEl.classList.contains("is-collapsed");
  const expanded = layoutEl.classList.contains("is-expanded");
  window.localStorage.setItem(
    "alumniportal.sidebar",
    JSON.stringify({ collapsed, expanded })
  );
}

function setPageTitle() {
  const current = getCurrentPage();
  const titleEl = document.querySelector("[data-page-title]");
  if (!titleEl) return;
  titleEl.textContent = PAGE_TITLES.get(current) || "Alumni Portal";
}

function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function setSidebarOpen(layoutEl, open) {
  layoutEl.classList.toggle("is-sidebar-open", open);
  document.body.classList.toggle("is-scroll-locked", open && isMobile());
  const toggle = layoutEl.querySelector("[data-sidebar-toggle]");
  if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
}

function initResponsiveBehavior(layoutEl) {
  const toggle = layoutEl.querySelector("[data-sidebar-toggle]");
  if (toggle) {
    toggle.addEventListener("click", () => {
      if (isMobile()) {
        setSidebarOpen(layoutEl, !layoutEl.classList.contains("is-sidebar-open"));
        return;
      }

      // Desktop/tablet: toggle collapsed state
      layoutEl.classList.toggle("is-collapsed");
      // Allow opting out of "auto collapse" by marking expanded
      layoutEl.classList.toggle("is-expanded", !layoutEl.classList.contains("is-collapsed"));
      persistSidebarState(layoutEl);
    });
  }

  // Mobile: clicking anywhere in main closes the open sidebar (overlay behavior via CSS)
  const main = layoutEl.querySelector(".main");
  if (main) {
    main.addEventListener("click", () => {
      if (layoutEl.classList.contains("is-sidebar-open") && isMobile()) {
        setSidebarOpen(layoutEl, false);
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (layoutEl.classList.contains("is-sidebar-open")) setSidebarOpen(layoutEl, false);
  });

  window.addEventListener("resize", () => {
    if (!isMobile()) {
      setSidebarOpen(layoutEl, false);
      document.body.classList.remove("is-scroll-locked");
    }
  });
}

function initGlobalSearch() {
  const form = document.querySelector("[data-global-search]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Intentionally minimal for now; backend wiring will come later.
  });
}

function initLayoutShell() {
  const sidebar = document.querySelector("[data-sidebar]");
  const topbar = document.querySelector("[data-topbar]");
  if (!sidebar || !topbar) return; // auth pages

  const layoutEl = document.querySelector(".layout");
  if (!layoutEl) return;

  if (!sidebar.id) sidebar.id = "sidebar";
  topbar.setAttribute("role", "banner");

  sidebar.innerHTML = renderSidebar();
  topbar.innerHTML = renderTopbar();

  // Mobile bottom navigation (injected once)
  if (!document.querySelector(".bottom-nav")) {
    const main = document.querySelector(".main");
    if (main) main.insertAdjacentHTML("beforeend", renderBottomNav());
  }

  const toggle = topbar.querySelector("[data-sidebar-toggle]");
  if (toggle) {
    toggle.setAttribute("aria-controls", sidebar.id);
    toggle.setAttribute("aria-expanded", "false");
  }

  applyStoredSidebarState(layoutEl);

  setActiveNavState();
  setPageTitle();
  initResponsiveBehavior(layoutEl);
  initGlobalSearch();
}

document.addEventListener("DOMContentLoaded", () => {
  initLayoutShell();
});

