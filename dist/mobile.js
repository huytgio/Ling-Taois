/* A viewport-sized combat board. Only dialogs scroll; the board never does. */
(()=>{
const arena=document.querySelector('.arena'),boss=document.querySelector('.boss'),hand=$('hand'),actions=document.querySelector('.actions'),handHeader=document.querySelector('.handHeader'),score=document.querySelector('.score'),tools=document.querySelector('.viewTools'),deck=$('drawPile');
const cursePanel=document.createElement('div');cursePanel.id='bossCurse';cursePanel.className='bossCurse';boss.querySelector('.bossHead').after(cursePanel);cursePanel.setAttribute('role','button');cursePanel.tabIndex=0;cursePanel.setAttribute('aria-label','Xem lời nguyền boss');cursePanel.onclick=()=>showBossCurse();cursePanel.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showBossCurse();}};window.showBossCurse=()=>{const b=currentBoss(),c=b.curse||b.suppressed;modal(`<div class="modalTop"><h2>Lời nguyền boss</h2><button onclick="closeModal()">Đóng ✕</button></div><h3>${c?c.n:'Không có lời nguyền'}</h3><p>${c?c.d:'Boss này không có lời nguyền.'}</p>${b.suppressed?'<p class="price">✦ Đã vô hiệu bởi Tiên Thiên Vô Cấu.</p>':''}`)};
const sidebar=document.createElement('section');sidebar.className='battleSidebar';
const table=document.createElement('section');table.className='battleTable';
const hud=document.createElement('div');hud.className='mobileHUD';
const readout=document.createElement('div');readout.className='combatReadout';
const menus=document.createElement('div');menus.className='mobileNav';menus.innerHTML='<button onclick="openMobileBag()">◇ Hành trang</button><button class="realmLogButton" onclick="showBattleLog()">Cảnh giới</button>';
const equipment=document.createElement('div');equipment.className='boardEquipment';equipment.innerHTML='<button id="equipmentSummary" onclick="openMobileBag()"></button><button id="handMode" aria-label="Đổi cách xếp bài">▦ / ▱</button>';
const stage=document.createElement('div');stage.className='formationStage';stage.innerHTML='<div class="formationWatermark">☯</div><div class="formationHint">Chọn Anh Linh để lập trận</div><div class="formationCards"></div>';
const scoreHost=document.createElement('div');scoreHost.id='scoreHost';scoreHost.hidden=true;scoreHost.append(score);document.body.append(scoreHost);
const battleLog=document.createElement('section');battleLog.className='battleLog panel';
battleLog.innerHTML='<h3>Nhật ký giao chiến</h3>';battleLog.append($('log'));
const realmOrder=`<section class="realmOrder"><h3>Thứ tự cảnh giới · thấp → cao</h3><ol>${realms.map(name=>`<li>${name}</li>`).join('')}</ol></section>`;
battleLog.insertAdjacentHTML('beforeend',realmOrder);
window.showBattleLog=()=>{
 modal(`<div class="modalTop"><h2>Nhật ký giao chiến</h2><button onclick="closeModal()">Đóng ✕</button></div><div id="modalBattleLog" class="modalBattleLog"></div>${realmOrder}`);
 const entries=s.logs.slice(0,8).map(text=>{
  const row=document.createElement('div');row.textContent=text;return row;
 });
 $('modalBattleLog').replaceChildren(...entries);
};
sidebar.append(hud,boss,score,battleLog,readout,menus);equipment.append(deck);table.append(equipment,stage,handHeader,hand,actions);arena.replaceChildren(sidebar,table);
// Keep the existing view controls in the header so none of the battle space is lost.
const nav=document.querySelector('header nav');if(tools){const wide=tools.querySelector('#wideView');if(wide)nav.append(wide);tools.remove();}
const portrait=matchMedia('(orientation:portrait)');let manualMode=null;
const handMode=$('handMode');
function fit(){
 const box=hand.getBoundingClientRect(),count=Math.max(1,hand.children.length);
 const minHeight=104;
 const gridCols=Math.min(4,count),gridRows=Math.ceil(count/gridCols);
 const gridFits=box.height-16-6*(gridRows-1)>=minHeight*gridRows&&
  box.width-12-6*(gridCols-1)>=54*gridCols;
 const rowFits=box.width-12-3*(count-1)>=54*count;
 const canSwitch=gridFits&&rowFits;
 const grid=canSwitch&&manualMode!==null ? manualMode : portrait.matches;
 arena.classList.toggle('gridHand',grid);
 arena.classList.toggle('fanHand',!grid);
 const cols=grid?gridCols:count,rows=grid?gridRows:1,gap=grid?6:rowFits?3:2;
 const availableHeight=Math.max(0,(box.height-16-gap*(rows-1))/rows);
 const availableWidth=Math.max(0,(box.width-12-gap*(cols-1))/cols);
 const height=Math.floor(Math.min(availableHeight,availableWidth/.47));
 const width=Math.floor(Math.min(availableWidth,height*.72));
 hand.classList.toggle('narrowCards',width<54);
 hand.classList.toggle('tightCards',height<140);
 hand.style.setProperty('--cols',cols);
 hand.style.setProperty('--rows',rows);
 hand.style.setProperty('--cardH',height+'px');
 hand.style.setProperty('--cardW',width+'px');
 hand.style.setProperty('--handGap',gap+'px');
 handMode.hidden=!canSwitch;
 handMode.textContent=grid?'▱ Hàng ngang':'▦ Xếp lưới';
 handMode.setAttribute('aria-pressed',String(grid));
}
handMode.onclick=()=>{manualMode=!arena.classList.contains('gridHand');fit();};
portrait.addEventListener('change',()=>{manualMode=null;fit();});
new ResizeObserver(fit).observe(hand);
window.addEventListener('resize',fit);
window.showBoardScore=()=>score.scrollIntoView({block:'nearest'});
window.openMobileBag=()=>{modal(`<div class="modalTop"><h2>Hành trang tu đạo</h2><button onclick="closeModal()">Đóng ✕</button></div><p>Cơ Duyên ${s.j.length}/${relicCap()} · Luyện Đan ${s.tarots.length}/3</p><h3>Cơ Duyên</h3><div class="bagItems">${$('jokers').innerHTML}</div><h3>Luyện Đan · Chọn bài trước khi dùng</h3><div class="bagItems">${$('tarots').innerHTML}</div><div class="tabs"><button onclick="openUpgradeSales()">Bán nâng cấp</button><button onclick="openTraining()">Tầm Pháp</button><button onclick="openBook('Nâng cấp')">Công pháp ↗</button><button onclick="showDeck()">Bộ bài ↗</button><button onclick="showRules()">Luật chơi</button><button onclick="newRun()">Chơi lại</button></div>`)};
// Move the live score node out before any dialog replaces its contents.
const oldModal=modal;modal=function(html){oldModal(html)};
const oldSelection=renderSelection;
renderSelection=function(v,updateCards){
 oldSelection(v,updateCards);
 readout.innerHTML=`<div><small>SÁT THƯƠNG</small><strong>${fmt(v.damage)}</strong></div><button onclick="showFormations()">${v.name} ▾</button>`;stage.querySelector('.formationHint').textContent=selected.length?`${v.name} · ${v.active.length} Anh Linh ra trận`:'Chọn tối đa 5 Anh Linh · Nhấn giữ lá để xem';const formation=stage.querySelector('.formationCards');
 const deployed=s.hand.filter(id=>v.active.includes(id));
 formation.style.setProperty('--deployed',Math.max(1,deployed.length));
 const existing=new Map(Array.from(formation.children,el=>[el.dataset.artKey,el]));
 deployed.forEach((id,index)=>{
  const c=card(id),key=[id,c.t,c.e,c.r].join(':');
  let node=existing.get(key);
  if(node)existing.delete(key);
  else{
   const template=document.createElement('template');
   template.innerHTML=`<div class="formationCard" data-art-key="${key}" data-card-id="${id}" data-realm="${c.r}" data-tu="${c.t}" style="--c:${colors[c.e]}" title="${elements[c.e]} ${types[c.t]} · ${realms[c.r]}" aria-label="Ra trận: ${elements[c.e]} ${types[c.t]}, ${realms[c.r]}"><span class="previewArt">${weaponArt(c,true,'weapon')}</span></div>`;
   node=template.content.firstElementChild;
  }
  if(formation.children[index]!==node)formation.insertBefore(node,formation.children[index]||null);
 });
 existing.forEach(node=>node.remove());
};
const oldRender=render;render=function(){oldRender();const b=currentBoss();boss.classList.toggle('guardianBoss',b.guardian);cursePanel.className='bossCurse'+(b.suppressed?' curseSuppressed':b.curse?' curseActive':'');cursePanel.innerHTML=b.suppressed?`<b>✦ Đã vô hiệu · ${b.suppressed.n}</b><span>${b.suppressed.d}</span>`:b.curse?`<b>☠ Lời nguyền · ${b.curse.n}</b><span>${b.curse.d}</span>`:'<b>Lời nguyền</b><span>Boss này không có lời nguyền.</span>';hud.innerHTML=`<div><span>ĐẠO THỂ</span><b>${s.hp}<small>/${s.max}</small></b><div class="bar"><i style="width:${s.hp/s.max*100}%"></i></div></div><div><span>${b.endless?'VÔ LƯỢNG BÍ CẢNH':'BÍ CẢNH '+b.floor}</span><b>Lượt ${s.turn}</b><small>◈ ${fmt(s.coins)} · Khiên ${s.shield}</small></div>`;if($('equipmentSummary'))$('equipmentSummary').innerHTML=`<span>✦ ${s.j.length}/${relicCap()} Cơ Duyên</span><span>◇ ${s.tarots.length}/3 Luyện Đan</span>`;fit();};
function inspect(id){const c=card(id);if(!c)return;modal(`<div class="modalTop"><h2>${elements[c.e]} ${types[c.t]}</h2><button onclick="closeModal()">Đóng ✕</button></div><div class="inspectWeapon bodyFrame" data-body="${c.body}" style="--c:${colors[c.e]}">${weaponArt(c,false,'avatar')}</div><h3>${realms[c.r]} · Cấp ${c.l}</h3>${bodyDetailsHTML(c)}<p>Công Kích riêng: ${num(ownAttack(c))}</p>`)}
let holdTimer=null,holdId=null,held=false,origin=null;
hand.addEventListener('pointerdown',e=>{const el=e.target.closest('.card');if(!el)return;held=false;holdId=+el.dataset.id;origin=[e.clientX,e.clientY];holdTimer=setTimeout(()=>{held=true;inspect(holdId)},550)});
const cancelHold=()=>{clearTimeout(holdTimer);holdTimer=null};hand.addEventListener('pointerup',cancelHold);hand.addEventListener('pointercancel',cancelHold);hand.addEventListener('pointermove',e=>{if(origin&&Math.hypot(e.clientX-origin[0],e.clientY-origin[1])>12)cancelHold()});hand.addEventListener('click',e=>{if(held){e.preventDefault();e.stopImmediatePropagation();held=false}},true);hand.addEventListener('contextmenu',e=>{const el=e.target.closest('.card');if(el){e.preventDefault();cancelHold();inspect(+el.dataset.id)}});
render();
})();
