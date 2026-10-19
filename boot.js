window.__classicRoute();
const enter=document.getElementById('toStudio');enter.textContent='Explore 3D office';
let modulePromise;
window.loadStudio=()=>{
 if(modulePromise)return modulePromise;
 let canvas=document.createElement('canvas'),gl=canvas.getContext('webgl2');
 if(!gl){window.__setClassic(true);enter.textContent='3D unavailable on this browser';enter.disabled=true;return}
 gl.getExtension('WEBGL_lose_context')?.loseContext();canvas=null;gl=null;
 const timer=setTimeout(()=>{if(!window.Studio?.ready&&!document.body.classList.contains('classic'))window.__setClassic(true)},30000);
 modulePromise=import('./studio.js?v=5').catch(error=>{
  clearTimeout(timer);console.warn('Studio unavailable',error);window.__setClassic(true);enter.textContent='3D unavailable, portfolio ready';enter.disabled=true;
 });
 return modulePromise;
};

// Full Urdu font only when a page actually needs it (the hero line uses a tiny subset)
window.needUrdu=function(){if(document.getElementById('furdu'))return;var l=document.createElement('link');l.id='furdu';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;600&display=swap';document.head.appendChild(l)};
function urduCheck(){if(/^#\/?scripts/.test(location.hash))window.needUrdu()}
addEventListener('hashchange',urduCheck);urduCheck();
// After the page has loaded and gone quiet, fetch only what the first 3D frame needs (about 300 KB)
addEventListener('load',function(){(window.requestIdleCallback||function(f){setTimeout(f,2000)})(function(){
 var c=navigator.connection;if(c&&(c.saveData||/2g/.test(c.effectiveType||'')))return;
 var A=window.ASSETS||{},list=['https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.min.js','js/studio.js?v=5',A.shell,A.shell&&A.shell.replace(/\.json$/,'.bin'),A.hdr,A.ext].concat(Object.values(A.tex||{}));
 list.filter(Boolean).forEach(function(h){var l=document.createElement('link');l.rel='prefetch';l.href=h;if(/^https:/.test(h))l.crossOrigin='anonymous';document.head.appendChild(l)});
},{timeout:4000})});
