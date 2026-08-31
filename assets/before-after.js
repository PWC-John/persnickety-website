(function(){
  var assetVersion='20260831-1821';
  function setSunroomImages(root){
    if(!root) return;
    var after = root.querySelector('.ba-after img');
    var before = root.querySelector('.ba-before img');
    if(after) after.src = '/assets/images/commercial-sunroom-after.avif?v=' + assetVersion;
    if(before) before.src = '/assets/images/commercial-sunroom-before.avif?v=' + assetVersion;
  }
  function setResidentialImages(root){
    if(!root) return;
    var after = root.querySelector('.ba-after img');
    var before = root.querySelector('.ba-before img');
    if(after){
      after.src = '/assets/images/residential-arched-after.avif?v=' + assetVersion;
      after.width = 720;
      after.height = 1128;
    }
    if(before){
      before.src = '/assets/images/residential-arched-before.avif?v=' + assetVersion;
      before.width = 718;
      before.height = 1135;
    }
  }
  function makeLandscape(root){
    if(!root) return;
    root.classList.add('ba-landscape');
    setSunroomImages(root);
  }
  function makeResidential(root){
    if(!root) return;
    root.classList.add('ba-residential');
    setResidentialImages(root);
  }
  function createResidentialSlider(){
    var container = document.querySelector('.results .container');
    if(!container) return null;
    var existing = container.querySelector('.ba-residential[data-before-after]');
    if(existing) return existing;
    var figure = document.createElement('figure');
    figure.className = 'before-after ba-residential';
    figure.setAttribute('data-before-after','');
    figure.innerHTML = '<div class="ba-viewport">' +
      '<div class="ba-layer ba-after" aria-hidden="true"><img src="/assets/images/residential-arched-after.avif?v=' + assetVersion + '" alt="" width="720" height="1128" loading="lazy" decoding="async"></div>' +
      '<div class="ba-layer ba-before" aria-hidden="true"><img src="/assets/images/residential-arched-before.avif?v=' + assetVersion + '" alt="" width="718" height="1135" loading="lazy" decoding="async"></div>' +
      '<div class="ba-label before" aria-hidden="true">Before</div>' +
      '<div class="ba-label after" aria-hidden="true">After</div>' +
      '<div class="ba-divider" aria-hidden="true"><span class="ba-handle">&lt;&gt;</span></div>' +
      '<input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Slide to compare the residential window before and after cleaning">' +
      '</div>' +
      '<figcaption class="ba-caption"><span>Residential Before &amp; After</span>Cloudy exterior glass restored to a clear finish.</figcaption>' +
      '<p class="ba-hint">Drag the slider to compare.</p>';
    container.appendChild(figure);
    return figure;
  }
  function applyPageImages(){
    var path = window.location.pathname.replace(/\/+$/, '');
    if(path === '/commercial-window-cleaning'){
      makeLandscape(document.querySelector('[data-before-after]'));
    } else if(path === '/our-work'){
      makeLandscape(document.querySelector('.before-after-card[data-before-after]'));
    } else if(path === '' || path === '/index.html'){
      makeResidential(document.querySelector('.before-after[data-before-after]'));
    } else if(path === '/residential-window-cleaning'){
      makeResidential(createResidentialSlider());
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