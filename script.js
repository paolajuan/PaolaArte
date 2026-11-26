// Filtros de colección
const filters = document.querySelectorAll(".filter");
const works = [...document.querySelectorAll(".work")];

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    const f = btn.dataset.filter;
    filters.forEach((b) => {
      const on = b === btn;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on);
    });
    works.forEach((w) => w.classList.toggle("is-hidden", f !== "todas" && w.dataset.col !== f));
  });
});

// Visor de obras
const viewer = document.getElementById("viewer");
const vImg = document.getElementById("viewer-img");
const vCap = document.getElementById("viewer-cap");
let current = 0;

const visible = () => works.filter((w) => !w.classList.contains("is-hidden"));

function show(i) {
  const list = visible();
  current = (i + list.length) % list.length;
  const img = list[current].querySelector("img");
  vImg.src = img.src;
  vImg.alt = img.alt;
  vCap.textContent = list[current].querySelector(".work-col").textContent + " · Acuarela";
}

works.forEach((w) => {
  w.querySelector("button").addEventListener("click", () => {
    show(visible().indexOf(w));
    viewer.showModal();
  });
});

viewer.querySelector(".viewer-close").addEventListener("click", () => viewer.close());
viewer.querySelector(".viewer-prev").addEventListener("click", () => show(current - 1));
viewer.querySelector(".viewer-next").addEventListener("click", () => show(current + 1));
viewer.addEventListener("click", (e) => { if (e.target === viewer) viewer.close(); });
document.addEventListener("keydown", (e) => {
  if (!viewer.open) return;
  if (e.key === "ArrowLeft") show(current - 1);
  if (e.key === "ArrowRight") show(current + 1);
});

// Aparición suave al hacer scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".section-head, .work, .about-img, .about-text, .crafts li, .contact, .buy-note")
  .forEach((el) => { el.classList.add("reveal"); io.observe(el); });

document.getElementById("year").textContent = new Date().getFullYear();
