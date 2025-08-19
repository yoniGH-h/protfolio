// ניווט עליון + כפתור חזרה למעלה + ScrollSpy
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  header.style.background = window.scrollY > 40 ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.57)';
  document.getElementById('scrollToTop').style.display = window.scrollY > 300 ? 'block' : 'none';
  let current = '';
  document.querySelectorAll('section').forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// תפריט
const navLinks = document.querySelector('.nav-links');
document.getElementById('menu-toggle').onclick = () => navLinks.classList.toggle('open');

// גלילה רכה
Array.from(document.querySelectorAll('.nav-links a')).forEach(link => {
  link.onclick = e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    navLinks.classList.remove('open');
  };
});

// כפתור חזרה למעלה
const scrollBtn = document.getElementById('scrollToTop');
scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// --- פרויקטים מ-GitHub ---
const username = 'yoniGH-h';
const projectsGrid = document.getElementById('projects-grid');
const counter = document.getElementById('projects-counter');

function showSkeletons(n) {
  projectsGrid.innerHTML = '';
  for (let i = 0; i < n; i++)
    projectsGrid.innerHTML += '<div class="skeleton-card"></div>';
}

function createProjectCard(repo) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.onclick = () => window.open(repo.html_url, '_blank');
  card.innerHTML = `
    <div class="project-title">${repo.name}</div>
    <div class="project-desc">${repo.description || 'No description.'}</div>
    <div class="project-langs">שפות:</div>
    <div class="badges"></div>
    <div class="project-overlay"><button class="gradient-btn">View on GitHub</button></div>
  `;
  fetch(repo.languages_url)
    .then(res => res.json())
    .then(langs => {
      Object.keys(langs).forEach(lang => {
        card.querySelector('.badges').innerHTML += `<span class="badge">${lang}</span>`;
      });
    });
  return card;
}

function fetchProjects() {
  showSkeletons(3);
  fetch(`https://api.github.com/users/${username}/repos`)
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(repos => {
      projectsGrid.innerHTML = '';
      repos.forEach(repo => projectsGrid.appendChild(createProjectCard(repo)));
      counter.textContent = `Total Projects: ${repos.length}`;
    })
    .catch(() => {
      projectsGrid.innerHTML = '<div style="text-align:center;color:#d32f2f;">Failed to load projects.</div>';
      counter.textContent = '';
    });
}
window.addEventListener('load', fetchProjects);

// ולידציה לטופס יצירת קשר
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('form-message');
contactForm.onsubmit = e => {
  e.preventDefault();
  const f = e.target;
  let error = '';
  if (f.name.value.trim().length < 2) error = 'נא להזין שם מלא.';
  else if (!/^\S+@\S+\.\S+$/.test(f.email.value.trim())) error = 'נא להזין אימייל תקין.';
  else if (f.message.value.trim().length < 5) error = 'ההודעה קצרה מדי.';
  formMsg.textContent = error || 'ההודעה נשלחה בהצלחה!';
  formMsg.style.color = error ? '#d32f2f' : '#0078d7';
  if (!error) f.reset();
};
