const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Configurable settings object
const config = {
    minRadius: 5,
    maxRadius: 50,
    pulseFactor: 0.001,  // Much slower pulse rate
    fadeSpeed: 0.0001,    // Much slower fade speed
    bounceFactor: 0.01      // Gentle bounce effect
};

class Circle {
    constructor(x, y, radius, color, blur, opacity) {
        this.x = x;
        this.y = y;
        this.baseRadius = radius;
        this.radius = radius;
        this.color = color;
        this.blur = blur;
        this.opacity = opacity;
        this.pulseFactor = config.pulseFactor;  
        this.className = 'object'; // Add class name property
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.filter = `blur(${this.blur}px)`;
        ctx.fill();
        ctx.closePath();
        ctx.filter = 'none'; // Reset the filter
    }

    update() {
        this.pulse();
        this.draw();
        this.fade();
    }

    pulse() {
        this.radius = this.baseRadius + Math.sin(Date.now() * this.pulseFactor) * (this.baseRadius * config.bounceFactor);
    }

    fade() {
        this.opacity -= config.fadeSpeed;
    }
}

const circles = [];
let stepCounter = 0;
const stepsToAddCircle = Math.floor(Math.random() * 3) + 2;  // 2 to 4 steps

function getRandomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomBlurValue() {
    return Math.random() * 10; // Random blur value between 0 and 10
}

function getRandomOpacity() {
    return Math.random() * (0.9 - 0.2) + 0.2; // Random opacity between 0.2 and 0.9
}

function addCircle(x, y) {
    const radius = Math.random() * (config.maxRadius - config.minRadius) + config.minRadius;
    const color = getRandomHexColor();
    const blur = getRandomBlurValue();
    const opacity = getRandomOpacity();
    const circle = new Circle(x, y, radius, color, blur, opacity);
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
    stepCounter++;
    if (stepCounter % stepsToAddCircle === 0) {
        addCircle(event.clientX, event.clientY);
        stepCounter = 0;  // Reset step counter
    }
}

animate();
canvas.addEventListener('mousemove', onMouseMove);
