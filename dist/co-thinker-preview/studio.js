// Scripted IM preview. Each send produces at most one pre-authored voice.
// Unscripted input never receives a pretend model response or enters the foundation.
const $ = id => document.getElementById(id);
const reading = $('reading');
let step = 0, view = 'conversation', conversationScroll = 0, quote = '', brief = null;
let followEnd = true, localSequence = 0, hasLocalInput = false;
let playingVoice = null, voiceFrame = null, pendingStep = null;
const escapeHTML = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rounds = [
  {
    user:'我想做一个记录灵感的工具。很多念头记下来了，过几天却不想再打开。',
    voice:'是不记得里面写了什么，还是记得，却觉得再打开也没什么用？',
    narrative:'我想做一个记录灵感的工具。现在的记录过几天就不想再打开，原因还需要想清楚。',
    known:'记录下来的念头没有自然地接回后续思考。',
    open:'是忘记了内容，还是记录没有保留下值得重看的东西？'
  },
  {
    user:'文字我记得，但忘了当时为什么激动。像这次，我只写了“灵感收集”。',
    voice:'“灵感收集”留下了结论，却没留下让你产生这个念头的那一刻。当时发生了什么？',
    narrative:'我记得写下的文字，却找不回当时为什么在意它。“灵感收集”这个标题没有留下念头的来由。',
    known:'需要找回的包含想法产生时的联系，不能只看标题本身。',
    open:'当时发生了什么？记录时遗漏了哪一部分？'
  },
  {
    user:'我刚和朋友聊完，几个想法串起来了。想赶紧记下，软件却一直让我先分类。',
    voice:'那一刻你还在顺着联想往下走，分类却要求你先停下来判断。把整理留到说完以后，会不会更合适？',
    narrative:'我想先留下几个想法串起来的过程。表达正在展开时，分类会打断我。',
    known:'记录应该容纳还没有组织好的表达。',
    open:'“说完以后再整理”是刚提出的方向，还没有确定具体方式。'
  },
  {
    user:'对，先让我说完。过后整理可以，但我通常不会主动回去看。',
    voice:'那只把整理往后放，还不能解决回看的问题。你希望旧想法主动来提醒，还是在你打开工具的时候再出现？',
    narrative:'我想先把思路说完，再整理内容。但把整理推后还不够，因为我通常不会主动回看。',
    known:'表达和整理分开；还需要让旧想法重新进入视野的机会。',
    open:'主动提醒，还是主动打开时遇见？'
  },
  {
    user:'别提醒。我打开的时候偶尔看到就好，也别替我判断哪个想法值得继续。',
    voice:'那“重新出现”就不等于“需要处理”：看到了可以接着想，也可以略过，不产生一件欠着的事。',
    narrative:'我希望主动打开时偶尔遇见旧想法，不要通知催促，也不让系统预先判断哪个想法值得继续。',
    known:'是否继续由我决定。回访不应变成待办。',
    open:'一次带回多少、怎样选择出现时机，仍未确定。'
  },
  {
    user:'对，就是这种偶然又接上了的感觉。都留着，不用每次都带回很多。',
    voice:'可以先试每次只带回一个，连同当时留下的几句话一起出现。这样检验的是能不能重新接上思路，而不只是有没有被看见。',
    narrative:'我想保留想法及其来由，先表达、后整理。主动打开时可以偶然遇见旧记录，接着想或略过都可以。',
    known:'保留全部记录；不通知、不催办、不替我判断价值；每次回访不带回很多。',
    open:'“每次一个并带上当时的几句话”是待验证的提议，尚未作为确定方案。'
  }
];
function atEnd(){return reading.scrollHeight-reading.clientHeight-reading.scrollTop<8;}
function scrollToEnd(){reading.scrollTop=reading.scrollHeight;followEnd=true;}
function revealMessage(element){
  if(!element)return;
  const viewport=reading.getBoundingClientRect(),box=element.getBoundingClientRect();
  const top=viewport.top+20,bottom=viewport.bottom-40;
  if(box.height>bottom-top||box.top<top)reading.scrollTop+=box.top-top;
  else if(box.bottom>bottom)reading.scrollTop+=box.bottom-bottom;
  followEnd=atEnd();
}
// Reflow is not a user decision to stop following the latest voice.
// Track geometry as well as scroll position: composer resizing and line wrapping
// can dispatch scroll before ResizeObserver. Preserve intent through either order.
const readingGeometry=()=>[reading.clientWidth,reading.clientHeight,reading.scrollHeight].join(':');
let lastReadingGeometry='';
function reconcileReading(){
  const geometry=readingGeometry();
  if(geometry===lastReadingGeometry)return;
  lastReadingGeometry=geometry;
  document.documentElement.style.setProperty('--scroll-inset',Math.max(0,(reading.offsetWidth-reading.clientWidth)/2)+'px');
  if(view==='conversation'&&followEnd)scrollToEnd();
}
reading.addEventListener('scroll',()=>{
  if(readingGeometry()!==lastReadingGeometry){reconcileReading();return;}
  followEnd=atEnd();
},{passive:true});
const readingObserver=new ResizeObserver(reconcileReading);
readingObserver.observe(reading);
readingObserver.observe($('messages'));
function message(id,role,text,quoted=''){
  const article=document.createElement('article');
  article.id=id;article.className='message '+role;
  const body=document.createElement('div');body.className='message-body';
  if(quoted){const block=document.createElement('blockquote');block.className='message-source';block.textContent=quoted;body.append(block);}
  const prose=document.createElement('p');prose.textContent=text;prose.style.whiteSpace='pre-wrap';body.append(prose);article.append(body);
  const actions=document.createElement('div');actions.className='message-actions';
  const button=document.createElement('button');button.className='quote-action';button.innerHTML='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 5-4 4 4 4M4 9h7a5 5 0 0 1 5 5v1"/></svg>';button.title='引用这段内容';button.setAttribute('aria-label','引用这段内容');button.addEventListener('click',()=>setQuote(prose.textContent));actions.append(button);article.append(actions);
  $('messages').append(article);
  return article;
}
function refreshSampleControl(){
  const end=step===rounds.length-1;
  $('advance').disabled=end||hasLocalInput||!!playingVoice;
  $('advance').textContent=hasLocalInput?'预设接续已暂停':playingVoice?'示例回应播放中':end?'示例结束':'填入下一句示例 →';
}
function updateComposer(){
  const filled=!!$('draft').value.trim();
  $('send').disabled=!filled;
  $('send').setAttribute('aria-label',playingVoice&&filled?'发送补充并停止当前示例回应':'发送内容');
  $('send').title=playingVoice&&filled?'发送补充，停止当前示例回应':'发送 · Enter；Shift + Enter 换行';
  $('sampleState').textContent='未连接模型';
  $('previewState').textContent=playingVoice?'正在播放预设回应，仍可输入并发送补充。':'此页面使用预设对话，输入不会发送给模型。';
}
function stopVoice(){
  if(!playingVoice)return false;
  cancelAnimationFrame(voiceFrame);
  playingVoice.article.classList.add('is-interrupted');
  playingVoice.article.querySelector('.voice-cursor')?.remove();
  playingVoice.article.setAttribute('aria-busy','false');
  playingVoice=null;pendingStep=null;voiceFrame=null;
  refreshSampleControl();updateComposer();return true;
}
function playVoice(index){
  // This is a visible playback of fixed example text, never a model request.
  const article=message('a'+index,'assistant','');
  const prose=article.querySelector('p');const textNode=document.createTextNode('');
  const cursor=document.createElement('span');cursor.className='voice-cursor';cursor.setAttribute('aria-hidden','true');
  prose.append(textNode,cursor);article.setAttribute('aria-busy','true');
  const chars=Array.from(rounds[index].voice);
  playingVoice={article,prose,index};pendingStep=index;refreshSampleControl();updateComposer();
  let started=null;
  function draw(time){
    if(!playingVoice||playingVoice.article!==article)return;
    if(started===null)started=time;
    const count=Math.min(chars.length,Math.max(1,Math.floor((time-started)*.035)));
    textNode.textContent=chars.slice(0,count).join('');
    if(view==='conversation'&&followEnd)scrollToEnd();
    if(count<chars.length){voiceFrame=requestAnimationFrame(draw);return;}
    cursor.remove();article.setAttribute('aria-busy','false');
    step=index;playingVoice=null;pendingStep=null;voiceFrame=null;
    updateFoundation();refreshSampleControl();updateComposer();
  }
  voiceFrame=requestAnimationFrame(draw);
}
function updateFoundation(){
  const f=rounds[step];
  // No recurring frontstage summary: the actual narrative is opened intentionally.
  $('foundationNarrative').textContent=f.narrative;
  $('foundationDetails').innerHTML='<section class="foundation-open"><h2>还在推敲</h2><p>'+escapeHTML(f.open)+'</p></section><details class="foundation-evidence"><summary>来源与判断依据</summary><p>'+escapeHTML(f.known)+'</p><button class="source-link">回到这处表达 ↗</button></details>';
  $('foundationDetails').querySelector('button').addEventListener('click',()=>returnToSource('u'+step));
  if(brief&&step>brief.step)$('snapshotNote').textContent='讨论有了新内容。这份手稿保留形成时的理解。';
}
function showView(name){
  if(view==='conversation')conversationScroll=reading.scrollTop;
  view=name;
  $('conversation').hidden=name!=='conversation';$('foundationView').hidden=name!=='foundation';$('manuscriptView').hidden=name!=='manuscript';
  $('foundationToggle').setAttribute('aria-pressed',String(name==='foundation'));
  reading.scrollTop=name==='conversation'?conversationScroll:0;
  followEnd=atEnd();
  if(name==='foundation')$('foundationTitle').focus({preventScroll:true});
  else if(name==='manuscript')$('manuscriptTitle').focus({preventScroll:true});
}
function returnToSource(id){showView('conversation');requestAnimationFrame(()=>{const target=$(id);if(target){revealMessage(target);target.classList.remove('source-highlight');void target.offsetWidth;target.classList.add('source-highlight');}});}
function setQuote(text){quote=text;$('quoteText').textContent=text;$('quoteComposer').hidden=false;resizeDraft();$('draft').focus({preventScroll:true});}
function clearQuote(){quote='';$('quoteComposer').hidden=true;resizeDraft();}
function notice(text){$('localNotice').textContent=text;$('localNotice').hidden=false;}
function prepareNext(){
  if(playingVoice||step>=rounds.length-1)return;
  if($('draft').value.trim()){
    if($('draft').value.trim()!==rounds[step+1].user)notice('输入中已有内容，已保留。清空后可填入下一句示例。');
    $('draft').focus({preventScroll:true});return;
  }
  if(view!=='conversation')showView('conversation');
  $('previewTools').open=false;clearQuote();$('draft').value=rounds[step+1].user;resizeDraft();$('draft').focus({preventScroll:true});
}
function resizeDraft(event){
  const el=$('draft'),position=el.scrollTop;
  const style=getComputedStyle(el);
  const minimum=parseFloat(style.minHeight),maximum=parseFloat(style.maxHeight);
  const line=parseFloat(style.lineHeight),padding=parseFloat(style.paddingTop)+parseFloat(style.paddingBottom);
  el.style.height=minimum+'px';
  const limit=Math.max(minimum,Math.floor((maximum-padding)/line)*line+padding);
  el.style.height=Math.max(minimum,Math.min(el.scrollHeight,limit))+'px';
  const typingAtEnd=event?.type==='input'&&document.activeElement===el&&el.selectionStart===el.selectionEnd&&el.selectionEnd===el.value.length;
  el.scrollTop=typingAtEnd?el.scrollHeight:position;updateComposer();
}
window.addEventListener('resize',resizeDraft);
let composeWidth=0;
new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(Math.abs(width-composeWidth)>1){composeWidth=width;resizeDraft();}}).observe($('draft'));
function send(){
  const text=$('draft').value.trim();if(!text)return;
  if(view!=='conversation')showView('conversation');
  const next=rounds[step+1];
  const interrupted=stopVoice();
  const scripted=!!next&&!quote&&!hasLocalInput&&!interrupted&&text===next.user;
  if(scripted){message('u'+(step+1),'user',text);playVoice(step+1);$('localNotice').hidden=true;}
  else{hasLocalInput=true;message('local-'+(++localSequence),'user',text,quote);notice('内容保留在这份样张中。未连接模型，不会生成回复；重新开始可回到预设讨论。');}
  $('draft').value='';clearQuote();resizeDraft();refreshSampleControl();
  requestAnimationFrame(scrollToEnd);$('draft').focus({preventScroll:true});
}
function reset(){
  stopVoice();
  $('previewTools').open=false;
  step=0;brief=null;quote='';conversationScroll=0;hasLocalInput=false;localSequence=0;
  $('messages').replaceChildren();message('u0','user',rounds[0].user);message('a0','assistant',rounds[0].voice);
  $('draft').value='';clearQuote();resizeDraft();$('localNotice').hidden=true;
  $('history').hidden=true;$('historyToggle').setAttribute('aria-expanded','false');
  updateFoundation();refreshSampleControl();showView('conversation');requestAnimationFrame(scrollToEnd);
}
function buildBrief(){
  const f=rounds[step];
  const body='<p>'+escapeHTML(f.narrative)+'</p><h2>已经形成的判断</h2><p>'+escapeHTML(f.known)+'</p><h2>还需要推敲</h2><p>'+escapeHTML(f.open)+'</p>';
  brief={step,body};$('manuscriptBody').innerHTML=body;$('snapshotNote').textContent='这份手稿保留当前理解，后续讨论不会自动改写此版本。';showView('manuscript');
}
function markdown(){return '# 灵感的记录与回访\n\n'+$('manuscriptBody').innerText+'\n\n---\nCo-Thinker · 预设讨论样稿';}
$('advance').addEventListener('click',prepareNext);$('reset').addEventListener('click',reset);
$('foundationToggle').addEventListener('click',()=>showView(view==='foundation'?'conversation':'foundation'));
document.querySelectorAll('[data-back]').forEach(button=>button.addEventListener('click',()=>{showView('conversation');$('foundationToggle').focus({preventScroll:true});}));
$('makeManuscript').addEventListener('click',buildBrief);$('draft').addEventListener('input',resizeDraft);
document.querySelector('.compose-box').addEventListener('click',event=>{if(event.target.matches('.compose-box,.compose-row'))$('draft').focus({preventScroll:true});});
$('draft').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();send();}});
$('send').addEventListener('click',send);$('clearQuote').addEventListener('click',()=>{clearQuote();$('draft').focus({preventScroll:true});});
$('copyBrief').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(markdown());$('copyBrief').textContent='已复制';setTimeout(()=>$('copyBrief').textContent='复制',1600);}catch{$('copyBrief').textContent='请选中文字复制';}});
$('downloadBrief').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([markdown()],{type:'text/markdown;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='Co-Thinker_灵感的记录与回访_示例.md';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
function closeHistory(){$('history').hidden=true;$('historyToggle').setAttribute('aria-expanded','false');$('historyToggle').focus({preventScroll:true});}
$('historyToggle').addEventListener('click',()=>{const open=$('history').hidden;$('history').hidden=!open;$('historyToggle').setAttribute('aria-expanded',String(open));if(open)$('historyClose').focus({preventScroll:true});});
$('historyClose').addEventListener('click',closeHistory);$('currentSession').addEventListener('click',closeHistory);
document.addEventListener('keydown',event=>{if(event.key==='Escape'){if($('previewTools').open){$('previewTools').open=false;$('previewTools').querySelector('summary').focus({preventScroll:true});}else if(!$('history').hidden)closeHistory();else if(view!=='conversation'){showView('conversation');$('foundationToggle').focus({preventScroll:true});}else if(quote){clearQuote();$('draft').focus({preventScroll:true});}}});
document.addEventListener('pointerdown',event=>{if($('previewTools').open&&!$('previewTools').contains(event.target))$('previewTools').open=false;});
document.addEventListener('focusin',event=>{if($('previewTools').open&&!$('previewTools').contains(event.target))$('previewTools').open=false;});
reset();
