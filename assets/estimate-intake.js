(function(){
  if(window.location.pathname.replace(/\/+$/,'')!=='/free-estimate') return;

  var endpoint='https://persnickety-os.john-winter.workers.dev/api/intake/website-public';
  var storageKey='pwc_first_touch_attribution';

  function readAttribution(){
    var params=new URLSearchParams(window.location.search);
    var current={
      utm_source:params.get('utm_source')||'',
      utm_medium:params.get('utm_medium')||'',
      utm_campaign:params.get('utm_campaign')||'',
      utm_term:params.get('utm_term')||'',
      utm_content:params.get('utm_content')||'',
      landing_page:window.location.href,
      referrer:document.referrer||''
    };
    try{
      var saved=JSON.parse(sessionStorage.getItem(storageKey)||'null');
      if(!saved || current.utm_source || current.utm_campaign){
        sessionStorage.setItem(storageKey,JSON.stringify(current));
        return current;
      }
      return saved;
    }catch(_error){return current;}
  }

  function addStyles(){
    if(document.getElementById('estimate-intake-styles')) return;
    var style=document.createElement('style');
    style.id='estimate-intake-styles';
    style.textContent='.estimate-intake{background:#f8f6f0}.estimate-form-wrap{max-width:920px;margin:0 auto;background:#fff;border:1px solid #e7e6e1;border-radius:24px;padding:34px;box-shadow:0 12px 36px rgba(8,25,44,.06)}.estimate-form{display:grid;gap:18px}.estimate-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.estimate-form label{display:grid;gap:7px;font-weight:750;color:#08192c;font-size:15px}.estimate-form input,.estimate-form select,.estimate-form textarea{width:100%;font:inherit;color:#182231;background:#fff;border:1px solid #cfd4da;border-radius:12px;padding:13px 14px;min-height:48px}.estimate-form textarea{min-height:120px;resize:vertical}.estimate-form input:focus,.estimate-form select:focus,.estimate-form textarea:focus{outline:3px solid rgba(207,166,90,.22);border-color:#cfa65a}.estimate-form .full{grid-column:1/-1}.estimate-form .submit{border:0;cursor:pointer;background:#cfa65a;color:#08192c;min-height:54px;border-radius:999px;font-weight:850;font-size:16px;padding:0 24px}.estimate-form .submit:disabled{opacity:.65;cursor:wait}.estimate-form-note{color:#687382;font-size:14px;margin:0}.estimate-form-status{min-height:26px;margin:0;font-weight:700}.estimate-form-status.success{color:#17633a}.estimate-form-status.error{color:#9a2d2d}.estimate-honeypot{position:absolute!important;left:-10000px!important;width:1px!important;height:1px!important;overflow:hidden!important}.estimate-alternatives{text-align:center;color:#687382;margin:24px 0 0;font-size:14px}@media(max-width:650px){.estimate-form-wrap{padding:24px 18px;border-radius:18px}.estimate-form-grid{grid-template-columns:1fr}.estimate-form .full{grid-column:auto}}';
    document.head.appendChild(style);
  }

  function createForm(){
    if(document.getElementById('estimate-request-form')) return;
    var contact=document.getElementById('contact-options');
    if(!contact) return;
    var section=document.createElement('section');
    section.className='estimate-intake';
    section.id='estimate-request';
    section.innerHTML='<div class="container"><div class="heading center"><div class="kicker">Request Online</div><h2>Send the details once.</h2><p>Your request goes directly into Persnickety\'s customer workflow for John to review. It does not automatically book work.</p></div><div class="estimate-form-wrap"><form class="estimate-form" id="estimate-request-form"><div class="estimate-form-grid"><label>Name<input name="display_name" autocomplete="name" required></label><label>Residential or commercial<select name="customer_type"><option value="residential">Residential</option><option value="commercial">Commercial</option></select></label><label>Cell phone<input name="phone" type="tel" inputmode="tel" autocomplete="tel"></label><label>Email<input name="email" type="email" autocomplete="email"></label><label class="full">Street address<input name="address_line_1" autocomplete="address-line1" required></label><label>Unit or suite<input name="address_line_2" autocomplete="address-line2"></label><label>City<input name="city" autocomplete="address-level2" required></label><label>State<input name="state" maxlength="2" autocomplete="address-level1" value="OH" required></label><label>ZIP<input name="postal_code" inputmode="numeric" autocomplete="postal-code" required></label><label>Service<select name="service"><option value="Window cleaning">Window cleaning</option><option value="Residential window cleaning">Residential window cleaning</option><option value="Commercial window cleaning">Commercial window cleaning</option><option value="Specialty window cleaning">Specialty window cleaning</option></select></label><label class="full">Anything we should know?<textarea name="message" placeholder="Interior/exterior, screens or storms, difficult-access glass, preferred timeframe, recurring service, or anything else helpful."></textarea></label></div><label class="estimate-honeypot" aria-hidden="true">Company<input name="company" tabindex="-1" autocomplete="off"></label><p class="estimate-form-note">Enter a phone number or email so John can follow up. For photos, submit this first and then text the photos to 330-353-8326.</p><button class="submit" type="submit">Request My Free Estimate</button><p class="estimate-form-status" id="estimate-form-status" role="status" aria-live="polite"></p></form><p class="estimate-alternatives">Prefer direct contact? Text, call, or email options are still below.</p></div></div>';
    contact.parentNode.insertBefore(section,contact);
    bindForm(section.querySelector('form'));
    var directNote=document.querySelector('.direct-note');
    if(directNote) directNote.textContent='Online requests are recorded in Persnickety OS for John to review. Nothing is automatically booked; John still confirms the scope and next step.';
  }

  function bindForm(form){
    if(!form) return;
    var button=form.querySelector('button[type="submit"]');
    var status=document.getElementById('estimate-form-status');
    form.addEventListener('submit',async function(event){
      event.preventDefault();
      var data=new FormData(form);
      var phone=String(data.get('phone')||'').trim();
      var email=String(data.get('email')||'').trim();
      status.className='estimate-form-status';
      if(!phone&&!email){status.textContent='Please enter a phone number or email.';status.classList.add('error');return;}
      button.disabled=true;
      button.textContent='Sending…';
      status.textContent='';
      var attribution=readAttribution();
      var payload={
        display_name:String(data.get('display_name')||''),
        phone:phone,
        email:email,
        address_line_1:String(data.get('address_line_1')||''),
        address_line_2:String(data.get('address_line_2')||''),
        city:String(data.get('city')||''),
        state:String(data.get('state')||'OH'),
        postal_code:String(data.get('postal_code')||''),
        customer_type:String(data.get('customer_type')||'residential'),
        service:String(data.get('service')||''),
        message:String(data.get('message')||''),
        company:String(data.get('company')||''),
        source_page:window.location.pathname,
        landing_page:attribution.landing_page||window.location.href,
        referrer:attribution.referrer||document.referrer||'',
        utm_source:attribution.utm_source||'',
        utm_medium:attribution.utm_medium||'',
        utm_campaign:attribution.utm_campaign||'',
        utm_term:attribution.utm_term||'',
        utm_content:attribution.utm_content||''
      };
      try{
        var response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        var result=await response.json().catch(function(){return {};});
        if(!response.ok||!result.ok) throw new Error(result.error||'Request could not be sent.');
        form.reset();
        var stateInput=form.querySelector('[name="state"]');if(stateInput) stateInput.value='OH';
        status.textContent='Request received. John will review it and follow up.';
        status.classList.add('success');
        button.textContent='Request Received';
        if(typeof gtag==='function') gtag('event','estimate_request_submit',{page_location:window.location.href,estimate_context:'free_estimate_page',contact_method:'web_form',utm_source:payload.utm_source,utm_campaign:payload.utm_campaign});
        window.setTimeout(function(){button.disabled=false;button.textContent='Request Another Estimate';},2500);
      }catch(error){
        status.textContent=(error&&error.message)||'We could not send the request. Please text or call 330-353-8326.';
        status.classList.add('error');
        button.disabled=false;
        button.textContent='Try Again';
      }
    });
  }

  addStyles();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',createForm,{once:true});
  else createForm();
})();
