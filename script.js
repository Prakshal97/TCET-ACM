/* =======================================================
   MOBILE FPS DETECTION – Reduce animations on low FPS
   ======================================================= */
let lowFpsMode = false;

function checkFPS() {
  let last = performance.now();
  let frames = 0;

  function frame() {
    let now = performance.now();
    frames++;

    if (now > last + 1000) {
      if (frames < 40) {
        lowFpsMode = true;
        console.warn("⚠ Low FPS detected — reducing animations.");
      }
      frames = 0;
      last = now;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
checkFPS();


/* =======================================================
   PRELOADER HANDLING
   ======================================================= */
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");

  setTimeout(() => {
    preloader.classList.add("hidden");
  }, 400);

  // Delay GSAP intro slightly to sync with fade-out
  setTimeout(() => {
    runGSAPIntro();
  }, 650);
  // Hide page transition overlay on first page load
document.getElementById("pageTransition").style.transform = "scaleX(0)";

});


/* =======================================================
   MOBILE NAVIGATION
   ======================================================= */
const navToggleBtn = document.getElementById("navToggle");
const navMobile = document.getElementById("navMobile");
let navOpen = false;

function toggleNav() {
  navOpen = !navOpen;
  navMobile.style.display = navOpen ? "flex" : "none";
  navToggleBtn.innerHTML = navOpen
    ? '<i class="ri-close-line"></i>'
    : '<i class="ri-menu-line"></i>';
}

if (navToggleBtn) {
  navToggleBtn.addEventListener("click", toggleNav);
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 800) {
    navMobile.style.display = "none";
    navOpen = false;
    navToggleBtn.innerHTML = '<i class="ri-menu-line"></i>';
  }
});


/* =======================================================
   PAGE TRANSITION + SMOOTH SCROLL
   ======================================================= */
const pageTransition = document.getElementById("pageTransition");

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;

  const navHeight = document.querySelector(".nav-blur").offsetHeight || 72;
  const offset = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;

  const tl = gsap.timeline({
    defaults: { duration: 0.35, ease: "power2.inOut" }
  });

  tl.set(pageTransition, { transformOrigin: "left", pointerEvents: "auto" })
    .to(pageTransition, { scaleX: 1 })
    .add(() => window.scrollTo({ top: offset, behavior: "auto" }))
    .set(pageTransition, { transformOrigin: "right" })
    .to(pageTransition, { scaleX: 0 })
    .set(pageTransition, { pointerEvents: "none" });
}

document.querySelectorAll("[data-target]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const id = el.getAttribute("data-target");
    if (navOpen) toggleNav();
    scrollToSection(id);
  });
});


/* =======================================================
   GSAP INTRO ANIMATION (starts after preloader)
   ======================================================= */
function runGSAPIntro() {
  gsap.registerPlugin(ScrollTrigger);

  // Disable heavy GSAP animations on low-end phones
  if (lowFpsMode) {
    document.querySelectorAll(".reveal").forEach(el => {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(".logo-circle", { y: -20, opacity: 0, duration: 0.5 })
    .from(".logo-text span:first-child", { y: -10, opacity: 0, duration: 0.4 }, "-=0.25")
    .from(".logo-text span:last-child", { y: -10, opacity: 0, duration: 0.4 }, "-=0.30")
    .from(".nav-links a", { y: -10, opacity: 0, duration: 0.4, stagger: 0.05 }, "-=0.4")
    .from(".hero-left", { opacity: 0, y: 25, duration: 0.7 }, "-=0.2")
    .from(".hero-right", { opacity: 0, y: 25, duration: 0.7 }, "-=0.45");

  // Scroll reveal
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      }
    );
  });

  // Orbit floating
  gsap.to(".hero-orbit", {
    y: 10,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // Slow rotation
  gsap.to(".hero-orbit", {
    rotate: 360,
    duration: 55,
    repeat: -1,
    ease: "none"
  });
}


/* =======================================================
   EVENTS FILTER SYSTEM (All / Odd / Even)
   ======================================================= */
const filterBtns = document.querySelectorAll(".events-filter-btn");
const eventCards = document.querySelectorAll(".event-card");

filterBtns.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");

    filterBtns.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    eventCards.forEach(card => {
      const semester = card.getAttribute("data-semester");

      if (filter === "all" || semester === filter) {
        gsap.to(card, { autoAlpha: 1, scale: 1, duration: 0.3, display: "block" });
      } else {
        gsap.to(card, { autoAlpha: 0, scale: 0.85, duration: 0.3, display: "none" });
      }
    });
  });
});


/* =======================================================
   FOOTER YEAR UPDATE
   ======================================================= */
document.getElementById("yearSpan").textContent = new Date().getFullYear();


/* =======================================================
   CONTACT FORM (Frontend Only)
   ======================================================= */
function handleFormSubmit(e) {
  e.preventDefault();
  alert("This form is frontend-only. Connect to a backend or Google Form to store responses.");
  e.target.reset();
}
document.body.classList.add("loaded");
