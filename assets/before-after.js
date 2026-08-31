(function(){
  function setSunroomImages(root){
    if(!root) return;
    var after = root.querySelector('.ba-after img');
    var before = root.querySelector('.ba-before img');
    if(after) after.src = '/assets/images/commercial-sunroom-after.avif';
    if(before) before.src = '/assets/images/commercial-sunroom-before.avif';
  }
  function applyPageImages(){
    var path = window.location.pathname.replace(/\/+$/, '');
    if(path === '/commercial-window-cleaning'){
      var commercialSlider = document.querySelector('[data-before-after]');
      if(commercialSlider) commercialSlider.classList.add('before-after-landscape');
      setSunroomImages(commercialSlider);
    } else if(path === '/our-work'){
      setSunroomImages(document.querySelector('.before-after-card[data-before-after]'));
    }
  }
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
  function initAll(){
    applyPageImages();
    document.querySelectorAll('[data-before-after]').forEach(initBeforeAfter);
  }
  if(document.readyState === 'loading'){document.addEventListener('DOMContentLoaded', initAll);}
  else{initAll();}
})();