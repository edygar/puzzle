if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const d=e=>i(e,t),f={module:{uri:t},exports:o,require:d};s[t]=Promise.all(n.map((e=>f[e]||d(e)))).then((e=>(r(...e),o)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-4011798f.js",revision:null},{url:"assets/index-fe23334f.css",revision:null},{url:"index.html",revision:"7bedd4ce10e9f3dd2b103a3263c3eca0"},{url:"registerSW.js",revision:"dfc7ed51292fee9120679054f82b0c0d"},{url:"manifest.webmanifest",revision:"fd9cbece2187bb6fd38481f66450d134"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
