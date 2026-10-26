/* ArchOpt Technologies - shared script for every page of the site */
function go(url){window.location.href=url;}

/* contact window */
function openContact(){document.getElementById('contactOverlay').classList.add('open');document.body.style.overflow='hidden';}
function closeContact(){document.getElementById('contactOverlay').classList.remove('open');document.body.style.overflow='';}
(function(){
  var o=document.getElementById('contactOverlay');
  if(o)o.addEventListener('click',function(e){if(e.target===this)closeContact();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&o)closeContact();});
})();

/* Contact form: sent through FormSubmit (https://formsubmit.co), because a GitHub Pages site cannot send e-mail
   itself. "Message received" is shown only when the service confirms; otherwise the visitor is told and offered
   the e-mail app as a fallback. The first message after publishing triggers a one-time activation e-mail from
   FormSubmit to CONTACT_TO: open it and click "Activate Form"; until then messages are not delivered. */
var CONTACT_TO='architecture.optimization@gmail.com';
var CONTACT_ENDPOINT='https://formsubmit.co/ajax/'+CONTACT_TO;

function contactNote(text, mailtoHref){
  var btn=document.querySelector('#contactForm .form-submit');
  var box=document.getElementById('contactNote');
  if(!box){
    box=document.createElement('div');
    box.id='contactNote';
    box.setAttribute('role','alert');
    box.style.cssText='margin-top:.8rem;padding:.75rem .9rem;border-radius:10px;font-size:.88rem;line-height:1.5;background:#fef2f2;color:#991b1b;border:1px solid #fecaca';
    btn.parentNode.insertBefore(box, btn.nextSibling);
  }
  box.textContent=text+' ';
  if(mailtoHref){
    var a=document.createElement('a');
    a.href=mailtoHref; a.textContent='Send it with your e-mail app instead';
    a.style.cssText='color:#991b1b;font-weight:700';
    box.appendChild(a);
    box.appendChild(document.createTextNode(' or write to '+CONTACT_TO+'.'));
  }
  box.style.display='block';
}

async function submitForm(){
  const name=document.getElementById('f-name').value.trim();
  const email=document.getElementById('f-email').value.trim();
  const type=document.getElementById('f-type').value;
  const org=document.getElementById('f-org').value.trim();
  const msg=document.getElementById('f-msg').value.trim();
  if(!name||!email||!msg){alert('Please fill in your name, email, and message.');return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){alert('Please enter a valid email address.');return;}
  const subjectText='ArchOpt Technologies Enquiry - '+(type||'General')+' - '+name;
  const bodyText='Name: '+name+'\nEmail: '+email+'\nOrganisation: '+(org||'Not provided')+'\nRegarding: '+(type||'Not selected')+'\n\nMessage:\n'+msg;
  const mailto='mailto:'+CONTACT_TO+'?subject='+encodeURIComponent(subjectText)+'&body='+encodeURIComponent(bodyText);

  const btn=document.querySelector('#contactForm .form-submit');
  const label=btn.innerHTML;
  btn.disabled=true; btn.innerHTML='Sending...';
  const old=document.getElementById('contactNote'); if(old) old.style.display='none';
  try{
    const res=await fetch(CONTACT_ENDPOINT,{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({
        name:name, email:email, organisation:org||'Not provided', regarding:type||'Not selected', message:msg,
        _subject:subjectText, _replyto:email, _template:'table', _captcha:'false', _honey:''
      })
    });
    const data=await res.json().catch(function(){return {};});
    if(res.ok && (data.success===true || data.success==='true')){
      document.getElementById('contactForm').style.display='none';
      document.getElementById('formSuccess').style.display='block';
      return;
    }
    contactNote('Your message could not be sent'+(data.message?' ('+data.message+')':'')+'.', mailto);
  }catch(e){
    contactNote('Your message could not be sent (no connection to the form service).', mailto);
  }finally{
    btn.disabled=false; btn.innerHTML=label;
  }
}

/* screenshot carousels (only on the pages that have them) */
function initShots(id, capId, interval){
  const frame=document.getElementById(id);
  if(!frame)return;
  const slides=frame.querySelectorAll('.slide');
  if(!slides.length)return;
  const shell=frame.parentElement;
  const caption=document.getElementById(capId);
  const dots=shell.querySelectorAll('.shots-dots button');
  let i=0,timer=null;
  function go(n){
    slides[i].classList.remove('active'); if(dots[i])dots[i].classList.remove('active');
    i=(n+slides.length)%slides.length;
    slides[i].classList.add('active'); if(dots[i])dots[i].classList.add('active');
    if(caption)caption.textContent=slides[i].getAttribute('data-caption')||'';
  }
  function start(){stop();timer=setInterval(()=>go(i+1),interval||4000);}
  function stop(){if(timer)clearInterval(timer);}
  dots.forEach((d,n)=>d.addEventListener('click',()=>{go(n);start();}));
  frame.addEventListener('mouseenter',stop);
  frame.addEventListener('mouseleave',start);
  go(0); start();
}
initShots('archopt-shots','archopt-cap',4000);
initShots('epcal-shots','epcal-cap',4200);

/* old addresses such as /#archopt or /#pricing now have their own pages */
(function(){
  var old={archopt:'PareVia',epcal:'EPCalibration',terms:'Terms',privacy:'Privacy',refund:'Refund',energyfront:'EnergyFront'};
  var h=window.location.hash.replace('#','');
  if(h==='contact'){openContact();return;}
  if(old[h]&&document.body.getAttribute('data-page')==='home')window.location.replace(old[h]);
})();
