/**
 * main.js
 * Complete page behaviors for Alumni Portal:
 * - Reusable modal system (open/close/ESC/overlay)
 * - Toast notifications (success/error, auto-dismiss)
 * - Tabs (aria-selected + optional tabpanel show/hide)
 * - Directory pagination UI state
 * - Directory filter toggles (More filters, clear chips)
 * - Password visibility toggle (auth forms)
 * - Connect button toggle (→ Pending)
 * - RSVP button toggle (→ RSVP'd)
 * - Like/Comment post actions
 * - Save Job toggle
 * - Apply Job modal
 * - Create Post (dynamic prepend)
 * - Settings form save with toast
 * - Copy to clipboard
 * - Auth form handling (forgot-password toast)
 */

/* ── Helpers ──────────────────────── */

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

/* ── Toast System ─────────────────── */

function getToastContainer() {
  let c = $(".toast-container");
  if (!c) {
    c = document.createElement("div");
    c.className = "toast-container";
    c.setAttribute("aria-live", "polite");
    document.body.appendChild(c);
  }
  return c;
}

function showToast(message, type = "success") {
  const container = getToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  const icon = type === "success" ? "check_circle" : "error";
  toast.innerHTML = `<span class="material-symbols-outlined" style="font-size:20px">${icon}</span> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("is-leaving");
    toast.addEventListener("animationend", () => toast.remove());
  }, 3000);
}

/* ── Modal System ─────────────────── */

function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add("is-open");
  document.body.classList.add("is-scroll-locked");

  // Focus the first focusable element
  requestAnimationFrame(() => {
    const focusable = overlay.querySelector("input, textarea, select, button:not([data-modal-close])");
    if (focusable) focusable.focus();
  });
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove("is-open");
  document.body.classList.remove("is-scroll-locked");
}

function closeAllModals() {
  $all(".modal-overlay.is-open").forEach((o) => {
    o.classList.remove("is-open");
  });
  document.body.classList.remove("is-scroll-locked");
}

function initModals() {
  // Open triggers: [data-modal-open="modalId"]
  document.addEventListener("click", (e) => {
    const trigger = e.target instanceof Element ? e.target.closest("[data-modal-open]") : null;
    if (trigger) {
      e.preventDefault();
      openModal(trigger.getAttribute("data-modal-open"));
    }
  });

  // Close triggers: [data-modal-close]
  document.addEventListener("click", (e) => {
    const closeBtn = e.target instanceof Element ? e.target.closest("[data-modal-close]") : null;
    if (closeBtn) {
      const overlay = closeBtn.closest(".modal-overlay");
      if (overlay) closeModal(overlay.id);
    }
  });

  // Close on overlay click (not modal body)
  $all(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // ESC to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });
}

/* ── Tabs ─────────────────────────── */

function initTabs() {
  const tablists = $all("[data-tablist]");
  tablists.forEach((tablist) => {
    const tabs = $all('[role="tab"]', tablist);
    if (!tabs.length) return;

    function selectTab(tab) {
      tabs.forEach((t) => t.setAttribute("aria-selected", t === tab ? "true" : "false"));

      // Toggle tab panels if tab has aria-controls
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

/* ── Directory Pagination ─────────── */

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

/* ── Directory Filters ────────────── */

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
      $all("input, select, textarea", form).forEach((el) => {
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.value = "";
        if (el instanceof HTMLSelectElement) el.selectedIndex = 0;
      });
      $all("[data-filter-chip]", form).forEach((chip) => chip.remove());
      if (advancedToggle && advanced) {
        setHidden(advanced, true);
        advancedToggle.setAttribute("aria-expanded", "false");
      }
    }
  });
}

/* ── Dropdowns ────────────────────── */

function initDropdowns() {
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

/* ── Password Toggles ─────────────── */

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

/* ── Connect Buttons ──────────────── */

function initConnectButtons() {
  document.addEventListener("click", (e) => {
    const btn = e.target instanceof Element ? e.target.closest("[data-connect]") : null;
    if (!btn || btn.classList.contains("is-connected")) return;

    btn.classList.add("is-connected");
    btn.textContent = "Pending";
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-ghost");
    btn.setAttribute("aria-disabled", "true");
    showToast("Connection request sent!");
  });
}

/* ── RSVP Buttons ─────────────────── */

function initRSVPButtons() {
  document.addEventListener("click", (e) => {
    const btn = e.target instanceof Element ? e.target.closest("[data-rsvp]") : null;
    if (!btn || btn.classList.contains("is-rsvpd")) return;

    btn.classList.add("is-rsvpd");
    btn.textContent = "RSVP'd ✓";
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-ghost");
    btn.setAttribute("aria-disabled", "true");
    showToast("You're registered for this event!");
  });
}

/* ── Like / Comment / Share ───────── */

function initPostActions() {
  document.addEventListener("click", (e) => {
    const btn = e.target instanceof Element ? e.target.closest(".post-action") : null;
    if (!btn) return;

    const label = btn.textContent.trim().toLowerCase();

    if (label.includes("like")) {
      btn.classList.toggle("is-active");
      const isLiked = btn.classList.contains("is-active");
      btn.innerHTML = `<span class="material-symbols-outlined">${isLiked ? "favorite" : "favorite_border"}</span> ${isLiked ? "Liked" : "Like"}`;
    }

    if (label.includes("comment")) {
      const card = btn.closest(".card, article");
      if (!card) return;
      const section = $(".comment-section", card);
      if (section) {
        const hidden = section.hasAttribute("hidden");
        setHidden(section, !hidden);
        btn.classList.toggle("is-active", hidden);
      }
    }

    if (label.includes("share")) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard!");
      } else {
        showToast("Share link: " + window.location.href);
      }
    }
  });
}

/* ── Save Job Toggle ──────────────── */

function initSaveJob() {
  document.addEventListener("click", (e) => {
    const btn = e.target instanceof Element ? e.target.closest("[data-save-job]") : null;
    if (!btn) return;

    const isSaved = btn.classList.toggle("is-active");
    btn.textContent = isSaved ? "Saved ✓" : "Save";
    showToast(isSaved ? "Job saved!" : "Job removed from saved.");
  });
}

/* ── Create Post (Feed) ───────────── */

function initCreatePost() {
  const form = $("[data-create-post]");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const textarea = $("textarea", form);
    if (!textarea || !textarea.value.trim()) return;

    const content = textarea.value.trim();
    const postHTML = `
      <article class="card" aria-label="Your post">
        <header class="card__header">
          <div class="profile-header__identity" aria-label="Post author">
            <span class="topbar__avatar" aria-hidden="true" style="width:40px;height:40px;border-radius:999px;display:inline-grid;place-items:center;background:rgba(31,41,55,0.08);border:1px solid rgba(31,41,55,0.12);font-weight:900;color:var(--primary);font-size:0.85rem">RS</span>
            <div>
              <strong>Robert Chen</strong>
              <div class="meta">Just now</div>
            </div>
          </div>
        </header>
        <p class="m-0">${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
        <div class="post-actions" aria-label="Post actions">
          <button class="post-action" type="button"><span class="material-symbols-outlined">favorite_border</span> Like</button>
          <button class="post-action" type="button"><span class="material-symbols-outlined">chat_bubble_outline</span> Comment</button>
          <button class="post-action" type="button"><span class="material-symbols-outlined">share</span> Share</button>
        </div>
        <div class="comment-section" hidden>
          <div class="comment-input-row">
            <input class="input-field" type="text" placeholder="Write a comment…" />
            <button class="btn btn-primary" type="button" data-add-comment>Post</button>
          </div>
        </div>
      </article>
    `;

    // Insert after the create-post card
    const postContainer = form.closest(".card, section");
    if (postContainer) {
      postContainer.insertAdjacentHTML("afterend", postHTML);
    }

    textarea.value = "";
    showToast("Post published!");
  });

  // Also handle the modal create-post if present
  const modalForm = $("[data-modal-post-form]");
  if (modalForm) {
    modalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const textarea = $("textarea", modalForm);
      if (!textarea || !textarea.value.trim()) return;

      // Re-use same logic: set the main textarea and trigger submit
      const mainTextarea = $("[data-create-post] textarea");
      if (mainTextarea) {
        mainTextarea.value = textarea.value;
        mainTextarea.form?.requestSubmit?.() || mainTextarea.form?.dispatchEvent(new Event("submit"));
      }
      textarea.value = "";
      closeAllModals();
    });
  }
}

/* ── Settings Save ────────────────── */

function initSettingsSave() {
  $all("[data-settings-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Settings saved successfully!");
    });
  });
}

/* ── Copy to Clipboard ────────────── */

function initCopyButtons() {
  document.addEventListener("click", (e) => {
    const btn = e.target instanceof Element ? e.target.closest("[data-copy]") : null;
    if (!btn) return;

    const text = btn.getAttribute("data-copy");
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied to clipboard!");
    }).catch(() => {
      showToast("Failed to copy", "error");
    });
  });
}

/* ── Auth Form Enhancements ───────── */

function initAuthForms() {
  // Forgot password: show toast before redirect
  const forgotForm = $(".auth form[action*='index']");
  if (forgotForm && window.location.pathname.includes("forgot")) {
    forgotForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Reset link sent to your email!");
      setTimeout(() => {
        window.location.href = "./index.html";
      }, 1800);
    });
  }
}

/* ── Add Comment (inline) ─────────── */

function initInlineComments() {
  document.addEventListener("click", (e) => {
    const btn = e.target instanceof Element ? e.target.closest("[data-add-comment]") : null;
    if (!btn) return;

    const row = btn.closest(".comment-input-row");
    if (!row) return;
    const input = $("input", row);
    if (!input || !input.value.trim()) return;

    const text = input.value.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const commentHTML = `
      <div class="comment-item">
        <span class="topbar__avatar" aria-hidden="true" style="width:32px;height:32px;font-size:0.7rem;border-radius:999px;display:inline-grid;place-items:center;background:rgba(31,41,55,0.08);border:1px solid rgba(31,41,55,0.12);font-weight:900;color:var(--primary);flex-shrink:0">RS</span>
        <div class="comment-item__body">
          <strong style="font-size:0.9rem">Robert Chen</strong>
          <p class="m-0" style="font-size:0.9rem">${text}</p>
        </div>
      </div>
    `;

    row.insertAdjacentHTML("beforebegin", commentHTML);
    input.value = "";
  });
}

/* ── Apply Job Modal Submit ───────── */

function initApplyJobModal() {
  const form = $("[data-apply-job-form]");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    closeAllModals();
    showToast("Application submitted successfully!");
  });
}

/* ── Message Modal Submit ─────────── */

function initMessageModal() {
  const form = $("[data-message-form]");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    closeAllModals();
    showToast("Message sent!");
    const textarea = $("textarea", form);
    if (textarea) textarea.value = "";
  });
}

/* ── Logout ───────────────────────── */

function initLogout() {
  document.addEventListener("click", (e) => {
    const btn = e.target instanceof Element ? e.target.closest("[data-logout-confirm]") : null;
    if (!btn) return;
    window.location.href = "./index.html";
  });
}

/* ── Feed Filter Tabs ─────────────── */

function initFeedFilters() {
  const tablist = $("[data-feed-tabs]");
  if (!tablist) return;

  const tabs = $all('[role="tab"]', tablist);
  const posts = $all("[data-post-category]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-selected", t === tab ? "true" : "false"));
      const category = tab.getAttribute("data-filter") || "all";

      posts.forEach((post) => {
        if (category === "all") {
          post.removeAttribute("hidden");
        } else {
          const postCat = post.getAttribute("data-post-category") || "";
          setHidden(post, postCat !== category);
        }
      });
    });
  });
}

/* ── Create Event Submit ───────────── */

function initCreateEvent() {
  const form = $("[data-create-event-form]");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    closeAllModals();
    showToast("Event created successfully!");
    const inputs = $all("input, textarea, select", form);
    inputs.forEach((input) => {
      if (input.tagName === 'SELECT') input.selectedIndex = 0;
      else input.value = "";
    });
  });
}

/* ── Load User Profile ───────────── */

function loadUserProfile() {
  // Only run on user-profile.html
  if (!window.location.pathname.includes("user-profile.html")) return;

  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id");

  if (!userId || !window.ALUMNI_DATA || !window.ALUMNI_DATA[userId]) {
    // If no ID or invalid ID, maybe redirect or show default?
    // For now, let's just leave the "Loading..." state or show an error
    const nameEl = document.getElementById("p-name");
    if (nameEl) nameEl.textContent = "Alumni not found";
    return;
  }

  const data = window.ALUMNI_DATA[userId];

  // Text fields
  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setText("p-name", data.name);
  setText("p-role", data.role);
  setText("p-company", data.company);
  setText("p-batch", data.batch);
  setText("p-branch", data.branch);
  setText("p-location", data.location);
  setText("p-about", data.about);
  setText("p-email", data.email);
  setText("p-linkedin", data.linkedin);

  // Attributes
  const avatar = document.getElementById("p-avatar");
  if (avatar) avatar.src = data.avatar;

  // Actions
  const copyBtn = document.getElementById("p-copy-email");
  if (copyBtn) copyBtn.setAttribute("data-copy", data.email);

  const linkedinLink = document.getElementById("p-linkedin-link");
  if (linkedinLink) linkedinLink.href = "https://" + data.linkedin;

  // Render arrays (Skills & Experience)
  const skillsContainer = document.getElementById("p-skills");
  if (skillsContainer && data.skills) {
    skillsContainer.innerHTML = data.skills
      .map(skill => `<span class="badge">${skill}</span>`)
      .join("");
  }

  const expContainer = document.getElementById("p-experience");
  if (expContainer && data.experience) {
    expContainer.innerHTML = data.experience
      .map((job, index) => `
        <div>
          <strong>${job.role}</strong>
          <div class="meta">${job.company} • ${job.duration}</div>
        </div>
        ${index < data.experience.length - 1 ? '<hr class="divider" />' : ''}
      `)
      .join("");
  }

  // Update Page Title
  document.title = `${data.name} | Alumni Portal`;
}

/* ── Init Everything ──────────────── */

document.addEventListener("DOMContentLoaded", () => {
  initModals();
  initTabs();
  initDirectoryPagination();
  initDirectoryFilters();
  initDropdowns();
  initPasswordToggles();
  initConnectButtons();
  initRSVPButtons();
  initPostActions();
  initSaveJob();
  initCreatePost();
  initSettingsSave();
  initCopyButtons();
  initAuthForms();
  initInlineComments();
  initApplyJobModal();
  initMessageModal();
  initCreateEvent();
  initApplyJobModal();
  initMessageModal();
  initCreateEvent();
  initLogout();
  initFeedFilters();
  loadUserProfile();
});
