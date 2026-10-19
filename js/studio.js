import * as THREE from 'three';
window.THREE=THREE;
// Heavy extras load only after the room is on screen
window.FXP=()=>Promise.all([import('three/addons/postprocessing/EffectComposer.js'),import('three/addons/postprocessing/RenderPass.js'),import('three/addons/postprocessing/GTAOPass.js'),import('three/addons/postprocessing/UnrealBloomPass.js'),import('three/addons/postprocessing/ShaderPass.js'),import('three/addons/postprocessing/OutputPass.js')]).then(([a,b,c,d,e,f])=>{window.FX={EffectComposer:a.EffectComposer,RenderPass:b.RenderPass,GTAOPass:c.GTAOPass,UnrealBloomPass:d.UnrealBloomPass,ShaderPass:e.ShaderPass,OutputPass:f.OutputPass}});
window.RALP=()=>import('three/addons/lights/RectAreaLightUniformsLib.js');
const fetchJSON=u=>fetch(u).then(r=>{if(!r.ok)throw new Error(u);return r.json()});
window.__loadPack=async u=>{const j=await fetchJSON(u);if(j.bin){const buf=await fetch(u.slice(0,-5)+'.bin').then(r=>{if(!r.ok)throw new Error(u);return r.arrayBuffer()});(j.meshes||[]).forEach(me=>['p','n','u','b','i'].forEach(k=>{if(Array.isArray(me[k]))me[k]=buf.slice(me[k][0],me[k][0]+me[k][1])}))}return j};
window.DATA=window.DATA||{};
(function(){
var body=document.body,html=document.documentElement;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var STOPS=['home','campaigns','films','statics','scripts','clients','about','contact'];
var LABEL={home:'Studio',campaigns:'Campaigns',films:'Films',statics:'Statics',scripts:'Scripts',clients:'Clients',about:'About',contact:'Contact'};
var LINES={campaigns:'Six campaigns pinned to the corkboard, from family planning policy to a Black Dragon for Telenor.',films:'The curtains draw, the 16mm projector rolls, and every film plays on the six-metre screen.',statics:'Key visuals, social and outdoor, framed on the gallery wall.',scripts:'Words written to be heard. Film scripts and campaign verse in Urdu and English, on the whiteboard.',clients:'Brands, institutions and causes, clipped to the board on the desk.',about:'Every role I’ve held, pinned to one board and tied together with a ribbon.',contact:'Pick up the red phone by the door. Open to creative leadership roles and select projects.'};
var SEG=1.15;
var loadEl=document.getElementById('load'),loadbar=document.getElementById('loadbar'),loading=document.getElementById('loading'),tip=document.getElementById('tip'),titles=document.getElementById('titles'),scroller=document.getElementById('scroller'),panel=document.getElementById('panel'),scrim=document.getElementById('scrim'),where=document.getElementById('where');
var pref=null;try{pref=localStorage.getItem('ah-view')}catch(e){}
function webglOK(){try{var c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl')))}catch(e){return false}}
var S=window.Studio={ready:false,booted:false,pause:function(){},close:function(){},sync:function(){}};
if(typeof THREE==='undefined'||!webglOK()||!window.ASSETS){window.__setClassic(true);return}
var T=THREE;
var free=false,renderer,scene,camera,clock,running=true,hot=[],screenMat,screenTex=[],anchors={},stopObj={},progress=0,target=0,sheetOpen=null,fovBase=50,fovNow=50,fovTarget=50;
function setLoad(t,f){if(loadEl)loadEl.textContent=t;if(loadbar)loadbar.style.width=Math.round(f*100)+'%'}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function cvs(w,h){var c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')]}
function tex(c,rep,lin){var t=new T.CanvasTexture(c);if(!lin)t.colorSpace=T.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());if(rep){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rep[0],rep[1])}return t}
function speckle(x,w,h,n,r,cols,size){for(var i=0;i<n;i++){x.fillStyle=cols[(r()*cols.length)|0];var s=(size||1.4)*r()+.4;x.globalAlpha=.04+r()*.12;x.fillRect(r()*w,r()*h,s,s)}x.globalAlpha=1}
function blotch(x,w,h,n,r,col,max){for(var i=0;i<n;i++){var cx=r()*w,cy=r()*h,rad=20+r()*(max||160);var g=x.createRadialGradient(cx,cy,0,cx,cy,rad);g.addColorStop(0,col.replace('A',(.03+r()*.05).toFixed(3)));g.addColorStop(1,col.replace('A','0'));x.fillStyle=g;x.fillRect(cx-rad,cy-rad,rad*2,rad*2)}}

function woodCanvas(w,h,base,dark,seed,rows,seams){var a=cvs(w,h),c=a[0],x=a[1],r=mulberry(seed);x.fillStyle=base;x.fillRect(0,0,w,h);var ph=h/rows;
 for(var p=0;p<rows;p++){var y0=p*ph;x.fillStyle='rgba(0,0,0,'+(r()*.16).toFixed(3)+')';x.fillRect(0,y0,w,ph);x.fillStyle='rgba(255,220,170,'+(r()*.06).toFixed(3)+')';x.fillRect(0,y0,w,ph);
  for(var i=0;i<ph*1.1;i++){var y=y0+r()*ph;x.strokeStyle='rgba('+dark+','+(.03+r()*.11).toFixed(3)+')';x.lineWidth=.5+r()*1.8;x.beginPath();var amp=1+r()*5,fr=.002+r()*.012,ph2=r()*6;for(var X=0;X<=w;X+=12){var Y=y+Math.sin(X*fr+ph2)*amp+Math.sin(X*fr*3.1)*amp*.3;if(Y<y0||Y>y0+ph)Y=Math.max(y0,Math.min(y0+ph,Y));X?x.lineTo(X,Y):x.moveTo(X,Y)}x.stroke()}
  for(var k=0;k<2;k++){if(r()<.35){var kx=r()*w,ky=y0+ph*(.2+r()*.6);var g=x.createRadialGradient(kx,ky,0,kx,ky,10+r()*14);g.addColorStop(0,'rgba('+dark+',.55)');g.addColorStop(1,'rgba('+dark+',0)');x.fillStyle=g;x.beginPath();x.ellipse(kx,ky,26,9,0,0,7);x.fill()}}
  if(seams){x.fillStyle='rgba(15,8,3,.7)';x.fillRect(0,y0,w,2);var j=(r()*w)|0;x.fillRect(j,y0,2,ph);if(r()<.5){x.fillRect((j+w/2)%w,y0,2,ph)}}}
 return c}
function plasterCanvas(w,h,base,seed){var a=cvs(w,h),c=a[0],x=a[1],r=mulberry(seed);x.fillStyle=base;x.fillRect(0,0,w,h);blotch(x,w,h,140,r,'rgba(90,70,40,A)',220);blotch(x,w,h,80,r,'rgba(255,250,235,A)',180);speckle(x,w,h,26000,r,['#000','#fff','#6b5a40'],1.2);return c}
function corkCanvas(w,h,seed){var a=cvs(w,h),c=a[0],x=a[1],r=mulberry(seed);x.fillStyle='#a8784a';x.fillRect(0,0,w,h);var cols=['#7a5230','#c4935e','#5e3e22','#d7a873','#8d6038'];for(var i=0;i<52000;i++){x.fillStyle=cols[(r()*cols.length)|0];x.globalAlpha=.25+r()*.5;var s=1+r()*3.2;x.beginPath();x.arc(r()*w,r()*h,s/2,0,7);x.fill()}x.globalAlpha=1;blotch(x,w,h,40,r,'rgba(40,20,5,A)',200);return c}
function paperNoise(x,w,h,seed){var r=mulberry(seed);blotch(x,w,h,30,r,'rgba(120,100,60,A)',120);speckle(x,w,h,6000,r,['#8a7a5a','#fff'],1)}
function fitCover(x,img,dx,dy,dw,dh){var iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height,s=Math.max(dw/iw,dh/ih),sw=dw/s,sh=dh/s;x.drawImage(img,(iw-sw)/2,(ih-sh)/2,sw,sh,dx,dy,dw,dh)}
function fitContain(x,img,dx,dy,dw,dh){var iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height,s=Math.min(dw/iw,dh/ih),w=iw*s,h=ih*s;x.drawImage(img,dx+(dw-w)/2,dy+(dh-h)/2,w,h)}
function wrapText(x,txt,X,Y,maxW,lh){var words=txt.split(' '),line='';for(var i=0;i<words.length;i++){var t=line+words[i]+' ';if(x.measureText(t).width>maxW&&line){x.fillText(line.trim(),X,Y);line=words[i]+' ';Y+=lh}else line=t}x.fillText(line.trim(),X,Y);return Y}

function std(o){return new T.MeshStandardMaterial(o)}
function box(w,h,d,m){var g=new T.Mesh(new T.BoxGeometry(w,h,d),m);g.castShadow=g.receiveShadow=true;return g}
function at(o,x,y,z,ry){o.position.set(x,y,z);if(ry)o.rotation.y=ry;return o}
function markHot(obj,page,label){obj.userData.page=page;obj.userData.label=label;hot.push(obj);obj.traverse(function(c){c.userData.hotRoot=obj})}

function brassPlate(text){var a=cvs(512,112),c=a[0],x=a[1];var g=x.createLinearGradient(0,0,0,112);g.addColorStop(0,'#1e1d1b');g.addColorStop(.5,'#141312');g.addColorStop(1,'#0c0b0a');x.fillStyle=g;x.fillRect(0,0,512,112);speckle(x,512,112,3000,mulberry(9),['#fff','#000'],1);x.strokeStyle='rgba(200,170,110,.5)';x.lineWidth=4;x.strokeRect(8,8,496,96);x.font='44px "Special Elite", "Courier New", monospace';x.textAlign='center';x.textBaseline='middle';x.fillStyle='rgba(0,0,0,.6)';x.fillText(text,257,59);x.fillStyle='#d9c08a';x.fillText(text,256,57);
 var m=new T.Mesh(new T.BoxGeometry(.56,.12,.01),[std({color:0x111111,metalness:.6,roughness:.35}),std({color:0x111111,metalness:.6,roughness:.35}),std({color:0x111111,metalness:.6,roughness:.35}),std({color:0x111111,metalness:.6,roughness:.35}),std({map:tex(c),metalness:.3,roughness:.35}),std({color:0x111111})]);m.castShadow=true;return m}

function imgTex(im,max){var w=im.naturalWidth||1,h=im.naturalHeight||1,k=Math.min(1,(max||1024)/Math.max(w,h));var a=cvs(Math.round(w*k),Math.round(h*k));try{a[1].drawImage(im,0,0,a[0].width,a[0].height)}catch(e){}return tex(a[0])}
function imgs(sel){return Array.prototype.slice.call(document.querySelectorAll(sel))}
function ready(img){if(img.loading==="lazy")img.loading="eager";return img.decode?img.decode().catch(function(){}):Promise.resolve()}

function b64(s){if(s instanceof ArrayBuffer)return s;var bin=atob(s),u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return u.buffer}
function dataImg(uri){return new Promise(function(res,reject){var im=new Image();im.onload=function(){res(im)};im.onerror=function(){reject(new Error('Image unavailable: '+uri))};im.src=uri})}
var IM={};
function preloadAssets(){var jobs=[],n=0,done=0;function add(key,uri){n++;jobs.push(dataImg(uri).then(function(im){IM[key]=im;done++;setLoad('Laying the floorboards…',.15+.55*done/n)}))}
 Object.keys(ASSETS.tex).forEach(function(k){add('t:'+k,ASSETS.tex[k])});Object.keys(ASSETS.photo||{}).forEach(function(k){add(k,ASSETS.photo[k])});add('hdr',ASSETS.hdr);if(ASSETS.ext)add('ext',ASSETS.ext);
 Object.keys(ASSETS.models).forEach(function(mn){if(typeof ASSETS.models[mn]!=='object')return;ASSETS.models[mn].mats.forEach(function(m,i){['map','nor','arm'].forEach(function(f){if(m[f])add('m:'+mn+':'+i+':'+f,m[f])})})});
 return Promise.all(jobs)}
function itex(im,srgb,rep,flip){var t=new T.Texture(im);t.needsUpdate=true;if(srgb)t.colorSpace=T.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());if(rep){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rep[0],rep[1])}if(flip===false)t.flipY=false;return t}
function pbr(name,rep,color,extra){var o={map:texFor('t:'+name+'_diff',true,rep),normalMap:texFor('t:'+name+'_nor',false,rep),roughnessMap:texFor('t:'+name+'_rough',false,rep),color:color||0xffffff,roughness:1,metalness:0};for(var k in extra)o[k]=extra[k];var m=std(o);m.normalScale=new T.Vector2(1,1);return m}
function model(mn,scale,opts){opts=opts||{};var black=false;var d=ASSETS.models[mn],grp=new T.Group();var mats=d.mats.map(function(m,i){var g=function(f,s){var im=IM['m:'+mn+':'+i+':'+f];return im?itex(im,s,null,false):null};var arm=g('arm',false);
  var col=new T.Color(m.c[0],m.c[1],m.c[2]);if(black&&!/glass|light/i.test(m.n||''))col.setRGB(.16,.155,.15);
  var mm=std({color:col,map:g('map',true),normalMap:g('nor',false),roughnessMap:arm,metalnessMap:arm,roughness:m.rg,metalness:m.mt,side:m.ds?T.DoubleSide:T.FrontSide});
  if(black&&!/glass|light/i.test(m.n||'')){mm.roughness=.85;mm.metalness=Math.min(1,m.mt)}
  if(m.alpha==='BLEND'||/glass/i.test(m.n||'')){mm.transparent=true;mm.opacity=.28;mm.depthWrite=false;mm.roughness=.05;mm.metalness=0;mm.roughnessMap=null;mm.metalnessMap=null;mm.color.setRGB(.6,.6,.6)}if(m.alpha==='MASK'){mm.alphaTest=.5}if(opts.artwork&&/artwork/i.test(m.n||'')){var at2=new T.Texture(opts.artwork);at2.colorSpace=T.SRGBColorSpace;at2.flipY=false;at2.needsUpdate=true;mm.map=at2;mm.color.setRGB(1,1,1)}return mm});
 d.meshes.forEach(function(me){if(!me._g){var g=new T.BufferGeometry();
   if(d.q){var pq=new Uint16Array(b64(me.p)),P=new Float32Array(pq.length);for(var i=0;i<pq.length;i++){var a=i%3;P[i]=me.pm[a]+pq[i]/65535*me.ps[a]}
    var nq=new Int8Array(b64(me.n)),N=new Float32Array(nq.length);for(i=0;i<nq.length;i++)N[i]=nq[i]/127;
    var uq=new Uint16Array(b64(me.u)),U=new Float32Array(uq.length);for(i=0;i<uq.length;i++){var b=i%2;U[i]=me.um[b]+uq[i]/65535*me.us[b]}
    g.setAttribute('position',new T.BufferAttribute(P,3));g.setAttribute('normal',new T.BufferAttribute(N,3));g.setAttribute('uv',new T.BufferAttribute(U,2))}
   else{g.setAttribute('position',new T.BufferAttribute(new Float32Array(b64(me.p)),3));g.setAttribute('normal',new T.BufferAttribute(new Float32Array(b64(me.n)),3));g.setAttribute('uv',new T.BufferAttribute(new Float32Array(b64(me.u)),2))}
   g.setIndex(new T.BufferAttribute(me.i32?new Uint32Array(b64(me.i)):new Uint16Array(b64(me.i)),1));me._g=g}
  var mesh=new T.Mesh(me._g,mats[me.m]);mesh.castShadow=!mats[me.m].transparent;mesh.receiveShadow=true;grp.add(mesh)});
 if(scale)grp.scale.setScalar(scale);return grp}

var MP={};
function whenModel(n){if(MP[n])return MP[n];var src=ASSETS.models[n];MP[n]=(typeof src==='string'?window.__loadPack(src):Promise.resolve(src)).then(function(j){ASSETS.models[n]=j;var jobs=[];j.mats.forEach(function(mt,i){['map','nor','arm'].forEach(function(f){var k='m:'+n+':'+i+':'+f;if(mt[f]&&!IM[k])jobs.push(dataImg(mt[f]).then(function(im){IM[k]=im}).catch(function(){}))})});return Promise.all(jobs)});return MP[n]}
function later(n,s,cb){whenModel(n).then(function(){cb(model(n,s))}).catch(function(e){console.warn('model',n,e)})}
var TEXREG={};
function texFor(key,srgb,rep){var t=itex(IM[key],srgb,rep);(TEXREG[key]=TEXREG[key]||[]).push(t);return t}
function upgradeTextures(){var F=ASSETS.texFull||{};return Promise.all(Object.keys(F).map(function(k){return dataImg(F[k]).then(function(im){IM[k]=im;(TEXREG[k]||[]).forEach(function(t){t.dispose();t.image=im;t.needsUpdate=true});
  if(k==='hdr'&&S.pm){var et=new T.Texture(im);et.colorSpace=T.SRGBColorSpace;et.mapping=T.EquirectangularReflectionMapping;et.needsUpdate=true;var old=scene.environment;scene.environment=S.pm.fromEquirectangular(et).texture;et.dispose();if(old)old.dispose()}}).catch(function(){})}))}
function need3DFonts(){if(document.getElementById('f3d'))return;var l=document.createElement('link');l.id='f3d';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;600&family=Caveat:wght@500&family=Special+Elite&display=swap';document.head.appendChild(l)}
function boot(){if(S.booted)return;S.booted=true;window.__t3d=window.__t3d||performance.now();
 var canvas=document.getElementById('gl'),mobile=matchMedia('(pointer:coarse)').matches||innerWidth<760;S.mobile=mobile;
 try{renderer=new T.WebGLRenderer({canvas:canvas,antialias:!mobile,powerPreference:'high-performance'})}catch(e){window.__setClassic(true);return}
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,mobile?1.5:1.75));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;renderer.shadowMap.enabled=true;renderer.shadowMap.type=mobile?T.PCFShadowMap:T.PCFSoftShadowMap;
 scene=new T.Scene();scene.background=new T.Color(0x16120e);camera=new T.PerspectiveCamera(fovBase,innerWidth/innerHeight,.03,140);clock=new T.Clock();renderer.setSize(innerWidth,innerHeight,false);html.style.overflow='hidden';
 setLoad('Opening the office…',.1);need3DFonts();
 // stage 1: room shell with small textures, on screen as fast as possible
 Promise.all([window.__loadPack(ASSETS.shell).then(function(j){ASSETS.shellPack=j}),preloadAssets()]).then(function(){
  var pi=document.querySelector('.about-top img');if(pi)IM['portrait']=pi;
  buildShell();layout();applyHash(true);S.ready=true;running=true;loop();document.getElementById('gl').classList.add('live');loading.classList.add('out');
  // stage 2: desk and projector, full-resolution textures, then everything else
  window.__loadPack(ASSETS.hero).then(buildHero).catch(function(e){console.warn('hero',e)});
  upgradeTextures();
  var fontsP=Promise.race([Promise.all(['40px "Special Elite"','40px "Caveat"','40px "Noto Nastaliq Urdu"'].map(function(f){return document.fonts.load(f)})),new Promise(function(r){setTimeout(r,4000)})]);
  var imgsP=Promise.all(imgs('#cindexHome img, .gallery img, .logos img, .page[data-page="films"] .lib img, .about-top img').map(ready));
  var dataP=Promise.all([fetch('data/books.json').then(function(r){return r.json()}).then(function(j){DATA.books=j}).catch(function(){}),fetch('data/career.json').then(function(r){return r.json()}).then(function(j){DATA.career=j}).catch(function(){})]);
  Promise.all([fontsP,imgsP,dataP]).then(function(){buildContent()}).catch(function(e){console.warn('content',e)});
  if(!mobile)setTimeout(function(){window.FXP().then(setupFX).catch(function(){})},1200);
  if(!mobile)window.RALP().then(function(m){m.RectAreaLightUniformsLib.init();var ra=new T.RectAreaLight(0xfff0dc,4.5,8,3.1);ra.position.set(0,2.05,-9.9);ra.lookAt(0,1.6,0);scene.add(ra);S.windowLight=ra}).catch(function(){});
 }).catch(function(error){console.warn('Studio build failed',error);if(window.reportStudioError)window.reportStudioError(error);window.__setClassic(true);S.booted=false;});
}
S.boot=boot;
// ===== hand-built props, modelled from Ali's reference photos =====
function rbox(w,h,d,r,seg){r=Math.min(r,w/2-.001,h/2-.001,d/2-.001);var s=new T.Shape(),x=-w/2+r,y=-h/2+r;s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
 var g=new T.ExtrudeGeometry(s,{depth:Math.max(.0005,d-2*r),bevelEnabled:true,bevelThickness:r,bevelSize:r*.999,bevelSegments:seg||4,curveSegments:seg||4});g.translate(0,0,-(d-2*r)/2);g.computeVertexNormals();return g}
