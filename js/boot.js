window.__classicRoute();
let preferClassic=false;
try{preferClassic=localStorage.getItem('ah-view')==='classic'}catch(e){}
const graphics=()=>{try{return !!document.createElement('canvas').getContext('webgl2')}catch(e){return false}};
let modulePromise;
window.loadStudio=()=>modulePromise||(modulePromise=import('./studio.js?v=2').catch(error=>{
 console.warn('Studio unavailable',error);window.__setClassic(true);
 const button=document.getElementById('toStudio');button.textContent='3D unavailable — portfolio ready';button.disabled=true;
}));
if(graphics()){
 if(!preferClassic){document.body.className='studio';window.loadStudio()}
}else{document.getElementById('toStudio').textContent='3D unavailable on this browser';document.getElementById('toStudio').disabled=true}

setTimeout(()=>{if(!document.body.classList.contains('classic')&&(!window.Studio||!window.Studio.ready)){window.__setClassic(true)}},30000);
