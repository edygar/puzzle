if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/puzzle/sw.js', { scope: '/puzzle/' })})}