function M(g,m,x,y,z,cast){var o=new T.Mesh(g,m);o.position.set(x||0,y||0,z||0);o.castShadow=cast!==false;o.receiveShadow=true;return o}
var MAT={};
function mats(){
 MAT.gloss=new T.MeshPhysicalMaterial({color:0x0a0a0a,roughness:.28,metalness:0,clearcoat:1,clearcoatRoughness:.12,envMapIntensity:.9});
 MAT.bakelite=new T.MeshPhysicalMaterial({color:0x080808,roughness:.35,metalness:0,clearcoat:.8,clearcoatRoughness:.25});
 MAT.matte=std({color:0x121212,roughness:.75,metalness:.05});
 MAT.chrome=std({color:0xe6e6e6,metalness:1,roughness:.1,envMapIntensity:1.2});
 MAT.silver=std({color:0xb9b9b9,metalness:1,roughness:.38});
 MAT.rubber=std({color:0x0c0c0c,roughness:.9});
 MAT.cream=std({color:0xf1ead9,roughness:.85});
 MAT.leather=new T.MeshPhysicalMaterial({color:0x0d0c0b,roughness:.55,metalness:0,clearcoat:.35,clearcoatRoughness:.5,sheen:.4,sheenColor:new T.Color(0x3a3530)});
 MAT.wood=pbr('smoked_walnut_veneer',[.4,.4],0x2c2623,{roughness:.55});
}
function canvasTex(w,h,draw,srgb){var a=cvs(w,h);draw(a[1],w,h);var t=new T.CanvasTexture(a[0]);if(srgb!==false)t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t}

// --- typewriter (refs: portable typewriter photos) ---
function makeTypewriter(paperLines){var g=new T.Group();
 var body=M(rbox(.42,.085,.30,.025,5),MAT.gloss,0,.045,0);g.add(body);
 var hood=M(rbox(.44,.075,.14,.03,5),MAT.gloss,0,.11,-.075);g.add(hood);
 g.add(M(new T.BoxGeometry(.43,.006,.006),MAT.chrome,0,.112,-.005));
 var deck=M(rbox(.40,.02,.17,.008,3),MAT.gloss,0,.075,.075);deck.rotation.x=.26;g.add(deck);
 // key legends atlas
 var L='1234567890QWERTYUIOPASDFGHJKL;ZXCVBNM,./-'.split('');
 var at=canvasTex(1024,256,function(x){x.fillStyle='#0d0d0d';x.fillRect(0,0,1024,256);x.fillStyle='#efe9db';x.font='bold 38px "Special Elite","Courier New",monospace';x.textAlign='center';x.textBaseline='middle';L.forEach(function(c,i){x.fillText(c,(i%16)*64+32,((i/16)|0)*64+34)})});
 var capM=std({map:at,roughness:.35,metalness:.1}),ringG=new T.TorusGeometry(.0112,.0018,6,20),capG=new T.CylinderGeometry(.0105,.0105,.004,20),stemG=new T.CylinderGeometry(.0018,.0018,.05,6);
 var rows=[10,10,10,10],k=0;
 rows.forEach(function(n,r){for(var i=0;i<n;i++){var x=-.165+i*.036+r*.009,z=.15-r*.034,y=.098+r*.014;
  var cg=capG.clone(),uv=cg.attributes.uv,idx=k%L.length,u0=(idx%16)/16,v0=1-(((idx/16)|0)+1)/4;for(var q=0;q<uv.count;q++){var ux=uv.getX(q),uy=uv.getY(q);uv.setXY(q,u0+(ux*.8+.1)/16,v0+(uy*.8+.1)/4)}
  var cap=M(cg,capM,x,y,z);g.add(cap);var ring=M(ringG,MAT.chrome,x,y,z);ring.rotation.x=Math.PI/2;g.add(ring);var st=M(stemG,MAT.chrome,x,y-.025,z-.012,false);st.rotation.x=-.5;g.add(st);k++}});
 var sp=M(rbox(.2,.008,.016,.004,2),MAT.chrome,0,.086,.188);g.add(sp);
 // carriage
 var platen=M(new T.CylinderGeometry(.028,.028,.47,32),MAT.rubber,0,.175,-.13);platen.rotation.z=Math.PI/2;g.add(platen);
 [-.25,.25].forEach(function(x){var kn=M(new T.CylinderGeometry(.024,.024,.03,24),MAT.gloss,x,.175,-.13);kn.rotation.z=Math.PI/2;g.add(kn);var cap2=M(new T.CylinderGeometry(.012,.012,.012,16),MAT.chrome,x+(x>0?.02:-.02),.175,-.13);cap2.rotation.z=Math.PI/2;g.add(cap2)});
 g.add(M(new T.BoxGeometry(.5,.008,.012),MAT.chrome,0,.205,-.105));g.add(M(new T.BoxGeometry(.5,.006,.01),MAT.chrome,0,.15,-.17));
 var lev=new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(-.24,.2,-.12),new T.Vector3(-.29,.24,-.08),new T.Vector3(-.33,.24,-.02)]),16,.004,8);g.add(M(lev,MAT.chrome));
 [-.07,.07].forEach(function(x){var sp2=M(new T.CylinderGeometry(.022,.022,.012,24),std({color:0x5a1010,roughness:.5}),x,.152,-.07);g.add(sp2)});
 // paper with typing
 var pt=canvasTex(512,640,function(x,w,h){x.fillStyle='#f3eee2';x.fillRect(0,0,w,h);paperNoise(x,w,h,5);x.fillStyle='#1e1e1e';x.font='30px "Special Elite","Courier New",monospace';var y=150;(paperLines||[]).forEach(function(l){x.font=(l.big?'34px':'21px')+' "Special Elite","Courier New",monospace';x.fillText(l.t,44,y);y+=l.big?50:31})});
 var pg=new T.PlaneGeometry(.21,.27,1,12),pp=pg.attributes.position;for(var i=0;i<pp.count;i++){var yy=pp.getY(i);pp.setZ(i,-Math.pow((yy+.135)/.27,2)*.03)}pg.computeVertexNormals();
 var paper=M(pg,std({map:pt,roughness:.9,side:T.DoubleSide}),0,.3,-.135);paper.rotation.x=-.18;g.add(paper);
 return g}

// --- rotary telephone (ref: black bakelite phone) ---
function makePhone(){var g=new T.Group();
 var bg=rbox(.19,.15,.20,.03,5),bp=bg.attributes.position;for(var i=0;i<bp.count;i++){var y=bp.getY(i);if(y>0){var s=1-.18*(y/.075);bp.setX(i,bp.getX(i)*s);bp.setZ(i,bp.getZ(i)*(1-.08*(y/.075)))}}bg.computeVertexNormals();
 g.add(M(bg,MAT.bakelite,0,.075,0));g.add(M(rbox(.21,.02,.215,.008,3),MAT.bakelite,0,.01,0));
 // dial on sloped front
 var dial=new T.Group();dial.position.set(0,.085,.098);dial.rotation.x=-.32;g.add(dial);
 var plate=canvasTex(256,256,function(x){var gg=x.createRadialGradient(110,110,10,128,128,128);gg.addColorStop(0,'#e9e9e9');gg.addColorStop(1,'#9d9d9d');x.fillStyle=gg;x.beginPath();x.arc(128,128,126,0,7);x.fill();x.fillStyle='#b8692e';x.beginPath();x.arc(128,128,40,0,7);x.fill();x.fillStyle='#111';x.font='bold 26px Arial';x.textAlign='center';x.textBaseline='middle';for(var n=0;n<10;n++){var a=(-.35-n*.29)*Math.PI;x.fillStyle='#f4f1ea';x.beginPath();x.arc(128+Math.cos(a)*86,128+Math.sin(a)*86,19,0,7);x.fill();x.fillStyle='#111';x.fillText(String((n+1)%10),128+Math.cos(a)*86,128+Math.sin(a)*86)}});
 dial.add(M(new T.CircleGeometry(.062,48),std({map:plate,roughness:.4,metalness:.3}),0,0,.001));
 var ws=new T.Shape();ws.absarc(0,0,.064,0,Math.PI*2,false);for(var n2=0;n2<10;n2++){var a2=-(-.35-n2*.29)*Math.PI;var h=new T.Path();h.absarc(Math.cos(a2)*.042,Math.sin(a2)*.042,.0085,0,Math.PI*2,true);ws.holes.push(h)}var inner=new T.Path();inner.absarc(0,0,.024,0,Math.PI*2,true);ws.holes.push(inner);
 var wheel=M(new T.ExtrudeGeometry(ws,{depth:.006,bevelEnabled:true,bevelThickness:.001,bevelSize:.001,bevelSegments:2,curveSegments:24}),MAT.bakelite,0,0,.002);dial.add(wheel);
 var stop=M(new T.BoxGeometry(.004,.018,.006),MAT.chrome,.045,-.038,.012);stop.rotation.z=-.7;dial.add(stop);
 // cradle + handset
 [-.07,.07].forEach(function(x){var pr=M(rbox(.022,.05,.03,.008,3),MAT.bakelite,x,.17,-.01);g.add(pr)});
 var hc=new T.CatmullRomCurve3([new T.Vector3(-.11,.0,0),new T.Vector3(-.05,.025,0),new T.Vector3(.05,.025,0),new T.Vector3(.11,0,0)]);var hs=new T.Group();hs.position.set(0,.205,-.01);g.add(hs);
 hs.add(M(new T.TubeGeometry(hc,32,.016,14),MAT.bakelite));
 [-.115,.115].forEach(function(x){hs.add(M(new T.CylinderGeometry(.038,.024,.045,28),MAT.bakelite,x,-.014,0))});
 // fabric cord across desk
 var pts=[new T.Vector3(-.12,.04,.02),new T.Vector3(-.2,.012,.1),new T.Vector3(-.28,.006,.22),new T.Vector3(-.18,.006,.32),new T.Vector3(-.3,.006,.4),new T.Vector3(-.42,.006,.3),new T.Vector3(-.36,.006,.12)];
 g.add(M(new T.TubeGeometry(new T.CatmullRomCurve3(pts),80,.0045,8),std({color:0x111111,roughness:.95})));
 return g}

