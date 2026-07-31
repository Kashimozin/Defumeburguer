/* ============ Dêfumê Burger — Vanilla JS ============ */

const WA = "https://wa.me/5511999999999?text=Ol%C3%A1%20D%C3%AAfum%C3%AA%2C%20quero%20fazer%20um%20pedido!";

const PRODUCTS = [
  {id:"defume-classic",name:"Dêfumê Classic",category:"Signature",
    ingredients:"Blend 180g, cheddar defumado, bacon caramelizado, cebola roxa, picles, molho da casa, pão brioche.",
    description:"O ícone da casa. Defumado por 12 horas em lenha de nogueira até o sabor invadir cada fibra da carne.",
    price:"R$ 42",badge:"Mais Pedido",image:"assets/hero-burger.jpg"},
  {id:"smash-duplo",name:"Smash Duplo",category:"Smash",
    ingredients:"Dois smash 90g, dobro de cheddar americano, picles, mostarda e maionese defumada.",
    description:"Duas camadas selando o suco no ponto exato. Crocante por fora, absurdo por dentro.",
    price:"R$ 36",image:"assets/burger-classic.jpg"},
  {id:"bbq-lenha",name:"BBQ na Lenha",category:"Defumados",
    ingredients:"Blend 200g, cheddar, cebolas caramelizadas em cerveja, bacon crocante, BBQ artesanal.",
    description:"A fumaça vira personagem. Aroma que atravessa a mesa antes do primeiro toque.",
    price:"R$ 48",badge:"Especial",image:"assets/burger-bbq.jpg"},
  {id:"fogo-verde",name:"Fogo Verde",category:"Picantes",
    ingredients:"Blend 180g, pepper jack, jalapeño, geleia de pimenta verde, chipotle da casa.",
    description:"Verde cana com atitude. Sobe pelo nariz, desce pela alma.",
    price:"R$ 45",badge:"Novo",image:"assets/burger-spicy.jpg"},
  {id:"trufado",name:"Trufado Real",category:"Premium",
    ingredients:"Blend 200g, queijo suíço, cogumelos ao vinho, aioli de trufa negra, brioche dourado.",
    description:"Terra, floresta e fogo em um só ato. Ingrediente raro, execução meticulosa.",
    price:"R$ 62",badge:"Especial",image:"assets/burger-truffle.jpg"},
  {id:"cana-verde",name:"Cana Verde",category:"Signature",
    ingredients:"Blend 180g, cheddar defumado, rúcula, tomate confitado, maionese verde, pão australiano.",
    description:"O verde que assina a casa. Frescor, defumação e um final de boca inesquecível.",
    price:"R$ 44",image:"assets/hero-burger.jpg"},
];

const GALLERY = [
  "assets/hero-burger.jpg","assets/gallery-grill.jpg","assets/burger-bbq.jpg",
  "assets/gallery-fries.jpg","assets/burger-truffle.jpg","assets/gallery-beer.jpg",
  "assets/burger-spicy.jpg","assets/burger-classic.jpg"
];

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const el = (tag, attrs={}, ...children) => {
  const e = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)) {
    if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const c of children.flat()) if (c != null) e.append(c.nodeType ? c : document.createTextNode(c));
  return e;
};

/* ---- Populate WA links ---- */
document.addEventListener("DOMContentLoaded", () => {
  $$("[data-wa]").forEach(a => a.href = WA);
  document.getElementById("year").textContent = new Date().getFullYear();
  renderTopCards();
  renderMenu();
  renderGallery();
  initReveal();
  initParallax();
  initHeroMouse();
  initCounters();
});

/* ---- Cards ---- */
function cardEl(p, i, extraCls="") {
  const badge = p.badge ? `<span class="badge">${p.badge}</span>` : "";
  return el("button", {
    class:`card glass shadow-cinema reveal ${extraCls}`,
    "data-parallax": (((i%3)-1)*0.08).toString(),
    style:`transition-delay:${(i%3)*100}ms`,
    onclick: () => openProduct(p)
  }, Object.assign(document.createElement("div"), { innerHTML: `
    <div class="cover">
      <img src="${p.image}" alt="${p.name}" loading="lazy" width="1024" height="1024" />
      <div class="veil"></div>
      ${badge}
      <span class="cat glass">${p.category}</span>
    </div>
    <div class="body">
      <div class="cat-text">${p.category}</div>
      <h3 class="font-display">${p.name}</h3>
      <p>${p.description}</p>
      <div class="row">
        <span class="price">${p.price}</span>
        <span class="cta">Ver detalhes →</span>
      </div>
    </div>
  `}));
}

function renderTopCards() {
  const root = document.getElementById("top-cards");
  PRODUCTS.slice(0,3).forEach((p,i) => root.append(cardEl(p,i)));
}
function renderMenu() {
  const root = document.getElementById("menu-cards");
  PRODUCTS.forEach((p,i) => root.append(cardEl(p,i)));
}
function renderGallery() {
  const root = document.getElementById("gallery");
  GALLERY.forEach((src,i) => {
    root.append(el("button", {
      class:"reveal",
      "data-parallax": (((i%4)-1.5)*0.05).toString(),
      style:`transition-delay:${(i%4)*80}ms`,
      onclick: () => openLightbox(i)
    }, Object.assign(document.createElement("div"), { innerHTML: `<img src="${src}" alt="" loading="lazy" />` }).firstElementChild));
  });
}

