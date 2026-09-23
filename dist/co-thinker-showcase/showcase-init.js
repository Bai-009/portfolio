// Open the existing scripted discussion at its third completed turn.
// All messages, foundation updates, and interactions come from the source sample.
stopVoice();
$('messages').replaceChildren();
step=2;
for(let i=0;i<=step;i++){
  message('u'+i,'user',rounds[i].user);
  message('a'+i,'assistant',rounds[i].voice);
}
updateFoundation();refreshSampleControl();updateComposer();
requestAnimationFrame(()=>{reading.scrollTop=0;followEnd=false;});
