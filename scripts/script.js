window.addEventListener('scroll', () => {
  let head = document.getElementById('header');
  if(window.scrollY > 40){
    head.style.background = 'rgba(255,255,255,0.95)';
  }else{
    head.style.background = 'rgba(255,255,255,0.57)';
  }
  let topBtn = document.getElementById('scrollToTop');
  if(window.scrollY > 300){
    topBtn.style.display = 'block';
  }else{
    topBtn.style.display = 'none';
  }
  let now = '';
  document.querySelectorAll('section').forEach(s => {
    if(window.scrollY >= s.offsetTop - 80){
      now = s.id;
    }
  });
  document.querySelectorAll('.navigation-links a').forEach(a => {
    if(a.getAttribute('href') === '#' + now){
      a.classList.add('active');
    }else{
      a.classList.remove('active');
    }
  });
});

let menuBtn = document.getElementById('menu-toggle');
let navLinks = document.querySelector('.navigation-links');
menuBtn.onclick = function(){
  navLinks.classList.toggle('active');
}

let navs = document.querySelectorAll('.navigation-links a');
for(let i=0;i<navs.length;i++){
  navs[i].onclick = function(e){
    e.preventDefault();
    let where = document.querySelector(navs[i].getAttribute('href'));
    where.scrollIntoView({behavior:'smooth'});
    navLinks.classList.remove('open');
  }
}

let topBtn = document.getElementById('scrollToTop');
topBtn.onclick = function(){
  window.scrollTo({top:0,behavior:'smooth'});
}

let user = 'yoniGH-h';
let projs = document.getElementById('projects-grid');
let projNum = document.getElementById('projects-counter');

// מראה כרטיסים זמניים
function showWait(n){
  projs.innerHTML = '';
  for(let i=0;i<n;i++){
    projs.innerHTML += '<div class="project-card"></div>';
  }
}

// יוצר כרטיס לפרויקט
function makeCard(repo){
  let c = document.createElement('div');
  c.className = 'project-card';
  c.onclick = function(){window.open(repo.html_url,'_blank');}
  c.innerHTML = '<div class="project-title">'+repo.name+'</div>'+
    '<div class="project-desc">'+(repo.description||'No description.')+'</div>'+
    '<div class="project-langs">שפות:</div>'+
    '<div class="badges"></div>'+
    '<div class="project-overlay"><button class="send-button">View on GitHub</button></div>';
  fetch(repo.languages_url)
    .then(function(res){return res.json();})
    .then(function(langs){
      for(let l in langs){
        c.querySelector('.badges').innerHTML += '<span class="badge">'+l+'</span>';
      }
    });
  return c;
}

// מביא את כל הפרויקטים
function getProjects(){
  showWait(3);
  fetch('https://api.github.com/users/'+user+'/repos')
    .then(function(res){if(res.ok)return res.json();else return Promise.reject();})
    .then(function(repos){
      projs.innerHTML = '';
      for(let i=0;i<repos.length;i++){
        projs.appendChild(makeCard(repos[i]));
      }
      projNum.textContent = 'Total Projects: '+repos.length;
    })
    .catch(function(){
      projs.innerHTML = '<div style="text-align:center;color:#d32f2f;">Failed to load projects.</div>';
      projNum.textContent = '';
    });
}

let form = document.getElementById('contactForm');
let msg = document.getElementById('form-message');

// בדיקת טופס
form.onsubmit = function(e){
  e.preventDefault();
  let f = e.target;
  let err = '';
  if(f.name.value.trim().length < 2){
    err = 'נא להזין שם מלא.';
  }else if(!/^\S+@\S+\.\S+$/.test(f.email.value.trim())){
    err = 'נא להזין אימייל תקין.';
  }else if(f.message.value.trim().length < 5){
    err = 'ההודעה קצרה מדי.';
  }
  msg.textContent = err || 'ההודעה נשלחה בהצלחה!';
  msg.style.color = err ? '#d32f2f' : '#0078d7';
  if(!err){f.reset();}
}
