(function(){
  var path=window.location.pathname.replace(/\/+$/,'');
  var needsFreshSlider=(path===''||path==='/index.html'||path==='/residential-window-cleaning');
  if(needsFreshSlider){
    if(!document.querySelector('link[href="/assets/before-after.css?v=20260831-1821"]')){
      var style=document.createElement('link');
      style.rel='stylesheet';
      style.href='/assets/before-after.css?v=20260831-1821';
      document.head.appendChild(style);
    }
    if(!document.querySelector('script[src="/assets/before-after.js?v=20260831-1821"]')){
      var sliderScript=document.createElement('script');
      sliderScript.src='/assets/before-after.js?v=20260831-1821';
      sliderScript.defer=true;
      document.head.appendChild(sliderScript);
    }
  }

  var button=document.querySelector('.menu-toggle');
  var nav=document.querySelector('.navlinks');
  if(!button||!nav)return;
  function setMenu(open){button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close site menu':'Open site menu');nav.classList.toggle('is-open',open)}
  function closeMenu(){setMenu(false)}
  button.addEventListener('click',function(){
    var opening=button.getAttribute('aria-expanded')!=='true';
    setMenu(opening);
  });
  nav.addEventListener('click',function(event){if(event.target.closest('a'))closeMenu()});
  document.addEventListener('click',function(event){if(!event.target.closest('header'))closeMenu()});
  document.addEventListener('keydown',function(event){if(event.key==='Escape'){closeMenu();button.focus()}});
  window.addEventListener('resize',function(){if(window.innerWidth>900)closeMenu()});
})();