/* Short synthesized effects, started only after player interaction. */
const soundPreference='linhdao-sound';
let gameSoundEnabled=true,audioContext;
try{gameSoundEnabled=localStorage.getItem(soundPreference)!=='off';}catch{}
function setGameSound(enabled){
 gameSoundEnabled=enabled;
 try{localStorage.setItem(soundPreference,enabled?'on':'off');}catch{}
 if(enabled)playGameSound('click');
}
const soundEffects={
 click:[['sine',620,440,.065,.075]],
 cast:[['triangle',180,620,.25,.11],['sine',320,900,.19,.07]],
 hit:[['triangle',125,38,.23,.19],['sine',740,290,.12,.085]],
 counter:[['triangle',92,31,.26,.22],['sine',460,95,.13,.065]]
};
function playGameSound(name){
 if(!gameSoundEnabled||document.hidden)return;
 const Audio=window.AudioContext||window.webkitAudioContext;
 if(!Audio)return;
 try{
  audioContext??=new Audio();
  if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
  const now=audioContext.currentTime;
  for(const [wave,from,to,length,volume] of soundEffects[name]){
   const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();
   oscillator.type=wave;
   oscillator.frequency.setValueAtTime(from,now);
   oscillator.frequency.exponentialRampToValueAtTime(to,now+length);
   gain.gain.setValueAtTime(.001,now);
   gain.gain.linearRampToValueAtTime(volume,now+.012);
   gain.gain.exponentialRampToValueAtTime(.001,now+length);
   oscillator.connect(gain);gain.connect(audioContext.destination);
   oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
   oscillator.start(now);oscillator.stop(now+length);
  }
 }catch{}
}
document.addEventListener('click',event=>{
 const button=event.target.closest('button');
 if(button&&!button.disabled&&button.id!=='attackBtn'&&button.getAttribute('onclick')!=='betaToggleSound()')playGameSound('click');
},true);
