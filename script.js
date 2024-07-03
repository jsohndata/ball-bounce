const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF5'];

class Circle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.baseRadius = radius;
        this.radius = radius;
        this.color = color;
        this.pulseFactor = 0.1;
        this.opacity = 1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.pulse();
        this.draw();
        this.fade();
    }

    pulse() {
        this.radius = this.baseRadius + Math.sin(Date.now() * this.pulseFactor) * 5;
    }

    fade() {
        this.opacity -= 0.01;
    }
}

const circles = [];

function addCircle(x, y) {
    const radius = Math.random() * 20 + 10;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const circle = new Circle(x, y, radius, color);
    circles.push(circle);
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach((circle, index) => {
        if (circle.opacity > 0) {
            circle.update();
        } else {
            circles.splice(index, 1);
        }
    });
}

function onMouseMove(event) {
    addCircle(event.clientX, event.clientY);
}

animate();
canvas.addEventListener('mousemove', onMouseMove);
