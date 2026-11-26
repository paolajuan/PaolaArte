const WA = "5491141575315";
const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

// Botones con mensaje predeterminado (data-wa)
document.querySelectorAll("[data-wa]").forEach((a) => { a.href = waLink(a.dataset.wa); });

// ---------- Fichas de obra ----------
const works = [...document.querySelectorAll(".work")];
works.forEach((w) => {
  const { title, size, price, status } = w.dataset;
  const sold = status === "vendida";
  const img = w.querySelector("img");
  const btn = document.createElement("button");
  btn.className = "work-img";
  btn.setAttribute("aria-label", `Ver ${title} en grande`);
  img.replaceWith(btn);
  btn.appendChild(img);
  if (sold) {
    const b = document.createElement("span");
    b.className = "badge badge-sold";
    b.textContent = "Vendida";
    btn.appendChild(b);
  }
  const info = document.createElement("div");
  info.className = "work-info";
  info.innerHTML = `
    <div class="work-text">
      <h3 class="work-title"></h3>
      <p class="work-meta"></p>
    </div>
    <div class="work-buy"></div>`;
  info.querySelector(".work-title").textContent = title;
  info.querySelector(".work-meta").textContent = `Acuarela · ${size}`;
  const buy = info.querySelector(".work-buy");
  if (sold) {
    buy.innerHTML = `<span class="work-price is-sold">Vendida</span>`;
    const a = document.createElement("a");
    a.className = "link-similar";
    a.textContent = "Pedir una similar";
    a.target = "_blank"; a.rel = "noopener";
    a.href = waLink(`Hola Paola, vi la obra "${title}" (vendida). ¿Podrías hacer una similar?`);
    buy.appendChild(a);
  } else {
    buy.innerHTML = `<span class="work-price"></span>`;
    buy.querySelector(".work-price").textContent = price;
    const a = document.createElement("a");
    a.className = "btn btn-whatsapp btn-sm";
    a.textContent = "Consultar";
    a.target = "_blank"; a.rel = "noopener";
    a.href = waLink(`Hola Paola, me interesa la obra "${title}" (${size}, ${price}). ¿Está disponible?`);
    buy.appendChild(a);
  }
  w.appendChild(info);
});

// Filtros
const filters = document.querySelectorAll(".filter");
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    const f = btn.dataset.filter;
    filters.forEach((b) => {
      const on = b === btn;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on);
    });
    works.forEach((w) => {
      const show = f === "todas" || (f === "disponibles" ? w.dataset.status !== "vendida" : w.dataset.col === f);
      w.classList.toggle("is-hidden", !show);
    });
  });
});

// ---------- Productos de la tienda ----------
document.querySelectorAll(".product").forEach((p) => {
  const { title, price, note } = p.dataset;
  const info = document.createElement("div");
  info.className = "product-info";
  info.innerHTML = `<h3></h3><p class="product-note"></p><div class="product-foot"><span class="work-price"></span></div>`;
  info.querySelector("h3").textContent = title;
  info.querySelector(".product-note").textContent = note || "Cerámica sublimada con mis acuarelas";
  info.querySelector(".work-price").textContent = price;
  const a = document.createElement("a");
  a.className = "btn btn-whatsapp btn-sm";
  a.textContent = "Lo quiero";
  a.target = "_blank"; a.rel = "noopener";
  a.href = waLink(`Hola Paola, quiero comprar: ${title} (${price}).`);
  info.querySelector(".product-foot").appendChild(a);
  p.appendChild(info);
});

// ---------- Visor de obras ----------
const viewer = document.getElementById("viewer");
const vImg = document.getElementById("viewer-img");
const vCap = document.getElementById("viewer-cap");
let current = 0;
const visible = () => works.filter((w) => !w.classList.contains("is-hidden"));

function show(i) {
  const list = visible();
  current = (i + list.length) % list.length;
  const w = list[current];
  const img = w.querySelector("img");
  vImg.src = img.src;
  vImg.alt = img.alt;
  const { title, size, price, status } = w.dataset;
  vCap.textContent = `${title} · Acuarela ${size} · ${status === "vendida" ? "Vendida" : price}`;
}

works.forEach((w) => {
  w.querySelector(".work-img").addEventListener("click", () => {
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

// ---------- Aparición suave ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".section-head, .work, .product, .class-card, .classes-intro, .about-img, .about-text, .contact, .buy-note")
  .forEach((el) => { el.classList.add("reveal"); io.observe(el); });

document.getElementById("year").textContent = new Date().getFullYear();