// --- film projector (ref: projector with two spoked reels) ---
function spokedReel(r,th){var s=new T.Shape();s.absarc(0,0,r,0,Math.PI*2,false);for(var i=0;i<5;i++){var a=i/5*Math.PI*2,h=new T.Path();var a0=a+.22,a1=a+Math.PI*2/5-.22;h.absarc(0,0,r*.82,a0,a1,false);h.absarc(0,0,r*.32,a1,a0,true);h.closePath();s.holes.push(h)}var hub=new T.Path();hub.absarc(0,0,r*.06,0,Math.PI*2,true);s.holes.push(hub);
 var g=new T.ExtrudeGeometry(s,{depth:th,bevelEnabled:true,bevelThickness:.002,bevelSize:.002,bevelSegments:2,curveSegments:40});g.translate(0,0,-th/2);return g}
function makeProjector(){var g=new T.Group();
 var body=M(rbox(.14,.17,.11,.012,4),MAT.matte,0,.135,0);g.add(body);for(var v=0;v<9;v++)g.add(M(new T.BoxGeometry(.006,.11,.004),MAT.gloss,-.05+v*.0125,.13,.057));
 g.add(M(rbox(.09,.03,.06,.008,3),MAT.chrome,0,.235,0));
 g.add(M(rbox(.3,.03,.16,.01,3),MAT.gloss,.04,.015,0));
 var arm=new T.Shape();arm.moveTo(-.02,0);arm.lineTo(.03,0);arm.lineTo(.08,.22);arm.lineTo(.04,.24);arm.closePath();g.add(M(new T.ExtrudeGeometry(arm,{depth:.02,bevelEnabled:false}),MAT.matte,.06,.08,-.01));
 var reelG=spokedReel(.11,.008);var r1=M(reelG,MAT.silver,.13,.36,.0);g.add(r1);var r2=M(reelG,MAT.silver,.2,.14,.0);g.add(r2);g.userData.reels=[r1,r2];
 [r1,r2].forEach(function(r){g.add(M(new T.CylinderGeometry(.012,.012,.03,16),MAT.chrome,r.position.x,r.position.y,0).rotateX(Math.PI/2))});
 var lens=M(new T.CylinderGeometry(.022,.026,.09,28),MAT.matte,.115,.15,0);lens.rotation.z=Math.PI/2;g.add(lens);var lr=M(new T.CylinderGeometry(.024,.024,.012,28),MAT.chrome,.16,.15,0);lr.rotation.z=Math.PI/2;g.add(lr);
 var glass=M(new T.CircleGeometry(.019,24),new T.MeshBasicMaterial({color:0xfff2d8}),.1665,.15,0,false);glass.rotation.y=Math.PI/2;g.add(glass);
 [[.07,.2],[.085,.17],[.06,.11]].forEach(function(p){var gear=M(new T.CylinderGeometry(.012,.012,.012,10),MAT.chrome,p[0],p[1],.06);gear.rotation.x=Math.PI/2;g.add(gear)});
 return g}

// --- anglepoise desk lamp (ref: black task lamp) ---
function makeLamp(){var g=new T.Group();
 var basePts=[new T.Vector2(0,0),new T.Vector2(.085,0),new T.Vector2(.088,.008),new T.Vector2(.07,.022),new T.Vector2(.02,.03),new T.Vector2(0,.03)];g.add(M(new T.LatheGeometry(basePts,40),MAT.gloss));
 var j0=new T.Vector3(0,.03,0),j1=new T.Vector3(.02,.38,.04),j2=new T.Vector3(.2,.52,.12);
 function rod(a,b){var d=b.clone().sub(a),L=d.length(),m=M(new T.CylinderGeometry(.008,.008,L,12),MAT.matte);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return m}
 g.add(rod(j0,j1));g.add(rod(j0.clone().add(new T.Vector3(.02,0,0)),j1.clone().add(new T.Vector3(.02,0,0))));g.add(rod(j1,j2));
 [j1,j2].forEach(function(j){var k=M(new T.CylinderGeometry(.014,.014,.035,16),MAT.chrome,j.x,j.y,j.z);k.rotation.z=Math.PI/2;g.add(k)});
 var spring=new T.TubeGeometry(new T.CatmullRomCurve3(Array.from({length:60},function(_,i){var t=i/59;return new T.Vector3(.035+Math.cos(t*40)*.006,.08+t*.24,.02+Math.sin(t*40)*.006)})),180,.0012,5);g.add(M(spring,MAT.chrome));
 var shadePts=[new T.Vector2(.012,0),new T.Vector2(.03,.01),new T.Vector2(.05,.04),new T.Vector2(.07,.09),new T.Vector2(.076,.11)];var sh=M(new T.LatheGeometry(shadePts,40),new T.MeshPhysicalMaterial({color:0x0a0a0a,roughness:.3,clearcoat:1,side:T.DoubleSide}));
 var head=new T.Group();head.position.copy(j2);head.rotation.z=-2.3;head.rotation.y=.4;head.add(sh);var bulb=M(new T.SphereGeometry(.028,16,12),new T.MeshBasicMaterial({color:0xfff1cf}),0,.07,0,false);head.add(bulb);g.add(head);g.userData.head=head;
 var cord=new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(-.06,.01,-.04),new T.Vector3(-.16,.003,-.1),new T.Vector3(-.3,.003,-.12)]),20,.003,6);g.add(M(cord,MAT.matte));
 return g}

// --- cup & saucer ---
function makeCup(){var g=new T.Group();var cp=[new T.Vector2(0,0),new T.Vector2(.028,0),new T.Vector2(.034,.006),new T.Vector2(.042,.04),new T.Vector2(.045,.066),new T.Vector2(.043,.067),new T.Vector2(.04,.042),new T.Vector2(.032,.008),new T.Vector2(0,.006)];
 var porc=new T.MeshPhysicalMaterial({color:0x0b0b0b,roughness:.18,clearcoat:1,clearcoatRoughness:.05,side:T.DoubleSide});
 var cup=M(new T.LatheGeometry(cp,48),porc,0,.012,0);g.add(cup);var h=M(new T.TorusGeometry(.017,.0045,12,24,Math.PI*1.3),porc,.047,.048,0);h.rotation.z=-Math.PI*.65;g.add(h);
 var cof=M(new T.CircleGeometry(.04,32),std({color:0x1c0d05,roughness:.05}),0,.068,0,false);cof.rotation.x=-Math.PI/2;g.add(cof);
 var sp=[new T.Vector2(0,0),new T.Vector2(.05,.001),new T.Vector2(.07,.008),new T.Vector2(.074,.012),new T.Vector2(.068,.011),new T.Vector2(.05,.005),new T.Vector2(0,.004)];g.add(M(new T.LatheGeometry(sp,48),porc));
 var rim=M(new T.TorusGeometry(.0715,.0012,6,48),std({color:0xc9a560,metalness:1,roughness:.3}),0,.0115,0,false);rim.rotation.x=Math.PI/2;g.add(rim);return g}

// --- stack of old books ---
function pageEdge(){return canvasTex(256,64,function(x){x.fillStyle='#e6dcc4';x.fillRect(0,0,256,64);for(var i=0;i<64;i+=2){x.fillStyle='rgba(120,100,70,'+(.08+Math.random()*.15)+')';x.fillRect(0,i,256,1)}})}
function makeBook(w,h,d,col,seed){var g=new T.Group();var cover=new T.MeshPhysicalMaterial({color:col,roughness:.7,sheen:.5,sheenColor:new T.Color(0x332a22)});
 g.add(M(rbox(w,h,d,.003,2),cover));var pe=pageEdge();var pm=std({map:pe,roughness:.95});var pages=M(new T.BoxGeometry(w-.006,h-.008,d-.004),pm,.003,0,0);g.add(pages);
 var spineT=canvasTex(64,256,function(x){x.fillStyle='#000';x.fillRect(0,0,64,256);x.globalAlpha=.0;x.fillRect(0,0,1,1)});
 [.25,.75].forEach(function(f){g.add(M(new T.BoxGeometry(.0015,.004,d*.9),std({color:0xb08d4a,metalness:.9,roughness:.35}),-w/2-.0008,-h/2+h*f,0,false))});return g}
function makeBookStack(){var g=new T.Group(),cols=[0x1a0d0d,0x10120f,0x1b1612,0x0e0e10,0x2a1414],y=0;
 [[.2,.035,.15],[.21,.03,.155],[.18,.04,.13],[.2,.028,.15],[.17,.032,.12]].forEach(function(s,i){var b=makeBook(s[0],s[1],s[2],cols[i]);b.rotation.y=(i%2?1:-1)*(.05+i*.03);b.position.y=y+s[1]/2;y+=s[1];b.rotation.z=Math.PI/2;b.rotation.z=0;g.add(b)});return g}

// --- potted plant ---
function makePlant(){var g=new T.Group();var potP=[new T.Vector2(0,0),new T.Vector2(.055,0),new T.Vector2(.07,.12),new T.Vector2(.073,.125),new T.Vector2(.066,.125),new T.Vector2(.062,.11),new T.Vector2(0,.11)];g.add(M(new T.LatheGeometry(potP,40),MAT.matte));
 var soil=M(new T.CircleGeometry(.064,24),std({color:0x1a1209,roughness:1}),0,.112,0,false);soil.rotation.x=-Math.PI/2;g.add(soil);
 var leafS=new T.Shape();leafS.moveTo(0,0);leafS.bezierCurveTo(.04,.03,.045,.09,0,.13);leafS.bezierCurveTo(-.045,.09,-.04,.03,0,0);var lg=new T.ShapeGeometry(leafS,12),lp=lg.attributes.position;for(var i=0;i<lp.count;i++){var x=lp.getX(i),y=lp.getY(i);lp.setZ(i,-x*x*6+y*y*.8)}lg.computeVertexNormals();
 var lm=new T.MeshPhysicalMaterial({color:0x1f4a22,roughness:.45,sheen:.3,side:T.DoubleSide,clearcoat:.3});var sm=std({color:0x2a3a1c});var r=mulberry(12);
 for(var k=0;k<16;k++){var a=k/16*Math.PI*2+r()*.4,len=.08+r()*.12,tilt=.5+r()*.6;var tip=new T.Vector3(Math.cos(a)*Math.sin(tilt)*len,.11+Math.cos(tilt)*len+.06,Math.sin(a)*Math.sin(tilt)*len);
  g.add(M(new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(0,.11,0),new T.Vector3(tip.x*.4,tip.y*.9,tip.z*.4),tip]),8,.0022,5),sm));
  var leaf=M(lg,lm,tip.x,tip.y,tip.z);leaf.lookAt(tip.x*2,tip.y+.05,tip.z*2);leaf.rotateX(-Math.PI/2+.4);leaf.scale.setScalar(.75+r()*.6);g.add(leaf)}return g}

// --- pencil cup ---
function makePencilCup(){var g=new T.Group();var mesh=canvasTex(256,256,function(x){x.fillStyle='#000';x.fillRect(0,0,256,256);x.fillStyle='#fff';for(var i=0;i<256;i+=16)for(var j=0;j<256;j+=16){x.save();x.translate(i+8,j+8);x.rotate(Math.PI/4);x.fillRect(-4,-4,8,8);x.restore()}},false);mesh.wrapS=mesh.wrapT=T.RepeatWrapping;mesh.repeat.set(4,2);
 g.add(M(new T.CylinderGeometry(.04,.04,.1,32,1,true),std({color:0x151515,metalness:.8,roughness:.4,alphaMap:mesh,alphaTest:.5,side:T.DoubleSide}),0,.05,0));g.add(M(new T.CylinderGeometry(.04,.04,.004,32),MAT.matte,0,.002,0));
 g.add(M(new T.TorusGeometry(.04,.002,6,32),MAT.matte,0,.1,0).rotateX(Math.PI/2));
 var cols=[0x1d1d1d,0x2a2a2a,0xc9a560,0x111111,0x8a1f1f,0x1f3a7a,0x303030];var r=mulberry(3);
 for(var i=0;i<8;i++){var p=new T.Group();var L=.16+r()*.03;p.add(M(new T.CylinderGeometry(.0042,.0042,L,6),std({color:cols[i%cols.length],roughness:.5}),0,L/2,0));p.add(M(new T.ConeGeometry(.0042,.016,6),std({color:0xd9b98a,roughness:.8}),0,L+.008,0));p.add(M(new T.ConeGeometry(.0013,.005,6),MAT.matte,0,L+.016,0));
  p.position.set((r()-.5)*.04,.004,(r()-.5)*.04);p.rotation.set((r()-.5)*.35,0,(r()-.5)*.35);g.add(p)}return g}

