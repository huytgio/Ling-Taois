/* One pooled strike per formation, with delayed HP presentation. */
(()=>{'use strict';
const overlay=$('overlay'),main=document.querySelector('main'),header=document.querySelector('header'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
function syncModal(){const open=!overlay.classList.contains('hidden');main.inert=header.inert=open||busy;overlay.setAttribute('aria-hidden',String(!open));if(open){overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');}else overlay.removeAttribute('aria-modal');}
new MutationObserver(syncModal).observe(overlay,{attributes:true,attributeFilter:['class']});syncModal();
for(const name of ['pick','sortHand','discardSelected']){const original=window[name];window[name]=function(...args){if(!overlay.classList.contains('hidden'))return;return original.apply(this,args);};}
const battleSummary=document.createElement('section');battleSummary.className='battleSummary';
battleSummary.setAttribute('aria-label','Tóm tắt Công Pháp và Chuỗi');
document.querySelector('.score').append(battleSummary);
function renderBattleSummary(v){
 const cards=(v.active||[]).map(card).filter(Boolean);
 const unique=key=>[...new Set(cards.map(c=>c[key]))];
 const typeValues=unique('t').map(i=>types[i]+' +'+num(5+(curseIs('typeSeal')?0:typeTrainingBonus(s.typeUp[i]))));
 const elementValues=unique('e').map(i=>elements[i]+' ×'+num(curseIs('element')?1:elementTrainingMult(s.elemUp[i])));
 const chainValue=label=>['pair','triple','four','five'].map(prefix=>{
  const chain=CH[prefix+label];return label==='T'?'×'+num(chain.m):'+'+num(chain.a);
 }).join(' · ');
 battleSummary.innerHTML=`<div class="battleSummaryHead"><b>CÔNG PHÁP & CHUỖI</b><button onclick="openBook('Nâng cấp')">Xem đủ ↗</button></div>
 <div class="battleSummaryLine"><span>${cards.length?'Loại Tu · mỗi lá':'Cùng Loại Tu · 2–5 lá'}</span><strong>${cards.length?typeValues.join(' · '):chainValue('T')}</strong></div>
 <div class="battleSummaryLine"><span>${cards.length?'Nguyên Tố · mỗi lá':'Cùng Nguyên Tố · 2–5 lá'}</span><strong>${cards.length?elementValues.join(' · '):chainValue('E')}</strong></div>
 ${v.key?`<div class="battleSummaryLine"><span>Chuỗi đang dùng</span><strong>+${num(v.add)} · ×${num(v.mult)}</strong></div>`:''}`;
}
const originalScore=renderScore;
renderScore=function(v){
 originalScore(v);
 $('chainExplain').textContent='';
 $('damageSourcesPanel').innerHTML=`<div class="scoreActions">
  ${v.key?'<button class="scoreDetail" onclick="showDamageDetail()">Chi tiết ↗</button>':''}
  <button class="scoreDetail scoreTraining" onclick="openBook('Nâng cấp')">Công pháp &amp; Chuỗi ↗</button>
 </div>`;
 $('scoreEquation').innerHTML=v.key?`<div class="quickTerms"><span><b>${fmt(Math.round(v.base))}</b><small>Anh Linh</small></span><span><b>+${fmt(Math.round(v.bonus))}</b><small>Cơ Duyên</small></span><span><b>+${fmt(Math.round(v.add))}</b><small>Thưởng</small></span><span><b>×${num(v.mult)}</b><small>Hợp kích</small></span>${v.tax!==1?`<span class="quickTax"><b>×${num(v.tax)}</b><small>Lời nguyền</small></span>`:''}</div>`:'';
 renderBattleSummary(v);
};
const scene=document.querySelector('.bossScene'),hud=document.querySelector('.mobileHUD');
const formationCards=document.querySelector('.formationCards'),hint=document.querySelector('.formationHint');
const fx=document.createElement('div');fx.className='strikeFx';fx.setAttribute('aria-hidden','true');document.body.append(fx);
const bolt=Object.assign(document.createElement('i'),{className:'strikeOrb'});
const burst=Object.assign(document.createElement('i'),{className:'strikeBurst'});
fx.append(bolt,burst);
const hitPause=150;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function center(el){const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];}
async function play(el,frames,duration){
 let animation;
 try{animation=el?.animate?.(frames,{duration,easing:'ease-out'});}catch{}
 if(!animation?.finished)return wait(duration);
 let timeout;
 try{
  await Promise.race([animation.finished,new Promise(resolve=>{timeout=setTimeout(resolve,duration+100)})]);
 }catch{}finally{
  clearTimeout(timeout);
  animation.cancel();
 }
}
function at([x,y],extra=''){return `translate3d(${x}px,${y}px,0) ${extra}`;}
function fly(from,to,duration){
 const angle=Math.atan2(to[1]-from[1],to[0]-from[0]);
 const turn=`rotate(${angle}rad)`;
 return play(bolt,[{transform:at(from,turn+' scaleX(.4)'),opacity:.55},
  {transform:at(to,turn+' scaleX(1.35)'),opacity:1}],duration);
}
function aimWeapon(actor,to){
 actor.classList.add('weaponAiming');
 const art=actor.querySelector('.tuImage,.tuFallback');
 const from=center(art||actor);
 const angle=Math.atan2(to[1]-from[1],to[0]-from[0]);
 const head=Number(art?.dataset.headAngle??-90)*Math.PI/180;
 const delta=Math.atan2(Math.sin(angle-head),Math.cos(angle-head));
 actor.style.setProperty('--weapon-aim',delta+'rad');
 const length=Math.hypot(to[0]-from[0],to[1]-from[1]);
 const tip=Math.min(length*.45,Math.min(art?.clientWidth||0,art?.clientHeight||0)*.34);
 return {from:[from[0]+Math.cos(angle)*tip,from[1]+Math.sin(angle)*tip],to,angle,length:length-tip,type:Number(actor.dataset.tu),color:actor.style.getPropertyValue('--c')};
}
// Straight rays, arcing cuts, spinning darts, and heavy bursts share one FX node.
const tuFlights=[
 {beam:true}, {bend:24}, {beam:true}, {bend:-18,spin:540}, {bend:8,spin:180},
 {beam:true}, {bend:-8,scale:1.45}, {scale:1.55}, {bend:-26,spin:75}, {bend:18,spin:300}
];
function shootEnergy(aim,duration){
 const turn=`rotate(${aim.angle}rad)`;
 const {beam,bend=0,spin=0,scale=1}=tuFlights[aim.type];
 bolt.dataset.tu=aim.type;
 bolt.style.setProperty('--bolt-ink',aim.color);
 if(beam){
  bolt.classList.add('strikeBeam');
  bolt.style.setProperty('--beam-length',aim.length+'px');
 }
 const middle=[(aim.from[0]+aim.to[0])/2-Math.sin(aim.angle)*bend,(aim.from[1]+aim.to[1])/2+Math.cos(aim.angle)*bend];
 const pose=(point,rotation,size)=>at(point,`${turn} rotate(${rotation}deg) scale(${size})`);
 const frames=beam?[
  {transform:at(aim.from,turn+' scaleX(.03)'),opacity:.65},
  {offset:.65,transform:at(aim.from,turn+' scaleX(1)'),opacity:1},
  {transform:at(aim.from,turn+' scaleX(1)'),opacity:0}
 ]:[
  {transform:pose(aim.from,0,.55),opacity:.65},
  {offset:.5,transform:pose(middle,spin/2,scale),opacity:1},
  {transform:pose(aim.to,spin,scale),opacity:.32}
 ];
 return play(bolt,frames,duration).finally(()=>{
  delete bolt.dataset.tu;
  bolt.classList.remove('strikeBeam');
 });
}
function strikePattern(key,count){
 if(key.startsWith('straight')||key.startsWith('gap'))return 'ladder';
 if(key==='fiveR')return 'seal';
 if(key.startsWith('mixed')||key.startsWith('full'))return 'split';
 if(key.startsWith('two'))return 'cross';
 return ['solo','solo','pair','triple','quad','five'][count]||'solo';
}
const strikeColors={solo:'#ffe09c',pair:'#91dcff',triple:'#ffac70',quad:'#98efbd',five:'#ffd372',split:'#ff9cd6',cross:'#b6a8ff',ladder:'#9ee5ff',seal:'#e3acff'};
async function launchFormation(v,actors,target){
 const pattern=strikePattern(v.key,v.active.length);
 const color=strikeColors[pattern],to=center(target);
 fx.dataset.pattern=pattern;
 fx.style.setProperty('--strike',color);
 const order=v.active.map(id=>actors.find(actor=>Number(actor.dataset.cardId)===id)).filter(Boolean);
 const lineup=order.length===actors.length?order:[...actors];
 if(pattern==='ladder')lineup.sort((a,b)=>Number(a.dataset.realm)-Number(b.dataset.realm));
 if(reduce.matches){
  await wait(45);
  playGameSound('cast');
  return color;
 }
 for(const [index,actor] of lineup.entries()){
  actor.classList.add('charging');
  try{
   const aim=aimWeapon(actor,to);
   await wait(index===0?165:200);
   hint.textContent='Đại Chiêu · '+v.name;
   if(index===0)playGameSound('cast');
   await shootEnergy(aim,pattern==='solo'?200:225);
  }finally{
   actor.classList.remove('charging');
  }
 }
 return color;
}
async function impact(target,color,duration=255){
 fx.style.setProperty('--strike',color);
 playGameSound(color==='#ff7457'?'counter':'hit');
 const point=center(target);
 await Promise.all([
  play(burst,[{transform:at(point,'scale(.25)'),opacity:1},{transform:at(point,'scale(1.7)'),opacity:0}],reduce.matches?Math.min(130,duration):duration),
  play(target,reduce.matches?[{opacity:.55},{opacity:1}]:[{transform:'translateX(0)',opacity:.35},{transform:'translateX(5px)',opacity:1},{transform:'translateX(-3px)'},{transform:'translateX(0)'}],reduce.matches?Math.min(130,duration):Math.min(220,duration))
 ]);
}
const cracks=document.createElement('div');
cracks.className='counterCracks';
cracks.setAttribute('aria-hidden','true');
cracks.innerHTML='<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 22L21 34 33 32 45 48 54 51 62 68 83 77 100 96M45 48L30 60 26 75 0 88M54 51L70 44 81 44 100 19M33 32L37 16 31 0M62 68L63 85 52 100M81 44L91 56 100 60"/></svg>';
document.body.append(cracks);
function counterShock(){
 if(!reduce.matches)void play(main,[{transform:'translate(0)'},{transform:'translate(-2px,1px)'},{transform:'translate(2px,-1px)'},{transform:'translate(-1px)'},{transform:'translate(0)'}],140);
 void play(cracks,[{opacity:0},{opacity:.46,offset:.15},{opacity:0}],300);
 return wait(hitPause);
}
let visibleHp=null;
const originalRender=render;
render=function(){
 originalRender();
 const b=currentBoss(),icon=scene.querySelector('.bossIcon');
 scene.classList.toggle('guardianScene',b.guardian);scene.style.setProperty('--yao-color',`hsl(${b.hue} 82% 61%)`);
 icon.classList.toggle('guardianIcon',b.guardian);icon.classList.toggle('yaoIcon',!b.guardian);
 $('bossTag').textContent=`${b.endless?'VÔ LƯỢNG BÍ CẢNH':'BÍ CẢNH '+b.floor} · ${b.guardian?'THỦ LĨNH':'YÊU QUÁI '+(b.index+1)+'/4'}`;
 $('bossName').textContent=b.n+' · '+b.rank;
 if(!b.guardian)$('bossCaption').textContent='Yêu khí · '+b.rank;
 else if(!b.curse&&!b.suppressed)$('bossCaption').textContent='Thủ lĩnh trấn giữ bí cảnh';
 if(visibleHp!==null){
  $('hpText').textContent=visibleHp+' / '+s.max;$('hpBar').style.width=(visibleHp/s.max*100)+'%';
  hud.querySelector('b').firstChild.textContent=visibleHp;
  hud.querySelector('.bar i').style.width=(visibleHp/s.max*100)+'%';
 }
};
const resolveAttack=attack;
attack=async function(){
 if(busy||!selected.length||s.phase!=='battle'||s.rewards.length||!overlay.classList.contains('hidden'))return;
 busy=true;syncModal();$('attackBtn').disabled=$('discardBtn').disabled=true;
 const state=s,actors=[...formationCards.children];
 try{
  const v=calc(chosen());
  hint.textContent='Anh Linh tụ lực';
  const target=scene.querySelector('.bossIcon');
  const color=await launchFormation(v,actors,target);
  await impact(target,color,hitPause);
  if(s!==state)return;
  busy=false;resolveAttack();
 }catch(error){busy=false;syncModal();render();throw error;}finally{
  actors.forEach(actor=>actor.classList.remove('weaponAiming','charging'));
 }
};
window.presentTurn=async function(turn,finish){
 const state=s;
 visibleHp=turn.hpBeforeCounter;
 try{
  render();
  $('hit').textContent='−'+fmt(turn.damage);$('hit').className='hitAnim';
  if(turn.repeatDamage){
   await wait(230);
   if(s!==state)return;
   await impact(scene.querySelector('.bossIcon'),'#9ee5ff',hitPause);
   if(s!==state)return;
   $('hit').className='';
   void $('hit').offsetWidth;
   $('hit').textContent='HỒI ÂM −'+fmt(turn.repeatDamage);$('hit').className='hitAnim';
  }
  if(turn.bossStruck){
   await wait(320);
   const player=hud.firstElementChild;
   fx.dataset.pattern='solo';
   if(!reduce.matches){fx.style.setProperty('--strike','#ff7457');await fly(center(scene.querySelector('.bossIcon')),center(player),245);}
   await Promise.all([impact(player,'#ff7457',hitPause),counterShock()]);
   if(s!==state)return;
   visibleHp=null;render();
   const number=document.createElement('span');number.className='counterDamage';
   number.textContent=turn.retaliation?'−'+fmt(turn.retaliation)+' HP':'ĐÃ CHẶN';
   document.body.append(number);setTimeout(()=>number.remove(),700);
  }else await wait(420);
 }finally{
  visibleHp=null;
  if(s===state){finish();syncModal();}
 }
};
render();
})();
