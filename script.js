(() => {
 const config=window.EXPERTA_CONTACT || {};
 const form=document.querySelector('#project-form');
 const name=document.querySelector('#client-name');
 const service=document.querySelector('#client-service');
 const preview=document.querySelector('#whatsapp-message');
 const phone=String(config.whatsapp || '51989792886').replace(/\D/g,'');
 const message=document.createElement('input');message.type='hidden';message.name='text';
 form.append(message);form.action=`https://wa.me/${phone}`;
 [name,service].forEach(field=>field.removeAttribute('name'));
 const update=()=>{
  name.setCustomValidity(name.value && name.value.trim().length<2?'Escribe tu nombre, por favor.':'');
  const intro=name.value.trim()?`Hola, soy ${name.value.trim()}.`:'Hola, equipo Experta.';
  const subject=service.value?`Me interesa ${service.value.toLowerCase()}.`:'Me gustaría conversar sobre un proyecto para mi negocio.';
  message.value=`${intro} ${subject}\n\n¿Podemos conversar?`;
  preview.textContent=message.value;
 };
 form.addEventListener('input',update);form.addEventListener('change',update);
 form.addEventListener('submit',event=>{update();if(!form.reportValidity())event.preventDefault();});
 update();
 document.querySelector('#footer-year').textContent=new Date().getFullYear();
 const links=document.querySelector('.footer-social-links');
 const titles={instagram:'Instagram',tiktok:'TikTok',facebook:'Facebook'};
 Object.entries(config.socials || {}).forEach(([key,url])=>{
  if(!url || !titles[key])return;
  let parsed;try{parsed=new URL(url);}catch{return;}
  if(parsed.protocol!=='https:')return;
  const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',titles[key]);
  const img=document.createElement('img');img.src=`social-${key}.svg`;img.alt='';img.width=20;img.height=20;
  a.append(img);
  const placeholder=links.querySelector(`[data-social="${key}"]`);
  if(placeholder)placeholder.replaceWith(a);else links.append(a);
 });
 const footer=document.querySelector('.footer-v2');
 if('IntersectionObserver' in window){
  footer.classList.add('footer-ready');
  new IntersectionObserver(entries=>{entries.forEach(entry=>{footer.classList.toggle('footer-in-view',entry.isIntersecting);if(entry.isIntersecting)footer.classList.add('footer-revealed');});},{threshold:.08}).observe(footer);
 }
})();

