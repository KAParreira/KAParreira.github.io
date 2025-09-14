const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Partículas
const particles = [];
for(let i=0;i<120;i++){
  particles.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, size:Math.random()*2+1, speedX:(Math.random()*1-0.5), speedY:(Math.random()*1-0.5)});
}
const mouse2 = {x:null, y:null};
window.addEventListener('mousemove', e=>{mouse2.x=e.x; mouse2.y=e.y;});

function updateParticles(){
  particles.forEach(p=>{
    p.x+=p.speedX;
    p.y+=p.speedY;
    let dx = mouse2.x-p.x, dy=mouse2.y-p.y, dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<120){ p.x-=dx/25; p.y-=dy/25;}
    if(p.x<0 || p.x>canvas.width) p.speedX*=-1;
    if(p.y<0 || p.y>canvas.height) p.speedY*=-1;
  });
}
function drawParticles(){
  particles.forEach(p=>{
    ctx.fillStyle='blueviolet';
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fill();
  });
}
function connectParticles(){
  for(let a=0;a<particles.length;a++){
    for(let b=a;b<particles.length;b++){
      let dx = particles[a].x-particles[b].x;
      let dy = particles[a].y-particles[b].y;
      let dist = Math.sqrt(dx*dx+dy*dy);
      if(dist<120){
        ctx.strokeStyle=`rgba(138,43,226,${1-dist/120})`;
        ctx.lineWidth=1;
        ctx.beginPath();
        ctx.moveTo(particles[a].x,particles[a].y);
        ctx.lineTo(particles[b].x,particles[b].y);
        ctx.stroke();
      }
    }
  }
}

// Mapa de metrô
const metroLines = [
  { color:'BlueViolet', y:canvas.height*0.4, offset:0, stations:[], trains:[]},
  { color:'BlueViolet', y:canvas.height*0.8, offset:50, stations:[], trains:[]}

];
metroLines.forEach(line=>{
  for(let x=0;x<canvas.width;x+=180) line.stations.push({x:x, y:line.y+Math.sin((x+line.offset)/80)*30});
  for(let i=0;i<4;i++) line.trains.push({pos: Math.random()*canvas.width});
});

function drawMetro(){
  metroLines.forEach(line=>{
    ctx.strokeStyle=line.color;
    ctx.lineWidth=2;
    ctx.beginPath();
    for(let x=0;x<canvas.width;x+=20){
      let y=line.y+Math.sin((x+line.offset)/80)*30;
      if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
    // Estações
    line.stations.forEach(s=>{
      ctx.fillStyle=line.color;
      ctx.beginPath();
      ctx.arc(s.x,s.y,6,0,Math.PI*2);
      ctx.fill();
    });
    // Trens
    line.trains.forEach(t=>{
      let y=line.y+Math.sin((t.pos+line.offset)/80)*30;
      ctx.fillStyle=line.color;
      ctx.shadowColor=line.color;
      ctx.shadowBlur=12;
      ctx.beginPath();
      ctx.arc(t.pos,y,6,0,Math.PI*2);
      ctx.fill();
      ctx.shadowBlur=0;
      t.pos+=2;
      if(t.pos>canvas.width) t.pos=0;
    });
  });
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  updateParticles();
  drawParticles();
  connectParticles();
  drawMetro();
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', ()=>{
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
});