// --- clipboard with client sheet ---
function makeClipboard(sheetTex){var g=new T.Group();g.add(M(rbox(.25,.004,.35,.0018,2),std({color:0x141210,roughness:.6}),0,.002,0));
 var paper=M(new T.PlaneGeometry(.23,.31),std({map:sheetTex,roughness:.9}),0,.0068,.015,false);paper.rotation.x=-Math.PI/2;g.add(paper);
 var cl=new T.Shape();cl.moveTo(-.05,0);cl.lineTo(.05,0);cl.lineTo(.045,.035);cl.quadraticCurveTo(0,.045,-.045,.035);cl.closePath();var cg=new T.ExtrudeGeometry(cl,{depth:.006,bevelEnabled:true,bevelSize:.002,bevelThickness:.002,bevelSegments:3});var clip=M(cg,MAT.chrome,0,.006,-.165);clip.rotation.x=-Math.PI/2;g.add(clip);
 var roll=M(new T.CylinderGeometry(.008,.008,.07,16),MAT.chrome,0,.012,-.172);roll.rotation.z=Math.PI/2;g.add(roll);return g}

// --- wingback armchair (ref: study-room armchairs), in black leather ---
function makeArmchair(){var g=new T.Group(),L=MAT.leather;
 g.add(M(rbox(.78,.14,.72,.05,5),L,0,.33,.02));g.add(M(rbox(.62,.12,.6,.05,5),L,0,.45,.07));
 var back=M(rbox(.74,.72,.16,.06,5),L,0,.78,-.3);back.rotation.x=-.12;g.add(back);
 [-1,1].forEach(function(s){var wing=M(rbox(.12,.5,.28,.05,4),L,s*.36,.86,-.2);wing.rotation.y=s*.25;g.add(wing);
  var arm=M(rbox(.13,.24,.66,.05,4),L,s*.35,.5,.04);g.add(arm);var roll=M(new T.CylinderGeometry(.075,.075,.66,24),L,s*.37,.62,.04);roll.rotation.x=Math.PI/2;g.add(roll);
  [-.26,.3].forEach(function(z){var leg=M(new T.CylinderGeometry(.022,.014,.26,12),MAT.wood,s*.32,.13,z);g.add(leg)})});
 // button tufting on back
 for(var i=0;i<3;i++)for(var j=0;j<4;j++)g.add(M(new T.SphereGeometry(.007,8,6),L,-.21+j*.14,.66+i*.15,-.21-i*.018,false));
 return g}
function makeTableLamp(){var g=new T.Group();var bp=[new T.Vector2(0,0),new T.Vector2(.06,0),new T.Vector2(.065,.02),new T.Vector2(.075,.08),new T.Vector2(.06,.15),new T.Vector2(.02,.18),new T.Vector2(.012,.3),new T.Vector2(0,.3)];
 g.add(M(new T.LatheGeometry(bp,40),new T.MeshPhysicalMaterial({color:0x0c0c0c,roughness:.2,clearcoat:1})));
 var shP=[new T.Vector2(.14,0),new T.Vector2(.08,.16)];var sh=M(new T.LatheGeometry(shP,48),new T.MeshStandardMaterial({color:0xf3e3c2,emissive:0xffc985,emissiveIntensity:.55,roughness:.9,side:T.DoubleSide}),0,.26,0,false);g.add(sh);
 var l=new T.PointLight(0xffc985,.55,3.2,2);l.position.set(0,.33,0);g.add(l);return g}

// --- 3D bookshelf with individual books (ref: study-room shelves) ---
function makeBookshelf(w,h,d){var g=new T.Group(),blk=new T.MeshPhysicalMaterial({color:0x0c0b0a,roughness:.5,clearcoat:.4});
 g.add(M(new T.BoxGeometry(w,h,.02),blk,0,h/2,-d/2+.01));g.add(M(new T.BoxGeometry(.04,h,d),blk,-w/2+.02,h/2,0));g.add(M(new T.BoxGeometry(.04,h,d),blk,w/2-.02,h/2,0));g.add(M(new T.BoxGeometry(w+.04,.05,d+.03),blk,0,h-.025,0));g.add(M(new T.BoxGeometry(w,.09,d),blk,0,.045,0));
 var shelves=5,sh=(h-.14)/shelves;for(var s=1;s<shelves;s++)g.add(M(new T.BoxGeometry(w-.06,.025,d-.02),blk,0,.09+s*sh,0));g.add(M(new T.BoxGeometry(.03,h-.14,d-.02),blk,0,h/2,0));
 var palette=[0x3b1414,0x1d2a1f,0x2b2118,0x14181f,0x4a3b28,0x5a1f1b,0x1f1a14,0x6b5a3e,0x223038,0x0f0f0f,0x7a6a50],r=mulberry(21),books=[],geo=new T.BoxGeometry(1,1,1);
 for(var s2=0;s2<shelves;s2++){var y0=.09+s2*sh+.0125;[[-w/2+.05,-.03],[.03,w/2-.05]].forEach(function(span){var x=span[0];while(x<span[1]-.02){var bw=.018+r()*.03,bh=sh*(.62+r()*.3),bd=d*(.7+r()*.2);if(r()<.06){x+=.04;continue}books.push({x:x+bw/2,y:y0+bh/2,z:-d/2+.02+bd/2,w:bw,h:bh,d:bd,c:palette[(r()*palette.length)|0],lean:r()<.08?(r()-.5)*.2:0});x+=bw+.0015}})}
 var im=new T.InstancedMesh(geo,new T.MeshPhysicalMaterial({color:0xffffff,roughness:.7,sheen:.4,sheenColor:new T.Color(0x332a22)}),books.length),o=new T.Object3D(),c=new T.Color();
 books.forEach(function(b,i){o.position.set(b.x,b.y,b.z);o.rotation.set(0,0,b.lean);o.scale.set(b.w,b.h,b.d);o.updateMatrix();im.setMatrixAt(i,o.matrix);im.setColorAt(i,c.setHex(b.c))});im.castShadow=true;im.receiveShadow=true;g.add(im);
 var bands=new T.InstancedMesh(new T.BoxGeometry(1,1,1),std({color:0xb08d4a,metalness:.9,roughness:.35}),books.length*2);books.forEach(function(b,i){[.2,.8].forEach(function(f,j){o.position.set(b.x,b.y-b.h/2+b.h*f,b.z+b.d/2+.0006);o.rotation.set(0,0,b.lean);o.scale.set(b.w*.8,.004,.001);o.updateMatrix();bands.setMatrixAt(i*2+j,o.matrix)})});g.add(bands);
 return g}

// books for the scanned bookshelf
function makeShelfBooks(w,h,d,shelves){var g=new T.Group(),palette=[0x3b1414,0x1d2a1f,0x2b2118,0x14181f,0x4a3b28,0x5a1f1b,0x1f1a14,0x6b5a3e,0x223038,0x0f0f0f,0x7a6a50],r=mulberry(21),books=[],sh=h/shelves;
 for(var s=0;s<shelves-1;s++){var y0=.12+s*sh*.98,x=-w/2+.05;while(x<w/2-.05){var bw=.018+r()*.03,bh=sh*(.55+r()*.28),bd=d*(.6+r()*.25);if(r()<.07){x+=.05;continue}books.push({x:x+bw/2,y:y0+bh/2,z:-d/2+.03+bd/2,w:bw,h:bh,d:bd,c:palette[(r()*palette.length)|0],lean:r()<.08?(r()-.5)*.2:0});x+=bw+.002}}
 var im=new T.InstancedMesh(new T.BoxGeometry(1,1,1),new T.MeshPhysicalMaterial({color:0xffffff,roughness:.7,sheen:.4,sheenColor:new T.Color(0x332a22)}),books.length),o=new T.Object3D(),c=new T.Color();
 books.forEach(function(b,i){o.position.set(b.x,b.y,b.z);o.rotation.set(0,0,b.lean);o.scale.set(b.w,b.h,b.d);o.updateMatrix();im.setMatrixAt(i,o.matrix);im.setColorAt(i,c.setHex(b.c))});im.castShadow=true;im.receiveShadow=true;g.add(im);return g}
// ===== Ali's favourite books, spines on the scanned bookshelf =====
var FAVS=((window.DATA&&DATA.books)||[]).map(function(b){return{r:b.shelf,s:b.series,a:b.author,ur:b.language==='ur'?1:0,l:b.titles}});
var BSTYLE={
 grisham:{bg:['#e9e4d8','#1e2a44','#7a1c1c','#f0c419','#2a2a2a','#efeae0'],fg:['#111','#f2e9d0','#f4ecd8','#111','#e9d9a6','#8a1c1c'],font:'bold',h:[.178,.18],w:[.03,.042],big:'GRISHAM'},
 ludlum:{bg:['#141414','#1c1c1c','#5a0f0f','#0f1e2e'],fg:['#d8b04a','#e33b2b','#efe4c8','#cfd8e0'],font:'bold',h:[.178,.18],w:[.036,.05],big:'LUDLUM'},
 hp:{bg:['#7a1a1a','#1f4a2a','#2b2e6a','#5b1717','#1c2c4a','#2f4a2a','#3a2b1a'],fg:['#e8c66a'],font:'serif',h:[.198,.2]},
 tolkien:{bg:['#20331f','#141414','#141414','#141414'],fg:['#d4b259'],font:'serif',h:[.205,.21]},
 saks:{bg:['#ece6d6'],fg:['#1b1b1b'],font:'sans',h:[.21,.21]},
 pj:{bg:['#1f5fa8','#1a7ab0','#2b4f9a','#3a6fb0','#1d4f86'],fg:['#fff'],font:'bold',h:[.195,.197],w:[.03,.038]},
 hoo:{bg:['#5a2a7a','#7a2a2a','#6a3a14','#2a3a6a','#7a1f1f'],fg:['#f6d27a'],font:'bold',h:[.2,.2],w:[.038,.045]},
 toa:{bg:['#b8862b','#a8761f','#c0902e','#9a6a1c','#b07a24'],fg:['#1a1206'],font:'bold',h:[.2,.2],w:[.033,.04]},
 kane:{bg:['#7a1414','#8a5a14','#3a1a5a'],fg:['#f2d27a'],font:'bold',h:[.2,.2],w:[.04,.045]},
 magnus:{bg:['#1f6a6a','#5a1f1f','#1f3f6a'],fg:['#f0e6c8'],font:'bold',h:[.2,.2],w:[.038,.044]},
 ranger:{bg:['#2b3a1c','#33441f','#26341a','#3a4422'],fg:['#e2c77a'],font:'serif',h:[.197,.2],w:[.026,.032]},
 early:{bg:['#4a2a14','#3a2a14'],fg:['#e8cf8a'],font:'serif',h:[.2,.2],w:[.03,.034]},
 brother:{bg:['#1a2e4a','#22385a','#1a2a3e'],fg:['#e6eef6'],font:'bold',h:[.197,.2],w:[.028,.034]},
 yousufi:{bg:['#5a1414','#1c3a2a','#2a1f14','#14243a','#3a1414'],fg:['#e6c878'],font:'urdu',h:[.225,.23],w:[.032,.042]},
 hijazi:{bg:['#2a4a2a','#4a1f1f','#1f2f4a','#3a3020','#203a3a','#4a3a1a'],fg:['#f0d690'],font:'urdu',h:[.215,.225],w:[.028,.04]}
};
function spineFont(f,px){return f==='urdu'?px+'px "Noto Nastaliq Urdu",serif':f==='serif'?'600 '+px+'px Georgia,"Times New Roman",serif':f==='sans'?'500 '+px+'px "Jost",Helvetica,Arial,sans-serif':'800 '+px+'px "Jost","Helvetica Neue",Arial,sans-serif'}
function drawSpine(x,cx,cy,cw,ch,bk){var st=BSTYLE[bk.s],bg=st.bg[bk.i%st.bg.length],fg=st.fg[bk.i%st.fg.length];
 x.save();x.translate(cx,cy);x.fillStyle=bg;x.fillRect(0,0,cw,ch);
 var g=x.createLinearGradient(0,0,cw,0);g.addColorStop(0,'rgba(0,0,0,.45)');g.addColorStop(.18,'rgba(255,255,255,.08)');g.addColorStop(.5,'rgba(255,255,255,.03)');g.addColorStop(.85,'rgba(0,0,0,.15)');g.addColorStop(1,'rgba(0,0,0,.5)');x.fillStyle=g;x.fillRect(0,0,cw,ch);
 var r=mulberry(bk.seed);for(var k=0;k<900;k++){x.fillStyle=r()<.5?'rgba(0,0,0,.06)':'rgba(255,255,255,.05)';x.fillRect(r()*cw,r()*ch,1+r()*2,1+r()*2)}
 if(st.font==='serif'||st.font==='urdu'){x.fillStyle=fg;x.globalAlpha=.75;[.06,.075,.925,.94].forEach(function(f){x.fillRect(8,ch*f,cw-16,3)});x.globalAlpha=1}
 x.translate(cw/2,0);x.rotate(Math.PI/2);x.fillStyle=fg;x.textBaseline='middle';
 var title=bk.t,auth=bk.a,maxL=ch*(bk.ur?.62:.66);
 if(st.big){x.font=spineFont('bold',Math.min(cw*.42,54));x.fillText(st.big,ch*.06,0);var bw=x.measureText(st.big).width;var px2=Math.min(cw*.3,34);x.font=spineFont(st.font,px2);var tt=title.toUpperCase();while(x.measureText(tt).width>ch*.9-bw-ch*.1&&px2>12){px2-=1;x.font=spineFont(st.font,px2)}x.fillText(tt,ch*.08+bw+ch*.04,0)}
 else{var px=Math.min(cw*(bk.ur?.5:.36),bk.ur?44:36);x.font=spineFont(st.font,px);while(x.measureText(title).width>maxL&&px>11){px-=1;x.font=spineFont(st.font,px)}
  if(bk.ur){x.save();x.direction='rtl';x.textAlign='left';x.fillText(title,ch*.1+x.measureText(title).width,0);x.restore()}else x.fillText(st.font==='bold'?title.toUpperCase():title,ch*.1,0);
  var ap=Math.min(cw*.24,22);x.font=spineFont(bk.ur?'urdu':'sans',bk.ur?ap*1.2:ap);x.globalAlpha=.85;var aw=x.measureText(auth).width;x.fillText(auth,ch*.93-aw,0);x.globalAlpha=1}
 x.restore()}
