const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-scaled-gap]').forEach(viewport=>{
 const fit=()=>{if(viewport.clientWidth>0)viewport.style.setProperty('--gap-preview-scale',String(viewport.clientWidth/1440));};
 fit();new ResizeObserver(fit).observe(viewport);
});
document.querySelectorAll('[data-scaled-co]').forEach(viewport=>{
 const fit=()=>{if(viewport.clientWidth>0)viewport.style.setProperty('--co-preview-scale',String(viewport.clientWidth/1280));};
 fit();new ResizeObserver(fit).observe(viewport);
});
const positionKey='portfolio-home-return-v1';
document.querySelectorAll('[data-case-link]').forEach(link=>link.addEventListener('click',()=>{try{sessionStorage.setItem(positionKey,JSON.stringify({y:scrollY,time:Date.now()}));}catch{}}));
document.querySelectorAll('[data-return]').forEach(link=>link.addEventListener('click',event=>{try{const saved=JSON.parse(sessionStorage.getItem(positionKey));if(saved&&Date.now()-saved.time<3600000){event.preventDefault();location.href='index.html?return=1';}}catch{}}));
if(new URLSearchParams(location.search).has('return')){try{const saved=JSON.parse(sessionStorage.getItem(positionKey));if(saved){history.scrollRestoration='manual';addEventListener('load',()=>{scrollTo({top:saved.y,behavior:'instant'});history.replaceState(null,'','index.html');},{once:true});}}catch{}}
const thinking=document.querySelector('[data-thinking]');let pauseThinking=()=>{};
function pauseOtherMedia(current){document.querySelectorAll('video').forEach(v=>{if(v!==current)v.pause();});if(current)pauseThinking();}
document.querySelectorAll('video').forEach(video=>{
 const error=video.closest('.film-shell')?.querySelector('.media-error');
 const showError=()=>{if(error)error.hidden=false;};
 video.addEventListener('error',showError);video.querySelectorAll('source').forEach(s=>s.addEventListener('error',showError));
 video.addEventListener('playing',()=>{if(error)error.hidden=true;const box=video.getBoundingClientRect();if(document.hidden||box.bottom<=0||box.top>=innerHeight){video.pause();return;}pauseOtherMedia(video);});
 new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)video.pause();},{threshold:.15}).observe(video);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
});
document.querySelectorAll('[data-preview]').forEach(preview=>{
 const shell=preview.closest('.film-shell');
 const previewSurface=shell.querySelector('[data-preview-surface]');
 if(previewSurface){
  const context=previewSurface.getContext('2d',{alpha:false});
  if(context){
   shell.classList.add('has-video-surface');
   let frameRequest=null,animationRequest=null;
   const draw=()=>{
    if(preview.readyState<2||!preview.videoWidth||!preview.videoHeight)return false;
    try{
     if(previewSurface.width!==preview.videoWidth||previewSurface.height!==preview.videoHeight){previewSurface.width=preview.videoWidth;previewSurface.height=preview.videoHeight;}
     context.drawImage(preview,0,0,previewSurface.width,previewSurface.height);
     previewSurface.dataset.painted='true';return true;
    }catch{return false;}
   };
   const stop=()=>{if(frameRequest!==null){preview.cancelVideoFrameCallback?.(frameRequest);frameRequest=null;}if(animationRequest!==null){cancelAnimationFrame(animationRequest);animationRequest=null;}};
   const tick=()=>{frameRequest=null;animationRequest=null;draw();if(preview.paused||preview.ended||document.hidden)return;if(preview.requestVideoFrameCallback)frameRequest=preview.requestVideoFrameCallback(tick);else animationRequest=requestAnimationFrame(tick);};
   const start=()=>{stop();tick();};
   preview.addEventListener('playing',start);
   // 没放起来之前不画：有的浏览器暂停在首帧时画出来是一整块黑，封面图一直留到真的开始播放
   preview.addEventListener('seeked',()=>{if(!preview.paused)start();});
   preview.addEventListener('pause',()=>{stop();draw();});
   preview.addEventListener('ended',()=>{stop();draw();});
   preview.addEventListener('error',()=>{stop();previewSurface.dataset.painted='false';});
   document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(!preview.paused)start();});
  }
 }
 const button=shell.querySelector('[data-play]');let visible=false,userPaused=false,ended=false,started=false;
 const sync=()=>{if(!button)return;button.textContent=preview.ended?'重新播放':preview.paused?'播放预览':'暂停预览';button.setAttribute('aria-label',button.textContent);};
 const play=()=>preview.play().then(()=>{started=true;sync();}).catch(sync);
 button?.addEventListener('click',()=>{if(preview.paused){userPaused=false;if(ended){preview.currentTime=0;ended=false;}play();}else{userPaused=true;preview.pause();}});
 preview.addEventListener('play',sync);preview.addEventListener('pause',sync);preview.addEventListener('ended',()=>{ended=true;sync();});
 const reconcile=()=>{if(!visible||document.hidden||document.querySelector('dialog[open]')){preview.pause();return;}if(!userPaused&&!ended&&(!reducedMotion.matches||started))play();};
 new IntersectionObserver(entries=>{visible=entries[0].intersectionRatio>=.45;reconcile();},{threshold:.45}).observe(shell);
 document.addEventListener('visibilitychange',reconcile);
 reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){userPaused=true;preview.pause();}});
});
document.querySelectorAll('[data-film-play]').forEach(button=>{
 const shell=button.closest('.film-shell'),film=shell.querySelector('video');
 film.addEventListener('play',()=>{film.controls=true;shell.classList.remove('is-idle');});
 button.addEventListener('click',()=>{film.controls=true;shell.classList.remove('is-idle');film.play().catch(()=>{});film.focus({preventScroll:true});});
});
const fullFilm=document.querySelector('.full-film');
document.querySelectorAll('[data-seek]').forEach(button=>button.addEventListener('click',()=>{if(!fullFilm)return;fullFilm.currentTime=Number(button.dataset.seek);fullFilm.play().catch(()=>{});fullFilm.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'center'});}));
const coDialog=document.querySelector('.prototype-dialog');
if(coDialog){let opener;document.querySelectorAll('[data-open-co]').forEach(button=>button.addEventListener('click',()=>{opener=button;const frame=coDialog.querySelector('iframe');if(!frame.getAttribute('src'))frame.src='co-thinker-showcase/index.html';pauseOtherMedia();pauseThinking();coDialog.showModal();document.body.style.overflow='hidden';}));coDialog.querySelector('[data-close-dialog]').addEventListener('click',()=>coDialog.close());coDialog.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus({preventScroll:true});});coDialog.addEventListener('click',e=>{if(e.target===coDialog)coDialog.close();});}
const imageDialog=document.querySelector('.image-dialog');
if(imageDialog){let opener;document.querySelectorAll('[data-expand-image]').forEach(button=>button.addEventListener('click',()=>{opener=button;const img=button.querySelector('img');imageDialog.querySelector('img').src=img.src;imageDialog.querySelector('img').alt=img.alt;imageDialog.querySelector('p').textContent=img.alt;pauseOtherMedia();pauseThinking();imageDialog.showModal();}));imageDialog.querySelector('[data-close-image]').addEventListener('click',()=>imageDialog.close());imageDialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));}
if(thinking){
 const frame=thinking.querySelector('[data-thinking-frame]'),pause=thinking.querySelector('[data-pause-thinking]');let loaded=false,inView=false,userPaused=reducedMotion.matches;
 // 直接双击打开（file://）时，每个文件各算一个来源，消息只能不指定来源地发
 const origin=location.protocol==='file:'?'*':location.origin;
 const send=type=>frame.contentWindow?.postMessage({source:'portfolio',type},origin);
 const reconcile=()=>{pause.textContent=userPaused?'播放演示':'暂停';if(!loaded)return;send(userPaused||!inView||document.hidden?'pause':'resume');};
 pauseThinking=()=>{if(loaded&&inView){userPaused=true;reconcile();}};
 frame.addEventListener('load',()=>{loaded=true;reconcile();});
 if(frame.contentDocument?.querySelector('#stage'))loaded=true;
 pause.addEventListener('click',()=>{userPaused=!userPaused;if(!userPaused)pauseOtherMedia();reconcile();});
 thinking.querySelector('[data-restart-thinking]').addEventListener('click',()=>{userPaused=false;pauseOtherMedia();send('restart');reconcile();});
 addEventListener('message',event=>{if((origin==='*'||event.origin===location.origin)&&event.source===frame.contentWindow&&event.data?.source==='thinking-showcase'&&event.data.type==='restart-request'){userPaused=false;send('restart');reconcile();}});
 new IntersectionObserver(entries=>{inView=entries[0].intersectionRatio>=.4;if(inView&&!userPaused)pauseOtherMedia();reconcile();},{threshold:.4}).observe(frame);
 document.addEventListener('visibilitychange',reconcile);
 reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){userPaused=true;reconcile();}});
 reconcile();
}
const gapShowcase=document.querySelector('[data-gap-showcase]');
if(gapShowcase){const tabs=[...gapShowcase.querySelectorAll('[data-gap-tab]')],open=gapShowcase.querySelector('[data-gap-open]');
 const select=tab=>{const scope=tab.dataset.gapTab==='scope';tabs.forEach(item=>{const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;});gapShowcase.querySelectorAll('[data-gap-panel]').forEach(panel=>{const selected=panel.dataset.gapPanel===tab.dataset.gapTab;panel.hidden=!selected;const frame=panel.querySelector('iframe');if(selected&&frame.dataset.src&&!frame.getAttribute('src'))frame.src=frame.dataset.src;});open.href=scope?'gap/module-responsibility-restructure.html':'gap/gap-prototype-review.html';open.textContent=scope?'独立打开需求梳理':'独立打开原型';gapShowcase.querySelector('.gap-viewer-foot>span').textContent=scope?'需求梳理 · 完整配图与交互':'桌面交互原型 · 示例内容';};
 tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>select(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight'||event.key==='ArrowLeft')next=tabs[(index+1)%tabs.length];if(event.key==='Home')next=tabs[0];if(event.key==='End')next=tabs.at(-1);if(next){event.preventDefault();select(next);next.focus();}});});
}
// 往下读时，标题、说明和图浮上来；首屏靠 CSS 动画，不在这里
const revealing=document.querySelectorAll('.work-head,.work-figures,.work-foot,.about,.case-outcome,.case-section .section-copy,.case-section figure,.gap-showcase,.case-note,.case-next,.site-footer');
if('IntersectionObserver' in window&&!reducedMotion.matches){
 const seen=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-in');seen.unobserve(entry.target);}}),{rootMargin:'0px 0px -8% 0px'});
 revealing.forEach(el=>{el.classList.add('reveal');seen.observe(el);});
}
