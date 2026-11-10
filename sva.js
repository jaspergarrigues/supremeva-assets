!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):(t="undefined"!=typeof globalThis?globalThis:t||self).Lenis=i()}(this,(function(){"use strict";function clamp(t,i,e){return Math.max(t,Math.min(i,e))}class Animate{constructor(){this.isRunning=!1,this.value=0,this.from=0,this.to=0,this.currentTime=0}advance(t){var i;if(!this.isRunning)return;let e=!1;if(this.duration&&this.easing){this.currentTime+=t;const i=clamp(0,this.currentTime/this.duration,1);e=i>=1;const s=e?1:this.easing(i);this.value=this.from+(this.to-this.from)*s}else this.lerp?(this.value=function damp(t,i,e,s){return function lerp(t,i,e){return(1-e)*t+e*i}(t,i,1-Math.exp(-e*s))}(this.value,this.to,60*this.lerp,t),Math.round(this.value)===this.to&&(this.value=this.to,e=!0)):(this.value=this.to,e=!0);e&&this.stop(),null===(i=this.onUpdate)||void 0===i||i.call(this,this.value,e)}stop(){this.isRunning=!1}fromTo(t,i,{lerp:e,duration:s,easing:o,onStart:n,onUpdate:l}){this.from=this.value=t,this.to=i,this.lerp=e,this.duration=s,this.easing=o,this.currentTime=0,this.isRunning=!0,null==n||n(),this.onUpdate=l}}class Dimensions{constructor(t,i,{autoResize:e=!0,debounce:s=250}={}){this.wrapper=t,this.content=i,this.width=0,this.height=0,this.scrollHeight=0,this.scrollWidth=0,this.resize=()=>{this.onWrapperResize(),this.onContentResize()},this.onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)},this.onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)},e&&(this.debouncedResize=function debounce(t,i){let e;return function(...s){let o=this;clearTimeout(e),e=setTimeout((()=>{e=void 0,t.apply(o,s)}),i)}}(this.resize,s),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize,!1):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){var t,i;null===(t=this.wrapperResizeObserver)||void 0===t||t.disconnect(),null===(i=this.contentResizeObserver)||void 0===i||i.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize,!1)}get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}}class Emitter{constructor(){this.events={}}emit(t,...i){var e;let s=this.events[t]||[];for(let t=0,o=s.length;t<o;t++)null===(e=s[t])||void 0===e||e.call(s,...i)}on(t,i){var e;return(null===(e=this.events[t])||void 0===e?void 0:e.push(i))||(this.events[t]=[i]),()=>{var e;this.events[t]=null===(e=this.events[t])||void 0===e?void 0:e.filter((t=>i!==t))}}off(t,i){var e;this.events[t]=null===(e=this.events[t])||void 0===e?void 0:e.filter((t=>i!==t))}destroy(){this.events={}}}const t=100/6,i={passive:!1};class VirtualScroll{constructor(e,s={wheelMultiplier:1,touchMultiplier:1}){this.element=e,this.options=s,this.touchStart={x:0,y:0},this.lastDelta={x:0,y:0},this.window={width:0,height:0},this.emitter=new Emitter,this.onTouchStart=t=>{const{clientX:i,clientY:e}=t.targetTouches?t.targetTouches[0]:t;this.touchStart.x=i,this.touchStart.y=e,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:t})},this.onTouchMove=t=>{const{clientX:i,clientY:e}=t.targetTouches?t.targetTouches[0]:t,s=-(i-this.touchStart.x)*this.options.touchMultiplier,o=-(e-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=i,this.touchStart.y=e,this.lastDelta={x:s,y:o},this.emitter.emit("scroll",{deltaX:s,deltaY:o,event:t})},this.onTouchEnd=t=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:t})},this.onWheel=i=>{let{deltaX:e,deltaY:s,deltaMode:o}=i;e*=1===o?t:2===o?this.window.width:1,s*=1===o?t:2===o?this.window.height:1,e*=this.options.wheelMultiplier,s*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:e,deltaY:s,event:i})},this.onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}},window.addEventListener("resize",this.onWindowResize,!1),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,i),this.element.addEventListener("touchstart",this.onTouchStart,i),this.element.addEventListener("touchmove",this.onTouchMove,i),this.element.addEventListener("touchend",this.onTouchEnd,i)}on(t,i){return this.emitter.on(t,i)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize,!1),this.element.removeEventListener("wheel",this.onWheel,i),this.element.removeEventListener("touchstart",this.onTouchStart,i),this.element.removeEventListener("touchmove",this.onTouchMove,i),this.element.removeEventListener("touchend",this.onTouchEnd,i)}}return class Lenis{constructor({wrapper:t=window,content:i=document.documentElement,eventsTarget:e=t,smoothWheel:s=!0,syncTouch:o=!1,syncTouchLerp:n=.075,touchInertiaMultiplier:l=35,duration:r,easing:h=(t=>Math.min(1,1.001-Math.pow(2,-10*t))),lerp:a=.1,infinite:c=!1,orientation:u="vertical",gestureOrientation:d="vertical",touchMultiplier:p=1,wheelMultiplier:m=1,autoResize:v=!0,prevent:g,virtualScroll:S,__experimental__naiveDimensions:w=!1}={}){this._isScrolling=!1,this._isStopped=!1,this._isLocked=!1,this._preventNextNativeScrollEvent=!1,this._resetVelocityTimeout=null,this.time=0,this.userData={},this.lastVelocity=0,this.velocity=0,this.direction=0,this.animate=new Animate,this.emitter=new Emitter,this.onPointerDown=t=>{1===t.button&&this.reset()},this.onVirtualScroll=t=>{if("function"==typeof this.options.virtualScroll&&!1===this.options.virtualScroll(t))return;const{deltaX:i,deltaY:e,event:s}=t;if(this.emitter.emit("virtual-scroll",{deltaX:i,deltaY:e,event:s}),s.ctrlKey)return;const o=s.type.includes("touch"),n=s.type.includes("wheel");this.isTouching="touchstart"===s.type||"touchmove"===s.type;if(this.options.syncTouch&&o&&"touchstart"===s.type&&!this.isStopped&&!this.isLocked)return void this.reset();const l=0===i&&0===e,r="vertical"===this.options.gestureOrientation&&0===e||"horizontal"===this.options.gestureOrientation&&0===i;if(l||r)return;let h=s.composedPath();h=h.slice(0,h.indexOf(this.rootElement));const a=this.options.prevent;if(h.find((t=>{var i,e,s,l,r;return t instanceof HTMLElement&&("function"==typeof a&&(null==a?void 0:a(t))||(null===(i=t.hasAttribute)||void 0===i?void 0:i.call(t,"data-lenis-prevent"))||o&&(null===(e=t.hasAttribute)||void 0===e?void 0:e.call(t,"data-lenis-prevent-touch"))||n&&(null===(s=t.hasAttribute)||void 0===s?void 0:s.call(t,"data-lenis-prevent-wheel"))||(null===(l=t.classList)||void 0===l?void 0:l.contains("lenis"))&&!(null===(r=t.classList)||void 0===r?void 0:r.contains("lenis-stopped")))})))return;if(this.isStopped||this.isLocked)return void s.preventDefault();if(!(this.options.syncTouch&&o||this.options.smoothWheel&&n))return this.isScrolling="native",void this.animate.stop();s.preventDefault();let c=e;"both"===this.options.gestureOrientation?c=Math.abs(e)>Math.abs(i)?e:i:"horizontal"===this.options.gestureOrientation&&(c=i);const u=o&&this.options.syncTouch,d=o&&"touchend"===s.type&&Math.abs(c)>5;d&&(c=this.velocity*this.options.touchInertiaMultiplier),this.scrollTo(this.targetScroll+c,Object.assign({programmatic:!1},u?{lerp:d?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}))},this.onNativeScroll=()=>{if(null!==this._resetVelocityTimeout&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent)this._preventNextNativeScrollEvent=!1;else if(!1===this.isScrolling||"native"===this.isScrolling){const t=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-t,this.direction=Math.sign(this.animatedScroll-t),this.isScrolling="native",this.emit(),0!==this.velocity&&(this._resetVelocityTimeout=setTimeout((()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()}),400))}},window.lenisVersion="1.1.13",t&&t!==document.documentElement&&t!==document.body||(t=window),this.options={wrapper:t,content:i,eventsTarget:e,smoothWheel:s,syncTouch:o,syncTouchLerp:n,touchInertiaMultiplier:l,duration:r,easing:h,lerp:a,infinite:c,gestureOrientation:d,orientation:u,touchMultiplier:p,wheelMultiplier:m,autoResize:v,prevent:g,virtualScroll:S,__experimental__naiveDimensions:w},this.dimensions=new Dimensions(t,i,{autoResize:v}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown,!1),this.virtualScroll=new VirtualScroll(e,{touchMultiplier:p,wheelMultiplier:m}),this.virtualScroll.on("scroll",this.onVirtualScroll)}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown,!1),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName()}on(t,i){return this.emitter.on(t,i)}off(t,i){return this.emitter.off(t,i)}setScroll(t){this.isHorizontal?this.rootElement.scrollLeft=t:this.rootElement.scrollTop=t}resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){this.isStopped&&(this.isStopped=!1,this.reset())}stop(){this.isStopped||(this.isStopped=!0,this.animate.stop(),this.reset())}raf(t){const i=t-(this.time||t);this.time=t,this.animate.advance(.001*i)}scrollTo(t,{offset:i=0,immediate:e=!1,lock:s=!1,duration:o=this.options.duration,easing:n=this.options.easing,lerp:l=this.options.lerp,onStart:r,onComplete:h,force:a=!1,programmatic:c=!0,userData:u}={}){if(!this.isStopped&&!this.isLocked||a){if("string"==typeof t&&["top","left","start"].includes(t))t=0;else if("string"==typeof t&&["bottom","right","end"].includes(t))t=this.limit;else{let e;if("string"==typeof t?e=document.querySelector(t):t instanceof HTMLElement&&(null==t?void 0:t.nodeType)&&(e=t),e){if(this.options.wrapper!==window){const t=this.rootElement.getBoundingClientRect();i-=this.isHorizontal?t.left:t.top}const s=e.getBoundingClientRect();t=(this.isHorizontal?s.left:s.top)+this.animatedScroll}}if("number"==typeof t){if(t+=i,t=Math.round(t),this.options.infinite?c&&(this.targetScroll=this.animatedScroll=this.scroll):t=clamp(0,t,this.limit),t===this.targetScroll)return null==r||r(this),void(null==h||h(this));if(this.userData=null!=u?u:{},e)return this.animatedScroll=this.targetScroll=t,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),null==h||h(this),void(this.userData={});c||(this.targetScroll=t),this.animate.fromTo(this.animatedScroll,t,{duration:o,easing:n,lerp:l,onStart:()=>{s&&(this.isLocked=!0),this.isScrolling="smooth",null==r||r(this)},onUpdate:(t,i)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=t-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=t,this.setScroll(this.scroll),c&&(this.targetScroll=t),i||this.emit(),i&&(this.reset(),this.emit(),null==h||h(this),this.userData={},this.preventNextNativeScrollEvent())}})}}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame((()=>{this._preventNextNativeScrollEvent=!1}))}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.__experimental__naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return"horizontal"===this.options.orientation}get actualScroll(){return this.isHorizontal?this.rootElement.scrollLeft:this.rootElement.scrollTop}get scroll(){return this.options.infinite?function modulo(t,i){return(t%i+i)%i}(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return 0===this.limit?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(t){this._isScrolling!==t&&(this._isScrolling=t,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(t){this._isStopped!==t&&(this._isStopped=t,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(t){this._isLocked!==t&&(this._isLocked=t,this.updateClassName())}get isSmooth(){return"smooth"===this.isScrolling}get className(){let t="lenis";return this.isStopped&&(t+=" lenis-stopped"),this.isLocked&&(t+=" lenis-locked"),this.isScrolling&&(t+=" lenis-scrolling"),"smooth"===this.isScrolling&&(t+=" lenis-smooth"),t}updateClassName(){this.cleanUpClassName(),this.rootElement.className=`${this.rootElement.className} ${this.className}`.trim()}cleanUpClassName(){this.rootElement.className=this.rootElement.className.replace(/lenis(-\w+)?/g,"").trim()}}}));
//# sourceMappingURL=lenis.min.js.map

/* Supreme VA site scripts (Hark) */
/* dark theme gate: dark by default; ?theme=light (remembered) opts out, ?theme=dark back on */
(function(){try{var q=new URLSearchParams(location.search).get('theme'),k='sva-theme';
if(q==='dark'||q==='light')localStorage.setItem(k,q);
var on=(localStorage.getItem(k)||window.SVA_DEFAULT_THEME||'dark')==='dark';if(!on)return;
var cs=document.currentScript,base=cs&&cs.src?cs.src.replace(/sva\.js(\?.*)?$/,''):'https://cdn.jsdelivr.net/gh/jaspergarrigues/supremeva-assets@main/';
if(!document.getElementById('sva-dark-css')){var l=document.createElement('link');l.rel='stylesheet';l.id='sva-dark-css';l.href=base+'sva-dark.css';document.head.appendChild(l)}
document.documentElement.classList.add('sva-dark');
new MutationObserver(function(){if(!document.documentElement.classList.contains('sva-dark'))document.documentElement.classList.add('sva-dark')}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
}catch(e){}})();
(function(){if(document.getElementById('sva-ld'))return;var s=document.createElement('script');s.type='application/ld+json';s.id='sva-ld';s.text="{\"@context\":\"https://schema.org\",\"@type\":\"ProfessionalService\",\"name\":\"Supreme VA\",\"url\":\"https://supremeva.com\",\"description\":\"Trained, Philippines-based virtual assistants for U.S. real estate agents, teams and brokers.\",\"email\":\"Connect@SupremeVA.com\",\"telephone\":\"+1-917-310-2015\",\"areaServed\":{\"@type\":\"Country\",\"name\":\"United States\"},\"serviceType\":\"Real estate virtual assistant services\"}";document.head.appendChild(s)})();
/* motion layer v1 */
(function(){
 var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn)}
 ready(function(){
  var root=document.documentElement;
  var bar=document.createElement('div');bar.id='sva-progress';document.body.appendChild(bar);

  /* stagger elements inside each section by their row, so they cascade in */
  document.querySelectorAll('section.block').forEach(function(sec){
   var els=[].slice.call(sec.querySelectorAll('.layout-element'));
   els.forEach(function(el){
    var r=parseInt((el.style.getPropertyValue('--grid-row')||'1').split('/')[0],10)||1;
    var c=parseInt((el.style.getPropertyValue('--grid-column')||'1').split('/')[0],10)||1;
    el.style.setProperty('--sva-delay',Math.min(((r-1)*0.06+(c-1)*0.025),0.6).toFixed(3)+'s');
   });
  });

  if(!reduce){
   /* elements the builder left un-animated get our reveal too */
   var plain=[].slice.call(document.querySelectorAll('section.block:not(#hero-section) .layout-element.transition--none, section.block:not(#hero-section) .layout-element:not(.transition)'));
   var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('sva-in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px',threshold:0.05});
   plain.forEach(function(el){
    var b=el.getBoundingClientRect();
    if(b.top<window.innerHeight*0.9){return}
    el.classList.add('sva-reveal');io.observe(el)});

   /* failsafe: reveal builder-animated elements ourselves so nothing stays invisible
      if the builder's own animation trigger is slow or never fires */
   var anim=[].slice.call(document.querySelectorAll('section.block .layout-element.transition:not(.transition--none)'));
   anim.forEach(function(el){
    if(el.closest('#hero-section')){setTimeout(function(){el.classList.add('sva-in')},120);return}
    io.observe(el)});
   setTimeout(function(){var vb=window.innerHeight;anim.concat(plain).forEach(function(el){if(el.getBoundingClientRect().top<vb)el.classList.add('sva-in')})},2500);
   /* images: zoom-out as they scroll through */
   var imgs=[].slice.call(document.querySelectorAll('section.block .layout-element__component--GridImage'));
   imgs.forEach(function(w){w.classList.add('sva-zoom')});
  }

  var hero=document.querySelector('#hero-section .block-layout');
  var heroSec=document.getElementById('hero-section');
  var ticking=false;
  function frame(){
   ticking=false;
   var y=window.scrollY||window.pageYOffset;
   var max=document.documentElement.scrollHeight-window.innerHeight;
   bar.style.transform='scaleX('+(max>0?Math.min(y/max,1):0)+')';
   root.classList.toggle('sva-scrolled',y>12);
   if(reduce)return;
   if(hero&&heroSec){
    var h=heroSec.offsetHeight||window.innerHeight;
    var p=Math.min(Math.max(y/h,0),1);
    hero.style.transform='translate3d(0,'+(p*60).toFixed(1)+'px,0) scale('+(1-p*0.06).toFixed(4)+')';
    hero.style.opacity=(1-p*0.85).toFixed(3);
   }
   var vh=window.innerHeight;
   for(var i=0;i<imgs.length;i++){
    var r=imgs[i].getBoundingClientRect();
    if(r.bottom<0||r.top>vh)continue;
    var t=Math.min(Math.max((vh-r.top)/(vh+r.height),0),1);
    imgs[i].style.setProperty('--sva-z',(1.08-t*0.08).toFixed(4));
   }
  }
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  frame();

  /* buttery smooth scrolling on desktop */
  if(!reduce&&window.Lenis&&window.matchMedia('(pointer:fine)').matches){
   var lenis=new Lenis({duration:1.15,easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t))},smoothWheel:true,anchors:{offset:-90}});
   lenis.on('scroll',onScroll);
   (function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(performance.now());
  }
 });
})();

