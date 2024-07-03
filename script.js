const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const balls = [];
const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF5'];
let mouseBall;

class Ball {
    constructor(x, y, radius, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.baseRadius = radius;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.pulseFactor = 0.05;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        if (this !== mouseBall) {
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }

            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.dy = -this.dy;
            }

            this.x += this.dx;
            this.y += this.dy;
        }

        this.pulse();
        this.draw();
    }

    pulse() {
        this.radius = this.baseRadius + Math.sin(Date.now() * this.pulseFactor) * 5;
    }

    interact(otherBall) {
        const dx = otherBall.x - this.x;
        const dy = otherBall.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + otherBall.radius) {
            this.dx = -this.dx;
            this.dy = -this.dy;
            otherBall.dx = -otherBall.dx;
            otherBall.dy = -otherBall.dy;
        }
    }
}

function init() {
    for (let i = 0; i < 50; i++) {
        const radius = Math.random() * 20 + 10;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const dx = (Math.random() - 0.5) * 2;
        const dy = (Math.random() - 0.5) * 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        balls.push(new Ball(x, y, radius, dx, dy, color));
    }

    // Add a special ball controlled by the mouse
    mouseBall = new Ball(canvas.width / 2, canvas.height / 2, 30, 0, 0, '#FFFFFF');
    balls.push(mouseBall);
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    balls.forEach(ball => {
        ball.update();
    });

    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            balls[i].interact(balls[j]);
        }
    }
}

function onMouseMove(event) {
    mouseBall.x = event.clientX;
    mouseBall.y = event.clientY;
}

init();
animate();
canvas.addEventListener('mousemove', onMouseMove);
