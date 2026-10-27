// 導覽（hamburger、Escape、點outside關閉）
const navToggle=document.querySelector('.nav-toggle'),navMenu=document.querySelector('#primary-menu');
if(navToggle&&navMenu){
  const setMenuOpen=(o)=>{navMenu.classList.toggle('is-open',o);navToggle.setAttribute('aria-expanded',String(o));const sr=navToggle.querySelector('.sr-only');if(sr)sr.textContent=o?'關閉導覽選單':'開啟導覽選單';};
  navToggle.addEventListener('click',()=>setMenuOpen(navToggle.getAttribute('aria-expanded')!=='true'));
  navMenu.querySelectorAll('a').forEach(l=>l.addEventListener('click',()=>setMenuOpen(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&navToggle.getAttribute('aria-expanded')==='true'){setMenuOpen(false);navToggle.focus();}});
  document.addEventListener('click',e=>{if(!e.target.closest('.navbar'))setMenuOpen(false);});
  window.matchMedia('(min-width:861px)').addEventListener('change',e=>{if(e.matches)setMenuOpen(false);});
}

// header 滾動狀態 + aria-current
const header=document.querySelector('.site-header');
const sectionLinks=Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
const linkedSections=sectionLinks.map(l=>document.querySelector(l.hash));
let scrollFrame=0;
const updateScrollState=()=>{
  const sh=document.documentElement.scrollHeight-window.innerHeight;
  const p=sh>0?Math.min(1,Math.max(0,window.scrollY/sh)):0;
  if(header){header.classList.toggle('is-scrolled',window.scrollY>16);header.style.setProperty('--scroll-progress',p);}
  let cur=-1;const marker=(header?header.offsetHeight:72)+48;
  linkedSections.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<=marker)cur=i;});
  if(sh>0&&window.scrollY>=sh-2)cur=linkedSections.length-1;
  sectionLinks.forEach((l,i)=>{if(i===cur)l.setAttribute('aria-current','location');else l.removeAttribute('aria-current');});
  scrollFrame=0;
};
const schedule=()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScrollState);};
window.addEventListener('scroll',schedule,{passive:true});
window.addEventListener('resize',schedule);
window.addEventListener('load',schedule);
updateScrollState();

// 進場動畫（prefers-reduced-motion 時跳過；內容始终可見）
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const runningReveals=new Set();
if('IntersectionObserver' in window && 'animate' in Element.prototype){
  const obs=new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(!en.isIntersecting)return;obs.unobserve(en.target);if(reducedMotion.matches)return;
      const isCard=en.target.matches('.guide-card,.event-card,.stat-item,.check-item');
      const idx=isCard?Array.from(en.target.parentElement.children).indexOf(en.target):0;
      const anim=en.target.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,delay:Math.min(idx,3)*75,easing:'cubic-bezier(0.2,0.7,0.2,1)',fill:'backwards'});
      runningReveals.add(anim);const rel=()=>runningReveals.delete(anim);
      anim.addEventListener('finish',rel,{once:true});anim.addEventListener('cancel',rel,{once:true});
    });
  },{threshold:0.08});
  document.querySelectorAll('.section-heading,.guide-card,.event-card,.stat-item,.check-item,.cta-inner,.contact-card,.contact-form').forEach(el=>obs.observe(el));
}
reducedMotion.addEventListener('change',e=>{if(e.matches)runningReveals.forEach(a=>a.cancel());});
document.addEventListener('focusin',e=>{runningReveals.forEach(a=>{if(a.effect.target.contains(e.target))a.cancel();});});