function makeFavBooks(){var g=new T.Group(),list=[],seed=1;
 FAVS.forEach(function(sr){var st=BSTYLE[sr.s];sr.l.forEach(function(t,i){var r=mulberry(seed*7+3);var h=st.h[0]+r()*(st.h[1]-st.h[0]),w=sr.w?sr.w[i]:(st.w?st.w[0]+r()*(st.w[1]-st.w[0]):.034);list.push({r:sr.r,s:sr.s,t:t,a:sr.a,ur:sr.ur,i:i,seed:seed++,h:h,w:w,d:.13+r()*.03})})});
 var cols=32,cw=128,ch=1024,rows=Math.ceil((list.length+1)/cols);var A=cvs(cols*cw,rows*ch),ax=A[1];
 list.forEach(function(bk,k){drawSpine(ax,(k%cols)*cw,((k/cols)|0)*ch,cw,ch,bk)});
 var pk=list.length,pcx=(pk%cols)*cw,pcy=((pk/cols)|0)*ch;ax.fillStyle='#e7dcc2';ax.fillRect(pcx,pcy,cw,ch);for(var y=0;y<ch;y+=3){ax.fillStyle='rgba(120,100,70,'+(.06+Math.random()*.14)+')';ax.fillRect(pcx,pcy+y,cw,1)}
 var atlas=tex(A[0]);atlas.anisotropy=8;var W=A[0].width,H=A[0].height;
 var mat=new T.MeshPhysicalMaterial({map:atlas,roughness:.62,sheen:.35,sheenColor:new T.Color(0x3a3228),clearcoat:.15,clearcoatRoughness:.6});
 function cell(k){return{u0:((k%cols)*cw)/W,u1:((k%cols)*cw+cw)/W,v1:1-(((k/cols)|0)*ch)/H,v0:1-(((k/cols)|0)*ch+ch)/H}}
 var shelfY=[.06,.37,.65,.94,1.25,1.64],cursor={},tot={},prevS={};list.forEach(function(bk){tot[bk.r]=(tot[bk.r]||0)+bk.w+.0025+(prevS[bk.r]&&prevS[bk.r]!==bk.s?.03:0);prevS[bk.r]=bk.s});prevS={};
 list.forEach(function(bk,k){var geo=new T.BoxGeometry(bk.w,bk.h,bk.d),uv=geo.attributes.uv,c=cell(k),p=cell(pk);
  for(var f=0;f<6;f++)for(var q=0;q<4;q++){var idx=f*4+q,u=uv.getX(idx),v=uv.getY(idx);
   if(f===4)uv.setXY(idx,c.u0+u*(c.u1-c.u0),c.v0+v*(c.v1-c.v0));
   else if(f===2||f===3||f===5&&false)uv.setXY(idx,p.u0+u*(p.u1-p.u0)*.9,p.v0+v*(p.v1-p.v0)*.2);
   else uv.setXY(idx,c.u0+(.3+u*.4)*(c.u1-c.u0),c.v0+(.45+v*.05)*(c.v1-c.v0))}
  var m=new T.Mesh(geo,mat);m.castShadow=true;m.receiveShadow=true;var x0=cursor[bk.r]===undefined?-tot[bk.r]/2:cursor[bk.r];if(prevS[bk.r]&&prevS[bk.r]!==bk.s)x0+=.03;prevS[bk.r]=bk.s;
  var lean=0;if(Math.random()<.04)lean=(Math.random()-.5)*.12;
  m.position.set(x0+bk.w/2,shelfY[bk.r]+.012+bk.h/2,-.255+bk.d/2+.07);m.rotation.z=lean;m.rotation.y=(Math.random()-.5)*.03;cursor[bk.r]=x0+bk.w+.0025;g.add(m)});
 return g}
var G={},MATS={};
function addPack(R){ R.forEach(function(me){var g=new T.BufferGeometry(),pq=new Uint16Array(b64(me.p)),P=new Float32Array(pq.length),i;for(i=0;i<pq.length;i++){var a=i%3;P[i]=me.pm[a]+pq[i]/65535*me.ps[a]}
  var nq=new Int8Array(b64(me.n)),N=new Float32Array(nq.length);for(i=0;i<nq.length;i++)N[i]=nq[i]/127;
  var mat=MATS[me.m]||std({color:0x777777});var src=mat.userData&&mat.userData.box?{q:me.b,m:me.bm,s:me.bs}:{q:me.u,m:me.um,s:me.us};var uq=new Uint16Array(b64(src.q)),U=new Float32Array(uq.length);for(i=0;i<uq.length;i++){var c=i%2;U[i]=src.m[c]+uq[i]/65535*src.s[c]}
  g.setAttribute('position',new T.BufferAttribute(P,3));g.setAttribute('normal',new T.BufferAttribute(N,3));g.setAttribute('uv',new T.BufferAttribute(U,2));g.setIndex(new T.BufferAttribute(me.i32?new Uint32Array(b64(me.i)):new Uint16Array(b64(me.i)),1));
  var m=new T.Mesh(g,mat);m.castShadow=!/Room_(Floor|Ceiling|Wall)/.test(me.g);m.receiveShadow=true;(G[me.g]=G[me.g]||new T.Group()).add(m)});
 Object.keys(G).forEach(function(k){if(!G[k].parent){G[k].name=k;scene.add(G[k])}});S.G=G}
