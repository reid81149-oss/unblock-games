// Flappy Bird Game
class FlappyBirdGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 500;
        
        this.bird = {
            x: 50,
            y: this.canvas.height / 2,
            width: 30,
            height: 30,
            velocity: 0,
            gravity: 0.6,
            jump: -12
        };
        
        this.pipes = [];
        this.score = 0;
        this.gameRunning = false;
        this.pipeGap = 120;
        this.pipeWidth = 60;
        this.pipeSpacing = 200;
        
        this.setupControls();
    }
    
    setupControls() {
        const jump = () => {
            if (this.gameRunning) {
                this.bird.velocity = this.bird.jump;
            }
        };
        
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key.toLowerCase() === 'w') {
                jump();
                e.preventDefault();
            }
        });
        
        this.canvas.addEventListener('click', jump);
    }
    
    start() {
        this.gameRunning = true;
        this.bird = {
            x: 50,
            y: this.canvas.height / 2,
            width: 30,
            height: 30,
            velocity: 0,
            gravity: 0.6,
            jump: -12
        };
        this.pipes = [];
        this.score = 0;
        this.gameLoop();
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        // Update bird
        this.bird.velocity += this.bird.gravity;
        this.bird.y += this.bird.velocity;
        
        // Check collision with ceiling/floor
        if (this.bird.y + this.bird.height > this.canvas.height || this.bird.y < 0) {
            this.endGame();
            return;
        }
        
        // Generate pipes
        if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < this.canvas.width - this.pipeSpacing) {
            const gapStart = Math.random() * (this.canvas.height - this.pipeGap - 50) + 25;
            this.pipes.push({
                x: this.canvas.width,
                gapStart: gapStart,
                passed: false
            });
        }
        
        // Update and check pipes
        this.pipes = this.pipes.filter(pipe => pipe.x > -this.pipeWidth);
        
        this.pipes.forEach(pipe => {
            pipe.x -= 5;
            
            // Check collision
            if (this.bird.x + this.bird.width > pipe.x &&
                this.bird.x < pipe.x + this.pipeWidth &&
                (this.bird.y < pipe.gapStart || this.bird.y + this.bird.height > pipe.gapStart + this.pipeGap)) {
                this.endGame();
                return;
            }
            
            // Increase score
            if (!pipe.passed && pipe.x + this.pipeWidth < this.bird.x) {
                pipe.passed = true;
                this.score += 1;
            }
        });
        
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    draw() {
        // Draw background
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw bird
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(this.bird.x, this.bird.y, this.bird.width / 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw pipes
        this.ctx.fillStyle = '#228B22';
        this.pipes.forEach(pipe => {
            // Top pipe
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.gapStart);
            // Bottom pipe
            this.ctx.fillRect(pipe.x, pipe.gapStart + this.pipeGap, this.pipeWidth, 
                            this.canvas.height - pipe.gapStart - this.pipeGap);
        });
        
        // Draw score
        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    }
    
    endGame() {
        this.gameRunning = false;
        alert(`Game Over! Final Score: ${this.score}`);
    }
    
    pause() {
        this.gameRunning = false;
    }
    
    resume() {
        this.gameRunning = true;
        this.gameLoop();
    }
}
