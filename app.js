const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
}),{threshold:.13});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const dialog=document.querySelector('#frameDialog');
const dialogImage=dialog.querySelector('img');
const dialogTitle=dialog.querySelector('h3');
const dialogText=dialog.querySelector('p');
document.querySelectorAll('.frame-card').forEach(card=>card.addEventListener('click',()=>{
  dialogImage.src=card.querySelector('img').src;
  dialogImage.alt=card.querySelector('img').alt;
  dialogTitle.textContent=card.dataset.title;
  dialogText.textContent=card.dataset.desc;
  dialog.showModal();
}));
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});

const historyScroll=document.querySelector('#historyScroll');
const historyNodes=[...document.querySelectorAll('.history-node')];
const historyDetail=document.querySelector('#historyDetail');
if(historyScroll&&historyDetail){
  const detailImage=historyDetail.querySelector('img');
  const detailCount=historyDetail.querySelector('.history-count');
  const detailDate=historyDetail.querySelector('time');
  const detailTitle=historyDetail.querySelector('h4');
  const detailCode=historyDetail.querySelector('div>b');
  const detailCopy=historyDetail.querySelector('p');
  historyNodes.forEach((node,index)=>node.addEventListener('click',()=>{
    historyNodes.forEach(item=>item.classList.remove('active'));
    node.classList.add('active');
    historyDetail.classList.add('changing');
    setTimeout(()=>{
      detailImage.src=node.dataset.image;
      detailImage.alt=node.dataset.title;
      detailCount.textContent=`ARCHIVE ${String(index+1).padStart(2,'0')} / 10`;
      detailDate.textContent=node.dataset.date;
      detailTitle.textContent=node.dataset.title;
      detailCode.textContent=node.dataset.code;
      detailCopy.textContent=node.dataset.copy;
      historyDetail.classList.remove('changing');
    },180);
    node.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
  }));
  historyScroll.addEventListener('wheel',event=>{
    if(Math.abs(event.deltaY)>Math.abs(event.deltaX)){event.preventDefault();historyScroll.scrollLeft+=event.deltaY;}
  },{passive:false});
  let dragging=false,startX=0,startLeft=0;
  historyScroll.addEventListener('pointerdown',event=>{
    if(event.target.closest('.history-node img'))return;
    dragging=true;startX=event.clientX;startLeft=historyScroll.scrollLeft;
  });
  historyScroll.addEventListener('pointermove',event=>{if(dragging)historyScroll.scrollLeft=startLeft-(event.clientX-startX)});
  historyScroll.addEventListener('pointerup',()=>dragging=false);
  historyScroll.addEventListener('pointercancel',()=>dragging=false);
  historyScroll.addEventListener('pointerleave',()=>dragging=false);
}