function buildShell(){
 var HW=10,HD=10,H=4.5;G={};
 var pm=new T.PMREMGenerator(renderer);S.pm=pm;var et=texFor('hdr',true);et.mapping=T.EquirectangularReflectionMapping;scene.environment=pm.fromEquirectangular(et).texture;
 mats();
 function scan(name,tile,tint,o){o=o||{};var rep=[1/tile,1/tile];var m=new T.MeshPhysicalMaterial({map:texFor('t:'+name+'_diff',true,rep),normalMap:texFor('t:'+name+'_nor',false,rep),roughnessMap:texFor('t:'+name+'_rough',false,rep),color:tint,roughness:o.r||1,metalness:0,clearcoat:o.coat||0,clearcoatRoughness:o.cr||.15,sheen:o.sheen||0,sheenColor:new T.Color(o.sheenColor||0),sheenRoughness:.5});m.normalScale=new T.Vector2(o.ns||1,o.ns||1);m.userData.box=true;return m}
 var walnut=scan('smoked_walnut_veneer',.6,0x6e4a32,{coat:.85,cr:.08,r:.6});
 MATS={walnut_desk:walnut,walnut_dark:scan('smoked_walnut_veneer',.6,0x4a2e1e,{coat:.7,cr:.1,r:.65}),walnut_wall:scan('smoked_walnut_veneer',.85,0x523624,{coat:.5,r:.7}),
  desk_leather:scan('fabric_leather_02',.35,0x23382a,{coat:.2,r:.85}),parquet:scan('herringbone_parquet',1.8,0x9a7c60,{coat:0,r:1}),plaster:scan('painted_plaster_wall',2.2,0x968b7c,{ns:.4}),
  ceiling:scan('painted_plaster_wall',2.8,0xa39d92,{ns:.25}),velvet:scan('velour_velvet',.42,0x5c0d14,{sheen:1,sheenColor:0x8a2a36,ns:.5}),rugwool:scan('velour_velvet',.33,0x15100c,{sheen:.15,sheenColor:0x2a1e16,ns:.8}),rugborder:scan('velour_velvet',.33,0x3a100c,{sheen:.15,sheenColor:0x4a1e16,ns:.8}),
  desk_brass:std({color:0xc08c3e,metalness:1,roughness:.24}),tooling:std({color:0xcc9a40,metalness:1,roughness:.35}),railbrass:std({color:0x9a6e33,metalness:1,roughness:.3}),
  chrome:std({color:0xdddddd,metalness:1,roughness:.08}),alu:std({color:0xb4b4b8,metalness:1,roughness:.3}),blackpaint:new T.MeshPhysicalMaterial({color:0x050505,roughness:.35,metalness:.2,clearcoat:.4}),
  proj_body:new T.MeshPhysicalMaterial({color:0x121513,roughness:.42,metalness:.75,clearcoat:.25}),film:new T.MeshPhysicalMaterial({color:0x2a160a,roughness:.25,clearcoat:.6}),rubber:std({color:0x080808,roughness:.85}),
  lensglass:new T.MeshPhysicalMaterial({color:0xe8f2ff,roughness:0,metalness:0,transparent:true,opacity:.35}),glass_ink:new T.MeshPhysicalMaterial({color:0x060a12,roughness:.05,clearcoat:1}),pen:new T.MeshPhysicalMaterial({color:0x050505,roughness:.2,clearcoat:1}),
  canister:std({color:0x9a9aa0,metalness:1,roughness:.35}),steel:new T.MeshPhysicalMaterial({color:0x050505,metalness:.85,roughness:.32,clearcoat:.2}),trim:new T.MeshPhysicalMaterial({color:0x0d0806,roughness:.35,clearcoat:.6}),
  sillstone:new T.MeshPhysicalMaterial({color:0x1e1c1a,roughness:.25,clearcoat:.6}),screenborder:std({color:0x030303,roughness:.9}),screen:std({color:0xd0cec6,roughness:.95})};
 MATS.parquet.roughnessMap=null;MATS.parquet.roughness=.68;MATS.parquet.envMapIntensity=.3;MATS.parquet.userData.keepEnv=1;
 MATS.parquet.roughnessMap=null;MATS.parquet.roughness=.68;MATS.parquet.envMapIntensity=.3;MATS.parquet.userData.keepEnv=1;
 S.MATS=MATS;addPack(ASSETS.shellPack.meshes);
 // pleated velvet curtains, generated here instead of downloaded (same pleat recipe as the Blender model)
 [[-4.6,1.1],[3.5,1.1],[-.55,1.1]].forEach(function(c,ci){var folds=7,nx=folds*12,nz=60,hg=3.75,S0=10,P=[],U=[],I=[];for(var a=0;a<=nx;a++){var u=a/nx;for(var b=0;b<=nz;b++){var v=b/nz,amp=.07*(1+.25*(1-v));var x=c[0]+u*c[1]*(1+.08*(1-v)*(u-.5)),yb=S0-.32+Math.sin(u*folds*2*Math.PI)*amp+(1-v)*.03*Math.sin(u*7),zb=.08+v*hg;P.push(x,zb,-yb);U.push(x,zb)}}
  for(a=0;a<nx;a++)for(b=0;b<nz;b++){var i0=a*(nz+1)+b,i1=i0+nz+1;I.push(i0,i1,i1+1,i0,i1+1,i0+1)}var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(P,3));g.setAttribute('uv',new T.Float32BufferAttribute(U,2));g.setIndex(I);g.computeVertexNormals();
  var m=new T.Mesh(g,MATS.velvet);m.material.side=T.DoubleSide;m.castShadow=true;m.receiveShadow=true;var k='Room_Curtain'+(ci?'_00'+ci:'');(G[k]=G[k]||new T.Group()).add(m);G[k].name=k;scene.add(G[k])});
 // curtains draw across the glazing for screenings
 S.curt=[];var cur=Object.keys(G).filter(function(k){return /^Room_Curtain(_[0-9]+)?$/.test(k)});var cp=[];cur.forEach(function(k){G[k].children.forEach(function(m){m.geometry.computeBoundingBox();cp.push(m)})});
 cp.sort(function(a,b){return a.geometry.boundingBox.min.x-b.geometry.boundingBox.min.x});
 cp.forEach(function(m,i){var bb=m.geometry.boundingBox,px=i===0?bb.min.x:(i===cp.length-1?bb.max.x:(bb.min.x+bb.max.x)/2);var piv=new T.Group();piv.position.set(px,0,0);scene.add(piv);m.geometry.translate(-px,0,0);piv.add(m);S.curt.push(piv);markHot(piv,'curtain','Draw or open the curtains')});
 S.curtainClosed=0;
 // exterior photograph beyond the glazing: elevated view north over Blue Area to the Margalla Hills
 var ext=new T.Mesh(new T.PlaneGeometry(112,75),new T.MeshBasicMaterial({map:texFor('ext',true),fog:false}));ext.position.set(0,1,-85);scene.add(ext);S.ext=ext;
 var glass=new T.Mesh(new T.PlaneGeometry(8,3.1),new T.MeshPhysicalMaterial({color:0xffffff,roughness:.03,transparent:true,opacity:.05,envMapIntensity:1.2,depthWrite:false}));glass.position.set(0,2.05,-10.02);scene.add(glass);
 // light: soft north glazing, warm practicals
 scene.add(new T.HemisphereLight(0xe6ecf2,0x2a1e16,.32));
 var wd=new T.DirectionalLight(0xfff0e0,.7);wd.position.set(1.5,6,-20);wd.target.position.set(0,0,-3);wd.castShadow=true;wd.shadow.mapSize.set(2048,2048);var c2=wd.shadow.camera;c2.left=-10;c2.right=10;c2.top=10;c2.bottom=-10;c2.far=50;wd.shadow.radius=5;wd.shadow.bias=-.0004;scene.add(wd,wd.target);S.windowDir=wd;
 var pend=new T.PointLight(0xffc98c,1.2,9,2);pend.position.set(0,3.05,-5.4);pend.castShadow=true;pend.shadow.bias=-.001;scene.add(pend);S.ceilLamp=pend;
 var dlp=new T.PointLight(0xffb470,.8,4,2);dlp.position.set(-.55,1.25,-5.5);scene.add(dlp);
 S.beam=new T.Mesh(new T.ConeGeometry(1.0,12.6,32,1,true),new T.MeshBasicMaterial({color:0xfff2d8,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}));S.beam.geometry.translate(0,-6.3,0);S.beam.geometry.rotateX(-Math.PI/2);S.beam.position.set(-2.67,.915,1.2);S.beam.lookAt(9.94,2.35,0);scene.add(S.beam);
 // panelled door on the south wall
 var door=new T.Group();door.position.set(-8.7,0,9.98);door.rotation.y=Math.PI;scene.add(door);var dw=MATS.walnut_dark,tr=MATS.trim;
 [-.62,.62].forEach(function(x){door.add(at(box(.1,2.5,.08,tr),x,1.25,.04))});door.add(at(box(1.34,.1,.08,tr),0,2.5,.04));door.add(at(box(1.14,2.42,.05,dw),0,1.21,.03));[[.85,1.65],[.75,.55]].forEach(function(p){door.add(M(rbox(.86,p[0],.03,.012,3),dw,0,p[1],.065))});
 var rose=M(new T.CylinderGeometry(.032,.032,.012,24),MATS.desk_brass,-.45,1.05,.07);rose.rotation.x=Math.PI/2;door.add(rose);var lev=M(new T.CylinderGeometry(.01,.01,.14,12),MATS.desk_brass,-.39,1.05,.095);lev.rotation.z=Math.PI/2;door.add(lev);
 (function(){var g=G['Room_ProjectionSurface'];if(g){markHot(g,'films','Films');stopObj.films=stopObj.films||g}})();
 var frameM=std({color:0x111010,roughness:.4,metalness:.1}),brass=std({color:0x1c1c1c,metalness:1,roughness:.3});S.frameM=frameM;S.brass=brass;
 tuneEnv();
}
function buildHero(pack){
 addPack(pack.meshes);
 // reels spin around their hubs
 S.reels=[];[['ReelFront',new T.Vector3(-2.83,1.245,1.2)],['ReelRear',new T.Vector3(-3.2,1.225,1.2)]].forEach(function(r){var g=G[r[0]];if(!g)return;var piv=new T.Group();piv.position.copy(r[1]);scene.add(piv);g.children.slice().forEach(function(m){m.geometry.translate(-r[1].x,-r[1].y,-r[1].z);piv.add(m)});S.reels.push(piv);S.reelAxis='z'});
 function hotG(n,page,label){var g=G[n];if(!g)return;markHot(g,page,label);stopObj[page]=stopObj[page]||g}
 hotG('Projector_Root','films','Films: the projector');hotG('ReelFront','films','Films: the projector');hotG('Desk_Root','about','About');hotG('ProjectorStand','films','Films');
 tuneEnv();
}
function buildContent(){
 var HW=10,HD=10,H=4.5,frameM=S.frameM,brass=S.brass;
 // projection screen (east wall) shows the films during screening
 var ps=G['Room_ProjectionSurface'];var films=imgs('#filmsCampaign .poster img');if(ps&&films.length){var psm=ps.children[0],pg=psm.geometry.attributes.position,pu=psm.geometry.attributes.uv;for(var q=0;q<pg.count;q++)pu.setXY(q,(pg.getZ(q)+3)/6,(pg.getY(q)-.6625)/3.375);pu.needsUpdate=true;
  S.filmTex=films.map(function(im){return imgTex(im,1024)});S.screenMat=std({color:0xcfccc4,emissive:0xffffff,emissiveMap:S.filmTex[0],emissiveIntensity:0,roughness:.95});psm.material=S.screenMat}
 [[-4,9.96],[3.5,9.96]].forEach(function(p){var s=new T.SpotLight(0xffd7a8,1.1,7,.5,.75,1.5);s.position.set(p[0],4.2,p[1]-2.6);s.target.position.set(p[0],1.9,p[1]);scene.add(s,s.target)});
 [[-3.5],[3.5]].forEach(function(p){var s=new T.SpotLight(0xffd7a8,1.1,7,.5,.75,1.5);s.position.set(-7.4,4.2,p[0]);s.target.position.set(-10,1.9,p[0]);scene.add(s,s.target)});
 // scanned furniture (Poly Haven, CC0)
 function put(n,x,y,z,ry,s){var o=new T.Group();o.position.set(x,y,z);o.rotation.y=ry||0;scene.add(o);later(n,s||1,function(m){o.add(m)});return o}
 put('dining_chair_02',0,0,-6.15,Math.PI);put('sofa_02',3.2,0,4.6,Math.PI/2,1.2);put('mid_century_lounge_chair',4.6,0,2.4,Math.PI/2+.5);
 put('potted_plant_04',4.6,0,-9.1,0,2.4);put('potted_plant_04',-4.7,0,-9.1,1.2,2.2);put('hanging_industrial_lamp',0,4.5,-5.4);put('desk_lamp_arm_01',-.75,.775,-5.65,2.4);
 var bsh=put('wooden_bookshelf_worn',-9.67,0,-7.6,Math.PI/2,1.05);var books=makeFavBooks();books.scale.setScalar(1.05);books.position.set(-9.67,0,-7.6);books.rotation.y=Math.PI/2;scene.add(books);
 var cbw=new T.Group();cbw.position.set(.55,.795,-5.08);cbw.rotation.y=Math.PI+.3;scene.add(cbw);later('clipboard',1.25,function(m){cbw.add(m)});
 var lc=cvs(1024,1380),lx=lc[1];lx.fillStyle='#f6f1e4';lx.fillRect(0,0,1024,1380);paperNoise(lx,1024,1380,8);lx.fillStyle='#222';lx.font='60px "Special Elite","Courier New",monospace';lx.fillText('CLIENTS',70,190);imgs('.logos img').slice(0,24).forEach(function(im,i){try{fitContain(lx,im,70+(i%4)*221+18,250+((i/4)|0)*150+18,185,114)}catch(e){}});
 var lp=new T.Mesh(new T.PlaneGeometry(.255,.36),std({map:tex(lc[0]),roughness:.9}));lp.rotation.x=-Math.PI/2;lp.position.set(0,.0085,.03);cbw.add(lp);markHot(cbw,'clients','Clients');stopObj.clients=cbw;
 var ph=new T.Group();ph.position.set(-7.4,1.15,9.99);ph.rotation.y=Math.PI;scene.add(ph);later('vintage_telephone_wall_clock',1.6,function(m){ph.add(m)});markHot(ph,'contact','Contact');stopObj.contact=ph;
 // ===== NORTH: corkboard =====
 var nb=new T.Group();nb.position.set(-4,1.95,9.96);nb.rotation.y=Math.PI;scene.add(nb);
 var frameM=std({color:0x111010,roughness:.4,metalness:.1});nb.add(at(box(3.9,2.15,.05,frameM),0,0,0));var ckc=corkCanvas(1536,820,5);var cork=new T.Mesh(new T.PlaneGeometry(3.74,1.99),std({map:tex(ckc),roughness:.95,bumpMap:tex(ckc,null,true),bumpScale:.006}));cork.position.z=.027;cork.receiveShadow=true;nb.add(cork);
 var cards=imgs('#cindexHome .ci'),pinM=std({color:0xb3221c,roughness:.3,metalness:.1}),pins=[],slots=[[-1.25,.42],[0,.48],[1.25,.4],[-1.22,-.5],[.02,-.46],[1.24,-.52]];
 cards.slice(0,6).forEach(function(card,i){var im=card.querySelector('img'),ttl=(card.querySelector('.ct')||{}).textContent||'',cl=(card.querySelector('.cl')||{}).textContent||'';
  var c2=cvs(560,640),x=c2[1];x.fillStyle='#f7f3ea';x.fillRect(0,0,560,640);paperNoise(x,560,640,50+i);try{fitCover(x,im,30,30,500,440)}catch(e){}x.fillStyle='rgba(0,0,0,.06)';x.fillRect(30,30,500,440);
  x.fillStyle='#1d2a5a';x.font='46px "Caveat",cursive';x.fillText(ttl,36,532);x.fillStyle='#555';x.font='30px "Caveat",cursive';x.fillText(cl,38,580);
  var pmh=new T.Mesh(new T.PlaneGeometry(.78,.89),std({map:tex(c2[0]),roughness:.75}));var s=slots[i];pmh.position.set(s[0],s[1],.035+i*.001);pmh.rotation.z=(i%2?1:-1)*(.03+((i*37)%7)/100);pmh.castShadow=true;pmh.receiveShadow=true;nb.add(pmh);
  var pin=new T.Mesh(new T.SphereGeometry(.022,14,10),pinM);pin.position.set(s[0],s[1]+.37,.06);pin.castShadow=true;nb.add(pin);pins.push(pin.position.clone());
  markHot(pmh,'campaigns','Campaign: '+ttl);pmh.userData.sub=(card.getAttribute('href')||'').split('/').pop()});
 var smat=new T.LineBasicMaterial({color:0xb3221c});[[0,1],[1,2],[1,4],[3,4],[4,5],[2,5]].forEach(function(pr){if(pins[pr[0]]&&pins[pr[1]]){nb.add(new T.Line(new T.BufferGeometry().setFromPoints([pins[pr[0]].clone().setZ(.065),pins[pr[1]].clone().setZ(.065)]),smat))}});
 var ic=cvs(512,300),ix=ic[1];ix.fillStyle='#fbf8ef';ix.fillRect(0,0,512,300);ix.strokeStyle='rgba(200,60,60,.6)';ix.beginPath();ix.moveTo(0,70);ix.lineTo(512,70);ix.stroke();ix.strokeStyle='rgba(80,120,200,.35)';for(var ln=1;ln<6;ln++){ix.beginPath();ix.moveTo(0,70+ln*42);ix.lineTo(512,70+ln*42);ix.stroke()}ix.fillStyle='#222';ix.font='52px "Special Elite","Courier New",monospace';ix.fillText('CAMPAIGNS',40,52);ix.font='40px "Caveat",cursive';ix.fillStyle='#1d2a5a';ix.fillText('Pick one. Pull the string.',40,150);
 var icm=new T.Mesh(new T.PlaneGeometry(.62,.36),std({map:tex(ic[0]),roughness:.8}));icm.position.set(-.62,-.02,.04);icm.rotation.z=.05;nb.add(icm);
 markHot(nb,'campaigns','Campaigns');anchors.campaigns=new T.Vector3(-1.9,2.95,-4.4);stopObj.campaigns=nb;
 var p1=brassPlate('CAMPAIGNS');p1.position.set(-4,.7,9.96);p1.rotation.y=Math.PI;scene.add(p1);

 // ===== NORTH (right): career board, every job on a ribbon =====
 var cg=new T.Group();cg.position.set(-9.96,1.95,-3.5);cg.rotation.y=Math.PI/2;scene.add(cg);
 cg.add(at(box(2.2,1.9,.05,frameM),0,0,0));var ckc2=corkCanvas(1100,950,9);var cork2=new T.Mesh(new T.PlaneGeometry(2.08,1.78),std({map:tex(ckc2),roughness:.95,bumpMap:tex(ckc2,null,true),bumpScale:.006}));cork2.position.z=.027;cork2.receiveShadow=true;cg.add(cork2);
 var JOBS=((window.DATA&&DATA.career)||[]).filter(function(c){return c.board}).reverse().map(function(c){var b=c.board;return[b.dates,b.company,b.sub,b.role,b.line]});
 var spots=[[-.78,.47],[-.26,.5],[.26,.46],[.78,.5],[.62,-.43],[0,-.46],[-.62,-.42]],jpins=[];
 JOBS.forEach(function(j,i){var c3=cvs(560,430),x=c3[1];x.fillStyle=i%3===1?'#f3efe4':'#fbf8ef';x.fillRect(0,0,560,430);paperNoise(x,560,430,70+i);x.strokeStyle='rgba(200,60,60,.55)';x.lineWidth=2;x.beginPath();x.moveTo(0,92);x.lineTo(560,92);x.stroke();
  x.fillStyle='#8a1f1f';x.font='44px "Caveat",cursive';x.fillText(j[0],30,66);x.fillStyle='#111';x.font='bold 44px "Special Elite","Courier New",monospace';x.fillText(j[1],30,160);x.fillStyle='#555';x.font='28px "Special Elite","Courier New",monospace';if(j[2])x.fillText(j[2],30,200);
  x.fillStyle='#1d2a5a';x.font='42px "Caveat",cursive';x.fillText(j[3],30,j[2]?262:240);x.fillStyle='#333';x.font='32px "Caveat",cursive';wrapText(x,j[4],30,j[2]?320:300,500,36);
  x.fillStyle='rgba(0,0,0,.25)';x.font='26px "Special Elite",monospace';x.fillText('0'+(i+1),500,410);
  var card=new T.Mesh(new T.PlaneGeometry(.46,.354),std({map:tex(c3[0]),roughness:.8}));var s=spots[i];card.position.set(s[0],s[1],.032+i*.0008);card.rotation.z=((i*53)%9-4)/120;card.castShadow=true;card.receiveShadow=true;cg.add(card);
  var pin=new T.Mesh(new T.SphereGeometry(.02,14,10),std({color:0xc9a560,metalness:.9,roughness:.3}));pin.position.set(s[0],s[1]+.15,.06);cg.add(pin);jpins.push(new T.Vector3(s[0],s[1]+.15,.058))});
 // satin ribbon threading every job in order
 var rp=[];for(var q=0;q<jpins.length-1;q++){var a=jpins[q],b2=jpins[q+1];for(var t=0;t<=1;t+=.05){var pt=a.clone().lerp(b2,t);pt.y-=Math.sin(t*Math.PI)*.07;pt.z+=Math.sin(t*Math.PI)*.012;rp.push(pt)}}
 var rcv=new T.CatmullRomCurve3(rp),N=420,pos=[],uvs=[],ind=[];for(var n=0;n<=N;n++){var tt=n/N,p0=rcv.getPoint(tt),tg=rcv.getTangent(tt),side=new T.Vector3().crossVectors(tg,new T.Vector3(0,0,1)).normalize().multiplyScalar(.011);var tw2=Math.sin(tt*40)*.25;side.applyAxisAngle(tg,tw2);
  pos.push(p0.x+side.x,p0.y+side.y,p0.z+side.z,p0.x-side.x,p0.y-side.y,p0.z-side.z);uvs.push(tt,0,tt,1);if(n<N){var k2=n*2;ind.push(k2,k2+1,k2+2,k2+1,k2+3,k2+2)}}
 var rgeo=new T.BufferGeometry();rgeo.setAttribute('position',new T.Float32BufferAttribute(pos,3));rgeo.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));rgeo.setIndex(ind);rgeo.computeVertexNormals();
 var ribbon=new T.Mesh(rgeo,new T.MeshPhysicalMaterial({color:0x9e1414,roughness:.35,sheen:1,sheenColor:new T.Color(0xff6a6a),sheenRoughness:.3,side:T.DoubleSide}));ribbon.castShadow=true;cg.add(ribbon);
 var ttc=cvs(512,120),tx=ttc[1];tx.fillStyle='#fbf8ef';tx.fillRect(0,0,512,120);tx.fillStyle='#111';tx.font='52px "Special Elite","Courier New",monospace';tx.fillText('CAREER',30,80);var ttm=new T.Mesh(new T.PlaneGeometry(.42,.1),std({map:tex(ttc[0]),roughness:.8}));ttm.position.set(0,.03,.04);ttm.rotation.z=-.03;cg.add(ttm);
 markHot(cg,'about','About: career board');stopObj.about=cg;
 var p5=brassPlate('CAREER');p5.position.set(-9.96,.7,-3.5);p5.rotation.y=Math.PI/2;scene.add(p5);
 var cwl=new T.SpotLight(0xffe0b0,.9,6,.42,.7,1.5);cwl.position.set(-7.5,3.9,-3.5);cwl.target.position.set(-10,1.9,-3.5);scene.add(cwl,cwl.target);
 // ===== WEST: statics =====
 var wg=new T.Group();wg.position.set(-9.96,.1,3.5);wg.rotation.y=Math.PI/2;scene.add(wg);
 var stat=imgs('.gallery img'),frameDark=std({color:0x17120e,roughness:.45,metalness:.1});var rows=[stat.slice(0,6),stat.slice(6,11)],rowY=[2.32,1.42],rowH=[.72,.68];
 rows.forEach(function(row,ri){var hgt=rowH[ri],gap=.16;var ws=row.map(function(im){return hgt*((im.naturalWidth||1)/(im.naturalHeight||1))});var tot=ws.reduce(function(a,b){return a+b},0)+gap*(row.length-1);var sc=Math.min(1,3.6/tot);var xx=-tot*sc/2;
  row.forEach(function(im,i){var w=ws[i]*sc,h=hgt*sc;var t=imgTex(im,1024);var fr=box(w+.07,h+.07,.035,frameDark);var cx2=xx+w/2;fr.position.set(cx2,rowY[ri]+(i%2?.03:-.02),.02);wg.add(fr);
   var mt=new T.Mesh(new T.PlaneGeometry(w+.03,h+.03),std({color:0xf4efe4,roughness:.9}));mt.position.set(cx2,fr.position.y,.039);wg.add(mt);
   var pic=new T.Mesh(new T.PlaneGeometry(w,h),std({map:t,roughness:.4}));pic.position.set(cx2,fr.position.y,.041);pic.receiveShadow=true;wg.add(pic);xx+=w+gap})});
 markHot(wg,'statics','Statics');anchors.statics=new T.Vector3(-4.4,2.95,1.85);stopObj.statics=wg;
 var p3=brassPlate('STATICS');p3.position.set(-9.96,.7,6.2);p3.rotation.y=Math.PI/2;scene.add(p3);

 // ===== SOUTH: whiteboard =====
 var sg=new T.Group();sg.position.set(3.5,1.95,9.96);sg.rotation.y=Math.PI;scene.add(sg);var alu=std({color:0x161616,metalness:.7,roughness:.3});sg.add(at(box(3.5,1.9,.04,alu),0,0,0));
 var wb=cvs(2048,1100),wx=wb[1];wx.fillStyle='#fbfbf8';wx.fillRect(0,0,2048,1100);blotch(wx,2048,1100,40,mulberry(77),'rgba(120,130,150,A)',260);
 wx.fillStyle='#1b2f8a';wx.font='110px "Caveat",cursive';wx.fillText('Scripts & verse',90,150);wx.strokeStyle='#1b2f8a';wx.lineWidth=6;wx.beginPath();wx.moveTo(90,175);wx.bezierCurveTo(400,160,700,195,860,170);wx.stroke();
 wx.direction='rtl';wx.textAlign='right';wx.fillStyle='#1b2f8a';wx.font='62px "Noto Nastaliq Urdu",serif';wx.fillText('قربانی ہی وفا کو قبول ہے',1950,330);wx.fillStyle='#b01e1e';wx.fillText('یہی رسمِ خلیل کا اصول ہے',1950,470);
 wx.fillStyle='#1d1d1d';wx.font='54px "Noto Nastaliq Urdu",serif';wx.fillText('کل کا روشن پاکستان',1950,640);wx.fillStyle='#1b6a3a';wx.fillText('کیونکہ یہ جہان ہے تو جان ہے',1950,790);wx.direction='ltr';wx.textAlign='left';
 [['COP29 script','#ffe27a',-.05],['5E DVC','#ffb3c1',.04],['World Population Day','#b7e4a8',-.03],['Eid ul Adha verse','#a8d8ff',.05],['Pakistan Day','#ffe27a',-.02],['Youm-e-Takbir','#ffcf99',.03]].forEach(function(n,i){var nx=100+(i%3)*270,ny=300+((i/3)|0)*280;wx.save();wx.translate(nx+120,ny+110);wx.rotate(n[2]);wx.fillStyle='rgba(0,0,0,.12)';wx.fillRect(-114,-100,240,220);wx.fillStyle=n[1];wx.fillRect(-120,-110,240,220);wx.fillStyle='#222';wx.font='44px "Caveat",cursive';wrapText(wx,n[0],-100,-40,200,48);wx.restore()});
 wx.fillStyle='#555';wx.font='48px "Caveat",cursive';wx.fillText('words written to be heard',100,1010);
 var board=new T.Mesh(new T.PlaneGeometry(3.38,1.8),std({map:tex(wb[0]),roughness:.15,metalness:0,envMapIntensity:.6}));board.position.z=.022;sg.add(board);
 sg.add(at(box(3.2,.03,.08,alu),0,-.95,.05));[[0x1b2f8a,-.8],[0xb01e1e,-.62],[0x1b6a3a,-.45],[0x222222,-.3]].forEach(function(m){var mk=new T.Mesh(new T.CylinderGeometry(.013,.013,.13,10),std({color:m[0],roughness:.4}));mk.rotation.z=Math.PI/2;mk.position.set(m[1],-.925,.06);sg.add(mk)});
 markHot(sg,'scripts','Scripts');anchors.scripts=new T.Vector3(1.75,2.92,4.4);stopObj.scripts=sg;
 var p4=brassPlate('SCRIPTS');p4.position.set(3.5,.7,9.96);p4.rotation.y=Math.PI;scene.add(p4);
 var dg=new T.BufferGeometry(),dn=90,dp=new Float32Array(dn*3);for(var di=0;di<dn;di++){dp[di*3]=(Math.random()-.5)*9;dp[di*3+1]=.3+Math.random()*3;dp[di*3+2]=-9.5+Math.random()*6}dg.setAttribute('position',new T.BufferAttribute(dp,3));S.dust=new T.Points(dg,new T.PointsMaterial({color:0xffe2c0,size:.008,transparent:true,opacity:.18,depthWrite:false}));scene.add(S.dust);
 tuneEnv();
}
function tuneEnv(){scene.traverse(function(o){if(o.material&&o.material.isMeshStandardMaterial&&o.material.envMapIntensity===1&&!o.material.userData.keepEnv&&!o.material.userData.tuned){o.material.envMapIntensity=.45;o.material.userData.tuned=1}})}
// ===== views: object framed to one side, title card in the free side =====
var WALL={campaigns:{c:[-4,1.95,9.96],n:[0,0,-1],w:4.0,h:2.25},films:{c:[9.94,2.35,0],n:[-1,0,0],w:6.6,h:3.8},statics:{c:[-9.96,1.95,3.5],n:[1,0,0],w:4.6,h:2.1},scripts:{c:[3.5,1.95,9.96],n:[0,0,-1],w:3.7,h:2.0},about:{c:[-9.96,1.95,-3.5],n:[1,0,0],w:2.4,h:2.0}};
var FIXED={home:{p:[-7.2,1.65,7.6],t:[1.0,1.45,-5.6]},clients:{p:[1.05,1.3,-4.35],t:[.55,.8,-5.1]},contact:{p:[-6.6,1.62,7.6],t:[-7.4,1.5,10]}};
function isDesk(){return innerWidth>900}function isPortrait(){return innerWidth<=700}
function view(k){var aspect=innerWidth/innerHeight,vf=T.MathUtils.degToRad(fovBase),hf=2*Math.atan(Math.tan(vf/2)*aspect);
 var fw=k==='home'?1:(isDesk()?.6:1),fh=k==='home'?1:(isPortrait()?.56:.86);
 if(FIXED[k])return{p:new T.Vector3().fromArray(FIXED[k].p),t:new T.Vector3().fromArray(FIXED[k].t)};var v=WALL[k];
 var dH=(v.h*1.12)/(2*Math.tan(vf/2)*fh),dW=(v.w*1.06)/(2*Math.tan(hf/2)*fw);var d=Math.min(Math.max(dH,dW),12);
 var c=new T.Vector3().fromArray(v.c),n=new T.Vector3().fromArray(v.n);return{p:c.clone().add(n.multiplyScalar(d)),t:c}}
