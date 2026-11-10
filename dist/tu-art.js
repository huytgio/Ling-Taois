function tuArtPath(type,style='avatar'){
 return style==='weapon'?`assets/tu/silver-${type}.webp`:`assets/avatars/detail-${type}.webp`;
}
const vectorWeaponArt=weaponArt;
// Artwork points up and right at rest. The flag has a steeper pole.
const weaponHeadAngles=[-45,-50,-45,-42,-43,-52,-54,-43,-76,-44];
document.addEventListener('error',event=>{
 const image=event.target;
 if(!image.matches?.('.tuImage[data-art-type]'))return;
 const slot=image.closest('[data-card-id]');
 const fighter=slot&&card(Number(slot.dataset.cardId))||{
  id:'fallback',r:0,t:Number(image.dataset.artType),e:Number(image.dataset.artElement),body:null
 };
 const fallback=document.createElement('span');
 fallback.className='tuFallback';
 fallback.dataset.headAngle='-90';
 fallback.innerHTML=vectorWeaponArt(fighter);
 image.replaceWith(fallback);
},true);
/* Ten raster illustrations, with independent elemental light and motes. */
weaponArt=function(c,animate=true,style='weapon'){
 const motes=animate?Array.from({length:3},(_,i)=>`<i style="--i:${i};--px:${12+(i*29)%76}%;--py:${12+(i*37)%76}%;--delay:${-i*.37}s"></i>`).join(''):'';
 return `<span class="elementArt tuArt ${style==='avatar'?'spiritArt':''} element-${c.e}" style="--element-color:${['#ffe28a','#73e7a4','#7bd6ff','#ff8549','#d9b37d'][c.e]};--float-delay:${-(c.id%7)*.4}s">${animate?'<span class="tuAura" aria-hidden="true"></span>':''}<img class="tuImage" src="${tuArtPath(c.t,style)}" data-art-type="${c.t}" data-art-element="${c.e}" decoding="async" alt="" ${style==='weapon'?'data-head-angle="'+weaponHeadAngles[c.t]+'"':''} width="256" height="256" draggable="false">${animate?`<span class="elementMotes" aria-hidden="true">${motes}</span>`:''}</span>`;
};

// Warm the ten small weapon images after first paint, at lower priority than visible art.
function warmTuArt(){
 for(let type=0;type<weaponHeadAngles.length;type++){
  const image=new Image();
  image.fetchPriority='low';
  image.src=tuArtPath(type);
 }
}
if(window.requestIdleCallback)window.requestIdleCallback(warmTuArt,{timeout:1500});
else setTimeout(warmTuArt,250);
