const canvas = document.getElementById("metroBackground");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lines = [];
let particles = [];
let mouse = { x: null, y: null, radius: 100 };

// === Criar linhas com movimento de cobrinha ===
function createLine() {
    // Decidir se a linha virá da esquerda ou direita
    const fromLeft = Math.random() > 0.6;
    const fromTop = Math.random() > 0.5;
    
    return {
        x: fromLeft ? 0 : canvas.width,
        y: fromTop ? 0 : canvas.height,
        dx: fromLeft ? (Math.random() * 1.5 + 1) : (Math.random() * -1.5 - 1),
        dy: fromTop ? (Math.random() * 1.5 + 1) : (Math.random() * -1.5 - 1),
        color: "rgba(138, 43, 226, 0.7)",
        length: 80 + Math.random() * 70,
        width: 3 + Math.random() * 3,
        path: [], // Array para armazenar o caminho percorrido
        maxPathLength: 600, // Número máximo de pontos no caminho
        turnFrequency: 0.01, // Frequência de mudança de direção
        lastTurn: 0, // Contador para controlar mudanças de direção
    };
}

// === Criar partículas em tons de roxo/BlueViolet ===
function createParticle() {
    const colors = [
        "rgba(138, 43, 226, 0.8)",     // BlueViolet
        "rgba(147, 112, 219, 0.8)",    // MediumPurple
        "rgba(123, 104, 238, 0.8)",    // MediumSlateBlue
        "rgba(106, 90, 205, 0.8)",     // SlateBlue
        "rgba(186, 85, 211, 0.8)",     // MediumOrchid
        "rgba(153, 50, 204, 0.8)",     // DarkOrchid
        "rgba(148, 0, 211, 0.8)"       // DarkViolet
    ];
    
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 1.2,
        dy: (Math.random() - 0.5) * 1.2,
        radius: 2.5 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        originalColor: ""
    };
}

// Inicializar
function init() {
    lines = [];
    particles = [];
    
    // Criar linhas com movimento de cobrinha
    for (let i = 0; i < 13; i++) {
        lines.push(createLine());
    }
    
    // Criar partículas
    for (let i = 0; i < 120; i++) {
        particles.push(createParticle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar fundo gradiente escuro
    const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) * 0.8
    );
    gradient.addColorStop(0, 'rgba(0, 0, 5, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 0, 25, 0.8)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // === Desenhar partículas do fundo ===
    particles.forEach(p => {
        p.x += p.dx * 0.5;
        p.y += p.dy * 0.5;

        // Rebote nas bordas
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        // Interação com o mouse (apenas partículas)
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (mouse.radius - distance) / mouse.radius;
                p.dx -= Math.cos(angle) * force * 0.6;
                p.dy -= Math.sin(angle) * force * 0.6;
                
                // Brilhar quando perto do mouse
                p.color = p.color.replace('0.8', '0.95');
            } else {
                // Voltar à cor original
                p.color = p.color.replace('0.95', '0.8');
            }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
    });

    // === Desenhar linhas com movimento de cobrinha ===
    lines.forEach(l => {
        // Adicionar posição atual ao caminho
        l.path.push({x: l.x, y: l.y});
        
        // Limitar o tamanho do caminho
        if (l.path.length > l.maxPathLength) {
            l.path.shift();
        }
        
        // Movimento de cobrinha - mudar direção ocasionalmente
        l.lastTurn++;
        if (l.lastTurn > 10 && Math.random() < l.turnFrequency) {
            // Mudar direção aleatoriamente
            if (Math.random() > 0.5) {
                l.dx = -l.dx;
            } else {
                l.dy = -l.dy;
            }
            l.lastTurn = 0;
        }
        
        // Movimento da linha
        l.x += l.dx;
        l.y += l.dy;
        
        // Desenhar o caminho completo como uma linha contínua
        if (l.path.length > 1) {
            ctx.beginPath();
            ctx.moveTo(l.path[0].x, l.path[0].y);
            
            for (let i = 1; i < l.path.length; i++) {
                ctx.lineTo(l.path[i].x, l.path[i].y);
            }
            
            ctx.strokeStyle = l.color;
            ctx.lineWidth = l.width;
            ctx.stroke();
        }
        
        // Desenhar "cabeça" da cobrinha (parte frontal)
        ctx.beginPath();
        ctx.arc(l.x, l.y, l.width * 1.0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(138, 43, 226, 0.9)";
        ctx.fill();
        
        // Desenhar "cauda" da cobrinha (parte traseira)
        if (l.path.length > 0) {
            const tail = l.path[0];
            ctx.beginPath();
            ctx.arc(tail.x, tail.y, l.width * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(138, 43, 226, 0.5)";
            ctx.fill();
        }

        // Se a linha sair da tela, recriá-la
        if (l.x < -100 || l.x > canvas.width + 100 || 
            l.y < -100 || l.y > canvas.height + 100) {
            const index = lines.indexOf(l);
            if (index > -1) {
                lines.splice(index, 1);
                lines.push(createLine());
            }
        }
    });

    requestAnimationFrame(animate);
}

// === Eventos do mouse ===
canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

canvas.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
});

// Redimensionar canvas quando a janela for redimensionada
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Iniciar
init();
animate();