// 四碼查詢：示範字典依 EPA 四位碼材質碼；正式站接官方四位碼表
const dict={
 '1Q73W':{m:'PET 聚乙烯對苯二甲酸酯',bin:'塑膠・黃',color:'#f4c531',fg:'#4a3300',ex:'飲用水瓶、飲料瓶、沙拉油瓶',tip:'剪開、去標籤、壓扁後入黃桶'},
 '2Q73W':{m:'HDPE 高密度聚乙烯',bin:'塑膠・黃',color:'#f4c531',fg:'#4a3300',ex:'洗髮精瓶、洗衣液瓶、牛奶桶(不透光)',tip:'倒空洗淨，標籤撕除'},
 '3Q73W':{m:'PVC 聚氯乙烯',bin:'塑膠・黃*',color:'#f4c531',fg:'#4a3300',ex:'透明盒、水管(非食品)',tip:'先查村里是否收 PVC'},
 '4Q73W':{m:'LDPE 低密度聚乙烯',bin:'塑膠袋・回收點',color:'#f4c531',fg:'#4a3300',ex:'塑膠袋、氣泡布',tip:'清潔乾燥，集滿到回收點集中交'},
 '5Q73W':{m:'PP 聚丙烯',bin:'塑膠・黃',color:'#f4c531',fg:'#4a3300',ex:'優酪乳杯、一次性杯、飯盒(耐熱)',tip:'清洗晾乾，紙標撕除'},
 '6Q73W':{m:'PS 聚苯乙烯',bin:'塑膠・黃*',color:'#f4c531',fg:'#4a3300',ex:'保麗龍托盤、發泡餐盒(發泡屬 PS)',tip:'保麗龍許多村里單獨收，壓實後交'},
 '7Q73W':{m:'其他/複層塑膠',bin:'其他・垃圾',color:'#805ad5',fg:'#fff',ex:'複合標、鋁箔層複合袋',tip:'7 號多數村里不收，隨一般垃圾，盡量避免購買'},
 'C90':{m:'紙容器',bin:'紙・白',color:'#ffffff',fg:'#333',ex:'外帶紙盒、紙杯(內PE膜)',tip:'內膜與紙分離後入白桶'},
 'P41':{m:'紙包裝(新聞紙)',bin:'紙・白',color:'#ffffff',fg:'#333',ex:'報紙、書本、紙袋',tip:'保持乾燥、捆綁'},
 'P42':{m:'紙包裝(紙板)',bin:'紙・白',color:'#ffffff',fg:'#333',ex:'紙箱、蛋盒(紙製)',tip:'攤平、撕膠帶'},
 'G71':{m:'玻璃容器',bin:'玻璃・紫/綠',color:'#2f9e44',fg:'#fff',ex:'玻璃瓶、醬菜罐',tip:'去標籤、洗淨；依村里入紫桶(罐與瓶)或綠桶'},
 'A51':{m:'金屬容器(錫/鐵)',bin:'罐與瓶・紫',color:'#805ad5',fg:'#fff',ex:'罐頭、鐵罐',tip:'清空清洗、剪口壓平，入紫桶(部分村里藍桶)'},
 'AL81':{m:'鋁罐',bin:'罐與瓶・紫',color:'#805ad5',fg:'#fff',ex:'飲料鋁罐',tip:'倒空壓扁，入紫桶(部分村里藍桶)'},
 'T94':{m:'紡織類',bin:'紡織・紫',color:'#805ad5',fg:'#fff',ex:'舊衣、舊鞋(清潔乾燥)',tip:'依村里收運日交清潔隊'},
 'F94':{m:'木頭/木材',bin:'木頭・紫*',color:'#805ad5',fg:'#fff',ex:'木製砧板、木箱',tip:'多數不隨車收，大型木料洽清潔隊'}
};
const input=document.querySelector('#code-input'),result=document.querySelector('#code-result');
function show(code){
  code=code.trim().toUpperCase().replace(/\s+/g,'');
  if(!code){result.innerHTML='<p>請輸入四位碼。</p>';return;}
  let r=dict[code];
  if(!r){ // 依首字母粗分
    const t={Q:{m:'塑膠類(依 1–7 樹脂)',bin:'塑膠・黃',c:'#f4c531',fg:'#4a3300'},C:{m:'紙容器類',bin:'紙・白',c:'#fff',fg:'#333'},P:{m:'紙包裝類',bin:'紙・白',c:'#fff',fg:'#333'},G:{m:'玻璃類',bin:'玻璃・紫/綠',c:'#2f9e44',fg:'#fff'},A:{m:'金屬類',bin:'罐與瓶・紫',c:'#805ad5',fg:'#fff'},F:{m:'木頭類',bin:'木頭・紫*',c:'#805ad5',fg:'#fff'},T:{m:'紡織類',bin:'紡織・紫',c:'#805ad5',fg:'#fff'}};
    const hit=t[code[0]];
    if(!hit){result.innerHTML='<p>查不到 <strong>'+code+'</strong>。示範字典只含常用碼；正式站接 EPA 官方四位碼表。提示：四位碼印在 ♒ 三角形旁。</p>';return;}
    r={m:hit.m,bin:hit.bin,color:hit.c,fg:hit.fg,ex:'依首字母 '+code[0]+' 粗分材質',tip:'清洗乾燥後入對應桶，細節查官方碼表'};
  }
  result.innerHTML='<div class="cr-head"><span class="cr-bin" style="background:'+r.color+';color:'+r.fg+'">'+r.bin.split('・')[1]+'</span>'+r.m+'</div>'+
   '<p class="cr-code"><strong>'+code+'</strong> → 回收：<strong>'+r.bin+'</strong></p>'+
   '<p>常見：'+r.ex+'</p><p>前置處理：'+r.tip+'</p>';
}
if(input&&result){
  document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{input.value=c.dataset.code;show(c.dataset.code);}));
  input.addEventListener('input',()=>show(input.value));
}

// 零廢棄挑戰進度
const boxes=document.querySelectorAll('.checklist input'),fill=document.querySelector('#progress-fill'),ptext=document.querySelector('#progress-text');
function update(){const n=[...boxes].filter(b=>b.checked).length;fill.style.width=(n/boxes.length*100)+'%';ptext.textContent='已勾選 '+n+' / '+boxes.length+(n>=5?' — 完成 5 項！產生分享圖卡（演示）':'');}
boxes.forEach(b=>b.addEventListener('change',update));

// 聯絡表單（演示：無後端）
const contactForm=document.querySelector('.contact-form');
if(contactForm){contactForm.addEventListener('submit',e=>{e.preventDefault();contactForm.reset();alert('感謝你的來信，我們會盡快與你聯繫。');});}
