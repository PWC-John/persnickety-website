(function(){
  function initBeforeAfter(root){
    if(root.dataset.baBound === 'true') return;
    var range = root.querySelector('.ba-range');
    if(!range) return;
    function update(){root.style.setProperty('--ba-position', range.value + '%');}
    range.addEventListener('input', update);
    range.addEventListener('change', update);
    update();
    root.dataset.baBound = 'true';
  }
  function initAll(){document.querySelectorAll('[data-before-after]').forEach(initBeforeAfter);}
  if(document.readyState === 'loading'){document.addEventListener('DOMContentLoaded', initAll);}
  else{initAll();}
})();
