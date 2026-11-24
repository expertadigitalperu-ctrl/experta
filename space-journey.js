(() => {
 const section = document.querySelector('#metodologia');
 const list = section?.querySelector('.method-steps');
 if (!list) return;
 const steps = [...list.children].map(li => ({title:li.querySelector('h3').textContent, description:li.querySelector('p').textContent}));
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const mobile = matchMedia('(max-width: 600px)');
 const ns = 'http://www.w3.org/2000/svg';
 const svgEl = (name, attrs={}, parent) => { const e=document.createElementNS(ns,name); Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v)); if(parent)parent.append(e); return e; };
 const board = document.createElement('div'); board.className='space-journey';
 board.innerHTML=`<div class="space-map"><svg class="journey-map" role="group" aria-label="Mapa del viaje: siete planetas, uno por cada etapa de nuestra metodología"></svg></div>
 <div class="mission-bottom"><div class="mission-detail"><span class="mission-kicker">Etapa <b class="mission-count">01 / 07</b></span><h3></h3><p></p></div><div class="mission-controls"><button type="button" class="mission-toggle">Pausar viaje</button><button type="button" class="mission-next" aria-label="Ir a la siguiente etapa">Siguiente etapa <span aria-hidden="true">›</span></button></div></div>`;
 list.before(board);
 section.classList.add('space-enhanced');
 const svg=board.querySelector('svg');
 const detail=board.querySelector('.mission-detail');
 const toggle=board.querySelector('.mission-toggle');
 const next=board.querySelector('.mission-next');
 const count=board.querySelector('.mission-count');
 const buttons=[];
 list.replaceChildren();
 steps.forEach((s,i)=>{
  const li=document.createElement('li'),b=document.createElement('button'),n=document.createElement('span'),label=document.createElement('span');
  b.type='button';b.className='journey-step'; b.setAttribute('aria-label',`Étape ${i+1}: ${s.title}`.replace('Étape','Etapa'));
  n.textContent=String(i+1).padStart(2,'0');label.textContent=s.title;b.append(n,label);li.append(b);list.append(li);buttons.push(b);
  b.addEventListener('click',()=>select(i,true));
 });
 let active=0, progress=0, paused=reduced.matches, inView=false, last=0, phase='hold', elapsed=0;
 let route,trail,rocket,legFractions=[],planets=[],length=0;
 const colors=['#00d9f2','#468eff','#9562f4','#34b6d4','#7478ff','#4fcedc','#a36df9'];
 const short=['Asesoría','Reunión','Prototipos','Desarrollo','Pruebas','Entrega','Soporte'];
 function update(){
  detail.querySelector('h3').textContent=steps[active].title;
  detail.querySelector('p').textContent=steps[active].description;
  count.textContent=`${String(active+1).padStart(2,'0')} / 07`;
  buttons.forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===active));b.classList.toggle('visited',i<active);});
  planets.forEach((p,i)=>{p.classList.toggle('planet-active',i===active);p.classList.toggle('planet-visited',i<active);p.setAttribute('aria-pressed',String(i===active));});
  board.classList.toggle('mission-arrived',active===6&&phase==='hold');
  board.classList.toggle('journey-paused',paused);
  toggle.textContent=paused?'Reanudar viaje':'Pausar viaje';toggle.setAttribute('aria-pressed',String(!paused));
  next.innerHTML=active===6?'Reiniciar viaje <span aria-hidden="true">↻</span>':'Siguiente etapa <span aria-hidden="true">›</span>';
  next.setAttribute('aria-label',active===6?'Reiniciar el viaje':'Ir a la siguiente etapa');
 }
 function pose(){
  if(!route||!length)return;
  const d=progress*length,p=route.getPointAtLength(d),q=route.getPointAtLength(Math.min(length,d+2)),prev=route.getPointAtLength(Math.max(0,d-2));
  const angle=Math.atan2(q.y-prev.y,q.x-prev.x)*180/Math.PI+90;
  rocket.setAttribute('transform',`translate(${p.x},${p.y}) rotate(${angle})`);
  trail.style.strokeDasharray=`${d} ${length}`;
 }
 function select(i,user=false){
  active=i;progress=legFractions[i]||0;elapsed=0;phase='hold';board.classList.remove('in-flight');
  if(user){paused=true;detail.setAttribute('aria-live','polite');}
  pose();update();
 }
 function build(){
  svg.replaceChildren();planets=[];
  const small=mobile.matches;
  svg.setAttribute('viewBox',small?'0 0 640 690':'0 0 1200 440');
  const pts=small?[[90,100],[316,96],[550,175],[430,335],[179,330],[90,510],[410,550]]:[[85,270],[246,134],[408,238],[582,106],[757,230],[935,128],[1100,263]];
  const h=small?690:440;
  const defs=svgEl('defs',{},svg);
  const glow=svgEl('filter',{id:'planet-glow',x:'-100%',y:'-100%',width:'300%',height:'300%'},defs);
  svgEl('feGaussianBlur',{stdDeviation:'7'},glow);
  const flameGradient=svgEl('linearGradient',{id:'flame-color',x1:'0',y1:'0',x2:'0',y2:'1'},defs);
  svgEl('stop',{offset:'0%','stop-color':'#e3fbff'},flameGradient);svgEl('stop',{offset:'60%','stop-color':'#00dfff'},flameGradient);svgEl('stop',{offset:'100%','stop-color':'#7c3aed','stop-opacity':'0'},flameGradient);
  colors.forEach((c,i)=>{const g=svgEl('radialGradient',{id:`world-${i}`,cx:'30%',cy:'25%',r:'75%'},defs);svgEl('stop',{offset:'0%','stop-color':c},g);svgEl('stop',{offset:'100%','stop-color':'#111b43'},g);});
  const stars=svgEl('g',{'aria-hidden':'true',class:'journey-stars'},svg);
  for(let i=0;i<100;i++){
   const x=((i*137.51+27)%1200)*(small?640/1200:1),y=(i*83.17+17)%h;
   const star=svgEl('circle',{cx:x,cy:y,r:i%11===0?1.7:.8,fill:i%4===0?'#8fdcf8':'#9ea9d5',opacity:i%3===0?.7:.27},stars);
   if(i%11===0){star.setAttribute('class','twinkle');star.style.animationDelay=`${i%7}s`;}
  }
  // A distant celestial body gives the scene depth without competing with the route.
  svgEl('circle',{cx:small?600:1110,cy:small?25:-60,r:small?125:180,fill:'#31305f',opacity:'.16'},svg);
  const anchors=pts.map(([x,y],i)=>[x,y-(i===6?65:47)]);
  let d=`M${anchors[0][0]},${anchors[0][1]}`;const segments=[];
  for(let i=1;i<anchors.length;i++){
   const [x,y]=anchors[i-1],[nx,ny]=anchors[i];
   const prev=anchors[Math.max(0,i-2)],after=anchors[Math.min(anchors.length-1,i+1)];
   const c1x=x+(nx-prev[0])/6,c1y=y+(ny-prev[1])/6,c2x=nx-(after[0]-x)/6,c2y=ny-(after[1]-y)/6;
   const curve=`C${c1x},${c1y} ${c2x},${c2y} ${nx},${ny}`;
   const seg=svgEl('path',{d:`M${x},${y} ${curve}`,fill:'none',visibility:'hidden'},svg);segments.push(seg);
   d+=` ${curve}`;
  }
  route=svgEl('path',{d,fill:'none',stroke:'#778fbe','stroke-opacity':'.33','stroke-width':'1.5','stroke-dasharray':'4 8'},svg);
  trail=svgEl('path',{d,fill:'none',stroke:'#57dff3','stroke-opacity':'.8','stroke-width':'2',class:'journey-trail'},svg);
  length=route.getTotalLength();legFractions=[0];let cumulative=0;segments.forEach(s=>{cumulative+=s.getTotalLength();legFractions.push(cumulative/length);});
  pts.forEach(([x,y],i)=>{
   const radius=i===6?43:22+(i%3)*3;
   const group=svgEl('g',{transform:`translate(${x},${y})`,class:'journey-planet',role:'button',tabindex:'0','aria-label':`Visitar etapa ${i+1}: ${steps[i].title}`},svg);planets.push(group);
   group.addEventListener('click',()=>select(i,true));
   group.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();select(i,true);}});
   svgEl('circle',{r:radius+13,fill:colors[i],opacity:'.2',filter:'url(#planet-glow)',class:'planet-halo'},group);
   svgEl('circle',{r:radius+11,fill:'none',stroke:colors[i],'stroke-opacity':'.6','stroke-width':'.8',class:'planet-orbit'},group);
   if(i===2||i===6)svgEl('ellipse',{rx:radius+21,ry:radius*.32,transform:'rotate(-24)',fill:'none',stroke:colors[i],'stroke-opacity':'.65','stroke-width':'2'},group);
   svgEl('circle',{r:radius,fill:`url(#world-${i})`,stroke:colors[i],'stroke-opacity':'.6','stroke-width':'.8'},group);
   svgEl('ellipse',{cx:-radius*.2,cy:radius*.19,rx:radius*.37,ry:radius*.13,transform:'rotate(-24)',fill:'#07102b',opacity:'.2'},group);
   svgEl('circle',{cx:radius*.28,cy:-radius*.15,r:radius*.16,fill:'#e7f7ff',opacity:'.09'},group);
   const num=svgEl('text',{x:0,y:radius+30,'text-anchor':'middle',class:'planet-number'},group);num.textContent=String(i+1).padStart(2,'0');
   const title=svgEl('text',{x:0,y:radius+51,'text-anchor':'middle',class:'planet-name'},group);title.textContent=short[i];
  });
  rocket=svgEl('g',{'aria-hidden':'true',class:'journey-rocket'},svg);
  const jet=svgEl('g',{class:'rocket-jet'},rocket);svgEl('path',{d:'M-6 14 Q-10 32 0 46 Q10 32 6 14Z',fill:'url(#flame-color)'},jet);
  svgEl('path',{d:'M-8 4 L-18 18 L-7 15 M8 4 L18 18 L7 15',fill:'#a57bff',stroke:'#b4a1ff','stroke-width':'.7'},rocket);
  svgEl('path',{d:'M0-27 C-8-17-12-1-8 14 L8 14 C12-1 8-17 0-27Z',fill:'#e4f1ff',stroke:'#a6d9eb','stroke-width':'.8'},rocket);
  svgEl('circle',{cx:0,cy:-6,r:5,fill:'#168ca8',stroke:'#53dff3','stroke-width':'1.2'},rocket);
  progress=legFractions[active]||0;pose();update();
 }
 toggle.addEventListener('click',()=>{if(paused&&active===6&&phase==='hold'){select(0);paused=false;}else paused=!paused;detail.removeAttribute('aria-live');update();});
 next.addEventListener('click',()=>select((active+1)%7,true));
 mobile.addEventListener('change',build);
 reduced.addEventListener('change',()=>{paused=reduced.matches;update();});
 new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;last=0;board.classList.toggle('journey-away',!inView);},{threshold:.1}).observe(board);
 document.addEventListener('visibilitychange',()=>{last=0;});
 function tick(now){
  const dt=last?Math.min(now-last,80):0;last=now;
  if(inView&&!document.hidden&&!paused){
   elapsed+=dt;
   if(phase==='hold'&&elapsed>2700){
    if(active===6){paused=true;update();}
    else {phase='flight';elapsed=0;board.classList.add('in-flight');board.classList.remove('mission-arrived');}
   } else if(phase==='flight'){
    const k=Math.min(1,elapsed/2100),e=k*k*(3-2*k);progress=legFractions[active]+(legFractions[active+1]-legFractions[active])*e;pose();
    if(k===1){active++;elapsed=0;phase='hold';board.classList.remove('in-flight');update();}
   }
  }
  requestAnimationFrame(tick);
 }
 build();update();requestAnimationFrame(tick);
})();
