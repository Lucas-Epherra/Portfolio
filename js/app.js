const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const fadeItems = document.querySelectorAll(".fade-up");
const currentYear = document.getElementById("currentYear");
const themeToggle = document.getElementById("themeToggle");
const themeToggleLabel = themeToggle?.querySelector("[data-theme-label]");
const themeToggleIcon = themeToggle?.querySelector(".theme-toggle-icon");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

const projectThumbs = document.querySelectorAll(".project-thumb");
const imageModal = document.getElementById("imageModal");
const imageModalImg = document.getElementById("imageModalImg");
const imageModalTitle = document.getElementById("imageModalTitle");
const imageModalClose = document.getElementById("imageModalClose");
const imageModalBackdrop = document.getElementById("imageModalBackdrop");

const pageLanguage = document.documentElement.lang || "en";
const isSpanish = pageLanguage.toLowerCase().startsWith("es");
const menuLabel = menuBtn?.dataset.menuLabel || (isSpanish ? "Menú" : "Menu");
const closeLabel = menuBtn?.dataset.closeLabel || (isSpanish ? "Cerrar" : "Close");
const previewFallback = isSpanish ? "Vista previa del proyecto" : "Project preview";
const themeStorageKey = "portfolio-theme";
const darkThemeColor = "#141013";
const lightThemeColor = "#F8F5F0";

const getPreferredTheme = () => {
  const storedTheme = localStorage.getItem(themeStorageKey);

  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const updateThemeToggle = (theme) => {
  if (!themeToggle) return;

  const isDark = theme === "dark";
  const nextLabel = isDark
    ? themeToggle.dataset.lightLabel || (isSpanish ? "Claro" : "Light")
    : themeToggle.dataset.darkLabel || (isSpanish ? "Oscuro" : "Dark");
  const nextAria = isDark
    ? themeToggle.dataset.lightAria || (isSpanish ? "Cambiar a modo claro" : "Switch to light mode")
    : themeToggle.dataset.darkAria || (isSpanish ? "Cambiar a modo oscuro" : "Switch to dark mode");

  if (themeToggleLabel) {
    themeToggleLabel.textContent = nextLabel;
  }

  if (themeToggleIcon) {
    themeToggleIcon.textContent = isDark ? "☀" : "☾";
  }

  themeToggle.setAttribute("aria-label", nextAria);
  themeToggle.setAttribute("aria-pressed", String(isDark));
};

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;

  if (themeColorMeta) {
    themeColorMeta.setAttribute(
      "content",
      theme === "dark" ? darkThemeColor : lightThemeColor
    );
  }

  updateThemeToggle(theme);
};

applyTheme(getPreferredTheme());

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

themeToggle?.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme || getPreferredTheme();
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  localStorage.setItem(themeStorageKey, nextTheme);
  applyTheme(nextTheme);
});

const closeNavigation = () => {
  if (!menuBtn || !navLinks) return;

  navLinks.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.textContent = menuLabel;
};

menuBtn?.addEventListener("click", () => {
  if (!navLinks) return;

  const isOpen = navLinks.classList.toggle("open");

  menuBtn.setAttribute("aria-expanded", String(isOpen));
  menuBtn.textContent = isOpen ? closeLabel : menuLabel;
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

fadeItems.forEach((item) => observer.observe(item));

const openImageModal = (src, title, altText = "") => {
  if (!imageModal || !imageModalImg || !imageModalTitle || !src) return;

  imageModalImg.src = src;
  imageModalImg.alt = altText || title;
  imageModalTitle.textContent = title;
  imageModal.classList.add("is-open");
  imageModal.setAttribute("aria-hidden", "false");
  imageModal.removeAttribute("inert");
  document.body.style.overflow = "hidden";
};

const closeImageModal = () => {
  if (!imageModal || !imageModalImg || !imageModalTitle) return;

  imageModal.classList.remove("is-open");
  imageModal.setAttribute("aria-hidden", "true");
  imageModal.setAttribute("inert", "");
  imageModalImg.src = "";
  imageModalImg.alt = "";
  imageModalTitle.textContent = "";
  document.body.style.overflow = "";
};

projectThumbs.forEach((thumb) => {
  const handleOpenPreview = () => {
    const fullImage = thumb.dataset.full;
    const title = thumb.dataset.title || previewFallback;
    const image = thumb.querySelector(".project-image");
    const altText = image?.alt || title;

    openImageModal(fullImage, title, altText);
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
  if (event.key === "Escape") {
    closeNavigation();

    if (imageModal?.classList.contains("is-open")) {
      closeImageModal();
    }
  }
});
