const itemIllustration=x=>typeof upgradeArt==='function'?upgradeArt(x):'';
const $=id=>document.getElementById(id),fmt=n=>{if(typeof n==='bigint')return n.toLocaleString('vi-VN');return Math.floor(n).toLocaleString('vi-VN')};
const realms=['Khai Linh','Sơ Linh','Tông Linh','Tướng Linh','Vương Linh','Hoàng Linh','Đế Linh','Thánh Linh','Tiên Linh','Tôn Linh','Chí Tôn Linh'];
const types=['Kiếm Tu','Đao Tu','Thương Tu','Ám Khí','Chủy Thủ','Chỉ Tu','Chưởng Tu','Quyền Tu','Pháp Tu','Côn Tu'],glyphs=['劍','刀','槍','鏢','匕','指','掌','拳','法','棍'];
const elements=['Kim','Mộc','Thủy','Hỏa','Thổ'],colors=['#dbc888','#8bbb8c','#84b5d3','#d98c73','#c4a27d'];
const realmPower=[1,2,4,7,11,16,22,29,37,46,56];
const heroCatalog=realms.flatMap((_,r)=>types.flatMap((_,t)=>elements.map((_,e)=>({key:r+'-'+t+'-'+e,r,t,e,l:1,body:null}))));
const num=n=>Number(n).toLocaleString('vi-VN',{maximumFractionDigits:2});
let heroFilters={r:-1,t:-1,e:-1,page:0};
const bodies=[['Cường Thể','+5 Công Kích trước các hệ số.',10],['Thánh Thể','Sát thương riêng của lá ×2.',18],['Kim Thể','Mỗi lần lá ra trận: +5 Linh Thạch.',20],['Vận Thể','Mỗi lần lá ra trận: nhận 1 Cơ Duyên ngẫu nhiên.',24],['Tinh Thần Thể','Mỗi lần lá ra trận: nhận 1 Tầm Pháp ngẫu nhiên.',22],['Đạo Thể','Mỗi lần lá ra trận: nhận 1 Luyện Đan ngẫu nhiên.',22],['Ma Thể','Sát thương riêng ×10; sau mỗi lần ra trận có 25% tan biến vĩnh viễn.',16],['Mị Thể','Mỗi Anh Linh KHÁC cùng Cảnh Giới đang ra trận được +20 Công Kích.',16],['Kim Cang Thể','+25 Công Kích; mỗi lần ra trận lùi đòn boss thêm 1 lượt.',22],['Sinh Nguyên Thể','Mỗi lá mang thể này ra trận hồi 10 HP.',16]].map((x,i)=>({id:i,n:x[0],d:x[1],p:x[2]}));
const CH={single:{n:'Độc Hành',a:0,m:1,da:3,dm:0},pairT:{n:'Song Tu',a:0,m:1.5,da:0,dm:0.15},pairE:{n:'Song Nguyên',a:10,m:1,da:5,dm:0},tripleT:{n:'Tam Tu',a:0,m:2,da:0,dm:0.2},tripleE:{n:'Tam Nguyên',a:15,m:1,da:5,dm:0},twoT:{n:'Lưỡng Đối Đồng Tu',a:0,m:2.5,da:0,dm:0.2},twoE:{n:'Lưỡng Đối Đồng Nguyên',a:20,m:1,da:5,dm:0},mixedT:{n:'Tam Tu · Song Nguyên',a:10,m:2,da:5,dm:0.2},mixedE:{n:'Tam Nguyên · Song Tu',a:15,m:1.5,da:5,dm:0.15},fiveT:{n:'Ngũ Loại Hợp Kích',a:0,m:5,da:0,dm:0.3},fiveE:{n:'Ngũ Nguyên Hợp Kích',a:50,m:1,da:10,dm:0},unison:{n:'Ngũ Linh Đồng Nhất',a:0,m:100,da:0,dm:5},straight:{n:'Ngũ Cảnh Liên Hoàn',a:250,m:1,da:25,dm:0},straightT:{n:'Ngũ Cảnh Đồng Tu',a:250,m:5,da:25,dm:0.25},straightE:{n:'Ngũ Cảnh Đồng Nguyên',a:500,m:1,da:50,dm:0},straightBoth:{n:'Vạn Linh Quy Nhất',a:1000,m:1,da:100,dm:0}};
Object.assign(CH,{fourT:{n:'Tứ Tu',a:0,m:4,da:0,dm:0.25},fourE:{n:'Tứ Nguyên',a:40,m:1,da:8,dm:0},fullT:{n:'Tam Nhị Đồng Tu',a:0,m:3,da:0,dm:0.25},fullE:{n:'Tam Nhị Đồng Nguyên',a:25,m:1,da:8,dm:0}});
const chainKeys=Object.keys(CH),oldChainKeys=chainKeys.slice(0,16);
const J=oldChainKeys.map((key,i)=>({id:i,key,n:CH[key].n+' · Chân Ý',d:`Nâng chuỗi ${CH[key].n}: ${CH[key].da?'+'+CH[key].da+' Công Kích ':''}${CH[key].dm?'+'+CH[key].dm+' hệ số':''}.`,p:6+(i>=9?4:0),kind:'Cơ Duyên'}));
[['Tụ Linh Châu','Mỗi lượt +5 Công Kích vào tổng đội hình.',6],['Thổ Linh Giáp','Giảm 4 sát thương mỗi đợt boss đánh.',7],['Mộc Linh Tức','Có Mộc ra trận: hồi 3 HP.',7],['Tiên Phong','Lượt đầu boss: tổng đội hình +10 Công Kích.',6],['Huyết Chiến','Còn tối đa 40% HP: tổng đội hình +15 Công Kích.',7],['Thiên Cơ','Mỗi lần đổi bài trong boss này: +2 Công Kích (tối đa +6).',6],['Linh Thạch Ấn','Mỗi 10 Linh Thạch đang giữ: +1 Công Kích (tối đa +10).',6],['Bất Khuất','Mỗi 10 HP đã mất: +2 Công Kích.',7],['Đại Đạo','Mỗi Cơ Duyên đang giữ: +2 Công Kích.',8]].forEach(x=>J.push({id:J.length,n:x[0],d:x[1],p:x[2],kind:'Cơ Duyên'}));
['fourT','fourE','fullT','fullE'].forEach(key=>J.push({id:J.length,key,n:CH[key].n+' · Chân Ý',d:`Nâng chuỗi ${CH[key].n}: ${CH[key].da?'+'+CH[key].da+' Công Kích':''}${CH[key].dm?'+'+CH[key].dm+' hệ số':''}.`,p:8,kind:'Cơ Duyên'}));
elements.forEach((n,e)=>J.push({id:J.length,n:n+' Hành Linh Ấn',d:`Mỗi lá ${n} thật sự ra trận cộng thêm +4 vào tổng Công Kích trước hệ số chuỗi.`,element:e,p:7,kind:'Cơ Duyên'}));
J.push({id:J.length,n:'Thể Đạo Cộng Minh',d:'Mỗi lá có Thể Chất ra trận: tổng Công Kích +3 (tối đa +15).',p:9,kind:'Cơ Duyên'});
const L=types.map((n,i)=>({n:n+' · Công Pháp',d:`Mỗi Anh Linh ${n} vĩnh viễn thêm +2 Công Kích trong hành trình. Gốc +5.`,effect:'type',target:i,p:5,kind:'Tầm Pháp'}));
elements.forEach((n,i)=>L.push({n:n+' · Nguyên Pháp',d:`Hệ số riêng của mọi lá ${n} tăng +0,1. Gốc ×1.`,effect:'element',target:i,p:6,kind:'Tầm Pháp'}));
const packs=[['Độc Hành',['single']],['Song Hợp',['pairT','pairE']],['Tam Hợp',['tripleT','tripleE']],['Lưỡng Đối',['twoT','twoE']],['Tam Nhị',['mixedT','mixedE']],['Ngũ Hợp',['fiveT','fiveE']],['Đồng Nhất',['unison']],['Liên Cảnh',['straight','straightT']],['Nguyên Cảnh',['straightE']],['Vạn Linh',['straightBoth']]];
packs.forEach(([n,keys])=>L.push({n:n+' · Tâm Kinh',d:'Tăng 1 cấp chuỗi: '+keys.map(k=>CH[k].n).join(', ')+'.',effect:'chain',keys,p:8,kind:'Tầm Pháp'}));[
['Tứ Tu · Tâm Kinh',['fourT']],['Tứ Nguyên · Tâm Kinh',['fourE']],['Tam Nhị Đồng Tu · Tâm Kinh',['fullT']],['Tam Nhị Đồng Nguyên · Tâm Kinh',['fullE']],
['Kiếm Đạo Thành Trận',['pairT','tripleT','fourT']],['Nguyên Hành Thành Trận',['pairE','tripleE','fourE']],['Song Đạo Quy Tông',['twoT','fullT']],['Song Nguyên Quy Tông',['twoE','fullE']],['Lưỡng Nghi Giao Hội',['mixedT','mixedE']],['Ngũ Linh Chân Kinh',['fiveT','fiveE']]
].forEach(([n,keys])=>L.push({n,d:'Tăng 1 cấp chuỗi: '+keys.map(k=>CH[k].n).join(', ')+'.',effect:'chain',keys,p:keys.length>1?11:8,kind:'Tầm Pháp'}));L.forEach((x,i)=>x.id=i);
const T=[['Thăng Linh','Chọn 1 lá: tăng một Cảnh Giới.',5,'realm'],['Đại Thăng Linh','Chọn 1–2 lá: tăng một Cảnh Giới.',9,'realm2'],['Tôi Hồn','Chọn 1 lá: tăng 2 cấp (+4 Công Kích gốc).',5,'level'],['Đồng Tâm','Chọn 2 lá: lá sau nhận Loại Tu của lá trước.',6,'copytype'],['Đồng Nguyên','Chọn 2 lá: lá sau nhận Nguyên Tố của lá trước.',6,'copyel'],...elements.map((e,i)=>[e+' Hóa',`Chọn 1–2 lá: chuyển thành ${e}.`,5,'e'+i]),...types.map((t,i)=>[t+' Ấn',`Chọn 1–2 lá: chuyển thành ${t}.`,5,'t'+i]),['Phục Nguyên','Hồi 35 HP.',6,'heal'],['Hộ Thể','Chặn 20 sát thương đợt boss đánh tiếp theo.',5,'shield'],['Duyên Sinh','Chọn 1 lá: tạo bản sao vĩnh viễn (giữ Thể Chất).',7,'clone'],['Tán Linh','Chọn 1 lá: xóa vĩnh viễn khỏi bộ (tối thiểu 10 lá).',4,'remove'],['Nghịch Mệnh','Hồi lượt đổi thẻ về tối đa của boss hiện tại (thường là 3).',6,'refresh'],...bodies.map(b=>[b.n+' · Thể Đan','Chọn 1 lá: gắn '+b.n+' vĩnh viễn. '+b.d,b.p,'body'+b.id])].map((x,i)=>({id:i,n:x[0],d:x[1],p:x[2],effect:x[3],kind:'Luyện Đan'}));
const curses=[{n:'Phong Nguyên',d:'Hệ số Nguyên Tố RIÊNG của các lá trở về ×1; hệ số chuỗi vẫn giữ.',key:'element'},{n:'Áp Cảnh',d:'Phần Công Kích từ Cảnh Giới của mỗi lá giảm 50%.',key:'realm'},{n:'Tán Pháp',d:'Phần thưởng CỘNG của chuỗi giảm 50%; không giảm điểm của lá.',key:'chain'},{n:'Huyết Sát',d:'Sau mỗi lần xuất kích mất 3 HP, kể cả đòn kết liễu boss.',key:'blood'},{n:'Cấm Chuyển',d:'Mỗi lần cấp lượt đổi chỉ nhận 1 thay vì 3 (kể cả Nghịch Mệnh).',key:'discard'}];
curses.push(
{n:'Phong Thể',d:'Vô hiệu mọi hiệu ứng Thể Chất trong trận, kể cả rủi ro Ma Thể.',key:'bodySeal'},
{n:'Tuyệt Sinh',d:'Không thể hồi HP trong trận; hồi HP nghỉ chân sau chiến thắng vẫn hoạt động.',key:'healSeal'},
{n:'Phá Giáp',d:'Đòn boss xuyên toàn bộ khiên và giảm sát thương.',key:'pierce'},
{n:'Áp Trận',d:'Phần hệ số chuỗi vượt ×1 bị giảm một nửa.',key:'multSeal'},
{n:'Tán Quân',d:'Đội hình có từ 4 Anh Linh ra trận: sát thương cuối giảm 20%.',key:'swarm'},
{n:'Cấm Duyên',d:'Vô hiệu toàn bộ Cơ Duyên đang giữ trong trận; Tầm Pháp vẫn hoạt động.',key:'fortuneSeal'},
{n:'Phong Tu',d:'Vô hiệu điểm tăng từ Tầm Pháp Loại Tu; điểm cơ bản +5 vẫn giữ.',key:'typeSeal'},
{n:'Nghịch Lưu',d:'Không thể lùi lượt phản công của boss; +25 của Kim Cang Thể vẫn giữ.',key:'delaySeal'},
{n:'Tham Linh',d:'Sau mỗi lần xuất kích mất tối đa 2 Linh Thạch, kể cả đòn kết liễu.',key:'tithe'},
{n:'Cuồng Nộ',d:'Sát thương đòn boss tăng thêm +2 sau mỗi lần xuất kích trong trận.',key:'rage'},
{n:'Đoạn Mạch',d:'Phong một Loại Tu, Nguyên Tố hoặc chuỗi ngẫu nhiên trong suốt trận.',key:'randomSeal'});
// Expansion 2.0: append-only IDs preserve all saved inventories.
const SPECIAL={gap:35,mergeE:36,mergeT:37,ward:38};
const RARITIES=['Phàm Phẩm','Trung Phẩm','Thượng Phẩm','Cực Phẩm','Tiên Thiên'];
const RARITY_COLORS=['#b2b7ad','#77c8aa','#89aef2','#d39af2','#f5ce78'];
J.push({id:35,n:'Cách Cảnh Thông Huyền',d:'Cho phép chuỗi 4 hoặc 5 Cảnh Giới khác nhau tăng dần, mỗi bước cách 1 hoặc 2 bậc. Ví dụ bậc 1–3–5–7. Không cần chọn bài theo thứ tự.',p:16,kind:'Cơ Duyên',q:3},
{id:36,n:'Lưỡng Hành Quy Nguyên',d:'Một cặp Nguyên Tố ngẫu nhiên được coi là cùng Hành khi xét chuỗi. Không đổi chỉ số hoặc Nguyên Tố thật của từng lá.',p:12,kind:'Cơ Duyên',q:2},
{id:37,n:'Lưỡng Tu Quy Nhất',d:'Một cặp Loại Tu ngẫu nhiên được coi là cùng Tu khi xét chuỗi. Cùng Lưỡng Hành chiếm tối đa 2 ô Cơ Duyên.',p:12,kind:'Cơ Duyên',q:2},
{id:38,n:'Tiên Thiên Vô Cấu',d:'Vô hiệu hóa TẤT CẢ lời nguyền boss khi đang giữ, kể cả Cấm Duyên, Huyết Sát, Cấm Chuyển và Cuồng Nộ.',p:25,kind:'Cơ Duyên',q:4});
Object.assign(CH,{fourR:{n:'Tứ Cảnh Đồng Tôn',a:80,m:2,da:15,dm:.2},fiveR:{n:'Ngũ Cảnh Đồng Tôn',a:150,m:4,da:25,dm:.4},gap4:{n:'Tứ Cảnh Cách Liên',a:120,m:1,da:15,dm:0},gap4T:{n:'Tứ Cảnh Đồng Tu',a:120,m:3,da:15,dm:0.2},gap4E:{n:'Tứ Cảnh Đồng Nguyên',a:240,m:1,da:25,dm:0},gap4Both:{n:'Tứ Cảnh Quy Nhất',a:600,m:1,da:60,dm:0}});
chainKeys.push('fourR','fiveR','gap4','gap4T','gap4E','gap4Both');
for(const key of ['fourR','fiveR'])J.push({id:J.length,key,n:CH[key].n+' · Chân Ý',d:'Tăng 1 cấp '+CH[key].n+'.',p:key==='fourR'?10:14,kind:'Cơ Duyên',q:key==='fourR'?2:3});
for(const key of ['fourR','fiveR'])L.push({id:L.length,n:CH[key].n+' · Tâm Kinh',d:'Vĩnh viễn tăng 1 cấp '+CH[key].n+'.',effect:'chain',keys:[key],p:key==='fourR'?9:12,kind:'Tầm Pháp',q:key==='fourR'?2:3});
L.push({id:L.length,n:'Cách Cảnh · Tâm Kinh',d:'Tăng 1 cấp cả 4 trận pháp Tứ Cảnh Cách Liên. Cần Cách Cảnh Thông Huyền để kích hoạt trận.',effect:'chain',keys:['gap4','gap4T','gap4E','gap4Both'],p:14,kind:'Tầm Pháp',q:3});
L.push({id:L.length,n:'Tiên Thiên Ngộ Đạo',d:'Vĩnh viễn tăng 1 cấp toàn bộ 10 Công Pháp, 5 Nguyên Pháp và tất cả trận pháp.',effect:'all',p:25,kind:'Tầm Pháp',q:4});
T.push({id:T.length,n:'Tiên Thiên Tạo Hóa',d:'Chọn 1 lá: tăng 2 Cảnh Giới và 4 cấp. Cảnh Giới tối đa Chí Tôn Linh.',effect:'ascend',p:22,kind:'Luyện Đan',q:4});
for(const x of J){if(x.q==null)x.q=x.id<9?1:x.id<16?3:x.id<25?0:x.id<29?2:1;}
for(const x of L){if(x.q==null)x.q=x.effect==='type'?0:x.effect==='element'?1:x.keys?.some(k=>['unison','straightBoth'].includes(k))?3:2;}
for(const x of T){if(x.q==null)x.q=x.effect.startsWith('body')?(x.p>=22?3:2):['realm2','clone'].includes(x.effect)?2:['realm','heal','shield','refresh'].includes(x.effect)?1:0;}

// Retire the four-of-a-realm chain without reusing saved catalog IDs.
J[39].retired=true;L[35].retired=true;delete CH.fourR;chainKeys.splice(chainKeys.indexOf('fourR'),1);
const yaoNames=['Heo Tinh','Hổ Tinh','Trâu Tinh','Hồ Tinh','Lang Tinh','Hùng Tinh','Thỏ Tinh','Hầu Tinh','Lộc Tinh','Dê Tinh','Mã Tinh','Khuyển Tinh','Xà Tinh','Thiềm Tinh','Ngạc Tinh','Quy Tinh','Thằn Lằn Tinh','Hỏa Tích Tinh','Cú Tinh','Nha Tinh','Ưng Tinh','Bức Tinh','Kê Tinh','Hạc Tinh','Chu Tinh','Hạt Tinh','Đường Lang Tinh','Ngô Công Tinh','Thử Tinh','Xuyên Sơn Tinh'];
const yaoRealms=['Yêu Sơ','Yêu Linh','Yêu Tông','Yêu Tướng','Yêu Vương','Yêu Hoàng','Yêu Đế','Yêu Thánh','Yêu Tiên','Yêu Tôn'];
const sanctuaryNames=['Nham Giác Sơn Quỷ','Hàn Uyên Giao Long','Huyền Thiết La Hán','Dạ Hành Ảnh Sát','Xích Đồng Ma Quân','Vạn Niên Mộc Linh','Dung Nham Ngưu Ma','Bạch Cốt U Cơ','Hàn Uyên Long Vương','Vô Lượng Đạo Chủ'];
const sanctuaryArt=[0,1,2,3,4,5,6,7,8,17];
const campaignStages=yaoRealms.length*5;
function yaoRank(floor){const level=floor-yaoRealms.length;return level>0?'Vô Lượng Yêu Tôn · '+(['Nhất','Nhị','Tam','Tứ','Ngũ','Lục','Thất','Bát','Cửu','Thập'][level-1]??level)+' Trọng':yaoRealms[floor-1];}
function seedYao(){s.yaoOrder=shuffle(yaoNames.map((_,i)=>i));}

