/* Title screen, persisted comic checkpoints, and a guided first battle. */
(()=>{
'use strict';
const comic={
 intro:[
  ['Dấu tay trong đá','Ngươi tỉnh dậy dưới đáy một khe núi, lòng bàn tay úp trên phiến đá ướt. Khi nhấc tay lên, vết in vẫn còn đó. Ngươi lấy nó làm dấu, rồi men theo vách tìm đường ra.'],
  ['Người trong lá ngọc','Con đường vòng trở lại phiến đá. Lần này, trong dấu tay có một lá ngọc. Vừa chạm vào nó, ngươi thấy một kiếm khách hiện lên, mờ đến nỗi có thể nhìn xuyên qua vai hắn. “Ta cũng từng đi vòng như ngươi,” hắn nói.'],
  ['Cửa vàng trên đỉnh','Kiếm khách chỉ lên một cánh cửa vàng phía trên mười tầng bí cảnh. Hắn đã từng đến gần đó, nhưng giờ chỉ có thể đi theo người giữ lá ngọc. Ngươi cất lá vào tay áo và cùng hắn tiến về bậc đá đầu tiên.'],
  ['Kẻ giữ bậc thềm','Dưới cổng đá, một con yêu chắn lối. Mỗi lần nó bước tới, mặt đất lại sáng thêm một ô. Kiếm khách kéo ngươi lùi khỏi ô vừa sáng. “Nhìn chân nó. Biết khi nào nó ra đòn thì mới có chỗ mà đánh.”'],
  ['Những lá bài đáp lời','Ngươi bày lá ngọc lên một ô còn trống. Những lá khác trượt ra khỏi khe đá, mang theo bóng người và tiếng vũ khí. Kiếm khách nhấc kiếm. “Gọi những người hợp được với nhau. Ta sẽ bắt nhịp.”'],
  ['Nước đầu tiên','Con yêu hạ thấp vai. Ngươi chọn những lá đầu tiên, còn kiếm khách bước vào ô sáng ngay trước mặt nó. Cánh cửa vàng vẫn ở rất xa, nhưng lần đầu từ lúc tỉnh dậy, con đường trước mặt không dẫn ngươi quay về dấu tay cũ.']
 ],
 ending:[
  ['Qua mười cửa ải','Khi Vô Lượng Đạo Chủ ngã xuống, cánh cửa vàng mở ra. Hắn chìa cho ngươi một lá ngọc đã mòn, giống hệt lá ngươi từng nhặt dưới khe núi. “Cầm lấy. Qua bên kia, ngươi sẽ biết vì sao ta giữ nó.”'],
  ['Bên kia cánh cửa','Ngươi bước qua cửa và lại nghe tiếng nước nhỏ dưới vách đá. Phiến đá cũ nằm trước mặt. Ngươi đặt tay xuống, vừa khít vết in từ buổi đầu. Lá ngọc trong tay cũng vừa khít chỗ lõm bên cạnh.'],
  ['Người đi trước','Trong vũng nước, ngươi thấy một người khác nhặt lá ngọc. Đứng bên cạnh người ấy là chính ngươi, trong bộ giáp của Đạo Chủ. Kiếm khách nhìn theo, rồi chậm rãi nói. “Lần trước đến đây, người đứng ở phía đó là ta.”'],
  ['Bàn tay trên trời','Mặt nước rung lên. Từ trên cao, một bàn tay đặt quân cờ xuống, và mười tầng bí cảnh dịch chuyển theo nó. Sợi xích vàng từ phiến đá quấn lấy cổ tay ngươi, kéo ngươi về đúng chỗ Đạo Chủ vừa bỏ lại.'],
  ['Một nước ngoài bàn','Ngươi kéo lá ngọc khỏi chỗ lõm. Kiếm khách chém vào sợi xích vừa chùng, các Anh Linh cùng giữ lấy đầu kia. Khi xích đứt, phiến đá nghiêng xuống, để lộ những bậc thềm đi sâu bên dưới bàn cờ.'],
  ['Vô Lượng Bí Cảnh','Từ tầng đầu tiên dưới vực, Vô Lượng Yêu Tôn gọi tên ngươi. Kiếm khách đợi bên mép đá, thanh kiếm còn rung trong tay. Ngươi đặt lá ngọc lên bậc thềm thấp nhất. Lần này, chính ngươi chọn nơi bắt đầu.']
 ]
};
const closeGamePanel=closeModal,resumeGame=resumePanel,resetGame=start;
const advanceGame=nextBoss;
const panel=$('modal'),overlay=$('overlay');
let screen='game',chapter='intro',page=0,replay=false;
const finalBossDown=()=>s.stage===campaignStages-1&&s.phase==='shop';
const pendingEnding=()=>finalBossDown()&&!s.betaEnding&&!s.openPack&&!s.rewards.length;
const canContinue=()=>s.hasJourney!==false&&s.phase!=='dead';
function setScreen(name){
 screen=name;
 document.body.classList.toggle('betaScreen',name!=='game');
 panel.classList.toggle('betaPanel',['menu','settings','comic','tutorial','exit'].includes(name));
}
function showMenu(){
 if(busy)return;
 document.querySelector('.betaExitNotice')?.remove();
 setScreen('menu');
 modal(`<div class="betaMenu">
  <div class="betaBrand"><span aria-hidden="true">靈道</span><p class="betaEdition">1.0.0 · BẢN CHÍNH THỨC</p><h1>Linh Đạo</h1><h2>Hợp Kích</h2><p class="betaTagline">Triệu Anh Linh, phá thế cờ.</p></div>
  <nav class="betaChoices" aria-label="Menu chính">
   <button class="primary" onclick="betaContinue()"><i aria-hidden="true">✦</i>${canContinue()?'Tiếp tục':'Bắt Đầu'}<span aria-hidden="true">›</span></button>
   <button onclick="betaLibrary()"><i aria-hidden="true">◇</i>Đồ giám<span aria-hidden="true">›</span></button>
   <button onclick="betaGuide()"><i aria-hidden="true">✧</i>Hướng Dẫn<span aria-hidden="true">›</span></button>
   <button onclick="betaSettings()"><i aria-hidden="true">⚙</i>Cài đặt<span aria-hidden="true">›</span></button>
   <button onclick="betaExit()"><i aria-hidden="true">↙</i>Thoát<span aria-hidden="true">›</span></button>
  </nav>
 </div>`);
}
function beginComic(kind,readOnly=false){
 chapter=kind;replay=readOnly;
 page=readOnly?0:(s[kind==='intro'?'betaIntroPage':'betaEndingPage']??0);
 page=Math.min(comic[kind].length-1,Math.max(0,page));
 showComic();
}
function showComic(){
 setScreen('comic');
 const [title,caption]=comic[chapter][page],last=page===comic[chapter].length-1;
 modal(`<article class="betaComic" aria-label="${chapter==='intro'?'Truyện mở đầu':'Truyện kết'}">
  <div class="betaComicTop"><span>${chapter==='intro'?'MỞ ĐẦU':'HỒI KẾT'}</span><span>TRANG ${page+1} / ${comic[chapter].length}</span></div>
  <img src="assets/comic/manhua-${chapter}-${page+1}.webp" width="416" height="624" alt="${title}">
  <div class="betaCaption"><h2>${title}</h2><p>${caption}</p></div>
  <div class="betaActions"><button onclick="betaComicBack()">${page?'Trang trước':'Quay lại'}</button>
  <button onclick="betaSkipComic()">Bỏ qua truyện</button><button class="primary" onclick="betaComicNext()">${last?(replay?'Khép truyện':chapter==='intro'?'Vào bàn đấu':'Bước vào Vô Lượng Bí Cảnh'):'Trang sau'} ↗</button></div>
 </article>`);
}
function rememberPage(){
 if(replay)return;
 s[chapter==='intro'?'betaIntroPage':'betaEndingPage']=page;save();
}
function playGame(){
 setScreen('game');resumePanel();
}
const tutorialKey='linhdao-tutorial-seen';
const tutorialTips=[
 ['Chọn Anh Linh','Chọn tối đa 5 trong 8 lá. Lá có viền sáng đã được chọn, còn dấu Xuất trận cho biết lá thật sự tham gia đòn đánh. Giữ một lá để xem cảnh giới, cấp, nguyên tố, loại tu và thể chất.'],
 ['Ghép hợp kích','Loại Tu giống nhau tăng hệ số. Nguyên Tố giống nhau cộng sát thương. Cảnh Giới và các chuỗi đặc biệt cũng có thưởng. Bấm tên chuỗi để đổi trận pháp. Khung dự kiến và nút Chi tiết cho biết từng khoản cộng và nhân.'],
 ['Ra đòn và đổi bài','Bấm Xuất chiêu để đánh và rút bài bù. Boss phản công khi bộ đếm về 0. Đổi thẻ rút bù các lá đã chọn mà không tốn lượt đánh, nhưng số lần đổi có giới hạn.'],
 ['Cơ Duyên, Tầm Pháp và Luyện Đan','Cơ Duyên tạo hiệu ứng khi còn giữ. Tầm Pháp tăng chỉ số sau khi lĩnh ngộ. Luyện Đan dùng để sửa hoặc cường hóa bài, hãy đọc điều kiện của từng món trước khi dùng.'],
 ['Phường Thị','Thắng trận để nhận Linh Thạch. Tại chợ có thể mua, hợp nhất, khóa hàng, mở gói, bán và sử dụng nâng cấp. Gói ghi số lá tối đa có thể nhận. Có thể hồi HP hoặc làm mới hàng bằng Linh Thạch.'],
 ['Tiến sâu vào Bí Cảnh','Xem số lượt trước khi boss ra đòn và bấm lời nguyền để đọc hiệu ứng. Vượt thủ lĩnh để sang Bí Cảnh tiếp theo. Hành trang và Cảnh giới giúp tra bài trong trận, còn tiến trình được lưu sau các thao tác chính.']
];
const tutorialSeen=()=>localStorage.getItem(tutorialKey)==='1';
const tutorialBar=document.createElement('div');
tutorialBar.className='liveTutorial';
tutorialBar.hidden=true;
document.querySelector('.formationStage').append(tutorialBar);
function syncTutorial(){
 tutorialBar.hidden=s.betaIntro!=='tutorial'||s.phase!=='battle';
 if(tutorialBar.hidden)return;
 tutorialBar.innerHTML=`<span>${s.used===0&&s.turn===1?'Thử chọn 2–3 Kiếm Tu để ghép chuỗi.':'Hạ yêu đầu tiên để hoàn thành hướng dẫn.'}</span>
 <button onclick="betaTutorialGuide()">Chỉ dẫn</button><button onclick="betaSkipTutorial()">Bỏ qua</button>`;
}
function startTutorial(){
 if(s.betaIntro!=='tutorial'){
  // A strong opening formation, on the real deck and battle rules.
  const opening=s.deck.filter(c=>c.t===0&&c.r>=4&&c.r<=6&&c.e===c.r-4).map(c=>c.id);
  const hand=[...opening,...s.hand.filter(id=>!opening.includes(id))].slice(0,8);
  s.draw=[...s.draw.filter(id=>!hand.includes(id)),...s.hand.filter(id=>!hand.includes(id))];
  s.hand=hand;s.betaIntro='tutorial';save();render();
 }
 setScreen('game');resumePanel();
}
window.betaTutorialGuide=()=>{
 modal(`<section class="betaTutorial"><p class="eyebrow">CHỈ DẪN TRONG TRẬN</p><h2>Đọc bàn đấu</h2>
  ${tutorialTips.map(([title,tip],i)=>`<details ${i===0?'open':''}><summary>${title}</summary><p>${tip}</p></details>`).join('')}
  <div class="betaActions"><button onclick="betaSkipTutorial()">Bỏ qua hướng dẫn</button><button class="primary" onclick="closeModal()">Về trận ↗</button></div></section>`);
};
function finishTutorial(){
 s.betaIntro='done';localStorage.setItem(tutorialKey,'1');save();syncTutorial();
}
window.betaSkipTutorial=()=>{if(s.betaIntro!=='tutorial'||busy)return;finishTutorial();playGame();};
window.betaTutorialContinue=()=>{finishTutorial();playGame();};
window.betaTutorialRestart=()=>{finishTutorial();resetGame();s.betaIntro='done';save();playGame();};
function tutorialComplete(){
 modal('<section class="betaTutorial"><p class="eyebrow">ĐÃ HẠ YÊU ĐẦU TIÊN</p><h2>Hoàn thành hướng dẫn</h2><p>Giữ ván vừa chơi để vào Phường Thị, hoặc bỏ ván này và khởi đầu một ván mới.</p><div class="betaActions"><button onclick="betaTutorialRestart()">Bỏ ván này và chơi mới</button><button class="primary" onclick="betaTutorialContinue()">Tiếp tục ván này ↗</button></div></section>');
}
window.betaSettings=function(){
 setScreen('settings');
 modal(`<section class="betaTutorial betaSettings"><p class="eyebrow">HIỂN THỊ & ÂM THANH</p><h2>Cài đặt</h2>
  <p>Thẻ trên tay dùng avatar Anh Linh. Đội hình trên bàn đấu dùng hình vũ khí.</p>
  <div class="betaActions"><button onclick="openMainMenu()">Quay lại</button><button aria-pressed="${gameSoundEnabled}" onclick="betaToggleSound()">Âm thanh · ${gameSoundEnabled?'Bật':'Tắt'}</button></div>
 </section>`);
};
window.betaToggleSound=function(){setGameSound(!gameSoundEnabled);window.betaSettings();};
window.openMainMenu=showMenu;
window.betaContinue=function(){
 if(!canContinue()){start();return;}
 if(s.betaIntro==='comic')beginComic('intro');
 else if(s.betaIntro==='tutorial')startTutorial();
 else playGame();
};
start=function(){
 resetGame();s.betaIntro='comic';s.betaIntroPage=0;save();beginComic('intro');
};
window.betaLibrary=()=>{setScreen('library');openBook();};
window.betaGuide=()=>{
 setScreen('guide');
 showRules();
 const actions=document.createElement('div');actions.className='betaActions';
 actions.innerHTML='<button onclick="openMainMenu()">Menu chính</button>';
 panel.append(actions);
};
window.betaComicBack=()=>{
 if(page>0){page--;rememberPage();showComic();return;}
 closeModal();
};
window.betaComicNext=()=>{
 if(page<comic[chapter].length-1){page++;rememberPage();showComic();return;}
 finishComic();
};
window.betaSkipComic=finishComic;
function finishComic(){
 if(replay){playGame();return;}
 if(chapter==='intro'){
  if(tutorialSeen()){s.betaIntro='done';save();playGame();return;}
  startTutorial();
  if(s.phase==='battle')window.betaTutorialGuide();
  return;
 }
 s.betaEnding=true;save();setScreen('game');advanceGame();
}
window.betaExit=()=>{
 setScreen('exit');
 modal(`<section class="betaTutorial"><h2>Đã rời bàn đấu</h2><p>Tiến trình đã được lưu. ${window.AndroidHost?'Dùng nút Quay lại của Android để đóng game.':'Mày có thể đóng tab này.'}</p><button onclick="openMainMenu()">Menu chính</button></section>`);
 // Let the native Back button close the activity instead of dismissing a dialog.
 if(window.AndroidHost){
  overlay.classList.add('hidden');
  const notice=document.createElement('div');notice.className='betaExitNotice';notice.append(...panel.childNodes);document.body.append(notice);
 }
};
closeModal=function(){
 if(screen==='comic'&&replay){playGame();return;}
 if(screen!=='game'){showMenu();return;}
 if(s.betaIntro==='tutorial'&&s.phase==='shop')return tutorialComplete();
 return closeGamePanel();
};
resumePanel=function(){
 syncTutorial();
 if(s.betaIntro==='tutorial'&&s.phase==='shop'&&!s.rewards.length&&!s.openPack)return tutorialComplete();
 if(s.betaIntro==='tutorial'&&s.phase==='dead')finishTutorial();
 if(pendingEnding()){beginComic('ending');return;}
 return resumeGame();
};
nextBoss=function(){
 if(pendingEnding()){beginComic('ending');return;}
 if(finalBossDown()&&s.betaEnding){advanceGame();return;}
 return advanceGame();
};
window.showStory=function(){beginComic(s.stage>=campaignStages||finalBossDown()?'ending':'intro',true);};
for(const name of ['showShop','endScreen']){
 const original=window[name];
 window[name]=function(...args){
  original.apply(this,args);
  if(screen!=='game'||s.openPack)return;
  const button=document.createElement('button');button.className='betaBackToMenu';button.textContent='Menu chính';button.onclick=showMenu;panel.append(button);
 };
}
showMenu();
})();
