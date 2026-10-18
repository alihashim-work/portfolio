(function(){
var body=document.body;
var lb=document.getElementById('lb'),inn=document.getElementById('lbin'),x=document.getElementById('lbx'),last=null;
var framed=(function(){try{return window.self!==window.top}catch(e){return true}})();
function lbOpen(html,vert,src){inn.className='lb-in'+(vert?' vert':'');inn.innerHTML=html;lb.classList.add('on');x.focus();
 if(src&&src.getBoundingClientRect&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var s=src.getBoundingClientRect(),r=inn.getBoundingClientRect();if(r.width&&r.height){inn.classList.remove('zoom');inn.style.transform='translate('+(s.left-r.left)+'px,'+(s.top-r.top)+'px) scale('+(s.width/r.width).toFixed(4)+','+(s.height/r.height).toFixed(4)+')';void inn.offsetWidth;inn.classList.add('zoom');inn.style.transform='none'}}}
function lbClose(){lb.classList.remove('on');inn.innerHTML='';if(last)last.focus()}
window.__lbOpen=function(){return lb.classList.contains('on')};
window.__playYT=function(id,v){var url=v?'https://www.youtube.com/shorts/'+id:'https://youtu.be/'+id;if(framed){window.open(url,'_blank','noopener');return}last=null;lbOpen('<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="Video player" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe><a class="lb-link" href="'+url+'" target="_blank" rel="noopener">Open on YouTube</a>',v)};
x.addEventListener('click',lbClose);lb.addEventListener('click',function(e){if(e.target===lb)lbClose()});
document.addEventListener('keydown',function(e){if(e.key==='Tab'&&lb.classList.contains('on')){var fs=Array.from(lb.querySelectorAll('button,a,iframe'));var f=fs[0],l=fs[fs.length-1];if(e.shiftKey&&document.activeElement===f){e.preventDefault();l.focus()}else if(!e.shiftKey&&document.activeElement===l){e.preventDefault();f.focus()}}if(e.key==='Escape'&&lb.classList.contains('on')){lbClose();e.stopImmediatePropagation()}},true);
document.addEventListener('click',function(e){
 var p=e.target.closest('.poster');
 if(p){if(framed)return;e.preventDefault();last=p;var id=p.getAttribute('data-yt'),v=p.hasAttribute('data-short');
  lbOpen('<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="Video player" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe><a class="lb-link" href="'+p.href+'" target="_blank" rel="noopener">Open on YouTube</a>',v,p);return}
 var z=e.target.closest('.zoom');
 if(z){last=z;var im=z.querySelector('img');lbOpen('<img src="'+im.src+'" alt="'+im.alt.replace(/"/g,'&quot;')+'">',false,z)}
});
var chips=document.querySelectorAll('.chip'),rail=document.getElementById('rail');
chips.forEach(function(c){c.addEventListener('click',function(){chips.forEach(function(o){o.setAttribute('aria-pressed',o===c?'true':'false')});var k=c.getAttribute('data-t');rail.querySelectorAll('.poster').forEach(function(p){p.hidden=!(k==='all'||p.classList.contains('t'+k))});rail.scrollLeft=0})});

/* classic routing */
var pages=document.querySelectorAll('.page'),navs=document.querySelectorAll('[data-nav]');
window.__showPage=function(p){pages.forEach(function(s){s.hidden=s.getAttribute('data-page')!==p})};
function classicRoute(){if(!body.classList.contains('classic'))return;
 var h=location.hash.replace(/^#\/?/,''),parts=h.split('/'),p=parts[0]||'home',sub=parts[1];if(p==='tabeeb')p='films';
 if(!Array.from(pages).some(s=>s.dataset.page===p)){p='home';sub=null}
 window.__showPage(p);navs.forEach(function(a){if(a.getAttribute('data-nav')===p)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 var t=sub&&document.getElementById(sub);if(t)t.scrollIntoView();else window.scrollTo(0,0)}
window.__classicRoute=classicRoute;
window.addEventListener('hashchange',classicRoute);
function setClassic(on){document.getElementById('panel').removeAttribute('aria-modal');document.getElementById('panel').removeAttribute('role');body.classList.toggle('classic',on);body.classList.toggle('studio',!on);document.documentElement.classList.toggle('studio-html',!on);try{localStorage.setItem('ah-view',on?'classic':'studio')}catch(e){}
 if(on){if(window.Studio&&Studio.close)Studio.close(true);if(window.Studio)Studio.pause(true);classicRoute()}else{if(!window.Studio&&window.loadStudio)window.loadStudio();if(window.Studio){Studio.pause(false);if(!Studio.booted)Studio.boot();else Studio.sync()}}}
window.__setClassic=setClassic;
document.getElementById('toClassic').addEventListener('click',function(){setClassic(true)});
document.getElementById('toStudio').addEventListener('click',function(){setClassic(false)});
})();