let s,selected=[],busy=false,toastTimer,formation=null;
const rand=n=>Math.floor(Math.random()*n);function shuffle(a){for(let i=a.length-1;i>0;i--){const j=rand(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function save(){try{localStorage.setItem('linhdao-v2',JSON.stringify(s))}catch{toast('Trình duyệt chưa lưu được tiến trình.')}}
function log(t){s.logs.unshift(t);s.logs=s.logs.slice(0,24)}function card(id){return s.deck.find(c=>c.id===id)}function chosen(){return selected.map(card).filter(Boolean)}function groups(cs,k){const g={};cs.forEach(c=>(g[chainAttr(c,k)]??=[]).push(c));return Object.values(g)}function curseIs(key){return s.phase==='battle'&&currentBoss().curse?.key===key}function hasJ(id){return !curseIs('fortuneSeal')&&s.j.includes(id)}function healInBattle(n){if(s.phase==='battle'&&curseIs('healSeal'))return 0;const old=s.hp;s.hp=Math.min(s.max,s.hp+n);return s.hp-old}
const bossBaseHp=[180,260,360,480,750];
function bossMaxHp(stage,campaignRate=130n,endlessRate=165n){
 const depth=Math.floor(stage/5),campaignDepth=Math.min(depth,yaoRealms.length-1);
 return BigInt(bossBaseHp[stage%5])*campaignRate**BigInt(campaignDepth)*endlessRate**BigInt(depth-campaignDepth)/100n**BigInt(depth);
}
function bossAt(stage){
 const floor=Math.floor(stage/5)+1,index=stage%5,endless=floor>yaoRealms.length,guardian=index===4;
 if(guardian&&s?.mundaneGuardians?.includes(stage))return {...bossAt(stage-1),index,convertedGuardian:true};
 const order=s?.yaoOrder;
 let curse=guardian?curses[(floor-1)%curses.length]:null;
 if(curse?.key==='randomSeal'){
  const roll=order?.[(floor+3)%order.length]??floor;
  const keys=chainKeys.filter(k=>k!=='single'&&!k.startsWith('gap'));
  const choices=[['t',types],['e',elements],['chain',keys]];
  const [attr,pool]=choices[roll%choices.length],index=(roll+floor)%pool.length;
  const label=attr==='chain'?CH[pool[index]].n:pool[index];
  curse={...curse,attr,target:attr==='chain'?pool[index]:index,
   d:'Vô hiệu '+(attr==='t'?'Loại Tu ':attr==='e'?'Nguyên Tố ':'chuỗi ')+label+' khi ghép hợp kích.'};
 }
 const encounter=(floor-1)*4+index;
 const art=guardian?sanctuaryArt[(floor-1)%sanctuaryArt.length]:(order?.[encounter%yaoNames.length]??encounter%yaoNames.length);
 const extra=Math.max(0,floor-yaoRealms.length);
 const hp=bossMaxHp(stage);
 const atk=Math.min(Number.MAX_SAFE_INTEGER-1000000,Math.round([10,14,17,13,21][index]*(1+.12*(floor-1-extra))*1.45**extra));
 const n=guardian?sanctuaryNames[(floor-1)%sanctuaryNames.length]:yaoNames[art];
 return {floor,index,n,art,glyph:guardian?'道':'妖',rank:yaoRank(floor),guardian,endless,hue:(art*137+18)%360,hp,interval:[3,4,3,2,3][index],atk,reward:7+index*2+Math.min(20,floor-1),curse};
}
let lastEncounter;
function baseEncounter() {
 const order=s.yaoOrder,stage=s.stage;
 if(!lastEncounter||lastEncounter.order!==order||lastEncounter.stage!==stage||lastEncounter.mundane!==s.mundaneGuardians)lastEncounter={order,stage,mundane:s.mundaneGuardians,boss:bossAt(stage)};
 return lastEncounter.boss;
}
function currentBoss(){const b={...baseEncounter()};if((s.j.includes(SPECIAL.ward)||s.curseClearedStage===s.stage)&&b.curse){b.suppressed=b.curse;b.curse=null;}if(b.curse?.key==='rage')b.atk+=2*s.turn;return b}function soul(c){const raw=realmPower[c.r];return (curseIs('realm')?raw*.5:raw)+(c.l-1)*2}
function cardStats(c,active=[c]){const sealed=curseIs('bodySeal'),body=sealed?null:c.body,aura=sealed?0:active.filter(x=>x.id!==c.id&&x.body===7&&x.r===c.r).length*20;const bodyAdd=body===0?5:body===8?25:0,bodyMult=body===1?2:body===6?10:1,element=curseIs('element')?1:elementTrainingMult(s.elemUp[c.e]),typeUpgrade=curseIs('typeSeal')?0:typeTrainingBonus(s.typeUp[c.t]),realm=curseIs('realm')?realmPower[c.r]*.5:realmPower[c.r],level=(c.l-1)*2,training=cardTraining(level,5+typeUpgrade,element),total=(realm+training.lv+training.tu+training.hanh+bodyAdd+aura)*training.element*bodyMult;return{realm,level,typeBase:5,typeUpgrade,bodyAdd,aura,element,bodyMult,total,training}}
function ownAttack(c,active=[c]){return cardStats(c,active).total}

function ranked(cs){return [...cs].sort((a,b)=>b.r-a.r||ownAttack(b)-ownAttack(a)||b.l-a.l||a.id-b.id)}
function chainLevel(key){return(s.up[key]||0)+(hasJ(J.find(x=>x.key===key)?.id)?relicPower(J.find(x=>x.key===key).id):0)}
function applyTraining(x){ensureExpansion();if(x.effect==='all'){s.typeUp=s.typeUp.map(n=>n+1);s.elemUp=s.elemUp.map(n=>n+1);chainKeys.forEach(k=>s.up[k]=(s.up[k]||0)+1)}else if(x.effect==='type')s.typeUp[x.target]++;else if(x.effect==='element')s.elemUp[x.target]++;else if(x.effect==='chain')x.keys.forEach(k=>s.up[k]=(s.up[k]||0)+1);s.trainingHistory[x.id]=(s.trainingHistory[x.id]||0)+1;}
function start(hasJourney=true){s={version:2,hasJourney,balanceVersion:4,yaoBalance:1,coins:5,hp:100,max:100,stage:0,turn:1,countdown:3,bossHp:'180',discards:3,used:0,j:[],tarots:[],up:{},typeUp:Array(10).fill(0),elemUp:Array(5).fill(0),deck:[],draw:[],hand:[],grave:[],logs:['Đại đạo khởi hành · 5 Linh Thạch.'],phase:'battle',shield:0,uid:0,rewards:[],offers:[],rosterVersion:2,bossHits:0};seedYao();for(const {r,t,e} of heroCatalog)s.deck.push({id:++s.uid,t,e,r,l:1,body:null});s.draw=shuffle(s.deck.map(c=>c.id));ensureExpansion();selected=[];busy=false;draw();save();render();$('overlay').classList.add('hidden')}
// Each rank adds 0.35 relative draw weight. Sampling consumes one real card.
function drawBiasWeights(){
 const boosts=drawBiasUpgrades.map(x=>[x,s.trainingHistory?.[x.id]||0]).filter(([,rank])=>rank>0);
 if(!boosts.length)return null;
 return new Map(s.deck.map(c=>[c.id,1+.35*boosts.reduce((sum,[x,rank])=>
  sum+((x.attr==='body'?c.body!=null:c[x.attr]===x.target)?rank:0),0)]));
}
function takeDrawCard(weights){
 if(!weights)return s.draw.pop();
 let roll=Math.random()*s.draw.reduce((sum,id)=>sum+(weights.get(id)||1),0);
 const index=s.draw.findIndex(id=>(roll-=weights.get(id)||1)<0);
 return s.draw.splice(index<0?s.draw.length-1:index,1)[0];
}
function draw(){
 const weights=drawBiasWeights();
 while(s.hand.length<8){
  if(!s.draw.length){s.draw=shuffle(s.grave.splice(0));if(!s.draw.length)break}
  const id=takeDrawCard(weights);
  if(card(id)&&!s.hand.includes(id))s.hand.push(id);
 }
}
function removeCard(id){s.deck=s.deck.filter(c=>c.id!==id);s.hand=s.hand.filter(x=>x!==id);s.draw=s.draw.filter(x=>x!==id);s.grave=s.grave.filter(x=>x!==id);selected=selected.filter(x=>x!==id)}
function newRun(){modal(`<h2>Khởi đầu hành trình mới?</h2><p>Bộ bài, Thể Chất và công pháp của hành trình hiện tại sẽ được thay bằng bộ mới.</p><button class="primary" onclick="start()">Bắt đầu</button> <button onclick="closeModal()">Quay lại</button>`)}
function teamBonuses(active){const sources=[],add=(id,value)=>{if(hasJ(id)&&value>0)sources.push({id,name:J[id].n,value:value*relicPower(id)})};add(16,5);if(s.turn===1)add(19,10);if(s.hp<=s.max*.4)add(20,15);add(21,Math.min(3,s.used)*2);add(22,Math.min(10,Math.floor(s.coins/10)));add(23,Math.floor((s.max-s.hp)/10)*2);add(24,s.j.length*2);for(let e=0;e<5;e++)add(29+e,active.filter(c=>c.e===e).length*4);if(!curseIs('bodySeal'))add(34,active.filter(c=>c.body!=null).length*3);return sources.map(x=>{const j=J.find(item=>item.n===x.name);if(j?.element!=null)x.note=active.filter(c=>c.e===j.element).map(c=>'#'+c.id).join(', ')+' · +'+num(4*relicPower(j.id))+' mỗi lá, cộng ngoài hệ số riêng';else if(j?.id===34)x.note=active.filter(c=>c.body!=null).map(c=>'#'+c.id).join(', ')+' · +'+num(3*relicPower(j.id))+' mỗi lá có Thể Chất';else x.note='Cộng một lần vào tổng đội hình';return x})}
function evaluateChain(key,active){
 const c=CH[key],level=chainLevel(key),sources=teamBonuses(active),chain=chainLedger(key);
 const {fired,extra,factors}=relicCombatEffects(key,active,sources);
 sources.push(...extra);
 const base=active.reduce((n,a)=>n+ownAttack(a,active),0),bonus=sources.reduce((n,b)=>n+b.value,0);
 const add=chain.add,mult=chain.mult,tax=curseIs('swarm')&&active.length>=4?.8:1;
 const hasActivation=[...fired].some(id=>!J[id]?.destiny);
 const finalAdds=[],finalFactors=[];
 if(hasActivation)for(const id of s.j){
  if(!hasJ(id))continue;
  const x=J[id],value=x.value*relicPower(id);
  if(x.effect==='destinyAdd')finalAdds.push({name:x.n,value});
  if(x.effect==='destinyMult')finalFactors.push({name:x.n,value:1+value});
 }
 for(const id of s.j){
  const x=J[id];
  if(hasJ(id)&&x.effect?.startsWith('sacrifice'))finalFactors.push({name:x.n,value:1+x.value*relicLevel(id)/100});
 }
 const totalFactor=factors.reduce((n,x)=>n*x.value,1);
 const finalAdd=finalAdds.reduce((n,x)=>n+x.value,0),finalFactor=finalFactors.reduce((n,x)=>n*x.value,1);
 const damage=Math.floor((base+bonus+add)*mult*totalFactor*tax*finalFactor+finalAdd);
 const parts=['Anh Linh '+num(base),...sources.map(x=>x.name+' +'+num(x.value)),c.n+' +'+num(add),c.n+' ×'+num(mult),...factors.map(x=>x.name+' ×'+num(x.value))];
 if(tax<1)parts.push('Tán Quân ×0,8');
 return{key,name:c.n,active:active.map(c=>c.id),damage,base,add,mult,bonus,tax,sources,parts,level,chain,fired,factors,finalAdds,finalFactors};
}

function candidatesFor(cs){if(!cs.length)return [];let candidates=[];
const seal=curseIs('randomSeal')?currentBoss().curse:null;
const offer=(key,a)=>{
 if(seal?.attr==='chain'&&seal.target===key)return;
 const usesType=/T$|Both$|^unison$|^mixed/.test(key);
 const usesElement=/E$|Both$|^unison$|^mixed/.test(key);
 if((seal?.attr==='t'&&usesType||seal?.attr==='e'&&usesElement)&&a.some(c=>c[seal.attr]===seal.target))return;
 candidates.push(evaluateChain(key,a));
};
// Any proposed hand is evaluated as one chain, never a product of chains.
const bestSingle=[...cs].sort((a,b)=>ownAttack(b)-ownAttack(a)||b.r-a.r||a.id-b.id)[0];offer('single',[bestSingle]);
for(const [attr,suffix]of[['t','T'],['e','E']]){const gs=groups(cs,attr).map(ranked);gs.forEach(g=>{if(g.length>=2)offer('pair'+suffix,g.slice(0,2));if(g.length>=3)offer('triple'+suffix,g.slice(0,3));if(g.length>=4)offer('four'+suffix,g.slice(0,4));if(g.length===5)offer('five'+suffix,g)});if(cs.length===5&&gs.length===2&&gs.some(g=>g.length===3)&&gs.some(g=>g.length===2))offer('full'+suffix,[...gs.find(g=>g.length===3),...gs.find(g=>g.length===2)]);const pairs=gs.filter(g=>g.length>=2);for(let i=0;i<pairs.length;i++)for(let j=i+1;j<pairs.length;j++)offer('two'+suffix,[...pairs[i].slice(0,2),...pairs[j].slice(0,2)])}
if(cs.length===5){for(const [a,b,key]of[['t','e','mixedT'],['e','t','mixedE']]){for(const g of groups(cs,a)){if(g.length<3)continue;const top=ranked(g).slice(0,3),rest=cs.filter(c=>!top.includes(c));if(rest.length===2&&chainAttr(rest[0],b)===chainAttr(rest[1],b))offer(key,[...top,...rest])}}
const sameT=cs.every(c=>chainAttr(c,'t')===chainAttr(cs[0],'t')),sameE=cs.every(c=>chainAttr(c,'e')===chainAttr(cs[0],'e')),ranks=[...new Set(cs.map(c=>c.r))].sort((a,b)=>a-b),straight=ranks.length===5&&(ranks[4]-ranks[0]===4||(hasJ(SPECIAL.gap)&&ranks.slice(1).every((r,i)=>r-ranks[i]<=2)));if(sameT&&sameE)offer('unison',cs);if(straight){offer('straight',cs);if(sameT)offer('straightT',cs);if(sameE)offer('straightE',cs);if(sameT&&sameE)offer('straightBoth',cs)}}
for(const group of groups(cs,'r')){if(group.length===5)offer('fiveR',group);}
if(hasJ(SPECIAL.gap)&&cs.length>=4){const sets=cs.length===4?[cs]:cs.map((_,i)=>cs.filter((_,j)=>j!==i));for(const set of sets){const rs=[...new Set(set.map(c=>c.r))].sort((a,b)=>a-b);if(rs.length!==4||!rs.slice(1).every((r,i)=>r-rs[i]<=2))continue;const t=set.every(c=>chainAttr(c,'t')===chainAttr(set[0],'t')),e=set.every(c=>chainAttr(c,'e')===chainAttr(set[0],'e'));offer('gap4',set);if(t)offer('gap4T',set);if(e)offer('gap4E',set);if(t&&e)offer('gap4Both',set);}}
// Prefer the higher-realm team on equal damage, then the larger team.
candidates.sort((a,b)=>b.damage-a.damage||b.active.reduce((n,id)=>n+cardFrom(cs,id).r,0)-a.active.reduce((n,id)=>n+cardFrom(cs,id).r,0)||b.active.length-a.active.length);return candidates}
function calc(cs){const list=candidatesFor(cs);return list.find(v=>formation===v.key+':'+v.active.join(','))||list[0]||{damage:0,parts:[],name:'Chưa chọn Anh Linh',active:[],key:null}}
function showFormations(){if(!selected.length||busy)return;const list=candidatesFor(chosen());modal(`<div class="modalTop"><h2>Chọn trận pháp</h2><button onclick="closeModal()">Đóng ✕</button></div><p>Mặc định lấy sát thương cao nhất. Có thể chọn chuỗi khác để đưa những Anh Linh có Thể Chất mong muốn ra trận. Mỗi lần chỉ dùng một chuỗi.</p><div class="grid">${list.map((v,i)=>`<div class="item"><h4>${v.name}</h4><p>${v.parts.join(' · ')}<br>${v.active.map(id=>'#'+id+' '+types[card(id).t]+' '+realms[card(id).r]).join('<br>')}</p><button onclick="chooseFormation(${i})">${fmt(v.damage)} sát thương · ${v.active.length} lá</button></div>`).join('')}</div>`)}
function chooseFormation(i){const v=candidatesFor(chosen())[i];if(!v)return;formation=v.key+':'+v.active.join(',');renderSelection(v);closeModal()}
function cardFrom(cs,id){return cs.find(c=>c.id===id)}
function pick(id){formation=null;if(s.phase!=='battle'||busy||s.rewards.length)return;if(selected.includes(id))selected=selected.filter(x=>x!==id);else if(selected.length<5)selected.push(id);else return toast('Chọn tối đa 5 Anh Linh.');renderSelection(calc(chosen()))}
const elementShapes=[
 'M8 1 15 8 8 15 1 8Z',
 'M14 2C5 2 2 6 3 12l-2 2 1 1 3-3c6 1 9-3 9-10ZM5 11l5-5 1 1-5 5Z',
 'M8 1C6 5 3 7 3 10a5 5 0 0 0 10 0c0-3-3-5-5-9Z',
 'M9 1c1 4-3 4-2 8 2 0 3-2 4-4 2 3 3 5 2 7-2 4-9 4-10-1-1-3 3-6 6-10Z',
 'M1 13 6 4l3 5 2-3 4 7Z'
];
function bodyCode(body){return 'TC '+String(body.id+1).padStart(2,'0')}
function bodyDetailsHTML(c){
 const body=bodies[c.body];
 return `<div class="bodyDetails"><b>Thể Chất · ${body?body.n:'Phàm Thể'}</b>
 <p>${body?bodyCode(body)+' · '+body.d:'Chưa có hiệu ứng Thể Chất.'}</p>
 ${body&&curseIs('bodySeal')?'<small>Đang bị Phong Thể vô hiệu.</small>':''}</div>`;
}
function cardHTML(c,interactive=true,v=calc(chosen())){const power=ownAttack(c).toFixed(1),base=realmPower[c.r]+(c.l-1)*2+5,active=selected.includes(c.id)&&v.active.includes(c.id),body=c.body==null?null:bodies[c.body];return `<button class="card ${selected.includes(c.id)?'selected':''} ${active?'deployed':selected.includes(c.id)?'reserve':''}" data-id="${c.id}" data-body="${c.body}" style="--c:${colors[c.e]}" ${interactive?`onclick="pick(${c.id})"`:''} aria-pressed="${selected.includes(c.id)}" title="${elements[c.e]} ${types[c.t]} · ${realms[c.r]} cấp ${c.l} · Công gốc ${base} · Công Kích riêng ${power}${body?' · '+body.n+': '+body.d:''}"><span class="element"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="${elementShapes[c.e]}"/></svg>${elements[c.e]}</span><span class="sigil">${typeof weaponArt==='function'?weaponArt(c,false,'avatar'):glyphs[c.t]}<span class="deployTag">XUẤT TRẬN</span>${body?`<span class="cardBodyBadge" title="${body.n}">${bodyCode(body)}</span>`: ''}</span><b>${types[c.t].replace(' Tu','')}</b><small class="realmName">${realms[c.r]}</small><small class="cardBase">C${c.l} <span aria-hidden="true">·</span> Gốc <strong>${fmt(base)}</strong></small><small class="cardModifiers"><span>+${5+(curseIs('typeSeal')?0:typeTrainingBonus(s.typeUp[c.t]))} Tu</span><span>×${num(curseIs('element')?1:elementTrainingMult(s.elemUp[c.e]))} Hành</span></small><small class="bodyTag">${body?body.n:'Phàm Thể'}</small></button>`}
function renderSelection(v,updateCards=true){
 if(updateCards){
  for(const el of $('hand').children||[]){
   const id=Number(el.dataset.id),chosen=selected.includes(id),active=v.active.includes(id);
   el.classList.toggle('selected',chosen);
   el.classList.toggle('deployed',active);
   el.classList.toggle('reserve',chosen&&!active);
   el.setAttribute('aria-pressed',String(chosen));
  }
 }
 $('damage').textContent=fmt(v.damage);$('chainLabel').innerHTML='<button class="textBtn" onclick="showFormations()">'+v.name+' ▾</button>';$('breakdown').innerHTML=v.parts.length?v.parts.map(p=>'<span>'+p+'</span>').join('')+'<span>'+v.active.length+' / '+selected.length+' lá ra trận</span>':'<span>Chọn tối đa 5 lá · chỉ lấy chuỗi mạnh nhất</span>';$('selectedCount').textContent=selected.length+'/5 chọn · '+v.active.length+' ra trận';$('attackBtn').disabled=!selected.length||busy||s.phase!=='battle'||!!s.rewards.length;$('discardBtn').disabled=!selected.length||!s.discards||busy||s.phase!=='battle'||!!s.rewards.length;renderScore(v);
}
function render(){const b=currentBoss(),v=calc(chosen());$('coins').textContent=fmt(s.coins);$('hpText').textContent=s.hp+' / '+s.max;$('hpBar').style.width=s.hp/s.max*100+'%';$('stage').textContent=b.floor+' · Boss '+(b.index+1)+'/5';$('turn').textContent=s.turn;$('jcount').textContent=s.j.length+' / '+relicCap();$('tcount').textContent=s.tarots.length;$('bossTag').textContent='BÍ CẢNH '+b.floor+' · BOSS '+(b.index+1)+'/5'+(b.curse?' · THỦ LĨNH':'');$('bossName').textContent=b.n;$('bossGlyph').textContent=b.glyph;$('bossCaption').textContent=b.suppressed?'Đã vô hiệu: '+b.suppressed.n:b.curse?b.curse.n+': '+b.curse.d:'Tầng Bí Cảnh vô hạn · Hạ boss để mở Linh Thị';$('intent').textContent=(b.suppressed?'✦ Miễn nguyền · ':'⚔ ')+s.countdown+' lượt · '+b.atk+' ST';$('bossHpText').textContent=fmt(BigInt(s.bossHp))+' / '+fmt(b.hp);$('bossHpBar').style.width=Number(BigInt(s.bossHp)*10000n/b.hp)/100+'%';$('hand').innerHTML=s.hand.map(id=>cardHTML(card(id),true,v)).join('');$('discards').textContent=s.discards+' / '+(b.curse?.key==='discard'?1:3);$('deckCount').textContent='Bộ rút '+s.draw.length;$('deckInfo').textContent=s.deck.length+' lá · '+s.deck.filter(c=>c.body!=null).length+' có Thể Chất';$('jokers').innerHTML=s.j.length?s.j.map(i=>`<div class="joker"><span class="icon">${['意','劍','道','靈','心'][i%5]}</span><div><b>${J[i].n}</b>${gradeHTML(J[i])}<p>${itemDescription(J[i])}</p></div></div>`).join(''):'<div class="empty">Chưa có Cơ Duyên · <br>Mua ở Linh Thị để nâng chuỗi</div>';$('tarots').innerHTML=s.tarots.length?s.tarots.map((id,i)=>`<button class="tarotBtn" onclick="useTarot(${i})" title="${T[id].d}">◇ ${T[id].n} ${gradeHTML(T[id])} <span style="float:right">Dùng ↗</span></button>`).join(''):'<div class="empty">Tối đa 3 Luyện Đan · Có 10 loại Thể Đan</div>';$('log').innerHTML=s.logs.slice(0,8).map(x=>'<div>'+x+'</div>').join('');renderSelection(v,false)}
function sortHand(){s.hand.sort((a,b)=>card(b).r-card(a).r||card(a).t-card(b).t);save();render()}
function discardSelected(){if(busy||!s.discards||!selected.length||s.phase!=='battle'||s.rewards.length)return;s.grave.push(...selected);s.hand=s.hand.filter(id=>!selected.includes(id));s.discards--;s.used++;selected=[];draw();save();render()}
function attack(){if(busy||!selected.length||s.phase!=='battle'||s.rewards.length)return;busy=true;let retaliation=0,bossStruck=false,hpBeforeCounter=null;const v=calc(chosen()),active=v.active.map(card),b=currentBoss(),oldBossHp=BigInt(s.bossHp);
const firstDamage=v.damage;
const repeat=J.find(x=>x.effect==='destinyRepeat');
const repeatDamage=oldBossHp>BigInt(firstDamage)&&firstDamage>0&&hasJ(repeat.id)&&rollUpgrade(25)?Math.floor(firstDamage*.8):0;
const hp=oldBossHp-BigInt(firstDamage)-BigInt(repeatDamage);
s.bossHits=(s.bossHits||0)+Number(firstDamage>0)+Number(repeatDamage>0);
s.bossHp=(hp>0n?hp:0n).toString();
recordCombo(v,active);
log('Lượt '+s.turn+': '+v.name+' · '+fmt(firstDamage)+' sát thương.');
if(repeatDamage)log(repeat.n+' · đánh lại '+fmt(repeatDamage)+' sát thương.');
// Both hits share the original hand and do not trigger a second round of card effects.
v.damage=firstDamage+repeatDamage;
const activeIds=new Set(v.active);s.grave.push(...v.active);s.hand=s.hand.filter(id=>!activeIds.has(id));
selected=[];
let delay=0;for(const c of active){switch(curseIs('bodySeal')?null:c.body){case 2:s.coins+=5;log('Kim Thể #'+c.id+': +5 Linh Thạch.');break;case 3:s.rewards.push({kind:'Cơ Duyên',id:randomLoot('Cơ Duyên').id});break;case 4:s.rewards.push({kind:'Tầm Pháp',id:randomLoot('Tầm Pháp').id});break;case 5:s.rewards.push({kind:'Luyện Đan',id:randomLoot('Luyện Đan').id});break;case 6:if(rand(4)===0){removeCard(c.id);log('Ma Thể #'+c.id+' đã siêu tán vĩnh viễn.')}break;case 8:if(!curseIs('delaySeal'))delay++;break;case 9:{const healed=healInBattle(10);if(healed)log('Sinh Nguyên Thể #'+c.id+': hồi '+healed+' HP.');break}}}
if(hasJ(18)&&active.some(c=>c.e===1)&&healInBattle(3*relicPower(18)))v.fired.add(18);
for(const id of s.j){
 if(!hasJ(id))continue;
 const x=J[id], actual=Number(oldBossHp<BigInt(v.damage)?oldBossHp:BigInt(v.damage));
 const amount=x.effect==='heal'?x.value:x.effect==='drain'?Math.min(15,Math.floor(actual*x.value)):0;
 const healed=amount?healInBattle(Math.floor(amount*relicPower(id))):0;
 if(healed){v.fired.add(id);log(x.n+' · hồi '+healed+' HP.');}
}
if(curseIs('tithe')){const lost=Math.min(2,s.coins);s.coins-=lost;log('Tham Linh: −'+lost+' Linh Thạch.');}s.countdown+=delay;if(delay)log('Kim Cang Thể đẩy đòn boss lùi '+delay+' lượt.');if(b.curse?.key==='blood'){s.hp=Math.max(0,s.hp-3);log('Huyết Sát: −3 HP.')}if(BigInt(s.bossHp)>0n&&s.hp>0){s.countdown--;if(s.countdown<=0){bossStruck=true;if(!curseIs('pierce')&&hasJ(17))v.fired.add(17);const dmg=Math.max(0,b.atk-(curseIs('pierce')?0:(hasJ(17)?4*relicPower(17):0)+s.shield));retaliation=dmg;hpBeforeCounter=s.hp;s.shield=0;s.hp=Math.max(0,s.hp-dmg);s.countdown=b.interval;log(b.n+' phản công: −'+dmg+' HP.')}}
recoverFatalHit(v.fired);
if(s.hp>0&&BigInt(s.bossHp)===0n)settleVictoryRelics(v.fired);
settleDestiny(v.fired);
for(const id of v.fired)if(J[id]?.fragile&&rand(5)===0&&removeRelic(id))log(J[id].n+' tự hủy.');
if(s.hp<=0||!s.deck.length){s.phase='dead';s.rewards=[];s.deathReason=s.hp<=0?'Đạo thể đã tan.':'Toàn bộ Anh Linh đã siêu tán.'}else if(BigInt(s.bossHp)===0n){s.coins+=b.reward;s.hp=Math.min(s.max,s.hp+15);s.phase='shop';log('Hạ '+b.n+' · +'+b.reward+' Linh Thạch · hồi 15 HP.');makeShop()}else{s.turn++;draw()}
// Commit the whole turn before presenting its result, including any retaliation.
save();
const finish=()=>{busy=false;$('hit').textContent='';$('hit').className='';render();resumePanel();};
if(typeof presentTurn==='function')presentTurn({damage:firstDamage,repeatDamage,retaliation,bossStruck,hpBeforeCounter},finish);
else{render();$('hit').textContent='−'+fmt(v.damage);$('hit').className='hitAnim';setTimeout(finish,500);}}

function modal(html){$('modal').innerHTML=html;$('overlay').classList.remove('hidden')}function closeModal(){if(s.openPack)return showOpenPack();if(s.rewards.length)return showRewards();if(s.phase==='shop')return showShop();if(s.phase==='dead')return endScreen();if(!promptSacrifice())$('overlay').classList.add('hidden')}function toast(t){$('toast').textContent=t;$('toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').style.display='none',3000)}
function resumePanel(){if(s.openPack)return showOpenPack();if(s.phase==='dead')endScreen();else if(s.rewards.length)showRewards();else if(s.phase==='shop')showShop();else if(!promptSacrifice())$('overlay').classList.add('hidden')}

function toggleOfferLock(i){if(s.openPack)return;if(s.phase!=='shop'||s.rewards.length)return;const o=s.offers[i];if(!o||o.bought)return;o.locked=!o.locked;save();showShop();}

const upgradeRole={
 'Cơ Duyên':'Hiệu ứng toàn ván như Joker. Có hiệu lực khi đang giữ và đủ điều kiện của lá.',
 'Tầm Pháp':'Mở Pháp Đồ từ Cuộn Giản. Có loại tăng trọng số rút bài, có loại lĩnh ngộ để cộng hoặc nhân cho Chuỗi, Cấp Độ, Loại Tu và Nguyên Tố. Lĩnh ngộ trùng sẽ tăng bậc.',
 'Luyện Đan':'Mở đan dược từ Đan Lô. Dùng lên từng lá để gắn Thể Chất, biến đổi bài hoặc nâng Cảnh Giới. Một số Luyện Đan hỗ trợ trực tiếp trong trận.'
};
function catalog(kind){return kind==='Cơ Duyên'?J:kind==='Tầm Pháp'?L:T}function itemOf(o){return catalog(o.kind)[o.id]}

function buy(i){if(s.openPack)return;if(s.phase!=='shop'||s.rewards.length)return;const o=s.offers[i];if(!o||o.bought)return;const x=itemOf(o);if(s.coins<x.p)return;if(x.kind==='Cơ Duyên'){if(!acquireRelic(x.id))return;}else if(x.kind==='Luyện Đan'){if(s.tarots.length===3)return toast('Đủ 3 Luyện Đan. Dùng hoặc bán một món.');s.tarots.push(x.id)}else{ensureExpansion();if(s.training.length>=3)return toast('Khung Tầm Pháp đầy. Lĩnh ngộ một thẻ trước.');s.training.push(x.id)}s.coins-=x.p;o.bought=true;o.locked=false;save();render();showShop()}
function reroll(){if(s.openPack)return;if(s.phase!=='shop'||s.coins<2)return;s.coins-=2;makeShop();save();render();showShop()}function shopHealAmount(){return Math.ceil(s.max/4)}
function shopHeal(){if(s.openPack)return;if(s.phase!=='shop'||s.coins<3||s.hp>=s.max)return;s.coins-=3;s.hp=Math.min(s.max,s.hp+shopHealAmount());save();render();showShop()}
function moveUpgradeSlot(kind,from,to,expected){
 if(busy||marketBlocked()||s.phase!=='battle'||!Number.isInteger(from)||!Number.isInteger(to))return false;
 const list=kind==='Cơ Duyên'?s.j:kind==='Tầm Pháp'?s.training:kind==='Luyện Đan'?s.tarots:null;
 const limit=kind==='Cơ Duyên'?relicCap():3;
 if(!list||from<0||list[from]!==expected||expected==null||to<0||to>=limit||from===to)return false;
 if(to<list.length)[list[from],list[to]]=[list[to],list[from]];
 else list.push(...list.splice(from,1));
 save();render();return true;
}
function sellUpgrade(kind,i,fromBag=false,expected,onBoard=false){
 if(busy||marketBlocked()||!(s.phase==='shop'||fromBag&&s.phase==='battle'))return;
 const inventory=kind==='Cơ Duyên'?s.j:kind==='Luyện Đan'?s.tarots:kind==='Tầm Pháp'?s.training:null;
 const id=inventory?.[i],item=catalog(kind)[id];
 if(!item||fromBag&&id!==expected)return;
 const amount=kind==='Cơ Duyên'?relicSellValue(item):Math.floor(item.p/2);
 if(kind==='Cơ Duyên'){
  const clearCurse=id===purgeRelic&&s.phase==='battle'&&!!currentBoss().curse;
  if(!removeRelic(id))return toast('Hãy bán bớt Cơ Duyên trước khi bỏ ô đang dùng.');
  if(clearCurse){s.curseClearedStage=s.stage;log(item.n+' vô hiệu lời nguyền đến hết trận.');}
 }else inventory.splice(i,1);
 s.coins+=amount;
 save();render();
 if(onBoard)toast('Đã bán '+item.n+' · +'+amount+' Linh Thạch');
 else if(fromBag&&s.phase!=='shop')openUpgradeSales();else showShop();
}
function sellJ(i){sellUpgrade('Cơ Duyên',i)}
function sellT(i){sellUpgrade('Luyện Đan',i)}
function openUpgradeSales(){
 if(busy||marketBlocked()||!['battle','shop'].includes(s.phase))return;
 const groups=[['Cơ Duyên',s.j],['Luyện Đan',s.tarots],['Tầm Pháp',s.training]];
 modal(`<div class="modalTop"><div><h2>Bán nâng cấp</h2><b>◈ ${fmt(s.coins)}</b></div><button onclick="openMobileBag()">Hành trang ↶</button></div>
  <p>Bán được nửa giá gốc, làm tròn xuống. Tầm Pháp chỉ bán được khi chưa lĩnh ngộ.</p>
  <div class="upgradeSales">${groups.map(([kind,items])=>`<section><h3>${kind}</h3>${items.map((id,i)=>{
   const x=catalog(kind)[id];
   return `<div class="upgradeSale"><span>${x.n}</span><button onclick="sellUpgrade('${kind}',${i},true,${id})">Bán · ◈ ${kind==='Cơ Duyên'?relicSellValue(x):Math.floor(x.p/2)}</button></div>`;
  }).join('')||'<p>Không có món để bán.</p>'}</section>`).join('')}</div>`);
}

function nextBoss(){if(s.openPack)return;if(s.phase!=='shop'||s.rewards.length)return;for(const p of s.marketPacks||[])if(!p.bought&&!p.locked)notePackSkip(p.kind);s.stage++;advanceFloorHealth();s.bossHits=0;const b=currentBoss();s.turn=1;s.countdown=b.interval;s.used=0;s.discards=b.curse?.key==='discard'?1:3;s.bossHp=b.hp.toString();s.phase='battle';s.hand=[];s.grave=[];s.draw=shuffle(s.deck.map(c=>c.id));draw();selected=[];save();render();resumePanel()}
function showRewards(){const r=s.rewards[0];if(!r)return resumePanel();const x=itemOf(r),inv=r.kind==='Cơ Duyên'?s.j:s.tarots,cap=r.kind==='Cơ Duyên'?relicCap([...s.j,r.id]):3;modal(`<div class="eyebrow">${r.source==='Cuộn Giản'?'CUỘN GIẢN · NHẬN PHÁP ĐỒ':r.source==='Đan Lô'?'ĐAN LÔ · NHẬN LÁ ĐÃ CHỌN':'THỂ CHẤT KÍCH HOẠT'} · CÒN ${s.rewards.length} THẺ</div><h2>${x.n}</h2>${itemIllustration(x)}${gradeHTML(x)}<p>${x.kind} · ${itemDescription(x)}</p>${r.kind==='Tầm Pháp'?(s.training.length<3?'<button class="primary" onclick="claimReward()">Nhận Tầm Pháp</button>':`<button onclick="openTraining()">Lĩnh ngộ để nhường chỗ</button><div class="tabs">${s.training.map((id,i)=>`<button onclick="claimReward(${i})">Thay ${L[id].n}</button>`).join('')}</div>`):r.kind==='Cơ Duyên'&&s.j.includes(r.id)?(canMergeRelic(x)?relicUpgradePreview(x.id)+'<button class="primary" onclick="claimReward()">Hợp nhất miễn phí</button>':'<p>Đã giữ hiệu ứng đặc biệt này; không cộng dồn. Có thể bỏ qua.</p>'):inv.length<cap?'<button class="primary" onclick="claimReward()">Nhận miễn phí</button>':`<p>Túi đã đầy. Chọn một món để thay (món cũ sẽ mất):</p><div class="tabs">${inv.map((id,i)=>`<button onclick="claimReward(${i})">Thay ${catalog(r.kind)[id].n}</button>`).join('')}</div>`}<button onclick="skipReward()" style="margin-left:8px">Bỏ qua</button>`)}
function claimReward(replace=null){const r=s.rewards[0];if(!r)return;if(r.kind==='Tầm Pháp'){ensureExpansion();if(s.training.length<3)s.training.push(r.id);else if(Number.isInteger(replace)&&replace>=0&&replace<s.training.length)s.training[replace]=r.id;else return toast('Đủ 3 Tầm Pháp. Lĩnh ngộ hoặc thay một Pháp Đồ.');}else{const inv=r.kind==='Cơ Duyên'?s.j:s.tarots,cap=r.kind==='Cơ Duyên'?relicCap([...s.j,r.id]):3;if(r.kind==='Cơ Duyên'){if(!acquireRelic(r.id,replace))return;}else if(inv.length<cap)inv.push(r.id);else if(Number.isInteger(replace)&&replace>=0&&replace<inv.length)inv[replace]=r.id;else return}log((r.source?'Nhận từ '+r.source+': ':'Nhận miễn phí ')+itemOf(r).n+'.');s.rewards.shift();save();render();resumePanel()}
function skipReward(){s.rewards.shift();save();render();resumePanel()}
function prepareShopTarot(i){selected=[];const t=T[s.tarots[i]];if(!t)return;if(t.effect.startsWith('destiny'))return useTarot(i);const target=!['heal','shield','refresh'].includes(t.effect);if(!target){useTarot(i);return}modal(`<div class="modalTop"><h2>${t.n}</h2><button onclick="showShop()">Quay lại</button></div><p>${t.d} Chọn theo thứ tự rồi bấm Dùng.</p><div id="shopSelection">Chưa chọn lá</div><div class="deckPicker">${s.deck.map(c=>`<button class="bodyFrame" data-body="${c.body}" onclick="shopPick(${c.id})" data-card="${c.id}">${elements[c.e]} ${types[c.t]}<small>${realms[c.r]} · C${c.l} · ${c.body==null?'Phàm Thể':bodies[c.body].n}</small></button>`).join('')}</div><button class="primary" onclick="useTarot(${i})">Dùng Luyện Đan</button>`)}
function shopPick(id){if(selected.includes(id))selected=selected.filter(x=>x!==id);else if(selected.length<2)selected.push(id);else return toast('Chọn tối đa 2 lá.');$('shopSelection').textContent=chosen().map((c,i)=>(i+1)+'. '+elements[c.e]+' '+types[c.t]+' '+realms[c.r]).join(' → ')||'Chưa chọn lá';document.querySelectorAll('[data-card]').forEach(el=>el.classList.toggle('selected',selected.includes(+el.dataset.card)))}
function useTarot(i,confirmed=false,relicTarget=null){if(s.openPack)return;if(busy||s.rewards.length||!['battle','shop'].includes(s.phase))return;const t=T[s.tarots[i]];if(!t)return;const eff=t.effect,cs=chosen(),need=(n,max=n)=>{if(cs.length<n||cs.length>max){toast('Chọn '+(n===max?n:n+'–'+max)+' lá trước khi dùng '+t.n+'.');return false}return true};if((['realm','level','clone','remove','ascend','realmDown'].includes(eff)||eff.startsWith('body'))&&!need(1))return;if(eff==='realm2'&&!need(1,2))return;if(tarotPair(eff)&&!need(2))return;if(/^[etr]\d+$/.test(eff)&&!need(1,2))return;
if(eff.startsWith('destiny')){
 if(!transformRelic(i,eff,relicTarget))return;
}else if(eff.startsWith('swap')){
 const attr=eff.at(-1);
 [cs[0][attr],cs[1][attr]]=[cs[1][attr],cs[0][attr]];
}else if(eff==='copyboth'){
 cs[1].t=cs[0].t;cs[1].e=cs[0].e;
}else if(eff==='realmDown'){
 if(!cs[0].r)return toast('Đã ở Cảnh Giới thấp nhất.');
 cs[0].r--;
}else if(/^r\d+$/.test(eff)){
 cs.forEach(c=>c.r=+eff.slice(1));
}else if(eff.startsWith('sell')){
 if(s.deck.length-cs.length<10)return toast('Bộ bài phải có ít nhất 10 lá.');
 for(const c of cs)removeCard(c.id);
 if(eff==='sellCoins')s.coins+=10;
 else queueFreePack(eff==='sellScroll'?'Tầm Pháp':'Luyện Đan');
 if(s.phase==='battle')draw();
}else if(eff.startsWith('body')){const body=+eff.slice(4);if(cs[0].body===body)return toast('Anh Linh đã có Thể Chất này.');if(cs[0].body!=null&&!confirmed){modal(`<h2>Thay Thể Chất?</h2><p>${bodies[cs[0].body].n} sẽ được thay bằng ${bodies[body].n} trên lá #${cs[0].id}.</p><button class="primary" onclick="useTarot(${i},true)">Thay Thể Chất</button> <button onclick="closeModal()">Quay lại</button>`);return}cs[0].body=body}
else if(eff==='ascend'){if(cs[0].r===10&&cs[0].l>=999)return toast('Anh Linh đã đạt giới hạn.');cs[0].r=Math.min(10,cs[0].r+2);cs[0].l+=4;}else if(eff==='realm'||eff==='realm2'){if(cs.every(c=>c.r===10))return toast('Đã đạt Chí Tôn Linh.');cs.forEach(c=>c.r=Math.min(10,c.r+1))}else if(eff==='level')cs[0].l+=2;else if(eff==='copytype')cs[1].t=cs[0].t;else if(eff==='copyel')cs[1].e=cs[0].e;else if(/^e\d+$/.test(eff))cs.forEach(c=>c.e=+eff.slice(1));else if(/^t\d+$/.test(eff))cs.forEach(c=>c.t=+eff.slice(1));else if(eff==='heal'){if(s.phase==='battle'&&curseIs('healSeal'))return toast('Tuyệt Sinh đang chặn hồi HP.');if(s.hp===s.max)return toast('HP đang đầy.');s.hp=Math.min(s.max,s.hp+35)}else if(eff==='shield')s.shield+=20;else if(eff==='clone'){const c={...cs[0],id:++s.uid};s.deck.push(c);s.draw.unshift(c.id)}else if(eff==='remove'){if(s.deck.length<=10)return toast('Bộ bài phải có ít nhất 10 lá.');removeCard(cs[0].id);if(s.phase==='battle')draw()}else if(eff==='refresh'){if(s.phase!=='battle')return toast('Dùng Nghịch Mệnh trong trận đấu.');s.discards=currentBoss().curse?.key==='discard'?1:3}
s.tarots.splice(i,1);log('Dùng '+t.n+'.');selected=[];save();render();resumePanel();toast(t.n+' đã phát huy tác dụng.')}
function endScreen(){const b=currentBoss();modal(`<div class="eyebrow">HÀNH TRÌNH KHÉP LẠI</div><h2>${s.deathReason||'Đạo thể đã tan'}</h2><p>Tầng Bí Cảnh ${b.floor} · Boss ${b.index+1}/5 · ${b.n}. Đã hạ ${s.stage} boss.</p><p>Thể Chất tồn tại vĩnh viễn trên lá trong hành trình; bắt đầu lượt chơi mới sẽ tạo bộ bài mới.</p><button class="primary" onclick="start()">Tu luyện lại ↗</button><button onclick="showDeck()">Xem bộ bài</button>`)}
function levelText(x){if(x.effect?.startsWith('destiny')&&x.kind==='Tầm Pháp')return 'Pháp Đồ dùng lên Cơ Duyên';if(x.kind==='Cơ Duyên')return s.j.includes(x.id)?'ĐANG GIỮ · CẤP '+relicLevel(x.id):'';if(x.kind==='Tầm Pháp')return ['all','track','drawBias'].includes(x.effect)?'Đã lĩnh ngộ '+(s.trainingHistory?.[x.id]||0)+' lần':x.effect==='type'?'Cấp '+s.typeUp[x.target]:x.effect==='element'?'Cấp '+s.elemUp[x.target]:x.keys.map(k=>CH[k].n+' C'+(s.up[k]||0)).join(' · ');return''}
function openBook(tab='Chuỗi'){if(tab==='Phẩm')return bookFrame('Phẩm',`<p>Phẩm cố định theo từng vật phẩm, phản ánh độ hiếm và hiệu ứng riêng. Không nhân sức mạnh ngầm lên các vật phẩm cũ.</p><div class="grid">${RARITIES.map((n,q)=>`<div class="item">${gradeHTML({q})}<h4>${n}</h4><p>Trọng số xuất hiện: ${[55,27,12,5,1][q]}. Nếu một loại không có vật phẩm ở bậc này, xác suất được chia lại trong các bậc còn lại.</p></div>`).join('')}</div><p>Tiên Thiên gồm Vô Cấu (miễn tất cả lời nguyền), Ngộ Đạo (tăng toàn bộ công pháp) và Tạo Hóa (+2 Cảnh Giới, +4 cấp).</p>`);if(['Chuỗi','Nâng cấp','Anh Linh'].includes(tab))return openReference(tab);const arr=(tab==='Tiên Duyên'?J.filter(x=>x.destiny):tab==='Cơ Duyên'?J.filter(x=>!x.destiny):tab==='Tầm Pháp'?L:tab==='Luyện Đan'?T:tab==='Lời nguyền'?curses:bodies).filter(x=>!x.retired);modal(`<div class="modalTop"><h2>Đồ giám · ${tab}</h2><button onclick="closeModal()">Đóng ✕</button></div><div class="tabs">${bookTabs(tab)}</div>${upgradeRole[tab]?'<p class="upgradeRole">'+upgradeRole[tab]+'</p>':''}<div class="grid">${arr.map(x=>`<div class="item ${tab==='Thể Chất'?'bodyFrame':''}" data-body="${tab==='Thể Chất'?x.id:''}"><div class="eyebrow">${x.kind||(tab==='Lời nguyền'?'LỜI NGUYỀN':'THỂ CHẤT')} · ${x.kind?levelText(x):tab==='Lời nguyền'?'BOSS THỨ 5':'GẮN VÀO TỪNG LÁ'}</div>${itemIllustration(x)}<h4>${x.n}</h4>${gradeHTML(x)}<p>${itemDescription(x)}</p>${x.p!=null?'<span class="price">◈ '+x.p+'</span>':''}</div>`).join('')}</div>`)}
function showDeck(){modal(`<div class="modalTop"><h2>Bộ bài · ${s.deck.length} Anh Linh</h2><button onclick="closeModal()">Đóng ✕</button></div><p>Mỗi cấp tăng thêm cho lá 2 Công Kích cơ bản. Số trên từng lá đã tính Công Pháp, Nguyên Pháp và Thể Chất. Hiệu ứng Mị Thể từ đồng đội được tính khi ra trận.</p><div class="grid">${s.deck.map(c=>`<div class="item bodyFrame" data-body="${c.body}"><b>${elements[c.e]} · ${types[c.t]}</b><p>${realms[c.r]} · Cấp ${c.l} · #${c.id}<br>${c.body==null?'Phàm Thể':bodies[c.body].n}<br>Công Pháp +${5+typeTrainingBonus(s.typeUp[c.t])} · Nguyên Pháp ×${num(elementTrainingMult(s.elemUp[c.e]))}<br>Công Kích hiện tại: ${ownAttack(c).toFixed(1)}</p></div>`).join('')}</div>`)}
function showRules(){modal(`<div class="modalTop"><h2>Đạo pháp · Tái cân bằng</h2><button onclick="closeModal()">Đóng ✕</button></div><p>Khởi đầu 100 HP, 5 Linh Thạch và đủ 550 Anh Linh (11 Cảnh Giới × 10 Loại Tu × 5 Nguyên Tố). Rút 8, đề cử tối đa 5 lá. Game chọn MỘT chuỗi gây sát thương cao nhất. Chỉ những lá mang dấu XUẤT TRẬN bị đưa vào chồng đã dùng và kích hoạt Thể Chất; các lá dự bị giữ lại. Rút bù lên 8, hết bộ rút thì xáo lại bài đã dùng. Mỗi boss có 3 lần đổi thẻ, trừ lời nguyền Cấm Chuyển.</p><p><b>Sát thương = (tổng Công Kích riêng của các lá ra trận + điểm cộng Cơ Duyên + điểm cộng chuỗi) × hệ số chuỗi.</b> Không còn dung hợp, không nhân chồng Loại Tu với Nguyên Tố. Không trùng: chỉ lá có Công Kích cao nhất ra trận. Với mỗi nhóm trùng, ưu tiên Cảnh Giới cao nhất, rồi Công Kích. Bộ 4 trùng Loại Tu nhân ×4, trùng Nguyên Tố cộng +40 và dùng 4 lá Cảnh Giới cao nhất. Hai đôi dùng 4 lá; bộ 3+2 dùng đủ 5 lá.</p><table class="ruleTable"><tr><th>Chuỗi</th><th>Cộng</th><th>Nhân</th><th>Số lá</th></tr>${chainKeys.map(k=>{const c=CH[k],n=chainInfo[k][2];return `<tr><td>${c.n}</td><td>+${c.a}</td><td>×${c.m}</td><td>${n}</td></tr>`}).join('')}</table><p>“3+2” gồm cả bộ cùng thuộc tính: 3 Kiếm Tu + 2 Đao Tu được ×3; 3 Hỏa + 2 Thủy được +25 Công Kích. Hai nhóm phải khác Loại Tu hoặc khác Nguyên Tố. Vẫn có bộ 3 cùng Loại Tu + 2 cùng Nguyên Tố (hoặc ngược lại), không dùng trùng lá. Các hệ số không cộng chồng giữa các chuỗi. Liên cảnh là 5 Cảnh Giới khác nhau nối tiếp. +1000 của Vạn Linh Quy Nhất là một chuỗi độc lập; không cộng thêm +500, +250 hoặc tự nhân ×100. Mặc định game chọn Ngũ Linh Đồng Nhất ×100 nếu sát thương cao hơn; bấm tên trận pháp để chọn thủ công chuỗi +1000 hoặc một đội hình khác.</p><p>Mỗi Loại Tu bắt đầu +5 Công Kích; Tầm Pháp cấp n cộng thêm 2n(n+1): cấp 1 +4, cấp 2 +12, cấp 3 +24. Nguyên Pháp nhân ×1,2 mỗi cấp, từ ×1 → ×1,2 → ×1,44. Nâng chuỗi tăng điểm theo n(n+3)/4 và tăng phần hệ số gốc ×1,12 mỗi cấp, riêng chuỗi chỉ trùng Nguyên Tố chỉ tăng điểm cộng. Cảnh Giới cho Công Kích gốc: ${realms.map((r,i)=>r+' '+realmPower[i]).join(' · ')}. Mỗi cấp trên cấp 1 thêm +2. Vào Bí Cảnh mới, Đạo Thể tăng 25% HP tối đa và hồi đúng phần tăng thêm.</p><p>Mỗi chuỗi có Cơ Duyên Chân Ý tương ứng để nâng cấp khi giữ (bán sẽ mất hiệu lực). Tầm Pháp tăng công pháp và cấp chuỗi vĩnh viễn trong hành trình; các giá trị tăng được ghi trong đồ giám. Các chuỗi cạnh tranh nhau, không cộng chồng.</p><p>Mỗi lá có 1 Thể Chất; dùng Thể Đan khác sẽ thay thế. Thể Chất tồn tại xuyên các trận và lần xáo bài, bản sao giữ Thể Chất. Chỉ lá ra trận được kích hoạt. Mị Thể buff các lá KHÁC cùng Cảnh Giới trong đội hình; Ma Thể kiểm tra 25% sau khi đã gây sát thương; Kim Cang Thể lùi đòn boss 1 lượt mỗi lá. Thẻ được rút nhờ Thể Chất là miễn phí; khi túi đầy có thể chọn thay hoặc bỏ qua. Cơ Duyên trùng có chỉ số được hợp nhất: mỗi lần nhân giá trị hiện tại ×1,5; không tốn thêm ô. Cơ Duyên đặc biệt (quy đồng, cách bậc, miễn nguyền) không cộng dồn.</p><p>Mỗi Bí Cảnh có 5 boss; boss 5 có 1 trong 16 lời nguyền luân phiên, xem đầy đủ trong Đồ giám → Lời nguyền. Tầng không giới hạn, HP tăng ×1,35 mỗi tầng với cùng vị trí boss; đòn đánh tăng 14% mức gốc mỗi tầng. Thắng hồi 15 HP và nhận 7–35 Linh Thạch tùy boss/tầng. Boss bị hạ sẽ không phản công; Huyết Sát vẫn trừ HP kể cả đòn kết liễu. Hiệu ứng hồi HP và lùi đòn được xử lý trước boss phản công.</p><p>${Object.entries(upgradeRole).map(([kind,role])=>'<b>'+kind+'</b> · '+role).join('<br>')}</p><p>Phường Thị có 3 Cơ Duyên và 2 gói chọn bài; 70% lượt chọn ưu tiên hướng combo đã xuất kích, 30% chọn đều trong cùng Phẩm. Gói Tầm Pháp chọn 1/3, 2/5, 3/7; Đan Lô chọn 1/2, 2/4, 2/8. Tầm Pháp từ gói lĩnh ngộ ngay. Tiền chỉ trừ khi mở; không hoàn khi bỏ gói. Có ${J.filter(x=>!x.retired).length} Cơ Duyên, ${L.filter(x=>!x.retired).length} Tầm Pháp, ${T.length} Luyện Đan và ${chainKeys.length} trận pháp. Phẩm được ấn định theo từng vật phẩm; vật phẩm cao phẩm hiếm gặp hơn. Tầm Pháp nhận vào khung (tối đa 3), bấm Lĩnh ngộ để áp dụng vĩnh viễn. Tiên Thiên Vô Cấu chặn cả Cấm Duyên.</p>`)}
const chainInfo={
single:['Chỉ 1 lá có Công Kích riêng cao nhất ra trận.','Đề cử 5 lá không trùng: chỉ lấy lá mạnh nhất.',1],pairT:['2 lá cùng Loại Tu; lấy 2 Cảnh Giới cao nhất của nhóm.','2 Kiếm Tu: tổng Công Kích ×1,5.',2],pairE:['2 lá cùng Nguyên Tố; lấy 2 Cảnh Giới cao nhất của nhóm.','2 Hỏa: tổng Công Kích +10.',2],tripleT:['3 lá cùng Loại Tu; lấy 3 Cảnh Giới cao nhất.','3 Đao Tu: tổng Công Kích ×2.',3],tripleE:['3 lá cùng Nguyên Tố; lấy 3 Cảnh Giới cao nhất.','3 Thủy: tổng Công Kích +15.',3],fourT:['4 lá cùng Loại Tu; lấy 4 Cảnh Giới cao nhất.','4 Kiếm Tu: tổng Công Kích ×4.',4],fourE:['4 lá cùng Nguyên Tố; lấy 4 Cảnh Giới cao nhất.','4 Hỏa: tổng Công Kích +40.',4],twoT:['2 cặp thuộc 2 Loại Tu khác nhau, 4 lá ra trận.','2 Kiếm + 2 Đao: tổng Công Kích ×2,5.',4],twoE:['2 cặp thuộc 2 Nguyên Tố khác nhau, 4 lá ra trận.','2 Hỏa + 2 Thủy: tổng Công Kích +20.',4],mixedT:['3 lá cùng Loại Tu + 2 lá còn lại cùng Nguyên Tố.','3 Kiếm + 2 Hỏa: (tổng Công Kích +10) ×2.',5],mixedE:['3 lá cùng Nguyên Tố + 2 lá còn lại cùng Loại Tu.','3 Hỏa + 2 Đao: (tổng Công Kích +15) ×1,5.',5],fullT:['3 lá cùng một Loại Tu và 2 lá cùng một Loại Tu khác.','3 Kiếm + 2 Đao: tổng Công Kích ×3.',5],fullE:['3 lá cùng một Nguyên Tố và 2 lá cùng một Nguyên Tố khác.','3 Hỏa + 2 Thủy: tổng Công Kích +25.',5],fiveT:['Cả 5 lá cùng Loại Tu.','5 Kiếm Tu: tổng Công Kích ×5.',5],fiveE:['Cả 5 lá cùng Nguyên Tố.','5 Mộc: tổng Công Kích +50.',5],unison:['Cả 5 lá cùng Loại Tu và cùng Nguyên Tố.','5 Hỏa Kiếm: tổng 5 lá ×100.',5],straight:['5 Cảnh Giới khác nhau, liên tiếp theo thứ tự cảnh giới.','Khai → Sơ → Tông → Tướng → Vương: tổng +250.',5],straightT:['5 Cảnh Giới liên tiếp, cùng Loại Tu.','5 Kiếm Tu từ Khai đến Vương: (tổng +250) ×5.',5],straightE:['5 Cảnh Giới liên tiếp, cùng Nguyên Tố.','5 Hỏa từ Khai đến Vương: tổng +500.',5],straightBoth:['5 Cảnh Giới liên tiếp, cùng Loại Tu và Nguyên Tố.','5 Hỏa Kiếm từ Khai đến Vương: tổng +1000. Không tự nhân thêm ×100.',5]};
Object.assign(chainInfo,{fourR:['4 lá cùng Cảnh Giới, không cần trùng Tu hoặc Hành.','4 Sơ Linh: (tổng 4 lá +80) ×2.',4],fiveR:['5 lá cùng Cảnh Giới, không cần trùng Tu hoặc Hành.','5 Sơ Linh: (tổng 5 lá +150) ×4.',5],gap4:['Cần Cách Cảnh Thông Huyền: 4 Cảnh Giới khác nhau, mỗi bước tăng 1 hoặc 2 bậc.','Bậc 1–3–5–7: tổng +120.',4],gap4T:['Như Tứ Cảnh Cách Liên, cả 4 lá cùng Tu (có xét Quy Nhất).','Bậc 1–3–5–7 cùng Kiếm: (tổng +120) ×3.',4],gap4E:['Như Tứ Cảnh Cách Liên, cả 4 lá cùng Hành (có xét Quy Nguyên).','Bậc 1–3–5–7 cùng Hỏa: tổng +240.',4],gap4Both:['Như Tứ Cảnh Cách Liên, cả 4 lá cùng Tu và Hành.','Bậc 1–3–5–7 Hỏa Kiếm: tổng +600.',4]});
for(const k of ['straight','straightT','straightE','straightBoth'])chainInfo[k][0]+=' Có Cách Cảnh Thông Huyền: chấp nhận mỗi bước cách 1 hoặc 2 bậc.';
function effectiveChain(key){const permanent=s.up[key]||0,joker=J.find(x=>x.key===key),held=!!joker&&s.j.includes(joker.id),active=held&&!curseIs('fortuneSeal'),level=permanent+(active?relicPower(joker.id):0),ledger=chainLedger(key);return{permanent,held,active,level,add:ledger.add,mult:ledger.mult}}
function bookTabs(tab){const counts={'Chuỗi':chainKeys.length,'Nâng cấp':L.filter(x=>!x.retired).length,'Anh Linh':550,'Cơ Duyên':J.filter(x=>!x.retired&&!x.destiny).length,'Tiên Duyên':destinies.length,'Tầm Pháp':L.filter(x=>!x.retired).length,'Luyện Đan':T.filter(x=>!x.retired).length,'Thể Chất':10,'Lời nguyền':curses.length,'Phẩm':5};return Object.entries(counts).map(([t,n])=>`<button class="${t===tab?'active':''}" onclick="openBook('${t}')">${t} · ${n}</button>`).join('')}
function bookFrame(tab,content){modal(`<div class="modalTop"><div><div class="eyebrow">TÀNG KINH · ĐỒ GIÁM ĐẦY ĐỦ</div><h2>${tab}</h2></div><button onclick="closeModal()">Đóng ✕</button></div><div class="tabs bookTabs">${bookTabs(tab)}</div>${content}`)}
function chainReference(key){const c=CH[key],x=effectiveChain(key),info=chainInfo[key];return `<div class="item chainItem"><div class="eyebrow">${info[2]} ANH LINH RA TRẬN · CẤP ${x.level}</div><h4>${c.n}</h4><p>${info[0]}</p><div class="mathBadges"><b class="addValue">+${num(x.add)} Công Kích</b><b class="multValue">×${num(x.mult)}</b></div><p>Gốc: +${num(c.a)} / ×${num(c.m)}<br>Chân Ý cấp 1: +${num(c.da)} điểm / +${num(c.dm)} hệ số. Tầm Pháp cấp n: điểm luyện = n(n+3)/4; hệ số gốc cùng phần luyện tăng ×1,12 mỗi cấp với chuỗi có hệ số luyện<br>Tầm Pháp: cấp ${x.permanent} · Cơ Duyên: ${x.held?x.active?'+'+num(relicPower(J.find(j=>j.key===key).id))+' cấp tương đương':'bị Cấm Duyên':'chưa giữ'}</p><small>${info[1]} Ví dụ dùng chỉ số gốc.</small></div>`}
function upgradesContent(){return `<h3>Tầm Pháp toàn bộ</h3><div class="grid">${Object.values(trainingTracks).map(({id})=>`<div class="item"><h4>${L[id].n}</h4><p>${itemDescription(L[id])}</p></div>`).join('')}</div><p>Tất cả chỉ số hiệu lực của hành trình hiện tại. Công pháp cộng vào từng lá; Nguyên Pháp nhân riêng từng lá; nâng chuỗi áp dụng sau khi cộng Công Kích đội hình.</p><h3>10 Công Pháp Loại Tu · Cộng</h3><div class="grid">${types.map((n,i)=>`<div class="item"><h4>${n} · Cấp ${s.typeUp[i]}</h4><div class="mathBadges"><b class="addValue">+${5+(curseIs('typeSeal')?0:typeTrainingBonus(s.typeUp[i]))} / lá</b></div><p>Gốc +5, đã luyện +${typeTrainingBonus(s.typeUp[i])}. Mỗi cấp sau tăng mạnh hơn: +4, +8, +12… vào phần đã luyện.${curseIs('typeSeal')?' Phong Tu đang chặn phần tăng.':''}</p></div>`).join('')}</div><h3>5 Nguyên Pháp · Nhân</h3><div class="grid">${elements.map((n,i)=>`<div class="item"><h4>${n} · Cấp ${s.elemUp[i]}</h4><div class="mathBadges"><b class="multValue">×${num(curseIs('element')?1:elementTrainingMult(s.elemUp[i]))} / lá</b></div><p>Gốc ×1. Mỗi cấp nhân hệ số hiện tại ×1,2.${curseIs('element')?' Phong Nguyên đang vô hiệu phần tăng.':''}</p></div>`).join('')}</div><h3>${chainKeys.length} trận pháp · Gốc, cấp và hiệu lực</h3><div class="grid">${chainKeys.map(chainReference).join('')}</div>`}
function openReference(tab){if(tab==='Anh Linh'){return showHeroCatalog()}if(tab==='Nâng cấp')return bookFrame(tab,upgradesContent());bookFrame('Chuỗi',`<p>Mỗi lần xuất kích chỉ áp dụng <b>một chuỗi</b>. Mặc định lấy sát thương cao nhất; bấm tên trận pháp ở bảng sát thương để tự chọn. Các lá ra trận được đánh dấu, lá dự bị không cộng điểm hoặc kích hoạt Thể Chất.</p><div class="legend"><span class="addValue">Màu vàng: CỘNG vào tổng</span><span class="multValue">Màu xanh: NHÂN tổng</span></div><div class="grid">${chainKeys.map(chainReference).join('')}</div>`)}
function chainLedger(key,permanent=s.up[key]||0){const c=CH[key],joker=J.find(x=>x.key===key),enabled=!!joker&&hasJ(joker.id),addSources=[{name:'Hợp kích '+c.n+' · gốc',value:c.a},{name:'Tầm Pháp '+c.n+' · cấp '+permanent,value:chainTrainingPower(permanent)*c.da},{name:joker?joker.n+(enabled?' · đang kích hoạt':s.j.includes(joker.id)?' · bị Cấm Duyên':' · chưa giữ'):'Cơ Duyên',value:enabled?c.da*relicPower(joker.id):0}],coefficientSources=[{name:'Hợp kích '+c.n+' · hệ số gốc',value:c.m},{name:'Tầm Pháp '+c.n+' · cấp '+permanent,value:chainTrainingMult(key,permanent)},{name:joker?joker.n+(enabled?' · đang kích hoạt':s.j.includes(joker.id)?' · bị Cấm Duyên':' · chưa giữ'):'Cơ Duyên',value:enabled?c.dm*relicPower(joker.id):0}],trackAdd=trained('chainAdd'),trackMult=trained('chainMult');if(trackAdd)addSources.push({name:'Vạn Trận · Tụ Lực',value:trackAdd});const rawAdd=addSources.reduce((n,x)=>n+x.value,0),untrainedMult=coefficientSources.reduce((n,x)=>n+x.value,0),rawMult=untrainedMult*trackMult;if(trackMult!==1)coefficientSources.push({name:'Vạn Trận · Khuếch Linh',value:rawMult-untrainedMult});const add=curseIs('chain')?rawAdd*.5:rawAdd,mult=curseIs('multSeal')?1+(rawMult-1)*.5:rawMult;return{addSources,coefficientSources,rawAdd,rawMult,add,mult,addCurse:curseIs('chain')?'Tán Pháp':null,multCurse:curseIs('multSeal')?'Áp Trận':null}}
function cardLedger(c,active){const d=cardStats(c,active),type=types[c.t],el=elements[c.e],base=realmPower[c.r],trained=typeTrainingBonus(s.typeUp[c.t]),addSources=[{name:'Gốc '+realms[c.r],value:base},{name:el+' · điểm cộng trực tiếp',value:0},{name:type+' · cơ bản',value:5}],multipliers=[];if(d.level)addSources.push({name:'Cấp '+c.l+' · '+(c.l-1)+' cấp tăng thêm',value:d.level});if(trained)addSources.push({name:type+' · Tầm Pháp cấp '+s.typeUp[c.t],value:trained});if(curseIs('realm'))addSources.push({name:'Lời nguyền Áp Cảnh',value:-base*.5});if(curseIs('typeSeal')&&trained)addSources.push({name:'Lời nguyền Phong Tu',value:-trained});if(d.bodyAdd)addSources.push({name:bodies[c.body].n,value:d.bodyAdd});if(!curseIs('bodySeal'))active.filter(x=>x.id!==c.id&&x.body===7&&x.r===c.r).forEach(x=>addSources.push({name:'Mị Thể từ Anh Linh #'+x.id,value:20}));for(const [name,value] of [['Tầm Pháp · Cấp Độ',d.training.lv-d.level],['Tầm Pháp · Loại Tu',d.training.tu-5-d.typeUpgrade],['Tầm Pháp · Nguyên Tố',d.training.hanh]])if(value)addSources.push({name,value});if(d.training.element!==d.element)multipliers.push({name:'Tầm Pháp · Nguyên Tố',value:d.training.element/d.element});multipliers.push({name:el+' Nguyên Pháp · cấp '+s.elemUp[c.e],value:d.element,note:curseIs('element')?'Phong Nguyên đưa hệ số về ×1':'×1 gốc + '+num((elementTrainingMult(s.elemUp[c.e])-1))+' từ Tầm Pháp'});if(c.body===1||c.body===6)multipliers.push({name:bodies[c.body].n,value:d.bodyMult,note:curseIs('bodySeal')?'Phong Thể đang vô hiệu':'Nhân Công Kích riêng của lá'});return{...d,addSources,multipliers}}
function signed(n){return(n<0?'−':'+')+num(Math.abs(n))}
function namedAmount(label,value,kind='add'){return `<span class="namedAmount ${kind==='mult'?'multValue':kind==='curse'?'curseValue':'addValue'}"><b>${kind==='mult'?'×'+num(value):signed(value)}</b><small>${label}</small></span>`}
function sourceRows(rows,mode='add'){return rows.map((x,i)=>`<div class="sourceRow"><span>${x.name}${x.note?'<small>'+x.note+'</small>':''}</span><b class="${mode==='mult'?'multValue':x.value<0?'curseValue':'addValue'}">${mode==='mult'?'×'+num(x.value):signed(x.value)}</b></div>`).join('')}
function perCardHTML(c,active){const d=cardLedger(c,active),contributions=d.addSources.map(x=>`${x.name} (${num(x.value)} điểm)`).join(' + '),outside=teamBonuses([c]).filter(x=>J.find(j=>j.n===x.name)?.element===c.e);return `<article class="damageCard bodyFrame" data-body="${c.body}"><div class="damageCardHead"><div><div class="eyebrow">ANH LINH #${c.id} · CẤP ${c.l}</div><h4>${realms[c.r]} ${elements[c.e]} ${types[c.t]}</h4></div><b>${num(d.total)}<small>Công Kích riêng</small></b></div>${bodyDetailsHTML(c)}<div class="cardNamedFormula">(${d.addSources.map(x=>namedAmount(x.name,x.value)).join('<span class="formulaJoin"> </span>')}) ${d.multipliers.map(x=>namedAmount(x.name,x.value,'mult')).join('')} <strong>= ${num(d.total)}</strong></div><details class="sourceDetail"><summary>Đọc từng thành phần của lá này</summary><h5>Điểm cộng trước khi nhân</h5>${sourceRows(d.addSources)}<h5>Hệ số nhân riêng</h5>${sourceRows(d.multipliers,'mult')}<p>${elements[c.e]} hiện cộng trực tiếp <b>0 điểm</b>; tác dụng Nguyên Tố nằm ở hệ số Nguyên Pháp.${outside.length?' '+outside.map(x=>x.name+' cộng +'+num(x.value)+' vào tổng đội hình, sau các hệ số riêng của lá.').join(' '):''}</p></details></article>`}
function chainSourcesHTML(v){const c=v.chain||chainLedger(v.key);return `<section class="ledgerBlock"><h4>2. Cộng từ Cơ Duyên</h4>${v.sources.length?sourceRows(v.sources):'<p>Không có Cơ Duyên cộng điểm đang kích hoạt: +0.</p>'}<div class="sourceSubtotal">Tổng cộng Cơ Duyên <b>+${num(v.bonus)}</b></div></section><section class="ledgerBlock"><h4>3. Cộng từ hợp kích ${v.name}</h4>${sourceRows(c.addSources.filter((x,i)=>i===0||x.value!==0))}${c.addCurse?'<p class="curseValue">Tán Pháp: '+num(c.rawAdd)+' ×0,5 = '+num(c.add)+'</p>':''}<div class="sourceSubtotal">Thưởng cộng có hiệu lực <b>+${num(v.add)}</b></div></section><section class="ledgerBlock"><h4>4. Nhân từ hợp kích và nâng cấp</h4><p>Các nguồn bên dưới <b>cộng vào cùng một hệ số</b>, không nhân chồng với nhau.</p>${c.coefficientSources.map((x,i)=>`<div class="sourceRow"><span>${x.name}</span><b class="multValue">${i===0?'×':'+'}${num(x.value)}${i?' vào hệ số':''}</b></div>`).join('')}${c.multCurse?'<p class="curseValue">Áp Trận: ×'+num(c.rawMult)+' → ×'+num(c.mult)+' (giảm nửa phần vượt ×1).</p>':''}<div class="sourceSubtotal multValue">Hệ số hợp kích có hiệu lực <b>×${num(v.mult)}</b></div>${v.tax!==1?'<div class="sourceRow curseValue"><span>Lời nguyền Tán Quân · từ 4 lá ra trận</span><b>×'+num(v.tax)+'</b></div>':''}</section>`}
function scoreFormula(v){return `<span class="equationBracket">(</span><span class="namedAmount"><b>${num(v.base)}</b><small>Tổng các Anh Linh</small></span>${namedAmount('Cơ Duyên',v.bonus)}${namedAmount(v.name+' · thưởng cộng',v.add)}<span class="equationBracket">)</span>${namedAmount(v.name+' · hệ số',v.mult,'mult')}${(v.factors||[]).map(x=>namedAmount(x.name,x.value,'mult')).join('')}${v.tax!==1?namedAmount('Lời nguyền Tán Quân',v.tax,'mult'):''}${(v.finalFactors||[]).map(x=>namedAmount(x.name,x.value,'mult')).join('')}${(v.finalAdds||[]).map(x=>namedAmount(x.name,x.value)).join('')}<span class="mathResult">= ${fmt(v.damage)}</span>`}
function damageLedgerHTML(v){const active=v.active.map(card);return `<h3>1. Công Kích của ${active.length} Anh Linh ra trận</h3>${active.map(c=>perCardHTML(c,active)).join('')}<div class="sourceSubtotal">Tổng Công Kích riêng <b>${num(v.base)}</b></div>${chainSourcesHTML(v)}<section class="ledgerBlock"><h4>5. Kết quả cuối</h4><div class="scoreEquation">${scoreFormula(v)}</div><p>Chỉ làm tròn xuống sau toàn bộ phép cộng và phép nhân. ${selected.length-v.active.length} lá dự bị không tham gia phép tính.</p></section>`}
function renderScore(v){const isOpen=$('damageSources')?.open||false;$('scoreEquation').innerHTML=v.key?scoreFormula(v):'<span class="muted">Chọn bài để xem từng nguồn cộng và nhân.</span>';$('chainExplain').textContent=v.key?chainInfo[v.key][0]+' Chỉ '+v.active.length+' lá ra trận.':'Chọn thẻ để xem chuỗi, điều kiện và phép tính.';$('damageSourcesPanel').innerHTML=v.key?`<details id="damageSources" class="damageSources" ${isOpen?'open':''}><summary>${v.active.length} Anh Linh · xem các nguồn + / ×</summary>${damageLedgerHTML(v)}</details>`:'';if($('mobileAttackDamage'))$('mobileAttackDamage').textContent=v.key?' · '+fmt(v.damage)+' ST':''}
function showDamageDetail(){const v=calc(chosen());if(!v.key)return toast('Chọn Anh Linh trước để xem phép tính.');modal(`<div class="modalTop"><div><div class="eyebrow">TỪNG ĐIỂM CỘNG · TỪNG HỆ SỐ NHÂN</div><h2>${v.name}</h2></div><button onclick="closeModal()" aria-label="Đóng chi tiết sát thương">Đóng ✕</button></div><p>${chainInfo[v.key][0]}</p>${damageLedgerHTML(v)}<div class="tabs"><button onclick="openBook('Chuỗi')">Giải thích ${chainKeys.length} chuỗi</button><button onclick="openBook('Nâng cấp')">Xem toàn bộ nâng cấp</button></div>`)}

function migrateRoster(){if(s.rosterVersion>=1)return 0;s.uid=Math.max(s.uid||0,...s.deck.map(c=>c.id));const existing=new Set(s.deck.map(c=>c.r+'-'+c.t+'-'+c.e));let count=0;for(const h of heroCatalog.filter(h=>h.r<2)){if(existing.has(h.key))continue;const c={id:++s.uid,r:h.r,t:h.t,e:h.e,l:1,body:null};s.deck.push(c);s.draw.push(c.id);count++}if(count)s.draw=shuffle(s.draw);s.rosterVersion=1;if(count)log('Bổ sung '+count+' tổ hợp Khai Linh/Sơ Linh còn thiếu vào bộ rút.');save();return count}
function setHeroFilter(key,value){if(!['r','t','e','page'].includes(key))return;const v=Number(value);if(!Number.isInteger(v))return;heroFilters[key]=v;if(key!=='page')heroFilters.page=0;showHeroCatalog()}
function filteredHeroes(){return heroCatalog.filter(h=>(heroFilters.r<0||h.r===heroFilters.r)&&(heroFilters.t<0||h.t===heroFilters.t)&&(heroFilters.e<0||h.e===heroFilters.e))}
function heroFiltersHTML(){return `<div class="heroFilters">${[['r','Cảnh Giới',realms],['t','Loại Tu',types],['e','Nguyên Tố',elements]].map(([key,label,values])=>`<label>${label}<select aria-label="Lọc ${label}" onchange="setHeroFilter('${key}',this.value)"><option value="-1" ${heroFilters[key]===-1?'selected':''}>Tất cả</option>${values.map((v,i)=>`<option value="${i}" ${heroFilters[key]===i?'selected':''}>${v}</option>`).join('')}</select></label>`).join('')}</div>`}

function showHeroCatalog(){
 const all=filteredHeroes(),pages=Math.max(1,Math.ceil(all.length/50));
 heroFilters.page=Math.max(0,Math.min(pages-1,heroFilters.page));
 const owned={};
 for(const c of s.deck){const key=c.r+'-'+c.t+'-'+c.e;owned[key]=(owned[key]||0)+1;}
 const rows=all.slice(heroFilters.page*50,heroFilters.page*50+50).map(h=>
  `<div class="item heroEntry" style="--c:${colors[h.e]}"><div class="eyebrow">${realms[h.r]} · CẤP 1</div><span class="catalogSigil">${glyphs[h.t]}</span><h4>${elements[h.e]} ${types[h.t]}</h4><p>Công Kích gốc: ${realmPower[h.r]+5}<br>Đang sở hữu: ${owned[h.key]||0} lá</p></div>`).join('');
 bookFrame('Anh Linh',`<p>Khởi đầu với đủ <b>550 tổ hợp</b> gồm 11 Cảnh Giới, 10 Loại Tu và 5 Nguyên Tố.</p>${heroFiltersHTML()}<div class="catalogStatus">${all.length} tổ hợp · Trang ${heroFilters.page+1}/${pages}</div><div class="grid">${rows||'<p>Không có tổ hợp khớp.</p>'}</div><div class="tabs"><button onclick="setHeroFilter('page',${heroFilters.page-1})" ${heroFilters.page===0?'disabled':''}>← Trang trước</button><button onclick="setHeroFilter('page',${heroFilters.page+1})" ${heroFilters.page===pages-1?'disabled':''}>Trang sau →</button></div>`);
}




function isPackRelic(x){return ['destinyScroll','destinyCauldron'].includes(x.effect)}
function rankedChance(base,rank,cap){return Math.min(cap,base+5*(rank-1))}
function canMergeRelic(x){return !!x&&!x.retired&&(!!x.key||isPackRelic(x)||(x.id>=16&&x.id<=34)||['add','mult','victory','discards','hits','drain','heal','bank','slots','destinyAdd','destinyMult'].includes(x.effect));}
function relicLevel(id){return 1+(s.relicMerges?.[id]||0);}
function relicPower(id){return 1.5**(s.relicMerges?.[id]||0);}
function relicEffectText(x,factor,rank=relicLevel(x.id)){
 if(isPackRelic(x))return upgradeOdds(rankedChance(10,rank,50))+'% nhận 1 '+(x.effect==='destinyScroll'?'Cuộn Giản':'Đan Lô');
 if(x.effect==='destinyAdd')return '+'+num(x.value*factor)+' sát thương cuối';
 if(x.effect==='destinyMult')return '×'+num(1+x.value*factor)+' sát thương';
 if(x.effect==='slots')return '+'+Math.min(3,Math.round(Math.log(factor)/Math.log(1.5))+1)+' ô Cơ Duyên';if(x.effect){const value=x.value*factor;return x.effect==='mult'?'×'+num(1+value)+' mỗi điều kiện':x.effect==='drain'?num(value*100)+'% hút máu':'+'+num(value)+' mỗi điều kiện';}if(x.key){const c=CH[x.key];return[c.da?'+'+num(c.da*factor)+' Công Kích chuỗi':'',c.dm?'+'+num(c.dm*factor)+' vào hệ số chuỗi':''].filter(Boolean).join(' · ');}const base={16:5,17:4,18:3,19:10,20:15,21:2,22:1,23:2,24:2,29:4,30:4,31:4,32:4,33:4,34:3},n=num((base[x.id]||0)*factor);if(x.id===17)return 'Giảm '+n+' sát thương mỗi đợt boss đánh';if(x.id===18)return 'Hồi '+n+' HP khi có Mộc ra trận';if(x.id===21)return '+'+n+' Công Kích / lần đổi (tối đa +'+num(6*factor)+')';if(x.id===22)return '+'+n+' Công Kích / 10 Linh Thạch (tối đa +'+num(10*factor)+')';if(x.id===23)return '+'+n+' Công Kích / 10 HP đã mất';if(x.id===24)return '+'+n+' Công Kích / Cơ Duyên đang giữ';if(x.id>=29&&x.id<=33)return '+'+n+' Công Kích / lá '+elements[x.id-29]+' ra trận';if(x.id===34)return '+'+n+' Công Kích / lá có Thể Chất (tối đa +'+num(15*factor)+')';return '+'+n+' Công Kích khi đủ điều kiện';}
function relicUpgradePreview(id){const x=J[id];if(!s.j.includes(id))return '';if(!canMergeRelic(x))return '<p class="mergePreview">Hiệu ứng đặc biệt không có chỉ số để hợp nhất.</p>';return `<div class="mergePreview"><b>Hợp nhất · Cấp ${relicLevel(id)} → ${relicLevel(id)+1}</b><span>${relicEffectText(x,relicPower(id))}</span><strong>→ ${relicEffectText(x,relicPower(id)*1.5,relicLevel(id)+1)}</strong><small>${isPackRelic(x)?'Tăng 5 điểm % mỗi bậc, tối đa 50%.':'Không tốn thêm ô.'}</small></div>`;}
function acquireRelic(id,replace=null){
 ensureExpansion();
 const x=J[id];
 if(!x)return false;
 if(s.j.includes(id)){
  if(!canMergeRelic(x)){toast('Hiệu ứng đặc biệt này không cộng dồn.');return false;}
  if(relicLevel(id)>=(x.effect==='slots'?3:99)){toast('Đã đạt bậc tối đa.');return false;}
  s.relicMerges[id]=(s.relicMerges[id]||0)+1;
  log('Hợp nhất '+x.n+' → Bậc '+relicLevel(id)+'.');
  return true;
 }
 const next=[...s.j],old=next[replace];
 if(Number.isInteger(replace)&&old!==undefined)next[replace]=id;
 else next.push(id);
 if(next.length>relicCap(next)){toast('Chưa đủ ô Cơ Duyên cho thay đổi này.');return false;}
 if(old!==undefined)clearRelicState(old);
 s.j=next;
 s.relicMerges[id]=0;
 return true;
}


function retireFourRealm(){if(s.fourRealmRetired)return;const old=39,next=40;if(s.j.includes(old)){if(s.j.includes(next)){s.relicMerges[next]=(s.relicMerges[next]||0)+(s.relicMerges[old]||0)+1;s.j=s.j.filter(id=>id!==old);}else{s.j=s.j.map(id=>id===old?next:id);s.relicMerges[next]=s.relicMerges[old]||0;}delete s.relicMerges[old];}if(s.up.fourR){s.up.fiveR=(s.up.fiveR||0)+s.up.fourR;delete s.up.fourR;}s.training=s.training.map(id=>id===35?36:id);if(s.trainingHistory[35]){s.trainingHistory[36]=(s.trainingHistory[36]||0)+s.trainingHistory[35];delete s.trainingHistory[35];}for(const o of [...(s.offers||[]),...(s.rewards||[])]){if(o.kind==='Cơ Duyên'&&o.id===39)o.id=40;if(o.kind==='Tầm Pháp'&&o.id===35)o.id=36;}s.fourRealmRetired=true;}

function ensureExpansion(){if(!s)return;s.training??=[];s.trainingHistory??={};s.relicMerges??={};retireFourRealm();s.mergePairs??={};for(const [id,n]of[[SPECIAL.mergeE,5],[SPECIAL.mergeT,10]])if(!s.mergePairs[id])s.mergePairs[id]=shuffle(Array.from({length:n},(_,i)=>i)).slice(0,2).sort((a,b)=>a-b);s.expansionVersion=2;ensureMarketState();}
function chainAttr(c,k){if(k!=='t'&&k!=='e')return c[k];const id=k==='e'?SPECIAL.mergeE:SPECIAL.mergeT,p=s.mergePairs?.[id];return p&&hasJ(id)&&p.includes(c[k])?p[0]:c[k];}
function trainingDescription(x){
 if(x.effect==='type'){
  const rank=s.typeUp[x.target];
  return `Mỗi lá ${types[x.target]}: Công Pháp +${num(5+typeTrainingBonus(rank))} → +${num(5+typeTrainingBonus(rank+1))} Công Kích sau khi lĩnh ngộ.`;
 }
 if(x.effect==='element'){
  const rank=s.elemUp[x.target];
  return `Mỗi lá ${elements[x.target]}: Nguyên Pháp ×${num(elementTrainingMult(rank))} → ×${num(elementTrainingMult(rank+1))} sau khi lĩnh ngộ.`;
 }
 if(x.effect==='chain'&&!x.retired){
  return 'Sau khi lĩnh ngộ: '+x.keys.map(key=>{
   const rank=s.up[key]||0,now=chainLedger(key,rank),next=chainLedger(key,rank+1);
   const changes=[];
   if(now.add!==next.add)changes.push(`+${num(now.add)} → +${num(next.add)} Công Kích`);
   if(now.mult!==next.mult)changes.push(`×${num(now.mult)} → ×${num(next.mult)} sát thương`);
   return CH[key].n+' · '+(changes.join(', ')||'hiệu lực giữ nguyên')+'.';
  }).join(' ');
 }
 if(x.effect==='track'){
  const {value}=trainingTracks[x.track],now=trained(x.track);
  const mult=x.track.endsWith('Mult'),prefix=mult?'×':'+';
  return x.d+` Hiệu lực: ${prefix}${num(now)} → ${prefix}${num(mult?now*(1+value):now+value)}.`;
 }
 return null;
}
function itemDescription(x){
if(x.effect?.startsWith('sacrifice')&&s.j.includes(x.id))return x.d+' Hiện tăng '+(x.value*relicLevel(x.id))+'% sát thương. Tỷ lệ lên bậc hiện tại '+upgradeOdds(50)+'%.';
if(x.effect==='destinyRepeat'&&s.j.includes(x.id))return x.d+' Tỷ lệ hiện tại '+upgradeOdds(25)+'%.';
if(x.kind==='Tầm Pháp'){const preview=trainingDescription(x);if(preview)return preview;}if(x.id===wealthRelic&&x.kind==='Cơ Duyên'&&s.j.includes(x.id))return x.d+' Giá bán hiện tại: '+relicSellValue(x)+' Linh Thạch.';if(x.kind==='Tầm Pháp'&&['track','drawBias'].includes(x.effect))return x.d+' Bậc hiện tại: '+(s.trainingHistory?.[x.id]||0)+'.';if(x.kind==='Cơ Duyên'&&s.j.includes(x.id)&&canMergeRelic(x))return x.d+' Hiệu lực hiện tại — Cấp '+relicLevel(x.id)+': '+relicEffectText(x,relicPower(x.id))+'. Điều kiện kích hoạt giữ nguyên.';const id=x.kind==='Cơ Duyên'?x.id:-1;if(id===SPECIAL.mergeE||id===SPECIAL.mergeT){ensureExpansion();const names=id===SPECIAL.mergeE?elements:types;return x.d+' Cặp của hành trình này: '+s.mergePairs[id].map(i=>names[i]).join(' ↔ ')+'.'}return x.d;}
function itemGrade(x){return x.kind==='Cơ Duyên'?s?.relicGrades?.[x.id]??x.q:x.q}
function gradeHTML(x){if(!x)return '';const q=itemGrade(x);return q!=null?`<span class="gradeBadge q${q}" style="--q:${RARITY_COLORS[q]}">${RARITIES[q]}</span>`:'';}
function randomFromPool(pool,biased=false){if(!pool.length)return null;const tiers=[...new Set(pool.map(x=>x.q))],weights=[55,27,12,5,1];let roll=Math.random()*tiers.reduce((v,q)=>v+weights[q],0),tier=tiers[tiers.length-1];for(const q of tiers){roll-=weights[q];if(roll<0){tier=q;break}}const matches=pool.filter(x=>x.q===tier);return biased?focusedPick(matches):matches[rand(matches.length)];}
function randomLoot(kind){return randomFromPool(catalog(kind).filter(x=>!x.retired),true);}
function useTraining(i,relicTarget=null,onBoard=false){if(s.openPack)return;ensureExpansion();const id=s.training[i],x=L[id];if(!x||busy||!['battle','shop'].includes(s.phase))return;if(x.effect.startsWith('destiny')){if(s.rewards.length||!transformRelic(i,x.effect,relicTarget,true))return;}else applyTraining(x);s.training.splice(i,1);if(!x.effect.startsWith('destiny'))log('Lĩnh ngộ '+x.n+' · '+RARITIES[x.q]+'.');save();render();toast(x.effect.startsWith('destiny')?s.logs[0]:'Đã lĩnh ngộ '+x.n);if(s.rewards.length)showRewards();else if(s.phase==='shop')showShop();else if(!onBoard)openTraining();}
function openTraining(){ensureExpansion();modal(`<div class="modalTop"><h2>Tầm Pháp · ${s.training.length}/3</h2><button onclick="closeModal()">Đóng ✕</button></div><p>Thẻ nằm trong khung chưa có hiệu lực. Lĩnh ngộ để áp dụng vĩnh viễn trong hành trình.</p><div class="grid">${s.training.map((id,i)=>{const x=L[id];return `<div class="item">${itemIllustration(x)}<h4>${x.n}</h4>${gradeHTML(x)}<p>${itemDescription(x)}</p><button onclick="useTraining(${i})">Lĩnh ngộ</button></div>`}).join('')||'<p>Chưa có Tầm Pháp chờ lĩnh ngộ.</p>'}</div><h3>Đã lĩnh ngộ</h3>${Object.entries(s.trainingHistory).map(([id,n])=>`<p>${L[id]?.n||'Công pháp'} ×${n} ${gradeHTML(L[id])}</p>`).join('')||'<p>Công pháp từ bản cũ vẫn được giữ nguyên trong Đồ giám → Nâng cấp.</p>'}<button onclick="openBook('Nâng cấp')">Xem công pháp đang có hiệu lực ↗</button>`);}

// Phường Thị: three relics and two sealed, persistent draft packs.
const PACK_SIZES={
 'Tầm Pháp':[{n:'Bó Cuộn Giản',count:3,take:1,p:4},{n:'Bó Cuộn Giản · Đại',count:5,take:2,p:7},{n:'Bó Cuộn Giản · Huyền',count:7,take:3,p:10}],
 'Luyện Đan':[{n:'Đan Lô',count:2,take:1,p:4},{n:'Đan Lô · Đại',count:4,take:2,p:7},{n:'Đan Lô · Huyền',count:8,take:2,p:10}]
};
function typeTrainingBonus(n){return 2*n*(n+1)}
function elementTrainingMult(n){return 1.2**n}
function chainTrainingPower(n){return n*(n+3)/4}
const additiveElementChains=new Set(['pairE','tripleE','fourE','fiveE','twoE','fullE','straightE','gap4E']);
function chainTrainingMult(key,n){if(additiveElementChains.has(key))return 0;const c=CH[key];return (c.m+c.dm*chainTrainingPower(n))*1.12**n-c.m}
function oldBossHP(stage){return BigInt([180,260,360,480,750][stage%5])*165n**BigInt(Math.floor(stage/5))/100n**BigInt(Math.floor(stage/5))}
function ensureMarketState(){
 s.comboUse??={chains:{},types:Array(10).fill(0),elements:Array(5).fill(0),bodies:Array(10).fill(0),attacks:0};
 if(s.balanceVersion!==4){
  if(s.phase==='battle'){
   const previousMax=s.balanceVersion!==3?oldBossHP(s.stage):bossMaxHp(s.stage,135n,s.yaoBalance===1?165n:135n);
   const remaining=BigInt(s.bossHp);
   const currentMax=bossMaxHp(s.stage);
   const scaled=(remaining<previousMax?remaining:previousMax)*currentMax/previousMax;
   s.bossHp=(remaining>0n?(scaled||1n):0n).toString();
  }
  s.balanceVersion=4;
  s.yaoBalance=1;
 }
 if(s.marketVersion===3)return;s.marketVersion=3;s.marketPacks??=[];s.openPack??=null;
 const old=s.offers||[];s.legacyMarket=old.filter(o=>o.kind!=='Cơ Duyên'&&o.locked&&!o.bought);s.offers=old.filter(o=>o.kind==='Cơ Duyên').slice(0,3);
 if(s.phase==='shop')makeShop();
}
function recordCombo(v,active){ensureMarketState();const h=s.comboUse;h.attacks++;h.chains[v.key]=(h.chains[v.key]||0)+1;for(const c of active){h.types[c.t]+=1/active.length;h.elements[c.e]+=1/active.length;if(c.body!=null)h.bodies[c.body]+=1/active.length;}}
function affinity(x){const h=s.comboUse;if(!h?.attacks)return 0;const norm=(a,i)=>(a[i]||0)/Math.max(1,...a),chain=keys=>Math.max(0,...keys.map(k=>(h.chains[k]||0)/Math.max(1,...Object.values(h.chains))));
 if(x.kind==='Cơ Duyên'){if(x.key)return chain([x.key]);if(x.keyAttr)return norm(x.keyAttr==='e'?h.elements:h.types,x.target);if(x.element!=null)return norm(h.elements,x.element);if(x.id===35)return chain(['straight','straightT','straightE','straightBoth','gap4','gap4T','gap4E','gap4Both']);if(x.id===36)return Math.max(norm(h.elements,0),...h.elements.map((_,i)=>norm(h.elements,i)))*.5;if(x.id===37)return .5;if(x.id===34)return Math.min(1,h.bodies.reduce((a,b)=>a+b,0)/h.attacks);return .1;}
 if(x.kind==='Tầm Pháp')return x.effect==='type'?norm(h.types,x.target):x.effect==='element'?norm(h.elements,x.target):x.effect==='drawBias'?(x.attr==='t'?norm(h.types,x.target):x.attr==='e'?norm(h.elements,x.target):.25):['all','track'].includes(x.effect)?.35:chain(x.keys||[]);
 const e=x.effect;if(/^e\d+$/.test(e))return norm(h.elements,+e.slice(1));if(/^t\d+$/.test(e))return norm(h.types,+e.slice(1));if(/^body/.test(e))return norm(h.bodies,+e.slice(4));if(['realm','realm2','ascend'].includes(e))return Math.max(.2,chain(['straight','straightT','straightE','straightBoth','gap4','gap4T','gap4E','gap4Both']));if(e==='copytype')return Math.max(.2,chain(['pairT','tripleT','fourT','fiveT','unison']));if(e==='copyel')return Math.max(.2,chain(['pairE','tripleE','fourE','fiveE','unison']));return .1;
}
function focusedPick(pool){if(!pool.length)return null;if(!s.comboUse?.attacks||Math.random()>=.7)return pool[rand(pool.length)];const weights=pool.map(x=>1+6*affinity(x)+(x.kind==='Cơ Duyên'&&s.j.includes(x.id)&&canMergeRelic(x)?1:0));let roll=Math.random()*weights.reduce((a,b)=>a+b,0);return pool.find((_,i)=>(roll-=weights[i])<0)||pool[pool.length-1];}
function marketHint(x){return affinity(x)>=.6?'<span class="buildHint">Hợp lối chơi</span>':''}
function popularStyle(){const h=s.comboUse;if(!h?.attacks)return 'Chưa có combo chủ đạo · đồ xuất hiện ngẫu nhiên';const key=Object.keys(h.chains).sort((a,b)=>h.chains[b]-h.chains[a])[0];return 'Thiên hướng: '+(CH[key]?.n||'Đa dạng')+' · 70% lượt chọn ưu tiên hướng đã đánh, 30% chọn đều; Phẩm vẫn quay riêng.'}
function rollPack(kind){const r=Math.random(),tier=r<.65?0:r<.93?1:2;return {kind,tier,bought:false,locked:false};}
function packMeta(p){return PACK_SIZES[p.kind]?.[p.tier]}
function marketBlocked(){return !!s.openPack||!!s.rewards.length}
function makeShop(){ensureExpansion();const kept=(s.offers||[]).slice(0,3).map(o=>o.kind==='Cơ Duyên'&&o.locked&&!o.bought?{...o}:null),used=new Set(kept.filter(Boolean).map(o=>o.id));s.offers=Array.from({length:3},(_,i)=>{if(kept[i])return kept[i];const pool=J.filter(x=>!x.retired&&!used.has(x.id)&&(!s.j.includes(x.id)||canMergeRelic(x)));const x=randomFromPool(pool,true);used.add(x.id);return {kind:'Cơ Duyên',id:x.id,bought:false,locked:false}});s.marketPacks=['Tầm Pháp','Luyện Đan'].map((kind,i)=>{const old=s.marketPacks?.[i];return old?.kind===kind&&old.locked&&!old.bought?old:rollPack(kind)});}
function ensureShopLayout(){ensureMarketState();if(s.offers.length!==3||s.offers.some(o=>o.kind!=='Cơ Duyên')||s.marketPacks.length!==2)makeShop();}
function togglePackLock(i){if(s.phase!=='shop'||marketBlocked())return;const p=s.marketPacks[i];if(!p||p.bought)return;p.locked=!p.locked;save();showShop();}
function packOfferHTML(p,i){const m=packMeta(p),art=typeof packIllustration==='function'?packIllustration(p.kind,p.bought):'';return `<article class="packOffer ${p.locked?'offerLocked':''}"><div class="offerTop"><span class="eyebrow">${p.kind==='Tầm Pháp'?'CUỘN GIẢN':'ĐAN LÔ'} · ${['TIỂU','ĐẠI','HUYỀN'][p.tier]}</span><button class="lockOffer" onclick="togglePackLock(${i})" aria-pressed="${!!p.locked}" ${p.bought?'disabled':''}>${p.locked?'Đã khóa':'Khóa'}</button></div>${art}<div class="packCopy"><h3>${m.n}</h3><b>Chọn ${m.take} / ${m.count}</b><small>${p.kind==='Tầm Pháp'?'Lĩnh ngộ ngay':'Nhận Luyện Đan vào túi'}</small></div><button class="primary" onclick="buyPack(${i})" ${p.bought||s.coins<m.p?'disabled':''}>${p.bought?'Đã mở':'Mở · ◈ '+m.p}</button></article>`}
function marketInventory(){
 const groups=[['Cơ Duyên',s.j,relicCap()],['Tầm Pháp',s.training,3],['Luyện Đan',s.tarots,3]];
 return `<section id="marketSell" class="marketInventory"><div class="modalTop"><h3>Bán &amp; quản lý nâng cấp</h3><button onclick="$('marketBuy').scrollIntoView({block:'start'})">Quầy mua ↑</button></div>
 <p>Tầm Pháp có thể bán khi còn trong túi, trước khi lĩnh ngộ.</p>
 ${groups.map(([kind,items,cap])=>`<section><h4>${kind} · ${items.length}/${cap}</h4>${items.map((id,i)=>{
  const x=catalog(kind)[id],price=kind==='Cơ Duyên'?relicSellValue(x):Math.floor(x.p/2);
  const use=kind==='Tầm Pháp'?'<button onclick="useTraining('+i+')">Lĩnh ngộ</button>':
   kind==='Luyện Đan'?'<button onclick="prepareShopTarot('+i+')">Dùng</button>':
   destinyActionButton(x);
  return `<article class="marketInventoryItem"><details><summary>${x.n} ${gradeHTML(x)}</summary><p>${itemDescription(x)}</p></details><div>${use}<button onclick="sellMarketUpgrade('${kind}',${i},${id})">Bán · ◈ ${price}</button></div></article>`;
 }).join('')||'<p>Chưa có món nào trong túi.</p>'}</section>`).join('')}</section>`;
}
function sellMarketUpgrade(kind,i,id){
 if(s.phase!=='shop'||busy||marketBlocked())return;
 const top=$('modal').scrollTop;
 sellUpgrade(kind,i,true,id);
 $('modal').scrollTop=top;
}
function showShop(){if(s.openPack)return showOpenPack();ensureShopLayout();const b=currentBoss(),next=bossAt(s.stage+1);modal(`<div class="market"><div class="modalTop"><div><div class="eyebrow">BÍ CẢNH ${b.floor} · HẠ BOSS ${b.index+1}/5</div><h2>Phường Thị</h2></div><span class="money">◈ ${fmt(s.coins)}</span></div><p class="marketStyle">${popularStyle()}</p><div class="marketJump"><button onclick="$('marketSell').scrollIntoView({block:'start'})">Bán &amp; quản lý nâng cấp ↓</button></div><section id="marketBuy" class="marketRelics" aria-label="Ba ô Cơ Duyên">${s.offers.map((o,i)=>{const x=itemOf(o);return `<article class="marketRelic ${o.locked?'offerLocked':''}"><div class="offerTop"><span class="eyebrow">CƠ DUYÊN</span><button class="lockOffer" onclick="toggleOfferLock(${i})" aria-pressed="${!!o.locked}" ${o.bought?'disabled':''}>${o.locked?'Đã khóa':'Khóa'}</button></div>${itemIllustration(x)}<h4>${x.n.replace(' · Chân Ý','')}</h4>${gradeHTML(x)}${marketHint(x)}<p>${itemDescription(x)}</p><button class="marketDetail" onclick="showMarketRelic(${i})">Chi tiết ↗</button>${s.j.includes(x.id)?'<small class="mergeHint">Cấp '+relicLevel(x.id)+' → '+(relicLevel(x.id)+1)+'</small>':''}<button onclick="buy(${i})" ${o.bought||s.coins<x.p?'disabled':''}>${o.bought?'Đã mua':(s.j.includes(x.id)?'Hợp nhất':'Mua')+' · ◈ '+x.p}</button></article>`}).join('')}</section><section class="marketPacks" aria-label="Hai gói nâng cấp">${s.marketPacks.map(packOfferHTML).join('')}</section>${['Tầm Pháp','Luyện Đan'].filter(kind=>s.freePacks?.[kind]>0).map(kind=>`<button onclick="openFreePack('${kind}')">Mở miễn phí · ${kind==='Tầm Pháp'?'Cuộn Giản':'Đan Lô'} (${s.freePacks[kind]})</button>`).join('')}<div class="marketActions"><button onclick="reroll()" ${s.coins<2?'disabled':''}>Làm mới · ◈ 2</button><button onclick="shopHeal()" ${s.coins<3||s.hp===s.max?'disabled':''}>Hồi ${fmt(shopHealAmount())} HP · ◈ 3</button><button class="primary" onclick="nextBoss()">${s.stage===campaignStages-1?'Kết cục ↗':'Boss tiếp ↗'}</button></div><p class="nextBossInfo">${s.stage===campaignStages-1?'Cửa thoát đã ở ngay trước mắt.':next.n+' · '+next.rank}${s.stage===campaignStages-1?'':' · '+fmt(next.hp)+' HP'}${s.stage!==campaignStages-1&&next.curse?' · ☠ '+next.curse.n:''}</p>${marketInventory()}<div class="tabs"><button onclick="showDeck()">Bộ bài</button><button onclick="openBook()">Đồ giám</button></div>${s.legacyMarket?.length?'<h4>Món đã khóa từ bản cũ</h4><div class="tabs">'+s.legacyMarket.map((o,i)=>`<button onclick="buyLegacy(${i})" ${o.bought||s.coins<itemOf(o).p?'disabled':''}>${o.bought?'Đã mua':itemOf(o).n+' · ◈ '+itemOf(o).p}</button>`).join('')+'</div>':''}</div>`)}
function showMarketRelic(i){const o=s.offers[i],x=o&&itemOf(o);if(!x)return;modal(`<div class="modalTop"><h2>${x.n}</h2><button onclick="showShop()">Về Phường Thị</button></div><div class="itemPortrait">${itemIllustration(x)}</div>${gradeHTML(x)}<p>${itemDescription(x)}</p>${relicUpgradePreview(x.id)}<button class="primary" onclick="buy(${i})" ${o.bought||s.coins<x.p?'disabled':''}>${o.bought?'Đã mua':'Mua · ◈ '+x.p}</button>`)}
function buyLegacy(i){const o=s.legacyMarket?.[i];if(s.phase!=='shop'||marketBlocked()||!o||o.bought)return;const x=itemOf(o);if(s.coins<x.p)return;if(x.kind==='Tầm Pháp'){if(s.training.length>=3)return toast('Lĩnh ngộ Tầm Pháp đang giữ để nhường ô.');s.training.push(x.id)}else{if(s.tarots.length>=3)return toast('Dùng hoặc bán một Luyện Đan để nhường ô.');s.tarots.push(x.id)}s.coins-=x.p;o.bought=true;save();render();showShop();}
function buyPack(i){if(s.phase!=='shop'||busy||marketBlocked())return;const p=s.marketPacks[i],m=p&&packMeta(p);if(!m||p.bought||s.coins<m.p)return;s.coins-=m.p;p.bought=true;p.locked=false;draftPack(p);}
function draftPack(p){const m=packMeta(p),pool=catalog(p.kind).filter(x=>!x.retired),choices=[];while(choices.length<m.count){const x=randomFromPool(pool.filter(x=>!choices.includes(x.id)),true);choices.push(x.id)}s.openPack={kind:p.kind,tier:p.tier,choices,selected:[],take:m.take};log('Mở '+m.n+' · chọn '+m.take+'/'+m.count+'.');save();render();if(typeof showPackOpening==='function')showPackOpening();else showOpenPack();}
function showOpenPack(){const p=s.openPack;if(!p)return showShop();const m=packMeta(p);modal(`<div class="packDraft"><div class="modalTop"><div><div class="eyebrow">${p.kind} · ĐÃ MỞ GÓI</div><h2>${m.n}</h2></div><b class="draftCount">${p.selected.length}/${p.take}</b></div><p>Chọn từ 1 đến ${p.take} trong ${p.choices.length} lá. ${p.kind==='Tầm Pháp'?'Pháp Đồ chỉ số và tăng tần suất rút được lĩnh ngộ ngay. Pháp Đồ hóa Tiên Duyên được nhận vào khung.':'Nhận vào túi; nếu đầy sẽ được chọn món để thay.'} Những lá còn lại sẽ bỏ. Kết quả được giữ khi thoát game.</p><div class="draftGrid">${p.choices.map((id,i)=>{const x=catalog(p.kind)[id],on=p.selected.includes(i);return `<button class="draftCard ${on?'draftSelected':''}" onclick="togglePackChoice(${i})" aria-pressed="${on}">${itemIllustration(x)}<b>${x.n}</b>${gradeHTML(x)}${marketHint(x)}<span class="draftDesc">${itemDescription(x)}</span><span class="draftTick">${on?'Đã chọn':'Chọn lá'}</span></button>`}).join('')}</div><div class="draftActions"><button onclick="skipPack()">Bỏ qua gói</button><button class="primary" onclick="claimPack()" ${!p.selected.length?'disabled':''}>${p.kind==='Tầm Pháp'?'Lĩnh ngộ':'Nhận'} ${p.selected.length}/${p.take} lá ↗</button></div></div>`)}
function togglePackChoice(i){const p=s.openPack;if(s.phase!=='shop'||!p||!Number.isInteger(i)||i<0||i>=p.choices.length)return;if(p.selected.includes(i))p.selected=p.selected.filter(n=>n!==i);else if(p.selected.length<p.take)p.selected.push(i);else return toast('Đã chọn đủ '+p.take+' lá. Bỏ chọn một lá để đổi.');save();showOpenPack();}
function claimPack(){const p=s.openPack;if(s.phase!=='shop'||!p||!p.selected.length||p.selected.length>p.take||new Set(p.selected).size!==p.selected.length||p.selected.some(i=>!Number.isInteger(i)||i<0||i>=p.choices.length))return;for(const i of p.selected){const id=p.choices[i];if(p.kind==='Tầm Pháp'&&!L[id].effect.startsWith('destiny')){applyTraining(L[id]);log('Lĩnh ngộ từ Cuộn Giản: '+L[id].n+'.')}else s.rewards.push({kind:p.kind,id,source:p.kind==='Tầm Pháp'?'Cuộn Giản':'Đan Lô'})}s.openPack=null;save();render();resumePanel();}
function skipPack(){if(!s.openPack||s.phase!=='shop')return;notePackSkip(s.openPack.kind);log('Bỏ qua các lá trong '+packMeta(s.openPack).n+'.');s.openPack=null;save();render();showShop();}

for(const x of L){
 if(x.effect==='type')x.d=`Tăng 1 cấp Công Pháp ${types[x.target]}. Ở cấp 1, 2 và 3, mỗi lá nhận lần lượt +9, +17 và +29 Công Kích, đã tính +5 điểm gốc.`;
 else if(x.effect==='element')x.d=`Tăng 1 cấp Nguyên Pháp ${elements[x.target]}. Ở cấp 1, 2 và 3, hệ số lần lượt là ×1,2, ×1,44 và ×1,73.`;
}

// Big Update 2. IDs remain append-only so inventory references survive an update.
const addUpgrade = (pool, kind, n, d, p, data) =>
  pool.push({id:pool.length, kind, n, d, p, q:p>=10?3:p>=8?2:1, ...data})-1;
const relic2 = (n,d,effect,value,p=8,data={}) =>
  addUpgrade(J,'Cơ Duyên',n,d,p,{effect,value,...data});
const tarot2 = (n,d,effect,p=6) => addUpgrade(T,'Luyện Đan',n,d,p,{effect});
const trainingTracks = {};
for (const [key,name,amount] of [
  ['chain','Vạn Trận',12],['level','Linh Giai',2],['type','Bách Tu',3],['element','Ngũ Hành',3]
]) {
  for (const [op,value] of [['Add',amount],['Mult',0.1]]) {
    const track=key+op;
    const id=addUpgrade(L,'Tầm Pháp',name+(op==='Add'?' · Tụ Lực':' · Khuếch Linh'),
      (op==='Add'?'+'+value:'×1,1')+' cho '+({chain:'mọi chuỗi',level:'phần Công Kích từ cấp của mọi lá',type:'phần Công Kích từ Loại Tu của mọi lá',element:'phần Công Kích riêng theo Nguyên Tố của mọi lá'})[key]+
      ' mỗi bậc. Lĩnh ngộ trùng để cộng dồn.',8,{effect:'track',track});
    trainingTracks[track]={id,value};
  }
}
function trained(track) {
  const x=trainingTracks[track], rank=s.trainingHistory?.[x.id]||0;
  return track.endsWith('Mult') ? (1+x.value)**rank : x.value*rank;
}
function cardTraining(level,type,element) {
  const lv=(level+trained('levelAdd'))*trained('levelMult');
  const tu=curseIs('typeSeal')?type:(type+trained('typeAdd'))*trained('typeMult');
  const hanh=curseIs('element')?0:trained('elementAdd');
  return {lv,tu,hanh,element:curseIs('element')?1:element*trained('elementMult')};
}
for (const [key,names] of [['e',elements],['t',types]]) {
  names.forEach((name,target)=>{
    if(key==='t')relic2(name+' · Tụ Khí','Có '+name+' ra trận: cộng 16 Công Kích.', 'add',16,7,{keyAttr:key,target});
    relic2(name+' · Chấn Khí','Có '+name+' ra trận: nhân ×1,25 sát thương.', 'mult',.25,8,{keyAttr:key,target});
  });
}
for (const [parity,label] of [[0,'Chẵn'],[1,'Lẻ']]) {
  relic2('Cảnh '+label+' · Tụ Quang','Mỗi Anh Linh ra trận có Cảnh Giới '+label.toLowerCase()+': +8 Công Kích.', 'add',8,7,{parity});
  relic2('Cảnh '+label+' · Vận Khí','Mỗi Anh Linh ra trận có Cảnh Giới '+label.toLowerCase()+': thêm 0,08 vào hệ số sát thương của lá Cơ Duyên này.', 'mult',.08,8,{parity});
}
relic2('Vô Tướng Ấn','Mỗi đòn nhân ×1,2 sát thương.','mult',.2,7);
relic2('Thiên Lôi Tàn Phù','Mỗi đòn +80 Công Kích. Sau khi kích hoạt, có 20% tự hủy.','add',80,10,{fragile:true});
relic2('Kiếp Hỏa Tàn Phù','Mỗi đòn nhân ×2 sát thương. Sau khi kích hoạt, có 20% tự hủy.','mult',1,10,{fragile:true});
for (const [pack,kind] of [['Cuộn Giản','Tầm Pháp'],['Đan Lô','Luyện Đan']]) {
  relic2(pack+' · Tàng Lực','Mỗi gói '+pack+' bỏ qua khi rời chợ hoặc bỏ sau khi mở: tích vĩnh viễn +8 Công Kích khi còn giữ lá này.','add',8,8,{skipKind:kind});
  relic2(pack+' · Tàng Uy','Mỗi gói '+pack+' bỏ qua khi rời chợ hoặc bỏ sau khi mở: tích vĩnh viễn thêm 0,08 vào hệ số sát thương của lá Cơ Duyên này.','mult',.08,8,{skipKind:kind});
}
relic2('Kim Vũ','Thắng trận nhận thêm 4 Linh Thạch.','victory',4,7);
relic2('Tĩnh Thủ','Thắng trận nhận 2 Linh Thạch mỗi lượt đổi còn lại.','discards',2,7);
relic2('Bách Kích Tụ Tài','Thắng trận nhận 1 Linh Thạch mỗi lượt đánh trúng boss.','hits',1,7);
relic2('Huyết Ẩm','Hồi HP bằng 5% sát thương thực gây lên boss, tối đa 15 HP mỗi đòn trước khi nâng bậc.','drain',.05,9);
relic2('Hồi Xuân Ngọc','Sau mỗi lần xuất kích hồi 5 HP.','heal',5,8);
const wealthRelic=relic2('Tụ Bảo Bồn','Giá bán tăng 3 Linh Thạch sau mỗi trận thắng khi đang giữ.','bank',3,8);
const purgeRelic=relic2('Giải Ách Phù','Bán trong trận có lời nguyền để vô hiệu lời nguyền đó đến hết trận.','purge',0,8);
const reviveRelic=relic2('Nhất Tuyến Sinh Cơ','Khi HP về 0, tự hủy để hồi 25% HP tối đa.','revive',.25,10);
J[SPECIAL.ward].d='Vô hiệu toàn bộ lời nguyền. Khi giữ, giảm thêm 1 ô Cơ Duyên có thể dùng.';
const destinies = [
  ['Thiên Môn','Mở thêm 1 ô Cơ Duyên, tối đa 8 ô. Hợp nhất lá trùng mở thêm 1 ô mỗi bậc.','slots',1],
  ['Kim Vận','Khi một Cơ Duyên khác kích hoạt, nhận 2 Linh Thạch.','destinyCoins',2],
  ['Đan Vận','Khi một Cơ Duyên khác kích hoạt, có 10% nhận 1 Đan Lô miễn phí ở Phường Thị. Mỗi bậc thêm 5 điểm %, tối đa 50%.','destinyCauldron',1],
  ['Kinh Vận','Khi một Cơ Duyên khác kích hoạt, có 10% nhận 1 Cuộn Giản miễn phí ở Phường Thị. Mỗi bậc thêm 5 điểm %, tối đa 50%.','destinyScroll',1],
  ['Thiên Phạt','Khi một Cơ Duyên khác kích hoạt trong đòn đánh, cộng 200 sát thương sau mọi hệ số nhân.','destinyAdd',200],
  ['Thiên Uy','Khi một Cơ Duyên khác kích hoạt trong đòn đánh, nhân ×4 sát thương trước phần cộng cuối.','destinyMult',3],
  ['Hiến Tế','Mỗi bậc tăng 10% sát thương trực tiếp. Đầu trận, có thể chọn một lá khác để hủy. Gốc 50% tăng 1 bậc.','sacrificeChosen',10],
  ['Nghịch Tế','Mỗi bậc tăng 30% sát thương trực tiếp. Đầu trận, có thể hủy ngẫu nhiên một lá khác. Gốc 50% tăng 1 bậc.','sacrificeRandom',30],
  ['Nghịch Thiên Cải Mệnh','Đổi toàn bộ lá đang giữ ngẫu nhiên trong cùng nhóm: Cơ Duyên thành Cơ Duyên, Tiên Duyên thành Tiên Duyên. Mỗi lá tăng một phẩm. Lá đã Tiên Thiên vẫn đổi và cho thêm 10 Linh Thạch.','destinyReroll',0],
  ['Đạp Hư Vượt Cảnh','Tiêu hủy lá này để bỏ qua phần còn lại của tầng Bí Cảnh hiện tại. Tối đa 2 lần mỗi hành trình.','destinySkip',2],
  ['Tước Ách Giáng Chủ','Tiêu hủy lá này để giáng Chủ Tầng hiện tại xuống boss thường, bỏ lời nguyền. Tối đa 3 lần mỗi hành trình.','destinyMundane',3],
  ['Thiên Tru Lệnh','Tiêu hủy lá này để kết liễu ngay boss đang giao chiến. Tối đa 3 lần mỗi hành trình.','destinySlay',3],
  ['Hồi Âm Hợp Kích','Gốc 25% đánh lại Hợp Kích với 80% sát thương nếu boss còn sống sau đòn đầu.','destinyRepeat',0],
  ['Thiên Vận Chiếu Mệnh','Thêm 10 điểm % vào các lần tung xác suất có lợi của nâng cấp, tối đa 100%.','destinyLuck',10]
].map(([n,d,effect,value])=>relic2('Tiên Duyên · '+n,d+(effect.startsWith('sacrifice')?' Lá bị hủy kể cả khi tăng bậc thất bại.':['destinyCoins','destinyCauldron','destinyScroll','destinyAdd','destinyMult'].includes(effect)?' Tối đa một lần mỗi lượt.':''),effect,value,12,{destiny:true}));
for (const [attr,label] of [['e','Nguyên Tố'],['t','Loại Tu'],['r','Cảnh Giới']])
  tarot2('Hoán '+label,'Hoán đổi '+label+' giữa đúng 2 lá đã chọn.','swap'+attr);
realms.forEach((name,r)=>tarot2(name+' · Định Cảnh','Chọn 1–2 lá và chuyển về '+name+'.','r'+r,7));
tarot2('Song Ảnh','Chọn 2 lá. Lá sau nhận cả Nguyên Tố và Loại Tu của lá trước.','copyboth');
tarot2('Giáng Linh','Chọn 1 lá để giảm một Cảnh Giới.','realmDown');
tarot2('Tán Linh Đổi Thạch','Bán 2 lá đã chọn để nhận 10 Linh Thạch.','sellCoins');
tarot2('Tán Linh Đổi Kinh','Bán 2 lá đã chọn để nhận 1 Cuộn Giản miễn phí.','sellScroll');
tarot2('Tán Linh Đổi Đan','Bán 2 lá đã chọn để nhận 1 Đan Lô miễn phí.','sellCauldron');
tarot2('Chỉ Mệnh Phù','Chọn 1 Cơ Duyên thường. Tỷ lệ gốc 20%, mỗi bậc của lá được hóa thêm 5 điểm %, tối đa 80%. Thành công đổi thành Tiên Duyên chưa sở hữu ở bậc 1. Thất bại giữ nguyên lá và mất phù.','destinyChosen',10);
tarot2('Vấn Thiên Phù','Chọn ngẫu nhiên 1 Cơ Duyên thường. Tỷ lệ gốc 20%, mỗi bậc của lá được hóa thêm 5 điểm %, tối đa 80%. Thành công đổi thành Tiên Duyên chưa sở hữu ở bậc 1. Thất bại giữ nguyên lá và mất phù.','destinyRandom',8);

for(const x of L)x.n+=' · Pháp Đồ';
const pillNames={realm:'Thăng Linh Đan',realm2:'Đại Thăng Linh Đan',level:'Tôi Hồn Đan',
 copytype:'Đồng Tâm Đan',copyel:'Đồng Nguyên Đan',copyboth:'Song Ảnh Đan',heal:'Phục Nguyên Đan',
 shield:'Hộ Thể Đan',clone:'Duyên Sinh Đan',remove:'Tán Linh Đan',refresh:'Nghịch Mệnh Đan',
 ascend:'Tạo Hóa Đan',realmDown:'Giáng Linh Đan',swape:'Hoán Nguyên Đan',swapt:'Hoán Tu Đan',
 swapr:'Hoán Cảnh Đan',sellCoins:'Đổi Thạch Đan',sellScroll:'Đổi Kinh Đan',sellCauldron:'Đổi Lô Đan'};
for(const x of T){
 if(x.effect.startsWith('destiny')){
  x.retired=true;
  addUpgrade(L,'Tầm Pháp',x.n.replace('Phù','· Pháp Đồ'),x.d.replace('mất phù','mất Pháp Đồ'),x.p,{effect:x.effect});
 }else x.n=pillNames[x.effect]||x.n.replace(' · Thể Đan','')+' Đan';
}

const drawBiasUpgrades=[];
for(const [attr,labels,prefix] of [
 ['t',types,'Dẫn Tu'],['e',elements,'Dẫn Nguyên'],['r',realms,'Dẫn Cảnh'],
 ['body',['Anh Linh có Thể Chất'],'Dẫn Thể']
]){
 labels.forEach((label,target)=>{
  const id=addUpgrade(L,'Tầm Pháp',prefix+' · '+label+' · Pháp Đồ',
   'Mỗi bậc cộng 35% trọng số rút cho '+(attr==='body'?'Anh Linh có Thể Chất':'lá khớp '+label)+' trong bộ bài. Các Pháp Đồ cùng khớp được cộng dồn.',8,
   {effect:'drawBias',attr,target});
  drawBiasUpgrades.push(L[id]);
 });
}

function migrateUpgradeNames(){
 const rename={'Luyện Tâm':'Tầm Pháp','Đạo Đồ':'Luyện Đan'};
 for(const item of [...(s.rewards||[]),...(s.offers||[]),...(s.legacyMarket||[]),...(s.marketPacks||[]),s.openPack]){
  if(item&&rename[item.kind])item.kind=rename[item.kind];
 }
 const counters=s.freePacks;
 if(counters){
  for(const [oldName,newName] of Object.entries(rename)){
   if(counters[oldName])counters[newName]=(counters[newName]||0)+counters[oldName];
   delete counters[oldName];
  }
 }
}

function relicCap(ids=s.j) {
  const slots=ids.filter(id=>J[id]?.effect==='slots').reduce((n,id)=>n+relicLevel(id),0);
  return Math.min(8,5+slots)-(ids.includes(SPECIAL.ward)?1:0);
}
function relicSellValue(x) {
  return Math.floor(x.p/2)+(x.id===wealthRelic?(s.relicCounters?.[x.id]||0):0);
}
function clearRelicState(id) {
  delete s.relicMerges[id];
  if(s.relicCounters)delete s.relicCounters[id];
  if(s.relicGrades)delete s.relicGrades[id];
}
function removeRelic(id) {
  const next=s.j.filter(x=>x!==id);
  if(next.length>relicCap(next)&&next.length-relicCap(next)>=s.j.length-relicCap())return false;
  s.j=next;
  clearRelicState(id);
  return true;
}
function relicCombatEffects(key,active,sources) {
  const fired=new Set(sources.map(x=>x.id));
  const extra=[], factors=[];
  for(const id of s.j) {
    const x=J[id];
    if(!hasJ(id))continue;
    if(x.key===key||id===SPECIAL.gap&&(key.startsWith('gap')||key.startsWith('straight')&&isGapped(active)))fired.add(id);
    if(id===SPECIAL.mergeE||id===SPECIAL.mergeT) {
      const attr=id===SPECIAL.mergeE?'e':'t', pair=s.mergePairs?.[id]||[];
      if(key!=='single'&&pair.every(value=>active.some(c=>c[attr]===value))&&
        (key.includes(attr.toUpperCase())||key==='unison'||key.endsWith('Both')))fired.add(id);
    }
    if(!['add','mult'].includes(x.effect))continue;
    const count=x.keyAttr?Number(active.some(c=>c[x.keyAttr]===x.target)):
      x.parity!=null?active.filter(c=>(c.r+1)%2===x.parity).length:
      x.skipKind?s.relicCounters?.[id]||0:1;
    if(!count)continue;
    fired.add(id);
    const value=x.value*count*relicPower(id);
    (x.effect==='add'?extra:factors).push({id,name:x.n,value:x.effect==='mult'?1+value:value});
  }
  return {fired,extra,factors};
}
function isGapped(active) {
  const ranks=active.map(c=>c.r).sort((a,b)=>a-b);
  return ranks.some((r,i)=>i>0&&r-ranks[i-1]>1);
}
function queueFreePack(kind,count=1) {
  s.freePacks??={};
  s.freePacks[kind]=(s.freePacks[kind]||0)+count;
}
function settleDestiny(fired) {
  const activates=[...fired].some(id=>!J[id]?.destiny);
  if(!activates)return;
  for(const id of s.j) {
    if(!hasJ(id))continue;
    const x=J[id],pack=isPackRelic(x);
    if(pack&&!rollUpgrade(rankedChance(10,relicLevel(id),50)))continue;
    const amount=pack?1:Math.floor((x.value||0)*relicPower(id));
    if(x.effect==='destinyCoins')s.coins+=amount;
    else if(x.effect==='destinyScroll')queueFreePack('Tầm Pháp',amount);
    else if(x.effect==='destinyCauldron')queueFreePack('Luyện Đan',amount);
    else continue;
    log(x.n+' kích hoạt · +'+amount+(x.effect==='destinyCoins'?' Linh Thạch':x.effect==='destinyScroll'?' Cuộn Giản':' Đan Lô')+'.');
  }
}
function openFreePack(kind) {
  if(s.phase!=='shop'||busy||marketBlocked()||!['Tầm Pháp','Luyện Đan'].includes(kind)||!s.freePacks?.[kind])return;
  s.freePacks[kind]--;
  draftPack({kind,tier:0});
}
function notePackSkip(kind) {
  s.relicCounters??={};
  for(const id of s.j)if(J[id].skipKind===kind)s.relicCounters[id]=(s.relicCounters[id]||0)+1;
}
function settleVictoryRelics(fired) {
  s.relicCounters??={};
  for(const id of s.j) {
    if(!hasJ(id))continue;
    const x=J[id], factor=relicPower(id);
    if(x.effect==='bank') {
      s.relicCounters[id]=(s.relicCounters[id]||0)+Math.floor(x.value*factor);
      fired.add(id);
    }
    const count=x.effect==='victory'?1:x.effect==='discards'?s.discards:x.effect==='hits'?(s.bossHits||0):0;
    if(!count)continue;
    const amount=Math.floor(count*x.value*factor);
    s.coins+=amount;
    fired.add(id);
    log(x.n+' · +'+amount+' Linh Thạch.');
  }
}
function recoverFatalHit(fired) {
  if(s.hp>0||!hasJ(reviveRelic)||!removeRelic(reviveRelic))return;
  s.hp=Math.max(1,Math.floor(s.max*.25));
  fired.add(reviveRelic);
  log('Nhất Tuyến Sinh Cơ tan biến · hồi '+s.hp+' HP.');
}
function advanceFloorHealth() {
  if(s.stage%5!==0)return;
  const floor=Math.floor(s.stage/5)+1;
  const old=s.max;
  s.max=Math.min(Number.MAX_SAFE_INTEGER,Math.floor(old*1.25));
  s.hp=Math.min(s.max,s.hp+(s.max-old));
  log('Bí Cảnh '+floor+' · Đạo Thể +'+(s.max-old)+' HP tối đa.');
}
function tarotPair(effect) {
  return effect.startsWith('copy')||effect.startsWith('swap')||effect.startsWith('sell');
}
function transformRelic(i,effect,target,fromTraining=false) {
  const ordinary=s.j.filter(id=>!J[id].destiny);
  if(!ordinary.length){toast('Cần một Cơ Duyên thường.');return false;}
  if(effect==='destinyChosen'&&target===null) {
    modal(`<h2>Chọn Cơ Duyên hóa Tiên Duyên</h2><p>Tỷ lệ theo bậc ghi trên từng lá. Thất bại giữ nguyên Cơ Duyên và mất vật phẩm dùng để hóa.</p><div class="tabs">${ordinary.map(id=>`<button onclick="${fromTraining?'useTraining('+i+','+id+')':'useTarot('+i+',true,'+id+')'}">${J[id].n} · Bậc ${relicLevel(id)} · ${upgradeOdds(rankedChance(20,relicLevel(id),80))}%</button>`).join('')}</div><button onclick="closeModal()">Quay lại</button>`);
    return false;
  }
  const id=effect==='destinyRandom'?ordinary[rand(ordinary.length)]:target;
  if(!ordinary.includes(id))return false;
  const choices=destinies.filter(candidate=>!s.j.includes(candidate)&&
    s.j.length<=relicCap(s.j.map(held=>held===id?candidate:held)));
  if(!choices.length){toast('Không còn Tiên Duyên phù hợp.');return false;}
  const chance=upgradeOdds(rankedChance(20,relicLevel(id),80));
  if(rand(100)>=chance){
    log((fromTraining?L[s.training[i]]:T[s.tarots[i]]).n+' hóa '+J[id].n+' thất bại ('+chance+'%). Cơ Duyên giữ nguyên.');
    return true;
  }
  const result=choices[rand(choices.length)];
  s.j[s.j.indexOf(id)]=result;
  clearRelicState(id);
  s.relicMerges[result]=0;
  log(J[id].n+' hóa thành '+J[result].n+'.');
  return true;
}
function upgradeOdds(base){
 const luck=J.find(x=>x.effect==='destinyLuck');
 return Math.min(100,base+(hasJ(luck.id)?luck.value:0));
}
function rollUpgrade(base){return rand(100)<upgradeOdds(base)}
function sacrificeChoices(id){
 const currentOverflow=Math.max(0,s.j.length-relicCap());
 return s.j.filter(other=>{
  if(other===id)return false;
  const remaining=s.j.filter(held=>held!==other);
  return remaining.length<=relicCap(remaining)||remaining.length-relicCap(remaining)<currentOverflow;
 });
}
function pendingSacrifice(){
 if(s.phase!=='battle'||s.turn!==1||busy)return null;
 return s.j.find(id=>hasJ(id)&&J[id].effect?.startsWith('sacrifice')&&s.sacrificeAsked?.[id]!==s.stage&&sacrificeChoices(id).length)??null;
}
function promptSacrifice(){
 const id=pendingSacrifice();
 if(id===null)return false;
 sacrificeRelic(id);
 return true;
}
function sacrificeRelic(id,target=null){
 if(marketBlocked()||id!==pendingSacrifice())return;
 const x=J[id],choices=sacrificeChoices(id);
 if(target===null){
  const options=x.effect==='sacrificeChosen'
   ?choices.map(other=>`<button onclick="sacrificeRelic(${id},${other})">Hiến ${J[other].n}</button>`).join('')
   :`<button class="primary" onclick="sacrificeRelic(${id},true)">Hủy ngẫu nhiên 1 trong ${choices.length} lá</button>`;
  modal(`<h2>${x.n} · Đầu trận</h2><p>Hiện tăng ${x.value*relicLevel(id)}% sát thương. Nếu tế, lá khác bị hủy và có ${upgradeOdds(50)}% lên bậc.</p><div class="tabs">${options}</div><button onclick="sacrificeRelic(${id},false)">Bỏ qua trận này</button>`);
  return;
 }
 if(target!==false){
  if(x.effect==='sacrificeRandom'&&target!==true)return;
  const other=x.effect==='sacrificeRandom'?choices[rand(choices.length)]:target;
  if(!choices.includes(other))return;
  const leveled=rollUpgrade(50);
  if(!removeRelic(other))return;
  if(leveled)s.relicMerges[id]=(s.relicMerges[id]||0)+1;
  log(x.n+' hủy '+J[other].n+(leveled?' · lên bậc '+relicLevel(id):' · tăng bậc thất bại')+'.');
 }
 s.sacrificeAsked??={};s.sacrificeAsked[id]=s.stage;
 save();render();resumePanel();
}
const activeDestinies=new Set(['destinyReroll','destinySkip','destinyMundane','destinySlay']);
function destinyActionButton(x){
 return activeDestinies.has(x.effect)?`<button class="primary" onclick="useDestiny(${x.id})">Kích hoạt</button>`:'';
}
function rerollDestinies(id){
 const previous=s.j.slice(),needed=Math.max(0,previous.length-5);
 const rare=shuffle(destinies.filter(candidate=>candidate!==id));
 const ordinary=shuffle(J.filter(x=>!x.destiny&&!x.retired&&(previous.length<5||x.id!==SPECIAL.ward)).map(x=>x.id));
 const slots=rare.find(candidate=>J[candidate].effect==='slots');
 // Reserve the slot-granting result in the first Destiny position if the rack needs it.
 if(needed)rare.splice(rare.indexOf(slots),1);
 let reserve=needed>0;
 const picks=previous.map(held=>{
  if(!J[held].destiny)return ordinary.pop();
  if(reserve){reserve=false;return slots}
  return rare.pop();
 });
 const grades=previous.map(held=>itemGrade(J[held]));
 s.coins+=10*grades.filter(q=>q===4).length;
 previous.forEach(clearRelicState);
 s.j=picks;
 s.relicGrades=Object.fromEntries(picks.map((held,i)=>[held,Math.min(4,grades[i]+1)]));
 if(needed)s.relicMerges[slots]=needed-1;
 log('Nghịch Thiên Cải Mệnh · đổi '+picks.length+' lá trong cùng nhóm.');
}
function useDestiny(id,confirmed=false){
 const x=J[id];
 if(!x||!activeDestinies.has(x.effect)||busy||marketBlocked()||!s.j.includes(id)||!hasJ(id)||!['battle','shop'].includes(s.phase))return;
 const effect=x.effect,used=s.destinyUses?.[effect]||0;
 if(x.value&&used>=x.value)return toast('Đã hết lượt dùng trong hành trình.');
 if(effect==='destinySlay'&&s.phase!=='battle')return toast('Chỉ dùng khi đang giao chiến.');
 const guardian=s.stage-s.stage%5+4;
 if(effect==='destinyMundane'&&(s.mundaneGuardians?.includes(guardian)||s.phase==='shop'&&s.stage===guardian))return toast('Tầng này không còn Chủ Tầng để giáng.');
 if(!confirmed){
  modal(`<h2>${x.n}</h2><p>${x.d}</p>${x.value?`<p>Còn ${x.value-used}/${x.value} lần.</p>`:''}<button class="primary" onclick="useDestiny(${id},true)">Xác nhận</button><button onclick="closeModal()">Quay lại</button>`);
  return;
 }
 if(effect==='destinyReroll')rerollDestinies(id);
 else{
  if(!removeRelic(id))return;
  s.destinyUses??={};s.destinyUses[effect]=used+1;
  if(effect==='destinyMundane'){
   const oldHp=currentBoss().hp;
   s.mundaneGuardians=[...(s.mundaneGuardians||[]),guardian];
   if(s.stage===guardian&&s.phase==='battle'){
    const b=currentBoss(),hp=BigInt(s.bossHp);
    s.bossHp=(hp*b.hp/oldHp||1n).toString();
    s.countdown=Math.min(s.countdown,b.interval);
   }
   log(x.n+' · Chủ Tầng trở thành boss thường.');
  }else if(effect==='destinySkip'){
   s.stage=guardian;s.bossHp='0';s.phase='shop';s.marketPacks=[];
   log(x.n+' · vượt qua phần còn lại của Bí Cảnh.');
   save();nextBoss();return;
  }else{
   const b=currentBoss();
   s.bossHp='0';s.coins+=b.reward;s.hp=Math.min(s.max,s.hp+15);s.phase='shop';
   settleVictoryRelics(new Set());makeShop();
   log(x.n+' · kết liễu '+b.n+'.');
  }
 }
 save();render();resumePanel();
}
function migrateBigRoster() {
  if(s.rosterVersion>=2)return;
  // Keep modified cards and the old hand, and add the newly available realms.
  const existing=new Set(s.deck.map(c=>c.r+'-'+c.t+'-'+c.e));
  for(const h of heroCatalog) {
    if(h.r<2||existing.has(h.key))continue;
    const c={id:++s.uid,r:h.r,t:h.t,e:h.e,l:1,body:null};
    s.deck.push(c);
    s.draw.push(c.id);
  }
  s.draw=shuffle(s.draw);
  s.rosterVersion=2;
}

try{s=JSON.parse(localStorage.getItem('linhdao-v2'))}catch{}if(!s||s.version!==2||!s.deck)start(false);else{if(!Array.isArray(s.yaoOrder)||s.yaoOrder.length!==yaoNames.length)seedYao();migrateUpgradeNames();ensureExpansion();migrateRoster();migrateBigRoster();save();render();resumePanel()}
