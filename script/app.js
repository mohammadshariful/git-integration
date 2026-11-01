const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
Object.assign(canvas.style, { position: "fixed", inset: 0, background: "#0b1020" });
document.body.style.margin = "0";
document.body.appendChild(canvas);

const COUNT = 80;
const LINK_DISTANCE = 120;
const mouse = { x: null, y: null };
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticle() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        r: Math.random() * 2 + 1,
    };
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "#7dd3fc";
        ctx.fill();
    }

    const points = mouse.x === null ? particles : [...particles, mouse];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < LINK_DISTANCE) {
                ctx.strokeStyle = `rgba(125, 211, 252, ${1 - dist / LINK_DISTANCE})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);
window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener("mouseout", () => {
    mouse.x = mouse.y = null;
});

resize();
particles = Array.from({ length: COUNT }, createParticle);
animate();
