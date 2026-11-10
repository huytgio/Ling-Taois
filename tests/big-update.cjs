const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const nodes={};
const ctx={localStorage:{getItem(){},setItem(){}},document:{
  getElementById:id=>nodes[id]??={style:{},classList:{add(){},remove(){}}},
  querySelectorAll:()=>[]
},setTimeout(){},clearTimeout(){}};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../dist/game.js'),'utf8'),ctx);
const run=js=>vm.runInContext(js,ctx);

assert.equal(run('s.deck.length'),550);
assert.equal(run('s.hand.length'),8);
assert.equal(run('new Set(s.deck.map(c=>c.r+"-"+c.e+"-"+c.t)).size'),550);
run("s.phase='shop';s.stage=4;s.hp=61;nextBoss()");
assert.equal(run('s.max'),125);
assert.equal(run('s.hp'),86);
run("s.phase='shop';nextBoss()");
assert.equal(run('s.max'),125);
run("start();applyTraining(L[trainingTracks.chainAdd.id]);applyTraining(L[trainingTracks.chainAdd.id]);applyTraining(L[trainingTracks.chainMult.id])");
assert.equal(run("chainLedger('single').add"),24);
assert.equal(run("chainLedger('single').mult"),1.1);

run("start();const slot=destinies[0];[16,17,18,19,20,slot].forEach(id=>acquireRelic(id))");
assert.equal(run('relicCap()'),6);
run("acquireRelic(slot);acquireRelic(21)");
assert.equal(run('removeRelic(slot)'),false);
run('acquireRelic(slot)');
assert.equal(run('relicCap()'),8);
assert.equal(run('acquireRelic(slot)'),false);
run('s.j=[16,destinies[4],destinies[5]];selected=[s.hand[0]]');
assert(run("calc(chosen()).damage===Math.floor((ownAttack(chosen()[0])+5)*4+200)"));
run("s.j=[reviveRelic];s.hp=0;recoverFatalHit(new Set())");
assert.equal(run('s.hp'),25);
assert.equal(run('s.j.length'),0);

run("start();s.stage=4;s.j=[purgeRelic];sellUpgrade('Cơ Duyên',0,true,purgeRelic,true)");
assert.equal(run('currentBoss().curse'),null);
run('s.stage=9');
assert(run('!!currentBoss().curse'));
run("start();s.phase='shop';s.j=[wealthRelic];settleVictoryRelics(new Set())");
assert.equal(run('relicSellValue(J[wealthRelic])'),7);

run("start();selected=s.hand.slice(0,2);let before=chosen().map(c=>c.r);s.tarots=[T.find(x=>x.effect==='swapr').id];useTarot(0)");
assert(run('card(s.hand[0]).r===before[1]&&card(s.hand[1]).r===before[0]'));
run("selected=s.hand.slice(0,2);s.tarots=[T.find(x=>x.effect==='sellScroll').id];useTarot(0);s.phase='shop';openFreePack('Tầm Pháp')");
assert.equal(run('s.deck.length'),548);
assert.equal(run("s.openPack.kind"),'Tầm Pháp');
run("start();s.j=[16];s.tarots=[T.find(x=>x.effect==='destinyChosen').id];Math.random=()=>0;useTarot(0,true,16)");
assert(run('J[s.j[0]].destiny&&s.tarots.length===0'));
run("s.j=[16];s.tarots=[T.find(x=>x.effect==='destinyRandom').id];Math.random=()=>.99;useTarot(0)");
assert(run('s.j[0]===16&&s.tarots.length===0'));
console.log('PASS: starting roster, floor HP, stacking, Destiny slots and score, revival, curse sale, sale value, card swapping, free packs, conversion success and failure.');

run(`start();
s.deck=[{id:1,t:0,e:0,r:0,body:null},{id:2,t:1,e:1,r:1,body:2},{id:3,t:2,e:2,r:2,body:null}];
s.hand=[];s.draw=[1,2,3];s.grave=[];
`);
assert.equal(run('drawBiasWeights()'),null);
for(const attr of ['t','e','r','body'])run(`applyTraining(drawBiasUpgrades.find(x=>x.attr==='${attr}'&&x.target===${attr==='body'?0:1}))`);
assert.equal(run('drawBiasWeights().get(1)'),1);
assert.equal(run('drawBiasWeights().get(2)'),2.4);
assert.equal(run('drawBiasWeights().get(3)'),1);
assert.equal(run('Math.random=()=>.25;takeDrawCard(drawBiasWeights())'),2);
assert.equal(run('s.draw.length'),2);
run('s.hand=[2];draw()');
assert.equal(run('new Set(s.hand).size'),3);
console.log('PASS: weighted draws, four bias types stack, cards drawn without replacement.');

