// Данные и элементы
let projects = JSON.parse(localStorage.getItem('projects')||'[]');
let currentIdx = null;
const projectsScreen = document.getElementById('projectsScreen');
const tasksScreen = document.getElementById('tasksScreen');
const projectList = document.getElementById('projectList');
const projectModal = document.getElementById('projectModal');
const soundCheck = document.getElementById('soundCheck');
const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');

// Отображение списка проектов
function renderProjects(){
  projectList.innerHTML = '';
  projects.forEach((p,i)=>{
    const card = document.createElement('div');
    card.className='project-card';
    card.onclick=()=>openProject(i);
    const img = document.createElement('img');
    img.src = p.img || 'https://via.placeholder.com/60';
    const info = document.createElement('div');
    info.className='project-info';
    const done = p.tasks.filter(t=>t.done).length;
    const total = p.tasks.length;
    info.innerHTML = `<strong>${p.name}</strong><p>${done} из ${total} задач</p>`;
    card.append(img, info);
    projectList.append(card);
  });
}

// Открыть модалку
function show(el){ el.classList.remove('hidden'); }
function hide(el){ el.classList.add('hidden'); }

// Сохранение
function save(){
  localStorage.setItem('projects', JSON.stringify(projects));
}

// Экран проекта
function openProject(i){
  currentIdx = i;
  const p = projects[i];
  document.getElementById('projTitle').innerText = p.name;
  document.getElementById('projImgDisplay').src = p.img || 'https://via.placeholder.com/60';
  document.getElementById('projDates').innerText = `${p.start||'—'} → ${p.end||'—'}`;
  renderTasks();
  projectsScreen.classList.add('hidden');
  tasksScreen.classList.remove('hidden');
}

// Назад
document.getElementById('backBtn').onclick = ()=>{
  tasksScreen.classList.add('hidden');
  projectsScreen.classList.remove('hidden');
  renderProjects();
};

// Рендер задач
function renderTasks(){
  const p = projects[currentIdx];
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  p.tasks.forEach((t,j)=>{
    const li = document.createElement('li');
    li.className='task-item';
    const cb = document.createElement('input');
    cb.type='checkbox'; cb.checked = t.done;
    cb.onchange = ()=>{
      t.done = cb.checked; save(); playSound(); renderTasks();
      if(p.tasks.every(x=>x.done)) fireConfetti();
    };
    li.append(cb, document.createTextNode(t.text));
    list.append(li);
  });
  const done = p.tasks.filter(t=>t.done).length;
  const pct = p.tasks.length? Math.round(done/p.tasks.length*100):0;
  document.getElementById('progressBar').style.width = pct+'%';
  document.getElementById('progressPct').innerText = pct+'%';
}

// Звук
function playSound(){
  soundCheck.currentTime=0; soundCheck.play();
}

// Конфетти
function fireConfetti(){
  confettiCanvas.classList.remove('hidden');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  let particles = [];
  for(let i=0;i<150;i++){
    particles.push({x:Math.random()*confettiCanvas.width,y:-10,r:Math.random()*6+4,dx:(Math.random()-0.5)*4,dy:Math.random()*4+2,color:`hsl(${Math.random()*60+180},100%,60%)`});
  }
  function animate(){
    ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    particles.forEach(p=>{
      p.x+=p.dx; p.y+=p.dy; p.dy+=0.05;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x,p.y,p.r,p.r*0.4);
    });
    particles = particles.filter(p=>p.y<confettiCanvas.height);
    if(particles.length) requestAnimationFrame(animate);
    else confettiCanvas.classList.add('hidden');
  }
  animate();
}

// Создать/редактировать проект
const newBtn = document.getElementById('newProjectBtn');
const editBtn = document.getElementById('editProjBtn');
const saveBtn = document.getElementById('saveProjBtn');
const cancelBtn = document.getElementById('cancelProjBtn');

function openModal(edit=false){
  document.getElementById('modalTitle').innerText = edit?'Редактировать проект':'Новый проект';
  if(edit){
    const p=projects[currentIdx];
    document.getElementById('projName').value=p.name;
    document.getElementById('projImgUrl').value=p.img||'';
    document.getElementById('projStart').value=p.start||'';
    document.getElementById('projEnd').value=p.end||'';
  } else {
    document.getElementById('projName').value='';
    document.getElementById('projImgUrl').value='';
    document.getElementById('projStart').value='';
    document.getElementById('projEnd').value='';
  }
  show(projectModal);
}
newBtn.onclick = ()=>openModal(false);
editBtn.onclick = ()=>openModal(true);
cancelBtn.onclick = ()=>hide(projectModal);

saveBtn.onclick = ()=>{
  const name = document.getElementById('projName').value.trim();
  if(!name) return alert('Введите название');
  const imgUrl = document.getElementById('projImgUrl').value.trim();
  const fileInput = document.getElementById('projImgFile');
  if(fileInput.files[0]){
    const reader=new FileReader();
    reader.onload=e=>{
      saveProject(name,e.target.result);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else saveProject(name,imgUrl);
  hide(projectModal);
};

function saveProject(name,img){
  const start = document.getElementById('projStart').value;
  const end = document.getElementById('projEnd').value;
  if(projectModal.querySelector('h2').innerText==='Редактировать проект'){
    const p = projects[currentIdx];
    p.name=name; p.img=img; p.start=start; p.end=end;
  } else {
    projects.push({name,img,start,end,tasks:[]});
  }
  save(); renderProjects();
}

// Добавить задачу
document.getElementById('addTaskBtn').onclick = ()=>{
  const text = prompt('Текст задачи');
  if(text) projects[currentIdx].tasks.push({text,done:false});
  save(); renderTasks();
};

// Инициализация
renderProjects();
