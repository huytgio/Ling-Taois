(()=>{
const table=document.querySelector('.battleTable'),equipment=document.querySelector('.boardEquipment'),header=document.querySelector('.handHeader');
const mode=$('handMode'),deck=$('drawPile');header.lastElementChild.append(mode,deck);$('equipmentSummary').remove();
equipment.innerHTML='<section class="luckFrame"><div class="rackLabel">CƠ DUYÊN · TIÊN DUYÊN <small id="luckCount"></small></div><div id="luckSlots"></div></section>';
const rail=document.createElement('div');rail.className='supportRail';
rail.innerHTML='<section class="trainingRail"><button class="rackLabel railTitle" onclick="openTraining()">TẦM PHÁP <small id="trainingCount"></small></button><div id="trainingSlots"></div></section><section class="daoRail"><div class="rackLabel">LUYỆN ĐAN <small id="daoCount"></small></div><div id="daoSlots"></div></section>';
table.append(rail);
const arena=table.closest('.arena'),sellTarget=document.createElement('button');
sellTarget.id='sellDrop';sellTarget.textContent='◇ Bán';
sellTarget.title='Kéo nâng cấp vào đây để bán';
sellTarget.setAttribute('aria-label','Bán nâng cấp. Kéo thẻ vào đây hoặc bấm để mở danh sách.');
sellTarget.onclick=openUpgradeSales;
document.querySelector('.mobileNav').append(sellTarget);
function rackSlot(kind,i){return `data-rack-kind="${kind}" data-rack-index="${i}"`;}
function luckSlot(id,i){if(id==null&&i>=relicCap())return `<div class="rackEmpty rackLocked" title="Ô Cơ Duyên ${i+1} đang khóa" aria-label="Ô Cơ Duyên ${i+1} đang khóa"><span aria-hidden="true">🔒</span><small>${i+1}</small></div>`;if(id==null)return `<div class="rackEmpty" ${rackSlot('Cơ Duyên',i)}><span>◇</span><small>${i+1}</small></div>`;const x=J[id],q=itemGrade(x);return `<button class="miniRelic q${q}" style="--q:${RARITY_COLORS[q]}" ${rackSlot('Cơ Duyên',i)} data-sell-kind="Cơ Duyên" data-sell-index="${i}" onclick="showRelic(${i})" title="${x.n} · Cấp ${relicLevel(id)} · ${RARITIES[q]}"><span>${upgradeArt(x)}</span><b>${x.n.replace(' · Chân Ý','')}</b><small>${x.destiny?'Tiên Duyên':RARITIES[q]} · C${relicLevel(id)}</small></button>`;}
window.showRelic=i=>{const x=J[s.j[i]];if(!x)return;modal(`<div class="modalTop"><h2>${x.n}</h2><button onclick="closeModal()">Đóng ✕</button></div><div class="itemPortrait">${upgradeArt(x)}</div>${gradeHTML(x)}<p>${itemDescription(x)}</p>${relicUpgradePreview(x.id)}<p>${hasJ(x.id)?'Đang có hiệu lực.':'Cấm Duyên đang vô hiệu Cơ Duyên này.'}</p>${destinyActionButton(x)}${s.phase==='shop'?`<button onclick="sellJ(${i})">Bán · ◈ ${relicSellValue(x)}</button>`:''}`)};
window.showTarotDetail=i=>{const x=T[s.tarots[i]];if(!x)return;modal(`<div class="modalTop"><h2>${x.n}</h2><button onclick="closeModal()">Đóng ✕</button></div><div class="itemPortrait">${upgradeArt(x)}</div>${gradeHTML(x)}<p>${x.d}</p><p>Với Luyện Đan dùng lên 1–2 lá, chọn nhóm trên tay rồi kéo vào một lá trong nhóm. Với Đồng Tâm / Đồng Nguyên, chọn lá gốc trước rồi kéo vào lá nhận.</p><button onclick="useTarot(${i})">Dùng với các lá đã chọn</button>${s.phase==='shop'?`<button onclick="prepareShopTarot(${i})">Chọn trong bộ bài</button>`:''}`)};
const old=render;render=function(){old();ensureExpansion();$('luckCount').textContent=s.j.length+'/'+relicCap();$('luckSlots').innerHTML=Array.from({length:8},(_,i)=>luckSlot(s.j[i],i)).join('');$('daoCount').textContent=s.tarots.length+'/3';$('daoSlots').innerHTML=Array.from({length:3},(_,i)=>{const x=T[s.tarots[i]];return x?`<button class="miniDao q${x.q}" style="--q:${RARITY_COLORS[x.q]}" ${rackSlot('Luyện Đan',i)} data-sell-kind="Luyện Đan" data-sell-index="${i}" onclick="showTarotDetail(${i})" aria-label="${x.n}, ${RARITIES[x.q]}, kéo vào Anh Linh"><span>${upgradeArt(x)}</span><b>${x.n.replace(' · Thể Đan','')}</b><small>${RARITIES[x.q]}</small></button>`:`<div class="rackEmpty" ${rackSlot('Luyện Đan',i)}><span>◇</span><small>${i+1}</small></div>`}).join('');$('trainingCount').textContent=s.training.length+'/3';
 $('trainingSlots').innerHTML=Array.from({length:3},(_,i)=>{
  const x=L[s.training[i]];
  return x?`<button class="miniTraining q${x.q}" style="--q:${RARITY_COLORS[x.q]}" ${rackSlot('Tầm Pháp',i)} data-sell-kind="Tầm Pháp" data-sell-index="${i}" onclick="openTraining()" title="${x.n}"><span>${upgradeArt(x)}</span><b>${x.n}</b></button>`:
   `<button class="rackEmpty" ${rackSlot('Tầm Pháp',i)} onclick="openTraining()" aria-label="Ô Tầm Pháp ${i+1} trống"><span>✧</span><small>${i+1}</small></button>`;
 }).join('');
};

// Use the same pointer gesture for selling and for applying Luyện Đan to a card.
let drag=null,suppressUntil=0,marked=null;
function mark(el){
 if(marked===el)return;
 marked?.classList.remove('dropReady');
 marked=el;marked?.classList.add('dropReady');
}
function dropTarget(e){
 const hit=document.elementFromPoint(e.clientX,e.clientY);
 const slot=hit?.closest('[data-rack-kind]');
 if(slot&&(slot.dataset.rackKind===drag.kind||drag.kind==='Tầm Pháp'&&slot.dataset.rackKind==='Cơ Duyên'&&L[drag.id]?.effect.startsWith('destiny')&&slot.hasAttribute('data-sell-kind')))return slot;
 return hit?.closest('#sellDrop')||(drag.kind==='Luyện Đan'?hit?.closest('#hand .card'):null);
}
arena.addEventListener('pointerdown',e=>{
 const el=e.target.closest('[data-sell-kind]');
 if(!el||drag||e.button!==0||busy||marketBlocked()||s.phase!=='battle')return;
 const kind=el.dataset.sellKind,i=Number(el.dataset.sellIndex);
 const id=(kind==='Cơ Duyên'?s.j:kind==='Tầm Pháp'?s.training:s.tarots)[i];
 if(!catalog(kind)[id])return;
 drag={kind,i,id,x:e.clientX,y:e.clientY,pointer:e.pointerId,ghost:null};
 el.setPointerCapture(e.pointerId);
});
arena.addEventListener('pointermove',e=>{
 if(!drag||e.pointerId!==drag.pointer)return;
 if(!drag.ghost&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<7)return;
 e.preventDefault();
 if(!drag.ghost){
  const x=catalog(drag.kind)[drag.id];
  drag.ghost=document.createElement('div');drag.ghost.className='dragDao';
  drag.ghost.style.setProperty('--q',RARITY_COLORS[itemGrade(x)]);
  drag.ghost.innerHTML=`<span>${upgradeArt(x)}</span><b>${x.n}</b><small>Bán · ◈ ${relicSellValue(x)}</small>`;
  document.body.append(drag.ghost);
 }
 drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';
 mark(dropTarget(e));
});
function endDrag(e,cancel=false){
 if(!drag||e.pointerId!==drag.pointer)return;
 const d=drag,target=!cancel&&d.ghost?dropTarget(e):null;
 drag=null;d.ghost?.remove();mark(null);
 if(!d.ghost||cancel)return;
 suppressUntil=Date.now()+500;
 if(target===sellTarget){sellUpgrade(d.kind,d.i,true,d.id,true);return;}
 if(target?.dataset.rackKind){
  const index=Number(target.dataset.rackIndex);
  if(target.dataset.rackKind===d.kind)moveUpgradeSlot(d.kind,d.i,index,d.id);
  else if(s.training[d.i]===d.id&&s.j[index]!=null&&!J[s.j[index]].destiny)useTraining(d.i,s.j[index],true);
  else toast('Chọn một Cơ Duyên thường.');
  return;
 }
 if(target){applyTarotDrop(d.i,Number(target.dataset.id),d.id);return;}
 toast(d.kind==='Luyện Đan'?'Thả vào ô Bán hoặc một lá Anh Linh.':'Thả vào ô cùng khung hoặc ô Bán.');
}
arena.addEventListener('pointerup',endDrag);
arena.addEventListener('pointercancel',e=>endDrag(e,true));
arena.addEventListener('lostpointercapture',e=>endDrag(e,true));
arena.addEventListener('click',e=>{
 if(Date.now()<suppressUntil&&e.target.closest('[data-sell-kind],#sellDrop')){
  e.preventDefault();e.stopImmediatePropagation();
 }
},true);
// This function performs validation before changing selection or consuming an item.
window.applyTarotDrop=(i,targetId,expected=s.tarots[i])=>{
 const x=T[s.tarots[i]];
 if(!x||s.openPack||s.tarots[i]!==expected||!s.hand.includes(targetId)||!card(targetId)||busy||s.rewards.length||!['battle','shop'].includes(s.phase))return false;
 const previous=[...selected],previousFormation=formation,eff=x.effect;
 if(eff.startsWith('destiny'))return false;
 if(eff.startsWith('copy')){
  if(!previous.length||previous.length>2||previous[0]===targetId||(previous.length===2&&previous[1]!==targetId)){
   toast('Chọn lá gốc trước, rồi kéo Luyện Đan vào lá nhận.');return false;
  }
  selected=[previous[0],targetId];
 }else if(eff==='realm2'||tarotPair(eff)||/^[etr]\d+$/.test(eff)){
  if(previous.length>2||(previous.length&&!previous.includes(targetId))){
   toast('Chọn tối đa 2 lá rồi thả Luyện Đan vào một lá trong nhóm.');return false;
  }
  selected=previous.length?previous:[targetId];
 }else selected=['heal','shield','refresh'].includes(eff)?[]:[targetId];
 formation=null;
 const before=s.tarots.length;
 useTarot(i);
 if(s.tarots.length===before&&$('overlay').classList.contains('hidden')){
  selected=previous;formation=previousFormation;render();
 }
 return s.tarots.length<before;
};
render();
})();
