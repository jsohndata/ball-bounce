const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const config = {
    colors: [
        'rgba(255, 105, 135, 0.2)',  // Darker Light Pink
        'rgba(34, 139, 34, 0.1)',    // Darker Light Green
        'rgba(100, 149, 237, 0.2)',  // Darker Light Blue
        'rgba(128, 0, 128, 0.1)',    // Darker Plum
        'rgba(0, 206, 209, 0.2)',    // Darker Light Cyan
        'rgba(219, 112, 147, 0.1)',  // Darker Lavender Blush
        'rgba(210, 180, 140, 0.2)',  // Darker Antique White
        'rgba(255, 192, 203, 0.1)',  // Darker Misty Rose
        'rgba(255, 223, 0, 0.1)',    // Darker Lemon Chiffon
        'rgba(173, 216, 230, 0.2)',  // Darker Alice Blue
        'rgba(255, 140, 0, 0.1)',    // Darker Moccasin
        'rgba(0, 255, 127, 0.2)',    // Darker Honeydew
        'rgba(255, 228, 181, 0.2)',  // Darker Seashell
        'rgba(152, 251, 152, 0.2)',  // Darker Mint Cream
        'rgba(189, 183, 107, 0.2)',  // Darker Khaki
        'rgba(148, 0, 211, 0.1)'     // Darker Lavender
    ],
    minRadius: 2,
    maxRadius: 120,
    pulseFactor: 0.001,  // Much slower pulse rate
    fadeSpeed: 0.0004,   // Much slower fade speed
    bounceFactor: 0.1    // Gentle bounce effect
};

class Circle {
    constructor(x, y, radius, color) {
        Object.assign(this, { x, y, baseRadius: radius, radius, color, pulseFactor: config.pulseFactor, opacity: 1 });
    }

    draw = () => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.closePath();
    }

    update = () => {
        this.pulse();
        this.draw();
        this.fade();
    }

    pulse = () => {
        this.radius = this.baseRadius + Math.sin(Date.now() * this.pulseFactor) * (this.baseRadius * config.bounceFactor);
    }

    fade = () => {
        this.opacity -= config.fadeSpeed;
    }
}

const circles = [];
let stepCounter = 0;
const stepsToAddCircle = () => Math.floor(Math.random() * 3) + 2;  // 2 to 4 steps
let steps = stepsToAddCircle();

const addCircle = (x, y) => {
    const radius = Math.random() * (config.maxRadius - config.minRadius) + config.minRadius;
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    circles.push(new Circle(x, y, radius, color));
}

const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach((circle, index) => {
        circle.opacity > 0 ? circle.update() : circles.splice(index, 1);
    });
}

const onPointerMove = event => {
    stepCounter++;
    if (stepCounter % steps === 0) {
        const x = event.clientX || event.touches[0].clientX;
        const y = event.clientY || event.touches[0].clientY;
        addCircle(x, y);
        stepCounter = 0;
        steps = stepsToAddCircle();  // Reset step counter and steps
    }
}

animate();
canvas.addEventListener('mousemove', onPointerMove);
canvas.addEventListener('touchmove', onPointerMove, { passive: true });
