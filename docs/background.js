class Particle {
    constructor(x, y, ctx) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.distance = 50;
        this.color = '#64ffda';
        this.alpha = Math.random() * 0.5 + 0.2;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fillStyle = `${this.color}${Math.floor(this.alpha * 255).toString(16).padStart(2, '0')}`;
        this.ctx.fill();
    }

    update(mouse) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;

        const maxDistance = 100;
        let force = (maxDistance - distance) / maxDistance;
        if (force < 0) force = 0;

        let directionX = (forceDirectionX * force * this.density);
        let directionY = (forceDirectionY * force * this.density);

        if (distance < maxDistance) {
            this.x -= directionX;
            this.y -= directionY;
            this.alpha = 0.8;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
            this.alpha = Math.max(0.2, this.alpha - 0.02);
        }
    }
}

class ParticleNetwork {
    constructor() {
        this.canvas = document.getElementById('bgCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = {
            x: null,
            y: null,
            radius: 100
        };

        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.handleMouse(e));
        window.addEventListener('mouseout', () => this.handleMouseOut());
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const numberOfParticles = (this.canvas.width * this.canvas.height) / 15000;
        
        for (let i = 0; i < numberOfParticles; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.particles.push(new Particle(x, y, this.ctx));
        }
    }

    handleMouse(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    handleMouseOut() {
        this.mouse.x = null;
        this.mouse.y = null;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.draw();
            if (this.mouse.x != null) {
                particle.update(this.mouse);
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the particle network when the window loads
window.addEventListener('load', () => {
    new ParticleNetwork();
});