/* ---- Reveal ---- */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold:0.12, rootMargin:"0px 0px -60px 0px" });
  $$(".reveal, .reveal-zoom, .reveal-left, .reveal-right").forEach(el => io.observe(el));
}

/* ---- Parallax + scroll progress ---- */
function initParallax() {
  const mq = matchMedia("(prefers-reduced-motion: reduce)");
  if (mq.matches) return;

  const els = $$("[data-parallax], [data-parallax-x], [data-parallax-scale], [data-parallax-rotate]");
  const progress = $(".scroll-progress");
  const visible = new Set();
  let raf = 0, ticking = false;

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { visible.add(e.target); e.target.classList.add("is-visible"); }
      else { visible.delete(e.target); e.target.classList.remove("is-visible"); }
    }
  }, { rootMargin:"20% 0px 20% 0px" });
  els.forEach(el => io.observe(el));

  const tick = () => {
    ticking = false;
    const vh = innerHeight;
    if (progress) {
      const max = document.documentElement.scrollHeight - vh;
      progress.style.transform = `scaleX(${Math.min(1, scrollY / Math.max(1,max))})`;
    }
    visible.forEach(el => {
      const r = el.getBoundingClientRect();
      const rel = (r.top + r.height/2 - vh/2) / vh;
      const c = Math.max(-1.4, Math.min(1.4, rel));
      const sy = parseFloat(el.dataset.parallax || "0");
      const sx = parseFloat(el.dataset.parallaxX || "0");
      const ss = parseFloat(el.dataset.parallaxScale || "0");
      const sr = parseFloat(el.dataset.parallaxRotate || "0");
      if (sy) el.style.setProperty("--py", `${(-c*sy*100).toFixed(2)}px`);
      if (sx) el.style.setProperty("--px", `${(-c*sx*100).toFixed(2)}px`);
      if (ss) el.style.setProperty("--ps", `${(1+c*ss).toFixed(4)}`);
      if (sr) el.style.setProperty("--pr", `${(c*sr).toFixed(2)}deg`);
    });
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    raf = requestAnimationFrame(tick);
  };
  addEventListener("scroll", onScroll, { passive:true });
  addEventListener("resize", onScroll, { passive:true });
  tick();
}

/* ---- Hero mouse parallax ---- */
function initHeroMouse() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (matchMedia("(pointer: coarse)").matches) return;
  const img = document.getElementById("hero-img");
  if (!img) return;
  let raf = 0, active = true;
  const io = new IntersectionObserver(([e]) => { active = e.isIntersecting; });
  io.observe(img);
  addEventListener("mousemove", (e) => {
    if (!active) return;
    const tx = (e.clientX/innerWidth - .5) * 20;
    const ty = (e.clientY/innerHeight - .5) * 20;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      img.style.transform = `translate3d(${tx}px,${ty}px,0)`;
    });
  }, { passive:true });
}

/* ---- Counters ---- */
function initCounters() {
  $$(".counter").forEach(node => {
    const to = parseInt(node.dataset.to, 10);
    const suffix = node.dataset.suffix || "";
    const out = node.querySelector(".n");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const start = performance.now(), dur = 1800;
          const step = t => {
            const p = Math.min(1, (t-start)/dur);
            const eased = 1 - Math.pow(1-p, 3);
            out.textContent = "+" + Math.round(to*eased).toLocaleString("pt-BR") + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      });
    }, { threshold:0.5 });
    io.observe(node);
  });
}

/* ---- Product modal ---- */
function openProduct(p) {
  const m = document.getElementById("product-modal");
  m.querySelector(".m-img img").src = p.image;
  m.querySelector(".m-img img").alt = p.name;
  m.querySelector(".cat-text").textContent = p.category;
  m.querySelector("h3").textContent = p.name;
  m.querySelector(".desc").textContent = p.description;
  m.querySelector(".ing p").textContent = p.ingredients;
  m.querySelector(".price").textContent = p.price;
  const b = m.querySelector(".badge");
  if (p.badge) { b.textContent = p.badge; b.style.display=""; } else { b.style.display="none"; }
  m.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeProduct() {
  document.getElementById("product-modal").classList.remove("open");
  document.body.style.overflow = "";
}

/* ---- Lightbox ---- */
let lbIndex = 0;
function openLightbox(i) {
  lbIndex = i;
  const lb = document.getElementById("lightbox");
  lb.querySelector("img").src = GALLERY[i];
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
}
function moveLightbox(dir) {
  lbIndex = (lbIndex + dir + GALLERY.length) % GALLERY.length;
  document.querySelector("#lightbox img").src = GALLERY[lbIndex];
}
function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeProduct(); closeLightbox(); }
  if (document.getElementById("lightbox").classList.contains("open")) {
    if (e.key === "ArrowLeft") moveLightbox(-1);
    if (e.key === "ArrowRight") moveLightbox(1);
  }
});

/* expose for inline handlers */
window.closeProduct = closeProduct;
window.closeLightbox = closeLightbox;
window.moveLightbox = moveLightbox;
