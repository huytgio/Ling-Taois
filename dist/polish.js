/* Compact combat, deterministic controls, atlas artwork and elemental motes. */
(()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const atlas=(index,cls='')=>`<span class="paintedArt ${cls}" style="--atlas-x:${index%6*100/5}%;--atlas-y:${Math.floor(index/6)*100/5}%" aria-hidden="true"></span>`;
bossEmblem=b=>b.guardian?atlas(b.art,'bossPortrait'):`<span class="yaoAvatar" style="--yao-x:${b.art%6*20}%;--yao-y:${Math.floor(b.art/6)*25}%" aria-hidden="true"></span>`;
const iconColors=['#f8c870','#8de0b6','#83c8ff','#f89a75','#c7a6fa','#e5d1a7','#f29ac6','#89ded9'];
const orbitTexts=['天地玄黃宇宙洪荒乾坤日月','風雷水火山澤天地陰陽五行','靈符鎮守明心見性道法自然','金木水火土乾坤萬象歸元氣'];
function alchemyIcon(x,family){
 const shape=x.id%8;
 const color=iconColors[(x.id+Math.floor(x.id/8)*3)%iconColors.length];
 const phase=-(x.id%11)*.27;
 const base='<b class="alchemyBody"><i></i></b>';
 let effect;
 if(family==='scroll'){
  const glyphs=[...orbitTexts[x.id%orbitTexts.length]].map((glyph,i)=>`<i style="--turn:${i*30}deg">${glyph}</i>`).join('');
  effect=`<span class="runeOrbit" style="--tilt:${-27+(x.id%5-2)*5}deg"><span>${glyphs}</span></span>`;
 }else{
  effect='<span class="pillSmoke"><i></i><i></i><i></i><i></i><i></i></span>';
 }
 return `<span class="upgradeArt paintedArt upgradeIcon art-${family} art-shape-${shape}" style="--art-ink:${color};--art-phase:${phase}s" aria-hidden="true">${base}${effect}</span>`;
}
document.addEventListener('error',event=>{
 const image=event.target;
 if(!image.matches?.('.art-relic>img'))return;
 const fallback=document.createElement('b');
 fallback.className='relicFallback';
 fallback.textContent='✦';
 image.replaceWith(fallback);
},true);
upgradeArt=x=>{
 if(!x?.kind)return '';
 if(x.kind==='Tầm Pháp'||x.kind==='Luyện Đan')return alchemyIcon(x,x.kind==='Tầm Pháp'?'scroll':'pill');
 const q=itemGrade(x),glyph={destinyReroll:'易',destinySkip:'越',destinyMundane:'降',destinySlay:'誅',destinyRepeat:'響',destinyLuck:'運'}[x.effect];
 const art=glyph?`<b style="display:grid;place-items:center;height:100%;color:var(--art-grade);font-size:1.5em">${glyph}</b>`:`<img src="assets/market/relic/${x.id}.png" width="72" height="72" decoding="async" alt="">`;
 return `<span class="upgradeArt paintedArt upgradeIcon art-relic q${q??0}" style="--art-grade:${RARITY_COLORS[q]??RARITY_COLORS[0]};--art-phase:-${x.id%7*.37}s" aria-hidden="true">${art}<i class="artEffect"></i></span>`;
};

let sortIndex=-1;const sorts=[['Nguyên tố',(a,b)=>a.e-b.e||a.t-b.t||b.r-a.r],['Loại Tu',(a,b)=>a.t-b.t||a.e-b.e||b.r-a.r],['Công kích',(a,b)=>ownAttack(b)-ownAttack(a)||a.e-b.e],['Cảnh giới',(a,b)=>b.r-a.r||b.l-a.l||a.e-b.e]];
const sortButton=document.querySelector('[onclick="sortHand()"]');sortButton.textContent='Sắp xếp: chọn ↕';sortButton.setAttribute('aria-label','Đổi tiêu chí sắp xếp bài');
sortHand=function(){if(busy)return;sortIndex=(sortIndex+1)%sorts.length;s.hand.sort((a,b)=>sorts[sortIndex][1](card(a),card(b))||a-b);save();render();};
const oldRender=render;render=function(){oldRender();if(sortIndex>=0)sortButton.textContent='Sắp xếp: '+sorts[sortIndex][0]+' ↕';};

render();
})();
