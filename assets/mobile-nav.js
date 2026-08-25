(function(){
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
