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

async function submitForm(){
  const name=document.getElementById('f-name').value.trim();
  const email=document.getElementById('f-email').value.trim();
  const type=document.getElementById('f-type').value;
  const org=document.getElementById('f-org').value.trim();
  const msg=document.getElementById('f-msg').value.trim();
  if(!name||!email||!msg){alert('Please fill in your name, email, and message.');return;}
  const subject=encodeURIComponent('ArchOpt Technologies Enquiry - '+type+' - '+name);
  const body=encodeURIComponent('Name: '+name+'\nEmail: '+email+'\nOrganisation: '+(org||'Not provided')+'\nRegarding: '+type+'\n\nMessage:\n'+msg);
  window.location.href='mailto:architecture.optimization@gmail.com?subject='+subject+'&body='+body;
  document.getElementById('contactForm').style.display='none';
  document.getElementById('formSuccess').style.display='block';
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
  var old={archopt:'PareVia',epcal:'EPCalibration',pricing:'Pricing',terms:'Terms',privacy:'Privacy',refund:'Refund',energyfront:'EnergyFront'};
  var h=window.location.hash.replace('#','');
  if(h==='contact'){openContact();return;}
  if(old[h]&&document.body.getAttribute('data-page')==='home')window.location.replace(old[h]);
})();
