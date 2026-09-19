(() => {
  const WA = "5491153873484";
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".progress span");
  const menuButton = document.querySelector(".menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");
  const revealRange = document.querySelector(".reveal-range");
  const afterClip = document.querySelector(".after-clip");
  const divider = document.querySelector(".reveal-divider");
  const form = document.querySelector("#quote-form");
  const preview = document.querySelector("#quote-preview");

  const waUrl = (message) => `https://wa.me/${WA}?text=${encodeURIComponent(message)}`;

  document.querySelectorAll("[data-wa]").forEach((link) => {
    link.href = waUrl(link.dataset.wa);
  });

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    mobileMenu.classList.toggle("open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("menu-open", open);
  });
  mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  const setReveal = (value) => {
    afterClip.style.left = `${value}%`;
    divider.style.left = `${value}%`;
  };
  revealRange.addEventListener("input", () => setReveal(revealRange.value));

  const watched = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  watched.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(element);
  });

  const selectedValue = (name) => form.querySelector(`[name="${name}"]:checked`)?.value || "";
  const selectedJobs = () => [...form.querySelectorAll('[name="trabajo"]:checked')].map((input) => input.value);

  const updatePreview = () => {
    const zone = selectedValue("zona");
    const place = selectedValue("espacio").replace(/^un(a)? /, "");
    const jobs = selectedJobs();
    preview.textContent = `${place.charAt(0).toUpperCase() + place.slice(1)} en ${zone} · ${jobs.length ? jobs.join(", ") : "elegí uno o más trabajos"}.`;
  };
  form.addEventListener("change", updatePreview);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const zone = selectedValue("zona");
    const place = selectedValue("espacio");
    const jobs = selectedJobs();
    const detail = form.elements.detalle.value.trim();
    const jobText = jobs.length ? jobs.join(", ") : "un trabajo a definir";
    const lines = [
      "Hola Diego, vi tu web y quiero pedir un presupuesto.",
      "",
      `Zona: ${zone}`,
      `Espacio: ${place}`,
      `Necesito: ${jobText}`,
    ];
    if (detail) lines.push(`Detalle: ${detail}`);
    window.open(waUrl(lines.join("\n")), "_blank", "noopener");
  });

  const syncVideos = () => {
    const videos = [...document.querySelectorAll(".video-stack video")];
    if (videos.length !== 2) return;
    const [before, after] = videos;
    if (Math.abs(before.currentTime - after.currentTime) > .45) after.currentTime = before.currentTime;
  };
  setInterval(syncVideos, 1800);

  const fitText = () => {
    document.querySelectorAll("[data-fit]").forEach((element) => {
      element.style.fontSize = "";
      let size = parseFloat(getComputedStyle(element).fontSize);
      while (element.scrollWidth > element.clientWidth && size > 24) {
        size -= 1;
        element.style.fontSize = `${size}px`;
      }
    });
  };
  document.fonts?.ready.then(fitText);
  addEventListener("resize", fitText);
  window.__diegoFit = fitText;
  updatePreview();
})();
