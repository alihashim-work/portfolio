window.__classicRoute();
const enter=document.getElementById('toStudio');enter.textContent='Explore 3D office';
let modulePromise;
window.loadStudio=()=>{
 if(modulePromise)return modulePromise;
 let canvas=document.createElement('canvas'),gl=canvas.getContext('webgl2');
 if(!gl){window.__setClassic(true);enter.textContent='3D unavailable on this browser';enter.disabled=true;return}
 gl.getExtension('WEBGL_lose_context')?.loseContext();canvas=null;gl=null;
 const timer=setTimeout(()=>{if(!window.Studio?.ready&&!document.body.classList.contains('classic'))window.__setClassic(true)},30000);
 modulePromise=import('./studio.js?v=3').catch(error=>{
  clearTimeout(timer);console.warn('Studio unavailable',error);window.__setClassic(true);enter.textContent='3D unavailable — portfolio ready';enter.disabled=true;
 });
 return modulePromise;
};
