if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const f=e=>i(e,t),l={module:{uri:t},exports:o,require:f};s[t]=Promise.all(n.map((e=>l[e]||f(e)))).then((e=>(r(...e),o)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-974dee16.css",revision:null},{url:"assets/index-c49b9cc5.js",revision:null},{url:"index.html",revision:"0d0d3f682c5d852b6a7f2e134b66e239"},{url:"registerSW.js",revision:"dfc7ed51292fee9120679054f82b0c0d"},{url:"manifest.webmanifest",revision:"0f173feafb07fa47a9052e772f01c1c4"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
