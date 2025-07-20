let projects = JSON.parse(localStorage.getItem('projects')||'[]');
let current = null;
const projectList = document.getElementById('projectList');
const projectModal = document.getElementById('projectModal');
const tasksModal = document.getElementById('tasksModal');
const tipsModal = document.getElementById('tipsModal');
const slides = Array.from(document.querySelectorAll('.slide'));
let slideIdx = 0;
function save() { localStorage.setItem('projects', JSON.stringify(projects)); }
function renderProjects() {
  projectList.innerHTML = '';
  projects.forEach((p,i)=>{
    const card = document.createElement('div'); card.className='project-card';
    card.onclick=()=>openProject(i);
    if(p.img){ let img=document.createElement('img'); img.src=p.img; card.append(img); }
    const info=document.createElement('div'); info.className='project-info';
    info.innerHTML=`<strong>${p.name}</strong><div class="prog-wrapper"><div class="prog" style="width:${Math.round((p.tasks.filter(t=>t.done).length/p.tasks.length||0)*100)}%"></div></div>
                    <small>${p.tasks.filter(t=>t.done).length} из ${p.tasks.length} задач</small>`;
    card.append(info);
    projectList.append(card);
  });
}
function openModal(el){ el.classList.remove('hidden'); }
function closeModal(el){ el.classList.add('hidden'); }
document.getElementById('newProjectBtn').onclick=()=>openModal(projectModal);
document.getElementById('closeProj').onclick=()=>closeModal(projectModal);
document.getElementById('saveProj').onclick=()=>{
  const name=document.getElementById('projName').value.trim();
  if(!name) return alert('Введите название');
  projects.push({name, img:document.getElementById('projImg').value.trim(), start:document.getElementById('projStart').value, end:document.getElementById('projEnd').value, tasks:[]});
  save(); renderProjects(); closeModal(projectModal);
};
function openProject(i){
  current=i; const p=projects[i];
  document.getElementById('tasksTitle').innerText=p.name;
  updateTasks(); openModal(tasksModal);
}
document.getElementById('backToList').onclick=()=>{ closeModal(tasksModal); renderProjects(); }
function updateTasks(){
  const p=projects[current];
  const list=document.getElementById('taskList'); list.innerHTML='';
  p.tasks.forEach((t,j)=>{
    const li=document.createElement('li');
    const cb=document.createElement('input'); cb.type='checkbox'; cb.checked=t.done;
    cb.onchange=()=>{ t.done=cb.checked; save(); updateTasks(); };
    li.append(cb, document.createTextNode(t.text));
    list.append(li);
  });
  const perc = p.tasks.length? Math.round(p.tasks.filter(t=>t.done).length/p.tasks.length*100):0;
  document.getElementById('progressBar').style.width=perc+'%';
}
document.getElementById('addTaskBtn').onclick=()=>{
  const txt=prompt('Текст задачи');
  if(txt){ projects[current].tasks.push({text:txt,done:false}); save(); updateTasks(); }
};
document.getElementById('tipsBtn').onclick=()=>{ openModal(tipsModal); showSlide(0); };
document.getElementById('closeTips').onclick=()=>closeModal(tipsModal);
document.getElementById('prevTip').onclick=()=>showSlide(slideIdx-1);
document.getElementById('nextTip').onclick=()=>showSlide(slideIdx+1);
function showSlide(n){
  slides[slideIdx].classList.remove('active');
  slideIdx=(n+slides.length)%slides.length;
  slides[slideIdx].classList.add('active');
}
renderProjects();
