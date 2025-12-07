// =============== MOBILE NAV ==================
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

// =========== PAGE TRANSITION + NAVIGATION ==============
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
    .add(() => {
      window.scrollTo({ top: offset, behavior: "auto" });
    })
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

// =============== GSAP SETUP ==================
gsap.registerPlugin(ScrollTrigger);

// Intro animation
window.addEventListener("load", () => {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.fromTo(
    "#pageTransition",
    { scaleX: 1, transformOrigin: "left" },
    { duration: 0.7, scaleX: 0, transformOrigin: "right", ease: "power3.inOut" }
  )
    .from(".logo-circle", { y: -20, opacity: 0, duration: 0.5 }, "-=0.2")
    .from(".logo-text span:first-child", { y: -10, opacity: 0, duration: 0.4 }, "-=0.30")
    .from(".logo-text span:last-child", { y: -10, opacity: 0, duration: 0.4 }, "-=0.35")
    .from(".nav-links a", { y: -10, opacity: 0, duration: 0.4, stagger: 0.05 }, "-=0.4")
    .from(".hero-left", { opacity: 0, y: 25, duration: 0.7 }, "-=0.25")
    .from(".hero-right", { opacity: 0, y: 25, duration: 0.7 }, "-=0.55");
});

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
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      }
    }
  );
});

// =============== HERO ORBIT ANIMATIONS ==================

// Floating up & down
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

// =============== EVENTS FILTER (ALL / ODD / EVEN) ==================

const filterButtons = document.querySelectorAll(".events-filter-btn");
const filterCards = document.querySelectorAll("[data-event]");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter");

    // Remove active class from all buttons
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Show / hide cards
    filterCards.forEach(card => {
      const type = card.getAttribute("data-event");

      if (filter === "all" || filter === type) {
        gsap.to(card, { autoAlpha: 1, scale: 1, duration: 0.35, display: "block" });
      } else {
        gsap.to(card, { autoAlpha: 0, scale: 0.85, duration: 0.35, display: "none" });
      }
    });
  });
});

// =============== FOOTER YEAR ===============
document.getElementById("yearSpan").textContent = new Date().getFullYear();

// =============== FORM HANDLER ===============
function handleFormSubmit(e) {
  e.preventDefault();
  alert("This form is frontend-only. Connect to backend or Google Form to save responses.");
  e.target.reset();
}