run("start();let packId=J.find(x=>x.effect==='destinyScroll').id;s.j=[16,packId];Math.random=()=>.10;settleDestiny(new Set([16]))");
assert.equal(run("s.freePacks?.['Tầm Pháp']||0"),0);
run("acquireRelic(packId);settleDestiny(new Set([16]))");
assert.equal(run("s.freePacks['Tầm Pháp']"),1);
assert.match(run("relicUpgradePreview(packId)"),/15%.*20%/s);
run("s.j=[16];s.tarots=[T.find(x=>x.effect==='destinyChosen').id];Math.random=()=>.20;useTarot(0,true,16)");
assert(run('s.j[0]===16&&s.tarots.length===0'));
run("s.relicMerges[16]=1;s.tarots=[T.find(x=>x.effect==='destinyChosen').id];useTarot(0,true,16)");
assert(run('J[s.j[0]].destiny&&relicLevel(s.j[0])===1'));
run("let sacrifice=J.find(x=>x.effect==='sacrificeRandom').id;s.j=[16,sacrifice];sacrificeRelic(sacrifice)");
assert.equal(run('s.j.length'),2);
run('sacrificeRelic(sacrifice,true)');
assert(run('s.j.length===1&&s.j[0]===sacrifice&&relicLevel(sacrifice)===2'));

run("start();let destinyId=effect=>J.find(x=>x.effect===effect).id;let chosenSac=destinyId('sacrificeChosen');s.j=[chosenSac,16,17];resumePanel()");
assert.match(run('$("modal").innerHTML'),/Đầu trận/);
run('Math.random=()=>.50;sacrificeRelic(chosenSac,16)');
assert(run('!s.j.includes(16)&&relicLevel(chosenSac)===1&&pendingSacrifice()===null'));
run("s.stage++;s.j.push(destinyId('destinyLuck'));Math.random=()=>.55;sacrificeRelic(chosenSac,17)");
assert(run('!s.j.includes(17)&&relicLevel(chosenSac)===2&&upgradeOdds(25)===35'));
run("selected=[s.hand[0]]");
assert.equal(run("calc(chosen()).finalFactors.find(x=>x.name.includes('Hiến Tế')).value"),1.2);
run("s.stage++;sacrificeRelic(chosenSac,false)");
assert(run('s.j.length===2&&pendingSacrifice()===null'));

run("start();let rerollId=destinyId('destinyReroll');let slotId=destinyId('slots');s.j=[rerollId,slotId,16,17,18,19,20,21];s.relicMerges[slotId]=2;s.relicGrades={[16]:4};let grades=s.j.map(id=>Math.min(4,itemGrade(J[id])+1));useDestiny(rerollId,true)");
assert(run("s.j.length===8&&new Set(s.j).size===8&&s.j.every((id,i)=>!!J[id].destiny===(i<2))&&relicCap()===8&&s.coins===15"));
assert.equal(run('JSON.stringify(s.j.map(id=>itemGrade(J[id])))'),run('JSON.stringify(grades)'));

run("start();let skipId=destinyId('destinySkip');s.j=[skipId];useDestiny(skipId,true)");
assert(run("s.stage===5&&s.phase==='battle'&&s.max===125&&!s.j.includes(skipId)&&s.destinyUses.destinySkip===1"));
run("s.j=[skipId];s.destinyUses.destinySkip=2;useDestiny(skipId,true)");
assert(run('s.stage===5&&s.j.includes(skipId)'));
run("start();let mundaneId=destinyId('destinyMundane');s.j=[mundaneId];s.stage=4;s.bossHp='375';useDestiny(mundaneId,true)");
assert(run("!currentBoss().guardian&&!currentBoss().curse&&s.bossHp==='240'&&s.destinyUses.destinyMundane===1"));
run("let slayId=destinyId('destinySlay');s.j=[slayId];useDestiny(slayId,true)");
assert(run("s.phase==='shop'&&s.bossHp==='0'&&s.destinyUses.destinySlay===1"));

run("start();let repeatId=destinyId('destinyRepeat');s.j=[repeatId];selected=[s.hand[0]];s.bossHp='99999';let primary=calc(chosen()).damage;Math.random=()=>.24;attack()");
assert(run("s.bossHits===2&&BigInt(s.bossHp)===99999n-BigInt(primary+Math.floor(primary*.8))"));