function voff(k){if(k==='home')return{x:0,y:0};if(isDesk())return{x:-innerWidth*.19,y:0};if(isPortrait())return{x:0,y:innerHeight*.17};return{x:0,y:0}}
var VIEWS={},VOFF={};function layout(){STOPS.forEach(function(k){VIEWS[k]=view(k);VOFF[k]=voff(k)})}
function resize(){if(!renderer)return;renderer.setSize(innerWidth,innerHeight,false);if(S.composer)S.composer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();layout()}
addEventListener('resize',resize);

// ===== open camera: free look and walk everywhere; tabs fly straight to a spot =====
var free=true,pos=new T.Vector3(),yaw=0,pitch=0,keys={},drag=null,suppressClick=false,fly=null,active='home',offCur={x:0,y:0},offTgt={x:0,y:0},dolly=0;
function dirOf(y,p){return new T.Vector3(Math.sin(y)*Math.cos(p),Math.sin(p),Math.cos(y)*Math.cos(p))}
function aim(p,t){var d=t.clone().sub(p).normalize();return{yaw:Math.atan2(d.x,d.z),pitch:Math.asin(Math.max(-1,Math.min(1,d.y)))}}
function wrapA(a){while(a>Math.PI)a-=2*Math.PI;while(a<-Math.PI)a+=2*Math.PI;return a}
function flyTo(k,instant){if(!VIEWS[k])return;var v=VIEWS[k],a=aim(v.p,v.t);active=k;offTgt=VOFF[k]||{x:0,y:0};updateTabs(true);
 if(instant||reduce){pos.copy(v.p);yaw=a.yaw;pitch=a.pitch;fly=null;return}
 var dist=pos.distanceTo(v.p);fly={p0:pos.clone(),y0:yaw,pi0:pitch,p1:v.p.clone(),y1:yaw+wrapA(a.yaw-yaw),pi1:a.pitch,t0:performance.now(),d:Math.min(1600,650+dist*70)}}
S.flyTo=flyTo;
function clampPos(p){p.x=Math.max(-9.5,Math.min(9.5,p.x));p.z=Math.max(-9.5,Math.min(9.5,p.z));p.y=Math.max(.9,Math.min(3.6,p.y));[[-1.2,1.2,-6.6,-4.8],[-3.5,-2.5,.8,1.6],[-10,-9.1,-8.5,-6.7],[2.4,4.1,3.4,5.8]].forEach(function(r){if(p.x>r[0]&&p.x<r[1]&&p.z>r[2]&&p.z<r[3]){var dx=Math.min(p.x-r[0],r[1]-p.x),dz=Math.min(p.z-r[2],r[3]-p.z);if(dx<dz)p.x=(p.x-r[0]<r[1]-p.x)?r[0]:r[1];else p.z=(p.z-r[2]<r[3]-p.z)?r[2]:r[3]}})}
function userMoved(){fly=null;offTgt={x:0,y:0}}
// which section is the camera on? nearest framing, judged by position and where it looks
var fwd=new T.Vector3();
function detectActive(){if(fly)return;var d0=dirOf(yaw,pitch),best=null,bs=1e9;STOPS.forEach(function(k){if(k==='home')return;var v=VIEWS[k];if(!v)return;var vd=v.t.clone().sub(v.p).normalize();var toT=v.t.clone().sub(pos);var dist=toT.length();toT.normalize();
  var s=(1-d0.dot(toT))*6+Math.max(0,dist-v.p.distanceTo(v.t))*.35+pos.distanceTo(v.p)*.15;if(d0.dot(toT)<.55)s+=99;if(s<bs){bs=s;best=k}});
 var nk=bs<2.6?best:'home';if(nk!==active){active=nk;updateTabs(true)}}

// ===== title cards for the section in view =====
var cards=[];
function buildTitles(){titles.innerHTML='';cards=STOPS.map(function(k,i){var el=document.createElement('div');el.className='stc'+(k==='home'?' home':'');
 if(k==='home')el.innerHTML='<p class="ur" lang="ur">لفظ، خیال، اور حکمتِ عملی</p><h2>Ali Hashim</h2><p>Creative strategist and bilingual copywriter. Step into the writers’ room.</p><span class="scrollcue"><i></i>Drag to look around, or pick a section above</span>';
 else if(k==='contact')el.innerHTML='<p class="no">0'+i+' / 0'+(STOPS.length-1)+'</p><h2>Contact me</h2><p>'+LINES[k]+'</p><div class="cl"><a href="mailto:work.alihashim@gmail.com">work.alihashim@gmail.com</a><a href="https://www.linkedin.com/in/alee-hashim/" target="_blank" rel="noopener">linkedin.com/in/alee-hashim</a><a href="tel:+923345443377">+92 334 5443377</a></div>';
 else el.innerHTML='<p class="no">0'+i+' / 0'+(STOPS.length-1)+'</p><h2>'+(k==='about'?'About and career':LABEL[k])+'</h2><p>'+LINES[k]+'</p><button class="open" type="button" data-open="'+k+'">Open '+(k==='about'?'full profile':LABEL[k].toLowerCase())+' ↗</button>';
 titles.appendChild(el);return el})}
titles.addEventListener('click',function(e){var b=e.target.closest('[data-open]');if(b)openSheet(b.getAttribute('data-open'))});
var tmpV=new T.Vector3();
function placeTitles(dt){var W=innerWidth,H=innerHeight,top=W>900?90:124;cards.forEach(function(el,i){var k=STOPS[i];var want=(k===active&&!sheetOpen&&!(k==='home'&&S.moved))?1:0;var o=parseFloat(el.dataset.o||'0');o+=(want-o)*Math.min(1,(dt||.016)*6);el.dataset.o=o;
 el.style.opacity=o.toFixed(3);el.style.visibility=o<.02?'hidden':'visible';if(o<.02)return;var cw=el.offsetWidth,ch=el.offsetHeight,x,y;
 if(isPortrait()){x=12;y=H-ch-18}else if(isDesk()){x=Math.max(24,W*.045);y=Math.max(top,H*.5-ch/2)}else{x=16;y=H-ch-24}
 el.style.transform='translate3d('+Math.round(x)+'px,'+Math.round(y+(1-o)*24)+'px,0)'})}
titles.addEventListener('click',function(e){var b=e.target.closest('[data-open]');if(b)openSheet(b.getAttribute('data-open'))});

