/* Small, offline vector illustrations: semantic shapes, shared visual grammar. */
function upgradeArt(x){
 if(!x?.kind)return '';const id=x.id||0,k=x.kind==='Cơ Duyên'?0:x.kind==='Tầm Pháp'?1:2;
 const palette=['#ffd572','#7ce1c1','#79c9ff','#ff9375','#c8a1ff'];let c=palette[(id+k)%5],symbol='';
 const path=d=>`<path d="${d}"/>`,circle=(a,b,r)=>`<circle cx="${a}" cy="${b}" r="${r}"/>`;
 const sword='<path d="M48 65V23L54 15 60 23V65M38 66H70M54 66V82M47 83H61"/><path d="M54 25V58" stroke="#fff1bc"/>';
 const elem=e=>[
 '<path d="M50 20 73 48 50 78 27 48Z"/><path d="M50 20V78M27 48H73"/>',
 '<path d="M50 80V32M50 58Q20 57 25 26 54 30 50 58M51 46Q78 46 77 20 54 21 51 46"/>',
 '<path d="M50 17Q18 53 30 70Q50 92 72 68Q82 50 50 17Z"/><path d="M38 58Q35 69 49 73"/>',
 '<path d="M49 15Q57 39 70 34Q86 65 65 79Q40 94 27 70Q18 54 37 36L36 55Q51 46 49 15Z"/>',
 '<path d="M22 66 36 35 53 28 77 60 66 78 34 78Z"/><path d="M36 35 47 59 77 60M47 59 34 78"/>'
 ][e%5];
 const weapon=t=>t===0?sword:t===1?'<path d="M36 76 66 19Q85 47 48 68L41 82ZM30 69 50 80"/>':t===2?'<path d="M34 84 61 26M54 33 64 13 71 35Z"/>':t===3?'<path d="M50 15 59 40 84 50 59 59 50 84 41 59 16 50 41 41Z"/>'+circle(50,50,7):t===4?'<path d="M37 70 64 25 69 17 72 35 48 75M29 64 55 80M40 74 33 87"/>':t===5?'<path d="M34 79V54Q34 45 43 51V26Q43 17 51 26V50Q60 45 66 57L66 75 57 84Z"/>':t===6?'<path d="M30 72V39Q35 31 40 40V59 25Q45 17 49 25V55 22Q55 17 58 25V57 33Q65 26 68 35V67L60 82H40ZM30 59 21 50 19 61 30 75"/>':t===7?'<path d="M27 67V44L39 36 69 39 76 52 67 78 42 82ZM39 38V57M50 37V55M61 38V56M28 61 55 62 61 71"/>':t===8?'<path d="M50 17 61 39 84 50 61 60 50 84 40 61 17 50 40 39Z"/>'+circle(50,50,15):'<path d="M29 81 63 19 72 24 38 86ZM58 28 67 33M33 72 42 77"/>';
 const nodes=(n,stairs=false,weaponMode=false)=>Array.from({length:n},(_,i)=>{const xx=18+i*64/Math.max(1,n-1),yy=stairs?72-i*11:48+((i%2)*12);return `<g transform="translate(${xx-50} ${yy-50})">${weaponMode?'<path d="M46 60V40L50 34 54 40V60M41 60H59M50 60V69"/>':circle(50,50,8)}</g>`}).join('');
 const chainKeys=['single','pairT','pairE','tripleT','tripleE','twoT','twoE','mixedT','mixedE','fiveT','fiveE','unison','straight','straightT','straightE','straightBoth'];
 const chain=(key,nid)=>{const n=key==='single'?1:key.startsWith('pair')?2:key.startsWith('triple')?3:key.startsWith('four')||key.startsWith('two')?4:5;return `<path d="M18 76H82" opacity=".45"/>${nodes(n,/straight|gap/.test(key),/T|Tu/.test(key))}${/full|mixed|two/.test(key)?'<path d="M27 29H44M58 29H76M51 24V33"/>':''}${/Both|unison|fiveR/.test(key)?'<path d="M30 27 34 14 50 23 66 14 70 27Z"/>':''}${Array.from({length:1+nid%3},(_,i)=>`<path d="M${40+i*10} 87v-4"/>`).join('')}`};
 if(k===0){if(id<16||[25,26,27,28,35,39,40].includes(id)){const key=chainKeys[id]||({25:'fourT',26:'fourE',27:'fullT',28:'fullE',35:'gap',39:'fourR',40:'fiveR'}[id]);symbol=chain(key,id)}else if(id>=29&&id<=33){c=palette[[0,1,2,3,4][id-29]];symbol=elem(id-29)}else symbol=({16:circle(50,50,23)+'<path d="M18 55Q5 23 39 19M65 82Q96 78 85 46"/>',17:'<path d="M50 16 78 28 73 61 50 84 27 61 22 28Z"/><path d="M35 47 48 60 66 37"/>',18:elem(1)+'<path d="M70 62v20M60 72h20"/>',19:sword+'<path d="M15 32H36M11 45H33M16 58H32"/>',20:sword+'<path d="M23 32Q6 52 23 54Q38 50 23 32Z"/>',21:'<path d="M50 17 59 41 83 50 59 59 50 83 41 59 17 50 41 41Z"/>'+circle(50,50,28),22:circle(50,50,29)+'<path d="M39 39H61V61H39ZM50 13V23M50 77V87"/>',23:'<path d="M50 17 77 28 73 62 50 84 27 62 23 28Z"/>'+elem(3),24:circle(50,50,20)+nodes(5),34:'<path d="M50 22V74M30 42H70M50 74 33 88M50 74 67 88"/>'+circle(50,18,9)+circle(30,42,6)+circle(70,42,6),36:'<path d="M44 27Q12 24 19 55Q26 79 51 60M56 73Q88 76 81 45Q74 21 49 40"/>'+circle(36,44,12)+circle(64,56,12),37:'<g transform="rotate(-30 50 50)">'+sword+'</g><g transform="rotate(30 50 50)">'+weapon(1)+'</g>',38:'<path d="M50 76Q16 69 19 40 40 39 50 62Q60 39 81 40 84 69 50 76ZM50 62Q31 42 50 15Q69 42 50 62Z"/><path d="M28 82H72"/>'}[id]||elem(id%5));}
 if(k===1){symbol='<path d="M14 33Q31 25 49 36Q67 25 86 33V80Q67 72 50 83Q32 72 14 80ZM50 37V81" fill="#162c3e"/>';symbol+=`<g transform="translate(17 -2) scale(.66)">${x.effect==='type'?weapon(x.target):x.effect==='element'?elem(x.target):x.effect==='all'?circle(50,50,26)+elem(1):chain((x.keys||x.chains||['straight'])[0]||'straight',id)}</g>`;symbol+=Array.from({length:1+id%4},(_,i)=>`<path d="M${23+i*14} 89v-3"/>`).join('');}
 if(k===2){const e=x.effect||'';if(/^e\d/.test(e)){c=palette[+e.slice(1)];symbol=elem(+e.slice(1))}else if(/^t\d/.test(e))symbol=weapon(+e.slice(1));else if(/^body/.test(e)){const b=+e.slice(4);c=['#ed8d4c','#f2e9d5','#ffd66d','#68d7bd','#a99aff','#67d6f0','#e35a79','#f09aca','#7aaae6','#8ed76d'][b];symbol='<path d="M29 32H71L77 44V72L66 84H34L23 72V44ZM34 22H66V32H34Z"/>'+`<g transform="translate(20 24) scale(.6)">${weapon(b)}</g>`}else symbol=({realm:'<path d="M20 82V63H39V46H58V29H79M50 52V15M39 28 50 15 61 28"/>',realm2:'<path d="M20 82V63H39V46H58V29H79M38 39V11M29 20 38 11 47 20M65 49V13M56 22 65 13 74 22"/>',level:'<path d="M28 76 63 27 75 38 40 85ZM35 27 49 12 82 35 69 51Z"/>',copytype:'<g transform="translate(-17 0)">'+weapon(0)+'</g><g transform="translate(17 0)">'+weapon(0)+'</g>',copyel:circle(33,50,19)+circle(67,50,19)+'<path d="M37 50H63M55 43 63 50 55 57"/>',heal:'<path d="M31 29H69V77L59 86H41L31 77ZM38 18H62V29H38ZM50 42V69M37 55H63"/>',shield:'<path d="M50 15 80 28 73 65 50 86 27 65 20 28Z"/><path d="M50 28V70M35 49H65"/>',clone:'<path d="M20 23H59V74H20ZM41 35H80V86H41Z"/><path d="M50 48 57 60 71 64 58 70 54 81 49 69 39 65 49 60Z"/>',remove:'<path d="M30 18H70V83H30ZM20 74 80 26M23 26 77 78"/>',refresh:'<path d="M30 16H70M30 84H70M35 16Q30 38 50 50Q70 62 65 84M65 16Q70 38 50 50Q30 62 35 84M39 71H61"/>',ascend:'<path d="M50 75Q17 65 23 40L50 56 77 40Q83 65 50 75ZM50 56V16M37 29 50 16 63 29M27 84H73"/>'}[e]||elem(id%5));}
 const uid=`art-${k}-${id}`;return `<svg class="upgradeArt" data-art="${k}-${id}" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><defs><radialGradient id="${uid}"><stop stop-color="${c}" stop-opacity=".24"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><circle cx="50" cy="50" r="48" fill="url(#${uid})"/><g stroke="${c}" stroke-width="3.5" fill="${c}" fill-opacity=".18" stroke-linecap="round" stroke-linejoin="round">${symbol}</g><circle cx="86" cy="15" r="3" fill="${c}"/></svg>`;
}
function bossEmblem(b){const palettes=[['#d6b776','#64452b'],['#78c6ba','#214d50'],['#f08570','#672940'],['#c696ed','#42224e'],['#e5d4ff','#7c344b']],p=palettes[(b.index+b.floor-1)%5],shape=b.index,face=[
'M28 29 41 20 61 20 75 31 72 65 50 82 29 64Z',
'M24 38 32 20 49 30 69 16 78 40 68 76 48 83 29 66Z',
'M20 41 35 18 50 28 66 18 81 40 72 69 50 84 28 69Z',
'M27 29 39 37 50 17 61 37 75 29 71 68 50 85 30 68Z',
'M23 29 36 38 50 15 64 38 79 29 71 72 50 86 29 72Z'][shape];return `<svg viewBox="0 0 100 100" aria-hidden="true" class="bossEmblem"><path d="M50 3 89 25 89 75 50 97 11 75 11 25Z" fill="#101e2a" stroke="${p[0]}" stroke-width="2"/><path d="${face}" fill="${p[1]}" stroke="${p[0]}" stroke-width="3" stroke-linejoin="round"/><path d="M32 46 45 51 38 58ZM68 46 55 51 62 58ZM40 69 50 74 61 68" fill="${p[0]}" stroke="${p[0]}" stroke-width="2"/><path d="M46 34 50 27 54 34 50 41Z" fill="${p[0]}"/></svg>`}
function packIllustration(kind,bought=false,opening=false){
 const family=kind==='Tầm Pháp'?'scroll':'cauldron';
 const still=`assets/market/${family}-${bought?'opened':'closed'}.png`;
 if(bought)return `<img class="packArt" src="${still}" width="112" height="112" alt="">`;
 return `<span class="packArt packSprite" aria-hidden="true"><img src="${still}" width="112" height="112" alt=""><span class="packFrames ${opening?'packFramesOpening':'packFramesIdle'}" style="--pack-sheet:url('assets/market/${family}-sheet.png')"></span></span>`;
}
function showPackOpening(){
 const draft=s.openPack;
 if(!draft||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return showOpenPack();
 const pack=packMeta(draft);
 modal(`<section class="packOpening" id="packOpening"><div class="eyebrow">ĐANG MỞ GÓI</div><h2>${pack.n}</h2>${packIllustration(draft.kind,false,true)}<button id="skipPackOpening">Xem vật phẩm ngay</button></section>`);
 const preview=$('packOpening');
 const skip=$('skipPackOpening');
 function reveal(){
  clearTimeout(fallback);
  if(s.openPack===draft&&$('packOpening')===preview&&!$('overlay').classList.contains('hidden'))showOpenPack();
 }
 const fallback=setTimeout(reveal,950);
 preview.querySelector('.packFrames').addEventListener('animationend',reveal,{once:true});
 skip.focus({preventScroll:true});
 skip.addEventListener('click',reveal,{once:true});
}
