(() => {
  "use strict";

  const themeStorageKey = "portfolio-theme";
  const darkThemeColor = "#141013";
  const lightThemeColor = "#F8F5F0";

  const currentYear = document.getElementById("currentYear");
  const fadeItems = document.querySelectorAll(".fade-up");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  const siteHeader = document.querySelector("[data-site-header]");
  const menuButton =
    siteHeader?.querySelector("[data-site-menu-button]") ?? null;
  const mobilePanel =
    siteHeader?.querySelector("[data-site-menu-panel]") ?? null;
  const mobileLinks =
    siteHeader?.querySelectorAll("[data-site-menu-link]") ?? [];
  const themeToggles = document.querySelectorAll("[data-theme-toggle]");
  const mobileQuery = window.matchMedia("(max-width: 920px)");
  const projectThumbs = document.querySelectorAll(".project-thumb");
  const imageModal = document.getElementById("imageModal");
  const imageModalImg = document.getElementById("imageModalImg");
  const imageModalTitle = document.getElementById("imageModalTitle");
  const imageModalClose = document.getElementById("imageModalClose");
  const imageModalBackdrop = document.getElementById("imageModalBackdrop");

  const pageLanguage = document.documentElement.lang || "en";
  const isSpanish = pageLanguage.toLowerCase().startsWith("es");
  const previewFallback = isSpanish
    ? "Vista previa del proyecto"
    : "Project preview";

  let lastFocusedElement = null;

  /**
   * Safely reads from localStorage.
   *
   * @param {string} key
   * @returns {string | null}
   */
  const safeGetStorageItem = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  /**
   * Safely writes to localStorage.
   *
   * @param {string} key
   * @param {string} value
   */
  const safeSetStorageItem = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Ignore persistence failure.
    }
  };

  /**
   * Gets stored theme or falls back to system preference.
   *
   * @returns {"light" | "dark"}
   */
  const getPreferredTheme = () => {
    const storedTheme = safeGetStorageItem(themeStorageKey);

    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  /**
   * Applies the selected theme to the document.
   *
   * @param {"light" | "dark"} theme
   */
  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;

    if (themeColorMeta) {
      themeColorMeta.setAttribute(
        "content",
        theme === "dark" ? darkThemeColor : lightThemeColor,
      );
    }

    themeToggles.forEach((toggle) => {
      const labelNode = toggle.querySelector("[data-theme-label]");
      const iconNode = toggle.querySelector("[data-theme-icon]");
      const isDark = theme === "dark";

      const nextLabel = isDark
        ? toggle.dataset.lightLabel || (isSpanish ? "Claro" : "Light")
        : toggle.dataset.darkLabel || (isSpanish ? "Oscuro" : "Dark");

      const nextAria = isDark
        ? toggle.dataset.lightAria ||
          (isSpanish ? "Cambiar a modo claro" : "Switch to light mode")
        : toggle.dataset.darkAria ||
          (isSpanish ? "Cambiar a modo oscuro" : "Switch to dark mode");

      if (labelNode) {
        labelNode.textContent = nextLabel;
      }

      if (iconNode) {
        iconNode.textContent = isDark ? "☀" : "☾";
      }

      toggle.setAttribute("aria-label", nextAria);
      toggle.setAttribute("aria-pressed", String(isDark));
    });
  };

  /**
   * Opens the mobile menu.
   */
  const openMenu = () => {
    if (!siteHeader || !menuButton || !mobilePanel) return;

    siteHeader.setAttribute("data-menu-state", "open");
    menuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("has-menu-open");
    mobilePanel.removeAttribute("inert");
  };

  /**
   * Closes the mobile menu.
   *
   * @param {{ restoreFocus?: boolean }} options
   */
  const closeMenu = ({ restoreFocus = false } = {}) => {
    if (!siteHeader || !menuButton || !mobilePanel) return;

    siteHeader.setAttribute("data-menu-state", "closed");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("has-menu-open");

    if (mobileQuery.matches) {
      mobilePanel.setAttribute("inert", "");
    } else {
      mobilePanel.removeAttribute("inert");
    }

    if (restoreFocus) {
      menuButton.focus();
    }
  };

  /**
   * Toggles the mobile menu state.
   */
  const toggleMenu = () => {
    if (!siteHeader) return;

    const isOpen = siteHeader.getAttribute("data-menu-state") === "open";

    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  };

  /**
   * Opens the project image preview modal.
   *
   * @param {string | undefined} src
   * @param {string} title
   * @param {string} altText
   * @param {HTMLElement | null} trigger
   */
  const openImageModal = (src, title, altText = "", trigger = null) => {
    if (!imageModal || !imageModalImg || !imageModalTitle || !src) return;

    lastFocusedElement = trigger || document.activeElement;

    imageModalImg.src = src;
    imageModalImg.alt = altText || title;
    imageModalTitle.textContent = title;

    imageModal.classList.add("is-open");
    imageModal.setAttribute("aria-hidden", "false");
    imageModal.removeAttribute("inert");

    document.body.style.overflow = "hidden";
    imageModalClose?.focus();
  };

  /**
   * Closes the project image preview modal.
   */
  const closeImageModal = () => {
    if (!imageModal || !imageModalImg || !imageModalTitle) return;

    const wasOpen = imageModal.classList.contains("is-open");

    imageModal.classList.remove("is-open");
    imageModal.setAttribute("aria-hidden", "true");
    imageModal.setAttribute("inert", "");

    imageModalImg.src = "";
    imageModalImg.alt = "";
    imageModalTitle.textContent = "";

    document.body.style.overflow = "";

    if (wasOpen && lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }

    lastFocusedElement = null;
  };

  applyTheme(getPreferredTheme());

  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  if (mobilePanel && mobileQuery.matches) {
    mobilePanel.setAttribute("inert", "");
  }

  themeToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const currentTheme =
        document.documentElement.dataset.theme || getPreferredTheme();
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      safeSetStorageItem(themeStorageKey, nextTheme);
      applyTheme(nextTheme);
    });
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      const storedTheme = safeGetStorageItem(themeStorageKey);

      if (storedTheme !== "dark" && storedTheme !== "light") {
        applyTheme(getPreferredTheme());
      }
    });

  menuButton?.addEventListener("click", toggleMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!siteHeader) return;

    const isOpen = siteHeader.getAttribute("data-menu-state") === "open";
    if (!isOpen) return;

    const target = event.target;

    if (target instanceof Node && siteHeader.contains(target)) return;

    closeMenu();
  });

  mobileQuery.addEventListener("change", () => {
    closeMenu();

    if (!mobilePanel) return;

    if (mobileQuery.matches) {
      mobilePanel.setAttribute("inert", "");
      return;
    }

    mobilePanel.removeAttribute("inert");
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
      },
    );

    fadeItems.forEach((item) => observer.observe(item));
  } else {
    fadeItems.forEach((item) => item.classList.add("visible"));
  }

  projectThumbs.forEach((thumb) => {
    if (!(thumb instanceof HTMLElement)) return;

    if (!thumb.hasAttribute("tabindex")) {
      thumb.setAttribute("tabindex", "0");
    }

    if (!thumb.hasAttribute("role")) {
      thumb.setAttribute("role", "button");
    }

    const handleOpenPreview = () => {
      const fullImage = thumb.dataset.full;
      const title = thumb.dataset.title || previewFallback;
      const image = thumb.querySelector(".project-image");
      const altText = image instanceof HTMLImageElement ? image.alt : title;

      openImageModal(fullImage, title, altText, thumb);
    };

    thumb.addEventListener("click", handleOpenPreview);

    thumb.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      handleOpenPreview();
    });
  });

  imageModalClose?.addEventListener("click", closeImageModal);
  imageModalBackdrop?.addEventListener("click", closeImageModal);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (siteHeader?.getAttribute("data-menu-state") === "open") {
      closeMenu({ restoreFocus: true });
    }

    if (imageModal?.classList.contains("is-open")) {
      closeImageModal();
    }
  });
})();
