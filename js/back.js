const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Partículas
const particles = [];
for (let i = 0; i < 220; i++) {
  particles.push({ 
    x: Math.random() * canvas.width, 
    y: Math.random() * canvas.height, 
    size: Math.random() * 2 + 1, 
    speedX: (Math.random() * 1 - 0.5), 
    speedY: (Math.random() * 1 - 0.5) 
  });
}

const mouse2 = { x: null, y: null };
window.addEventListener('mousemove', e => { 
  mouse2.x = e.x; 
  mouse2.y = e.y; 
});

function updateParticles() {
  particles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    let dx = mouse2.x - p.x;
    let dy = mouse2.y - p.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 120) { 
      p.x -= dx / 25; 
      p.y -= dy / 25; 
    }
    
    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
  });
}

function drawParticles() {
  particles.forEach(p => {
    ctx.fillStyle = 'blueviolet';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 120) {
        ctx.strokeStyle = `rgba(138,43,226,${1 - dist / 120})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateParticles();
  drawParticles();
  connectParticles();
  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function toggleDescricao(button) {
    const descricao = button.nextElementSibling;
    if (descricao.style.display === "none") {
        descricao.style.display = "block";
        button.textContent = "Ver menos";
    } else {
        descricao.style.display = "none";
        button.textContent = "Saiba mais";
    }
}