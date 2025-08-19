// ניווט עליון (Navbar)
window.addEventListener('scroll', function() {
  const header = document.getElementById('header');
  if (window.scrollY > 40) {
    header.style.background = 'rgba(255,255,255,0.95)';
  } else {
    header.style.background = 'rgba(255, 255, 255, 0.57)';
  }
  const scrollBtn = document.getElementById('scrollToTop');
  if (window.scrollY > 300) {
    scrollBtn.style.display = 'block';
  } else {
    scrollBtn.style.display = 'none';
  }
});

// תפריט המבורגר במובייל
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', function() {
  navLinks.classList.toggle('open');
});

// גלילה רכה (Smooth Scroll)
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const section = document.querySelector(this.getAttribute('href'));
    section.scrollIntoView({ behavior: 'smooth' });
    navLinks.classList.remove('open');
  });
});

// כפתור חזרה למעלה
const scrollBtn = document.getElementById('scrollToTop');
scrollBtn.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ScrollSpy - הדגשת קישור פעיל
window.addEventListener('scroll', function() {
  const sections = document.querySelectorAll('section');
  let current = '';
  sections.forEach(function(section) {
    const sectionTop = section.offsetTop - 80;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navItems.forEach(function(link) {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// אנימציה לכניסת סקשנים
const fadeEls = document.querySelectorAll('.section');
function fadeInOnScroll() {
  fadeEls.forEach(function(el) {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', fadeInOnScroll);
window.addEventListener('load', fadeInOnScroll);

// --- שליפת פרויקטים מ-GitHub ---
const username = 'yoniGH-h';
const projectsGrid = document.getElementById('projects-grid');
const counter = document.getElementById('projects-counter');

// יצירת כרטיס פרויקט
function createProjectCard(repo) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.onclick = function() { window.open(repo.html_url, '_blank'); };
  card.innerHTML = `
    <div class="project-title">
      ${repo.name}
      <span style="float:right;font-size:1.1rem;color:#f7b500;">★ ${repo.stargazers_count}</span>
    </div>
    <div class="project-desc">${repo.description || 'No description.'}</div>
    <div class="badges" id="badges-${repo.name}"></div>
    <div class="project-overlay">
      <button class="gradient-btn">
        <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" style="width:20px;height:20px;vertical-align:middle;margin-right:6px;">View on GitHub
      </button>
    </div>
  `;
  fetch(repo.languages_url)
    .then(function(res) { return res.json(); })
    .then(function(langs) {
      const badges = card.querySelector('.badges');
      Object.keys(langs).forEach(function(lang) {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = lang;
        badges.appendChild(badge);
      });
    });
  return card;
}

// הצגת שלדים בזמן טעינה
function showSkeletons(count) {
  projectsGrid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    projectsGrid.appendChild(skeleton);
  }
}

// שליפת ה-Top repositories
function fetchProjects() {
  showSkeletons(3);
  fetch(`https://api.github.com/users/${username}/repos`)
    .then(function(res) {
      if (!res.ok) throw new Error('API unavailable');
      return res.json();
    })
    .then(function(repos) {
      repos.sort(function(a, b) { return b.stargazers_count - a.stargazers_count; });
      const topRepos = repos.slice(0, 5);
      projectsGrid.innerHTML = '';
      if (topRepos.length === 0) {
        counter.textContent = 'No projects found.';
      } else {
        counter.textContent = '';
        topRepos.forEach(function(repo) {
          projectsGrid.appendChild(createProjectCard(repo));
        });
      }
    })
    .catch(function(err) {
      projectsGrid.innerHTML = '<div style="text-align:center;color:#d32f2f;">Failed to load projects.</div>';
      counter.textContent = '';
    });
}
window.addEventListener('load', fetchProjects);

// ולידציה לטופס יצירת קשר
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('form-message');
contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  let error = '';
  if (name.length < 2) error = 'נא להזין שם מלא.';
  else if (!/^\S+@\S+\.\S+$/.test(email)) error = 'נא להזין אימייל תקין.';
  else if (message.length < 5) error = 'ההודעה קצרה מדי.';
  if (error) {
    formMsg.textContent = error;
    formMsg.style.color = '#d32f2f';
    return;
  }
  formMsg.textContent = 'ההודעה נשלחה בהצלחה!';
  formMsg.style.color = '#0078d7';
  contactForm.reset();
});
