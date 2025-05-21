let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

const enableDarkmode = () => {
  document.body.classList.add('darkmode')
  localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () => {
  document.body.classList.remove('darkmode')
  localStorage.setItem('darkmode', null)
}

if (darkmode === "active") enableDarkmode()

themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem('darkmode')
  darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})

function openPdf() {
  window.open('./assets/Tableau.pdf', '_blank')
}

// -----------------------------
// DESSIN DES COURBES ENTRE CARTES
// -----------------------------
function drawTimelineCurves() {
  const svg = document.getElementById("timeline-lines");
  const cards = document.querySelectorAll(".timeline .card");

  if (!svg || cards.length < 2) return;

  svg.innerHTML = ""; // Clear previous paths

  for (let i = 0; i < cards.length - 1; i++) {
    const card1 = cards[i].getBoundingClientRect();
    const card2 = cards[i + 1].getBoundingClientRect();
    const container = svg.getBoundingClientRect();

    const x1 = card1.left + card1.width / 2 - container.left;
    const y1 = card1.bottom - container.top;

    const x2 = card2.left + card2.width / 2 - container.left;
    const y2 = card2.top - container.top;

    const dx = (x2 - x1) / 2;
    const dy = (y2 - y1) / 2;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = `M${x1},${y1} C${x1},${y1 + dy} ${x2},${y2 - dy} ${x2},${y2}`;
    path.setAttribute("d", d);
    path.classList.add("scroll-path");
    svg.appendChild(path);
  }

  observeEachPathIndividually();
}

function observeEachPathIndividually() {
  const paths = document.querySelectorAll(".scroll-path");

  paths.forEach(path => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        // Lance le scroll listener pour CE path
        const onScroll = () => {
          const rect = path.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          const progress = Math.min(
            Math.max((windowHeight - rect.top) / (rect.height + windowHeight * 0.5), 0),
            1
          );

          path.style.strokeDashoffset = length * (1 - progress);
        };

        // Animation au scroll pour ce path
        window.addEventListener("scroll", onScroll);
        onScroll(); // appel initial
        observer.unobserve(path); // plus besoin d’observer
      },
      { threshold: 0.1 }
    );

    observer.observe(path);
  });
}

// Initialisation
window.addEventListener("load", drawTimelineCurves);
window.addEventListener("resize", drawTimelineCurves);
