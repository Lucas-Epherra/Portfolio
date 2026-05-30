const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const fadeItems = document.querySelectorAll(".fade-up");
const currentYear = document.getElementById("currentYear");

const projectThumbs = document.querySelectorAll(".project-thumb");
const imageModal = document.getElementById("imageModal");
const imageModalImg = document.getElementById("imageModalImg");
const imageModalTitle = document.getElementById("imageModalTitle");
const imageModalClose = document.getElementById("imageModalClose");
const imageModalBackdrop = document.getElementById("imageModalBackdrop");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const closeNavigation = () => {
  if (!menuBtn || !navLinks) return;

  navLinks.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.textContent = "Menú";
};

menuBtn?.addEventListener("click", () => {
  if (!navLinks) return;

  const isOpen = navLinks.classList.toggle("open");

  menuBtn.setAttribute("aria-expanded", String(isOpen));
  menuBtn.textContent = isOpen ? "Cerrar" : "Menú";
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
  document.body.style.overflow = "hidden";
};

const closeImageModal = () => {
  if (!imageModal || !imageModalImg || !imageModalTitle) return;

  imageModal.classList.remove("is-open");
  imageModal.setAttribute("aria-hidden", "true");
  imageModalImg.src = "";
  imageModalImg.alt = "";
  imageModalTitle.textContent = "";
  document.body.style.overflow = "";
};

projectThumbs.forEach((thumb) => {
  const handleOpenPreview = () => {
    const fullImage = thumb.dataset.full;
    const title = thumb.dataset.title || "Vista previa del proyecto";
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