const historyDialog=document.querySelector('#historyDialog');
if(historyDialog){
  const dossiers=[
    {lead:'未来第一次留下了可以被测量的痕迹。',tech:'捕获到0.4秒的动作先行信号，并在七分钟后完成第一次重复观测。',impact:'没有公众知晓。研究最初被归类为视觉延迟与偶发认知误差。',official:'尚未形成公司，记录名称为“橙色回声”。',note:'研究者在记录结尾写道：如果它已经知道我的动作，这个动作还算是我选择的吗？'},
    {lead:'影子从异常现象，变成了可以复现的规律。',tech:'回声稳定窗口提升至0.9秒；同一对象可连续记录十二次未来动作。',impact:'第一批论文引起医疗、保险与交通机构关注。',official:'未来不是被预测，而是以记忆形式提前抵达。',note:'第七码实验中出现未被受试者执行的动作，相关影像随后被删除。'},
    {lead:'预测第一次在现实发生之前救下一个人。',tech:'人体校准将领先时间延长至2.1秒，并建立个体影子映射。',impact:'志愿者避开跌倒的视频让项目获得公共安全资金。',official:'每个人都应拥有保护自己的未来。',note:'志愿者之后表示，她开始害怕做出影子没有做过的动作。'},
    {lead:'影子离开实验室，开始走在城市之前。',tech:'交通信号、列车调度与个人未来影子接入同一预测网络。',impact:'试验区事故率下降61%，平均通勤时间缩短18%。',official:'更安全的城市，从提前一步开始。',note:'自由路线数量下降43%，但未被列入公开评估指标。'},
    {lead:'一家公司的名字，逐渐成为人们称呼未来的方式。',tech:'全球总部与第一代明日记忆云同时启用。',impact:'政府将未来行为服务列入基础设施采购目录。',official:'SHADOW CARES FOR YOUR TOMORROW.',note:'董事会要求从报告中删除“依赖”一词，统一替换为“信任”。'},
    {lead:'每个人都获得一条提前发生的人生。',tech:'个人影子与身份终端永久绑定，系统实现全天候低延迟运行。',impact:'校准成为成年登记的一部分，未接入者无法使用部分公共服务。',official:'持续在线，持续安心。',note:'系统开始将“拒绝校准”标记为预测异常，而非个人选择。'},
    {lead:'成千上万的动作在同一刻失去误差。',tech:'十二座城市共享未来缓存，跨区域偏差首次低于0.5%。',impact:'全球同步庆典持续七分钟，成为每年的公共纪念日。',official:'不同城市，共同明天。',note:'庆典结束后，有417人无法分辨自己是否已经完成挥手动作。'},
    {lead:'城市开始保存尚未发生的记忆。',tech:'明日档案可长期储存行为回声，并反向训练下一轮预测。',impact:'未来数据进入教育、招聘、司法与消费决策。',official:'从过去学习，也从明天学习。',note:'这是系统第一次使用自己产生的未来，证明自己对未来的判断。'},
    {lead:'选择开始拥有统一答案。',tech:'一致率被写入城市协议，偏差超过阈值将触发主动纠正。',impact:'意外接近消失，个人探索与无目的行为同时大幅下降。',official:'零偏差意味着零遗憾。',note:'内部词典将“偶然”重新定义为尚未完成治理的风险。'},
    {lead:'未来已完成。请开始重复。',tech:'全球平均一致率99.8%，行为领先窗口稳定在3.7秒。',impact:'人们几乎不再经历影子没有预演过的动作。',official:'这是人类历史上最安全的一天。',note:'18:29，系统无法生成林默接下来要说的完整句子。'}
  ];
  const dImg=document.querySelector('#dossierImage'),dCode=document.querySelector('#dossierCode'),dDate=document.querySelector('#dossierDate'),dTitle=document.querySelector('#dossierTitle'),dLead=document.querySelector('#dossierLead'),dTech=document.querySelector('#dossierTech'),dImpact=document.querySelector('#dossierImpact'),dOfficial=document.querySelector('#dossierOfficial'),dNote=document.querySelector('#dossierNote'),dIndex=document.querySelector('#dossierIndex');let dossierCurrent=0;
  function openDossier(index){historyDialog.classList.remove('switching');void historyDialog.offsetWidth;historyDialog.classList.add('switching');dossierCurrent=(index+historyNodes.length)%historyNodes.length;const node=historyNodes[dossierCurrent],data=dossiers[dossierCurrent];dImg.src=node.dataset.image;dCode.textContent=node.dataset.code+' / INTERNAL RECORD';dDate.textContent=node.dataset.date;dTitle.textContent=node.dataset.title;dLead.textContent=data.lead;dTech.textContent=data.tech;dImpact.textContent=data.impact;dOfficial.textContent=data.official;dNote.textContent=data.note;dIndex.textContent=`FILE ${String(dossierCurrent+1).padStart(2,'0')} / 10`;if(!historyDialog.open)historyDialog.showModal();historyDialog.scrollTop=0;}
  historyNodes.forEach((node,index)=>{
    const thumbnail=node.querySelector('img');
    thumbnail.setAttribute('role','button');
    thumbnail.setAttribute('tabindex','0');
    thumbnail.setAttribute('aria-label',`打开${node.dataset.title}完整档案`);
    thumbnail.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();openDossier(index)});
    thumbnail.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();openDossier(index)}});
  });
  document.querySelector('.history-dialog-close').addEventListener('click',()=>historyDialog.close());
  historyDialog.addEventListener('pointermove',event=>{const x=(event.clientX/innerWidth-.5)*-12,y=(event.clientY/innerHeight-.5)*-8;historyDialog.style.setProperty('--dossier-x',x+'px');historyDialog.style.setProperty('--dossier-y',y+'px')});
  document.querySelector('#dossierPrev').addEventListener('click',()=>openDossier(dossierCurrent-1));
  document.querySelector('#dossierNext').addEventListener('click',()=>openDossier(dossierCurrent+1));
}

let lastY=window.scrollY;
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  document.documentElement.style.setProperty('--scroll-shift',Math.min(22,Math.abs(y-lastY))+'px');
  lastY=y;
},{passive:true});

// Global motion language: reading progress, active chapter, magnetic depth and click echoes.
const progress=document.createElement('div');progress.className='page-progress';document.body.appendChild(progress);
const cursorDot=document.createElement('div');cursorDot.className='cursor-dot';document.body.appendChild(cursorDot);
window.addEventListener('pointermove',event=>{cursorDot.style.left=event.clientX+'px';cursorDot.style.top=event.clientY+'px'});
document.querySelectorAll('a,button').forEach(item=>{
  item.addEventListener('pointerenter',()=>cursorDot.classList.add('hot'));
  item.addEventListener('pointerleave',()=>cursorDot.classList.remove('hot'));
});
const navLinks=[...document.querySelectorAll('.nav nav a')];
const linkedSections=navLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
function updatePageState(){
  const max=document.documentElement.scrollHeight-innerHeight;
  progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;
  let current='';linkedSections.forEach(section=>{if(section.getBoundingClientRect().top<innerHeight*.42)current='#'+section.id});
  navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===current));
  const heroImage=document.querySelector('.hero-media img');if(heroImage)heroImage.style.transform=`scale(1.03) translateY(${Math.min(scrollY*.035,24)}px)`;
}
window.addEventListener('scroll',updatePageState,{passive:true});updatePageState();
document.querySelectorAll('.frame-card,.rule,.logo-card').forEach(card=>{
  card.addEventListener('pointermove',event=>{const box=card.getBoundingClientRect();card.style.setProperty('--tilt-x',((event.clientX-box.left)/box.width-.5)*5+'deg');card.style.setProperty('--tilt-y',-((event.clientY-box.top)/box.height-.5)*5+'deg')});
  card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg')});
});
document.addEventListener('pointerdown',event=>{const ripple=document.createElement('span');ripple.className='tap-ripple';ripple.style.left=event.clientX+'px';ripple.style.top=event.clientY+'px';document.body.appendChild(ripple);setTimeout(()=>ripple.remove(),700)});

