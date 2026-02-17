/**
 * main.js
 * Minimal page behaviors:
 * - Tabs (aria-selected + optional tabpanel show/hide)
 * - Directory pagination UI state
 * - Basic filter toggles (More filters, clear chips)
 * - Basic dropdown helper (optional)
 * - Password visibility toggle (auth forms)
 */

function $(selector, root = document) {
  return root.querySelector(selector);
}

function $all(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function isVisible(el) {
  return Boolean(el) && !el.hasAttribute("hidden");
}

function setHidden(el, hidden) {
  if (!el) return;
  if (hidden) el.setAttribute("hidden", "");
  else el.removeAttribute("hidden");
}

function initTabs() {
  const tablists = $all("[data-tablist]");
  tablists.forEach((tablist) => {
    const tabs = $all('[role="tab"]', tablist);
    if (!tabs.length) return;

    function selectTab(tab) {
      tabs.forEach((t) => t.setAttribute("aria-selected", t === tab ? "true" : "false"));

      // Optional: toggle tab panels if tab has aria-controls
      const controls = tab.getAttribute("aria-controls");
      if (controls) {
        const root = tablist.closest("section")?.parentElement || document;
        const panels = $all("[data-tabpanel]", root);
        panels.forEach((p) => setHidden(p, p.id !== controls));
      }
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => selectTab(tab));
      tab.addEventListener("keydown", (e) => {
        const idx = tabs.indexOf(tab);
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          const next = tabs[(idx + 1) % tabs.length];
          next.focus();
          selectTab(next);
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
          prev.focus();
          selectTab(prev);
        }
      });
    });
  });
}

function initDirectoryPagination() {
  const pagination = $("[data-pagination]");
  if (!pagination) return;

  const pageButtons = $all("[data-page]", pagination).filter((b) => b instanceof HTMLButtonElement);
  const pageNumberButtons = pageButtons.filter((b) => /^\d+$/.test(b.dataset.page || ""));
  const prevBtn = pageButtons.find((b) => b.dataset.page === "prev");
  const nextBtn = pageButtons.find((b) => b.dataset.page === "next");

  function getCurrentPage() {
    const currentBtn = pageNumberButtons.find((b) => b.getAttribute("aria-current") === "page");
    return currentBtn ? Number(currentBtn.dataset.page) : 1;
  }

  function setCurrentPage(page) {
    pageNumberButtons.forEach((b) => {
      const isCurrent = Number(b.dataset.page) === page;
      if (isCurrent) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });

    if (prevBtn) prevBtn.disabled = page <= Math.min(...pageNumberButtons.map((b) => Number(b.dataset.page)));
    if (nextBtn) nextBtn.disabled = page >= Math.max(...pageNumberButtons.map((b) => Number(b.dataset.page)));
  }

  pagination.addEventListener("click", (e) => {
    const target = e.target instanceof Element ? e.target.closest("[data-page]") : null;
    if (!target) return;

    const value = target.getAttribute("data-page");
    const current = getCurrentPage();

    if (value === "prev") setCurrentPage(current - 1);
    else if (value === "next") setCurrentPage(current + 1);
    else if (value && /^\d+$/.test(value)) setCurrentPage(Number(value));
  });
}

function initDirectoryFilters() {
  const form = $("[data-directory-filters]");
  if (!form) return;

  const advancedToggle = $("[data-filters-toggle]", form);
  const advancedId = advancedToggle?.getAttribute("aria-controls");
  const advanced = advancedId ? $("#" + advancedId) : null;

  if (advancedToggle && advanced) {
    advancedToggle.addEventListener("click", () => {
      const open = !isVisible(advanced);
      setHidden(advanced, !open);
      advancedToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  form.addEventListener("click", (e) => {
    const removeBtn = e.target instanceof Element ? e.target.closest("[data-filter-chip-remove]") : null;
    if (removeBtn) {
      const chip = removeBtn.closest("[data-filter-chip]");
      if (chip) chip.remove();
      return;
    }

    const clearBtn = e.target instanceof Element ? e.target.closest("[data-filters-clear]") : null;
    if (clearBtn) {
      // Clear inputs/selects
      $all("input, select, textarea", form).forEach((el) => {
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.value = "";
        if (el instanceof HTMLSelectElement) el.selectedIndex = 0;
      });

      // Remove chips
      $all("[data-filter-chip]", form).forEach((chip) => chip.remove());

      // Hide advanced area
      if (advancedToggle && advanced) {
        setHidden(advanced, true);
        advancedToggle.setAttribute("aria-expanded", "false");
      }
    }
  });
}

function initDropdowns() {
  // Optional pattern:
  // <div data-dropdown>
  //   <button data-dropdown-toggle aria-expanded="false" aria-controls="...">...</button>
  //   <div id="..." data-dropdown-menu hidden>...</div>
  // </div>
  $all("[data-dropdown]").forEach((root) => {
    const toggle = $("[data-dropdown-toggle]", root);
    const menu = $("[data-dropdown-menu]", root);
    if (!toggle || !menu) return;

    function setOpen(open) {
      setHidden(menu, !open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    toggle.addEventListener("click", () => setOpen(!isVisible(menu)));
    document.addEventListener("click", (e) => {
      if (!(e.target instanceof Node)) return;
      if (!root.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  });
}

function initPasswordToggles() {
  $all("[data-password-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const field = btn.closest(".input-icon")?.querySelector("[data-password]");
      if (!(field instanceof HTMLInputElement)) return;

      const willShow = field.type === "password";
      field.type = willShow ? "text" : "password";
      btn.setAttribute("aria-label", willShow ? "Hide password" : "Show password");

      const icon = btn.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = willShow ? "visibility_off" : "visibility";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initDirectoryPagination();
  initDirectoryFilters();
  initDropdowns();
  initPasswordToggles();
});