/* accents layer v2 */
(function(){
 var root=document.documentElement,K='More real estate.';
 function apply(){
  var hero=document.getElementById('hero-section');
  if(hero){
   if(!hero.__sva){hero.__sva=1;hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();root.style.setProperty('--sva-mx',(e.clientX-r.left)+'px');root.style.setProperty('--sva-my',(e.clientY-r.top)+'px')},{passive:true})}
   var h1=hero.querySelector('h1');
   if(h1&&!h1.querySelector('.sva-gold-text')){
    var w=document.createTreeWalker(h1,NodeFilter.SHOW_TEXT),n;
    while(n=w.nextNode()){var i=n.nodeValue.indexOf(K);if(i>-1){var r=document.createRange();r.setStart(n,i);r.setEnd(n,i+K.length);var sp=document.createElement('span');sp.className='sva-gold-text';r.surroundContents(sp);break}}
   }
  }
  document.querySelectorAll('section.block:not(#hero-section) h2:not(.sva-h2)').forEach(function(h){
   h.classList.add('sva-h2');var al=getComputedStyle(h).textAlign;if(al==='left'||al==='start')h.classList.add('sva-left');io.observe(h)});
  if(!hero){var fs=document.querySelector('main section.block');if(fs)fs.classList.add('sva-sub-hero');
   document.querySelectorAll('main section.block h1').forEach(function(h){
    if(/173,\s*121,\s*0/.test(h.getAttribute('style')||'')&&!h.classList.contains('sva-gold-text'))h.classList.add('sva-gold-text');
    h.querySelectorAll('span[style*="173, 121, 0"]').forEach(function(s){s.classList.add('sva-gold-text')});
    if(!h.classList.contains('sva-h2')){h.classList.add('sva-h2');var al=getComputedStyle(h).textAlign;if(al==='left'||al==='start')h.classList.add('sva-left');io.observe(h)}})}
  if(fine)document.querySelectorAll('.layout-element__component--GridCard').forEach(function(c){
   if(c.__sva)return;c.__sva=1;c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--cx',(e.clientX-r.left)+'px');c.style.setProperty('--cy',(e.clientY-r.top)+'px')},{passive:true})});
  if(!document.getElementById('sva-ambient')){var a=document.createElement('div');a.id='sva-ambient';a.setAttribute('aria-hidden','true');a.innerHTML='<i class="b1"></i><i class="b2"></i><i class="dots"></i>';document.body.insertBefore(a,document.body.firstChild);var sp=document.createElement('div');sp.id='sva-spot';sp.setAttribute('aria-hidden','true');document.body.appendChild(sp);
   if(fine){window.addEventListener('pointermove',function(e){root.style.setProperty('--sva-gx',e.clientX+'px');root.style.setProperty('--sva-gy',e.clientY+'px');root.classList.add('sva-pointer')},{passive:true});document.addEventListener('mouseleave',function(){root.classList.remove('sva-pointer')})}}
  if(!document.getElementById('sva-grain')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var g=document.createElement('div');g.id='sva-grain';document.body.appendChild(g)}
 }
 var fine=matchMedia('(pointer:fine)').matches;
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('sva-drawn');io.unobserve(e.target)}})},{threshold:.6});
 var t;function soon(){clearTimeout(t);t=setTimeout(apply,120)}
 function start(){apply();[600,1500,3000,6000].forEach(function(d){setTimeout(apply,d)});
  new MutationObserver(soon).observe(document.body,{childList:true,subtree:true})}
 if(document.readyState==='complete')start();else window.addEventListener('load',start);
})();
