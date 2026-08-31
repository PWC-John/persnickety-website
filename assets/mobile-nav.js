(function(){
  var path=window.location.pathname.replace(/\/+$/,'');
  var isHome=(path===''||path==='/index.html');
  var isResidential=(path==='/residential-window-cleaning');
  var isFreeEstimate=(path==='/free-estimate');
  var assetVersion='20260831-2235';

  function removeLiteralNewlines(){
    var root=document.documentElement;
    if(!root) return;
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    var nodes=[];
    while(walker.nextNode()){
      var node=walker.currentNode;
      var value=node.nodeValue||'';
      if(value.indexOf('\\n')!==-1 && !node.parentElement?.closest('script,style,pre,code,textarea')) nodes.push(node);
    }
    nodes.forEach(function(node){node.nodeValue=(node.nodeValue||'').replace(/\\n/g,'');});
  }

  function loadSliderAssets(){
    if(!(isHome||isResidential)) return;
    var style=document.querySelector('link[href*="before-after.css"]');
    if(!style){
      style=document.createElement('link');
      style.rel='stylesheet';
      style.href='/assets/before-after.css?v='+assetVersion;
      document.head.appendChild(style);
    }
    if(!document.querySelector('script[src*="before-after.js"]')){
      var sliderScript=document.createElement('script');
      sliderScript.src='/assets/before-after.js?v='+assetVersion;
      sliderScript.defer=true;
      document.head.appendChild(sliderScript);
    }
  }

  function loadEstimateIntake(){
    if(!isFreeEstimate||document.querySelector('script[src*="estimate-intake.js"]')) return;
    var script=document.createElement('script');
    script.src='/assets/estimate-intake.js?v='+assetVersion;
    script.defer=true;
    document.head.appendChild(script);
  }

  function bindContactAnalytics(){
    if(document.documentElement.dataset.contactAnalyticsBound==='true') return;
    document.documentElement.dataset.contactAnalyticsBound='true';
    document.addEventListener('click',function(event){
      var link=event.target.closest('a[href]');
      if(!link) return;
      var href=(link.getAttribute('href')||'').trim();
      var method=null;
      var eventName=null;
      if(href.indexOf('tel:')===0){method='phone';eventName='phone_click';}
      else if(href.indexOf('sms:')===0){method='text';eventName='text_click';}
      else if(href.indexOf('mailto:')===0){method='email';eventName='email_click';}
      else if(/(^|\/)free-estimate\/?(?:[?#].*)?$/.test(href)){method='estimate';eventName='free_estimate_click';}
      if(!eventName||typeof window.gtag!=='function') return;
      var location='body';
      if(link.closest('header')) location='header';
      else if(link.closest('footer')) location='footer';
      window.gtag('event',eventName,{
        contact_method:method,
        link_location:location,
        page_path:window.location.pathname
      });
    });
  }

  function bindSlider(root){
    if(!root) return;
    var range=root.querySelector('.ba-range');
    if(!range) return;
    function update(){root.style.setProperty('--ba-position',range.value+'%');}
    if(root.dataset.mobileBaBound!=='true'){
      range.addEventListener('input',update);
      range.addEventListener('change',update);
      range.addEventListener('touchmove',update,{passive:true});
      root.dataset.mobileBaBound='true';
    }
    update();
  }

  function setArchedImages(root){
    if(!root) return false;
    root.classList.add('ba-residential');
    var after=root.querySelector('.ba-after img');
    var before=root.querySelector('.ba-before img');
    if(after){after.removeAttribute('srcset');after.src='/assets/images/residential-arched-after.avif?v='+assetVersion;after.width=720;after.height=1128;}
    if(before){before.removeAttribute('srcset');before.src='/assets/images/residential-arched-before.avif?v='+assetVersion;before.width=718;before.height=1135;}
    bindSlider(root);
    return !!(after&&before);
  }

  function createResidentialSlider(container){
    var figure=document.createElement('figure');
    figure.className='before-after ba-residential';
    figure.setAttribute('data-before-after','');
    figure.innerHTML='<div class="ba-viewport">'+
      '<div class="ba-layer ba-after" aria-hidden="true"><img src="/assets/images/residential-arched-after.avif?v='+assetVersion+'" alt="" width="720" height="1128" loading="eager" decoding="async"></div>'+
      '<div class="ba-layer ba-before" aria-hidden="true"><img src="/assets/images/residential-arched-before.avif?v='+assetVersion+'" alt="" width="718" height="1135" loading="eager" decoding="async"></div>'+
      '<div class="ba-label before" aria-hidden="true">Before</div><div class="ba-label after" aria-hidden="true">After</div>'+
      '<div class="ba-divider" aria-hidden="true"><span class="ba-handle">&lt;&gt;</span></div>'+
      '<input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Slide to compare the residential window before and after cleaning"></div>'+
      '<figcaption class="ba-caption"><span>Residential Before &amp; After</span>Cloudy exterior glass restored to a clear finish.</figcaption><p class="ba-hint">Drag the slider to compare.</p>';
    var heading=container.querySelector('.heading');
    var grid=container.querySelector('.results-grid');
    if(grid) container.insertBefore(figure,grid);
    else if(heading && heading.nextSibling) container.insertBefore(figure,heading.nextSibling);
    else container.appendChild(figure);
    return figure;
  }

  function ensureResidentialSlider(){
    removeLiteralNewlines();
    if(isHome){
      document.querySelectorAll('.before-after[data-before-after]').forEach(setArchedImages);
      return;
    }
    if(!isResidential) return;
    var existing=document.querySelector('.ba-residential[data-before-after], .before-after[data-before-after]');
    if(existing){setArchedImages(existing);return;}
    var container=document.querySelector('.results .container') || document.querySelector('main .container');
    if(!container) return;
    setArchedImages(createResidentialSlider(container));
  }

  loadSliderAssets();
  loadEstimateIntake();
  bindContactAnalytics();
  function runFixes(){removeLiteralNewlines();ensureResidentialSlider();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',runFixes,{once:true});
  else runFixes();
  window.addEventListener('pageshow',runFixes);
  window.setTimeout(runFixes,100);
  window.setTimeout(runFixes,500);
  window.setTimeout(runFixes,1500);
  if(window.MutationObserver){
    var observer=new MutationObserver(function(){removeLiteralNewlines();});
    observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  }

  var button=document.querySelector('.menu-toggle');
  var nav=document.querySelector('.navlinks');
  if(!button||!nav)return;
  function setMenu(open){button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close site menu':'Open site menu');nav.classList.toggle('is-open',open)}
  function closeMenu(){setMenu(false)}
  button.addEventListener('click',function(){var opening=button.getAttribute('aria-expanded')!=='true';setMenu(opening)});
  nav.addEventListener('click',function(event){if(event.target.closest('a'))closeMenu()});
  document.addEventListener('click',function(event){if(!event.target.closest('header'))closeMenu()});
  document.addEventListener('keydown',function(event){if(event.key==='Escape'){closeMenu();button.focus()}});
  window.addEventListener('resize',function(){if(window.innerWidth>900)closeMenu()});
})();