// ===== tabs =====
var tabs=Array.prototype.slice.call(document.querySelectorAll('[data-stop]'));
tabs.forEach(function(a){a.addEventListener('click',function(e){if(body.classList.contains('classic'))return;e.preventDefault();var k=a.getAttribute('data-stop');if(sheetOpen)closeSheet(true);flyTo(k);try{history.replaceState(null,'','#/'+k)}catch(x){}})});
var lastTab='';function updateTabs(force){if(!force&&lastTab===active)return;lastTab=active;tabs.forEach(function(a){if(a.getAttribute('data-stop')===active&&a.parentNode.classList.contains('tabs2'))a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')})}

// ===== full-zoom sheet =====
function objRect(k){var o=stopObj[k];if(!o)return null;var b=new T.Box3().setFromObject(o),pts=[],mn={x:1e9,y:1e9},mx={x:-1e9,y:-1e9};
 for(var i=0;i<8;i++){tmpV.set(i&1?b.max.x:b.min.x,i&2?b.max.y:b.min.y,i&4?b.max.z:b.min.z).project(camera);var sx=(tmpV.x*.5+.5)*innerWidth,sy=(-tmpV.y*.5+.5)*innerHeight;mn.x=Math.min(mn.x,sx);mn.y=Math.min(mn.y,sy);mx.x=Math.max(mx.x,sx);mx.y=Math.max(mx.y,sy)}
 mn.x=Math.max(0,mn.x);mn.y=Math.max(0,mn.y);mx.x=Math.min(innerWidth,mx.x);mx.y=Math.min(innerHeight,mx.y);if(mx.x-mn.x<20||mx.y-mn.y<20)return null;return{x:mn.x,y:mn.y,w:mx.x-mn.x,h:mx.y-mn.y}}
function fromRectTransform(r){var pr=panel.getBoundingClientRect();if(!r)r={x:innerWidth/2-80,y:innerHeight/2-50,w:160,h:100};return 'translate('+(r.x-pr.left)+'px,'+(r.y-pr.top)+'px) scale('+(r.w/pr.width).toFixed(4)+','+(r.h/pr.height).toFixed(4)+')'}
function openSheet(k,sub){if(!document.querySelector('.page[data-page="'+k+'"]'))return;
 panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');window.__showPage(k);where.textContent=LABEL[k];sheetOpen=k;hideTip();
 panel.classList.remove('anim');panel.style.transform=fromRectTransform(objRect(k));panel.style.borderRadius='18px';panel.classList.add('open');panel.scrollTop=0;
 void panel.offsetWidth;panel.classList.add('anim');panel.style.transform='none';panel.style.borderRadius='';scrim.classList.add('on');fovTarget=fovBase*.82;
 var t=sub&&document.getElementById(sub);if(t)setTimeout(function(){t.scrollIntoView({behavior:reduce?'auto':'smooth'})},680);
 try{history.replaceState(null,'','#/'+k+(sub?'/'+sub:''))}catch(e){}
 setTimeout(function(){var b=document.getElementById('back');if(b)b.focus({preventScroll:true})},50)}
function closeSheet(instant){if(!sheetOpen)return;var k=sheetOpen;sheetOpen=null;fovTarget=fovBase;scrim.classList.remove('on');panel.removeAttribute('role');panel.removeAttribute('aria-modal');
 if(instant){panel.classList.remove('open','anim');panel.style.transform='';return}
 panel.classList.add('anim');panel.style.transform=fromRectTransform(objRect(k));panel.style.borderRadius='18px';setTimeout(function(){panel.classList.remove('open');panel.classList.remove('anim');panel.style.transform='';panel.style.borderRadius=''},560);
 try{history.replaceState(null,'','#/'+k)}catch(e){}}
S.close=closeSheet;
document.getElementById('back').addEventListener('click',function(){closeSheet()});scrim.addEventListener('click',function(){closeSheet()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&sheetOpen&&!(window.__lbOpen&&__lbOpen()))closeSheet()});
function applyHash(instant){var h=location.hash.replace(/^#\/?/,'').split('/');var k=h[0]==='tabeeb'?'films':h[0];if(STOPS.indexOf(k)<0)k='home';flyTo(k,instant);if(h[1])setTimeout(function(){openSheet(k,h[1])},instant?400:1200)}
addEventListener('hashchange',function(){if(body.classList.contains('classic'))return;applyHash(false)});

// ===== pointer: drag to look, walk with keys / right-drag / wheel / two fingers =====
var ray=new T.Raycaster(),ptr=new T.Vector2(),cv=document.getElementById('gl');
function pick(e){ptr.x=(e.clientX/innerWidth)*2-1;ptr.y=-(e.clientY/innerHeight)*2+1;ray.setFromCamera(ptr,camera);var hits=ray.intersectObjects(scene.children,true);for(var i=0;i<hits.length;i++){var o=hits[i].object;if(!o.visible||o.isPoints||(o.material&&o.material.transparent&&o.material.opacity<.2))continue;var c=o;while(c&&!c.userData.page)c=c.parent;return c||null}return null}
var lastPick=0;
function hideTip(){tip.classList.remove('on');cv.classList.remove('hot');body.style.cursor=''}
function uiTarget(e){return e.target.closest&&e.target.closest('a,button,.panel,.topbar,.lb,.stc,.roamhint')}
function studioOn(){return S.ready&&!sheetOpen&&!body.classList.contains('classic')}
function walk(f,r){var fw=new T.Vector3(Math.sin(yaw),0,Math.cos(yaw)),rt=new T.Vector3(-Math.cos(yaw),0,Math.sin(yaw));pos.addScaledVector(fw,f).addScaledVector(rt,r);clampPos(pos)}
addEventListener('pointerdown',function(e){if(!studioOn()||e.pointerType==='touch'||uiTarget(e))return;drag={x:e.clientX,y:e.clientY,btn:e.button,moved:false};if(e.button===2)e.preventDefault()});
addEventListener('contextmenu',function(e){if(S.ready&&!body.classList.contains('classic')&&!uiTarget(e))e.preventDefault()});
addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;
 if(drag){var dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.moved&&Math.abs(dx)+Math.abs(dy)>4){drag.moved=true;userMoved();S.moved=1;hideTip()}
  if(drag.moved){if(drag.btn===2)walk(-(e.movementY||0)*.01,(e.movementX||0)*.01);else{yaw-=(e.movementX||0)*.0042;pitch=Math.max(-1.2,Math.min(1.2,pitch-(e.movementY||0)*.0042))}}return}
 if(!studioOn())return;if(uiTarget(e))return hideTip();var nowp=performance.now();if(nowp-lastPick<90)return;lastPick=nowp;var h=pick(e);
 if(h){var k=h.userData.page,here=k===active;tip.textContent=k==='curtain'?h.userData.label:(h.userData.yt?h.userData.label:((here?'Open ':'Go to ')+(h.userData.label||LABEL[k])));tip.style.left=e.clientX+'px';tip.style.top=e.clientY+'px';tip.classList.add('on');cv.classList.add('hot');body.style.cursor='pointer'}else hideTip()},{passive:true});
addEventListener('pointerup',function(){if(drag&&drag.moved)suppressClick=true;drag=null});
addEventListener('wheel',function(e){if(!studioOn()||uiTarget(e))return;e.preventDefault();userMoved();S.moved=1;dolly+=-e.deltaY*.0035},{passive:false});
addEventListener('click',function(e){if(suppressClick){suppressClick=false;return}if(!studioOn()||uiTarget(e))return;var h=pick(e);if(!h)return;var k=h.userData.page;
 if(k==='curtain'){S.manualCurtain=!S.manualCurtain;return}
 if(h.userData.yt&&window.__playYT){__playYT(h.userData.yt,h.userData.short);return}
 if(k===active||pos.distanceTo(VIEWS[k]?VIEWS[k].t:pos)<4.5)openSheet(k,h.userData.sub);else{flyTo(k);try{history.replaceState(null,'','#/'+k)}catch(x){}}});
addEventListener('keydown',function(e){if(e.target.closest&&e.target.closest('input,textarea'))return;var k=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].indexOf(k)>-1&&studioOn()){keys[k]=true;userMoved();S.moved=1;e.preventDefault()}});
addEventListener('keyup',function(e){keys[e.key.toLowerCase()]=false});
// touch: one finger looks, two fingers walk, pinch moves forward/back
var tch=null;
addEventListener('touchstart',function(e){if(!studioOn()||uiTarget(e))return;userMoved();S.moved=1;
 if(e.touches.length>=2){var a=e.touches[0],b=e.touches[1];tch={mode:'walk',x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2,d:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)};return}
 var t0=e.touches[0];tch={mode:'look',x:t0.clientX,y:t0.clientY,sx:t0.clientX,sy:t0.clientY,moved:false}},{passive:true});
addEventListener('touchmove',function(e){if(!tch)return;e.preventDefault();
 if(tch.mode==='look'&&e.touches.length===1){var t1=e.touches[0];if(Math.abs(t1.clientX-tch.sx)+Math.abs(t1.clientY-tch.sy)>6)tch.moved=true;yaw+=(t1.clientX-tch.x)*.0055;pitch=Math.max(-1.2,Math.min(1.2,pitch+(t1.clientY-tch.y)*.0055));tch.x=t1.clientX;tch.y=t1.clientY}
 else if(e.touches.length>=2){var a=e.touches[0],b=e.touches[1],mx=(a.clientX+b.clientX)/2,my=(a.clientY+b.clientY)/2,dd=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);if(tch.mode!=='walk'){tch={mode:'walk',x:mx,y:my,d:dd}}
  walk((my-tch.y)*.012+(dd-tch.d)*.015,-(mx-tch.x)*.012);tch.x=mx;tch.y=my;tch.d=dd;tch.moved=true}},{passive:false});
addEventListener('touchend',function(e){if(tch&&tch.moved){suppressClick=true;setTimeout(function(){suppressClick=false},350)}if(e.touches.length===0)tch=null});
var rt=document.getElementById('resumeTour');if(rt)rt.style.display='none';
setTimeout(function(){var rh=document.getElementById('roamhint');if(rh)rh.classList.add('quiet')},7000);

// ===== post-processing (loaded after the room is on screen, desktop only) =====
function setupFX(){if(!window.FX)return;try{var low=innerWidth<760||(navigator.hardwareConcurrency||4)<=4;var c=new FX.EffectComposer(renderer);c.setPixelRatio(renderer.getPixelRatio());c.setSize(innerWidth,innerHeight);c.addPass(new FX.RenderPass(scene,camera));
 if(!low&&FX.GTAOPass){var g=new FX.GTAOPass(scene,camera,innerWidth,innerHeight);g.blendIntensity=.9;g.updateGtaoMaterial({radius:.4,distanceExponent:1,thickness:1,scale:1,samples:12});c.addPass(g);S.gtao=g}
 c.addPass(new FX.UnrealBloomPass(new T.Vector2(innerWidth,innerHeight),.22,.5,.93));
 var v=new FX.ShaderPass({uniforms:{tDiffuse:{value:null},t:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform sampler2D tDiffuse;uniform float t;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+t)*43758.5453);}void main(){vec4 c=texture2D(tDiffuse,vUv);vec2 d=vUv-.5;c.rgb*=1.-dot(d,d)*.6;c.rgb+=(h(vUv*1000.)-.5)*.02*(c.rgb+.05);gl_FragColor=c;}'});c.addPass(v);S.grainPass=v;
 c.addPass(new FX.OutputPass());S.composer=c}catch(e){S.composer=null}}
S.setupFX=setupFX;
// ===== loop =====
function ease(u){return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2}
var lastT=performance.now();
function loop(){if(!running)return;requestAnimationFrame(loop);var now=performance.now(),dt=Math.min(.05,(now-lastT)/1000);lastT=now;var t=clock.getElapsedTime();
 if(fly){var u=Math.min(1,(now-fly.t0)/fly.d),e=ease(u);pos.lerpVectors(fly.p0,fly.p1,e);pos.y+=Math.sin(e*Math.PI)*Math.min(.6,fly.p0.distanceTo(fly.p1)*.04);yaw=fly.y0+(fly.y1-fly.y0)*e;pitch=fly.pi0+(fly.pi1-fly.pi0)*e;if(u>=1)fly=null}
 else{var sp=2.6*dt;if(keys.w||keys.arrowup)walk(sp,0);if(keys.s||keys.arrowdown)walk(-sp,0);if(keys.a||keys.arrowleft)walk(0,-sp);if(keys.d||keys.arrowright)walk(0,sp);
  if(Math.abs(dolly)>.0005){var dv=dirOf(yaw,pitch);pos.addScaledVector(dv,dolly*.25);clampPos(pos);dolly*=.78}}
 camera.position.copy(pos);camera.lookAt(pos.clone().add(dirOf(yaw,pitch)));
 detectActive();
 offCur.x+=(offTgt.x-offCur.x)*.08;offCur.y+=(offTgt.y-offCur.y)*.08;if(Math.abs(offCur.x)>.5||Math.abs(offCur.y)>.5)camera.setViewOffset(innerWidth,innerHeight,offCur.x,offCur.y,innerWidth,innerHeight);else if(camera.view&&camera.view.enabled)camera.clearViewOffset();
 fovNow+=(fovTarget-fovNow)*.08;if(Math.abs(camera.fov-fovNow)>.01){camera.fov=fovNow;camera.updateProjectionMatrix()}
 // screening starts whenever the projection wall is in view, however you got there
 var sc=new T.Vector3(9.94,2.35,0),toS=sc.clone().sub(pos),dS=toS.length();toS.normalize();var looking=dirOf(yaw,pitch).dot(toS)>.82&&dS<16;
 var want=(S.manualCurtain||active==='films'||looking)?1:0;S.curtainClosed+=(want-S.curtainClosed)*Math.min(1,dt*1.6);var cc=S.curtainClosed;
 if(S.curt)S.curt.forEach(function(p){p.scale.x=1+cc*1.95});
 if(S.windowLight)S.windowLight.intensity=4.5*(1-cc*.92);if(S.windowDir)S.windowDir.intensity=.7*(1-cc*.95);if(S.ext)S.ext.material.color.setScalar(1-cc*.85);if(S.ceilLamp)S.ceilLamp.intensity=1.2*(1-cc*.75);
 if(S.screenMat){S.screenMat.emissiveIntensity=cc*1.1;S.screenMat.color.setScalar(.81*(1-cc*.8));if(cc>.5&&now-(S.lastFilm||0)>4200){S.lastFilm=now;S.fi=((S.fi||0)+1)%S.filmTex.length;S.screenMat.emissiveMap=S.filmTex[S.fi];S.screenMat.needsUpdate=true}}
 if(S.beam)S.beam.material.opacity=cc*.035;
 if(S.reels&&!reduce)S.reels.forEach(function(r){r.rotation.z-=dt*2.2*cc});
 if(S.dust&&!reduce){S.dust.rotation.y=t*.01}
 if(S.grainPass)S.grainPass.uniforms.t.value=t%10;if(S.composer)S.composer.render();else renderer.render(scene,camera);
 if(!S.firstFrame){S.firstFrame=performance.now();if(window.__t3d)console.info('3D first frame in',Math.round(S.firstFrame-window.__t3d),'ms')}
 placeTitles(dt);updateTabs()}
S.pause=function(p){running=!p;html.style.overflow=p?'':'hidden';if(!p&&S.ready)loop()};
S.sync=function(){html.classList.add('studio-html');html.style.overflow='hidden';layout();applyHash(true)};
document.addEventListener('visibilitychange',function(){if(document.hidden)running=false;else if(!body.classList.contains('classic')&&S.ready&&!running){running=true;loop()}});
// grain
(function(){var a=cvs(160,160),x=a[1],d=x.createImageData(160,160);for(var i=0;i<d.data.length;i+=4){var v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}x.putImageData(d,0,0);var g=document.getElementById('grain');if(g)g.style.backgroundImage='url('+a[0].toDataURL()+')'})();
buildTitles();
if(pref==='classic'){window.__setClassic(true)}else{html.classList.add('studio-html');boot()}
})();
