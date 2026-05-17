// Snake Game
class SnakeGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 400;
        
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        this.snake = [{x: 10, y: 10}];
        this.food = {x: 15, y: 15};
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        this.score = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameOver = false;
        
        this.setupControls();
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (this.direction.y === 0) {
                        this.nextDirection = {x: 0, y: -1};
                    }
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (this.direction.y === 0) {
                        this.nextDirection = {x: 0, y: 1};
                    }
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.direction.x === 0) {
                        this.nextDirection = {x: -1, y: 0};
                    }
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.direction.x === 0) {
                        this.nextDirection = {x: 1, y: 0};
                    }
                    e.preventDefault();
                    break;
            }
        });
    }
    
    start() {
        this.snake = [{x: 10, y: 10}];
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        this.score = 0;
        this.gameRunning = true;
        this.gamePaused = false;
        this.gameOver = false;
        this.spawnFood();
        this.gameLoop();
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) {
            if (this.gameRunning && !this.gamePaused) {
                requestAnimationFrame(() => this.gameLoop());
            }
            return;
        }
        
        this.direction = this.nextDirection;
        
        // Move snake
        const head = this.snake[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };
        
        // Check collision with walls
        if (newHead.x < 0 || newHead.x >= this.tileCount || 
            newHead.y < 0 || newHead.y >= this.tileCount) {
            this.endGame();
            return;
        }
        
        // Check collision with self
        for (let segment of this.snake) {
            if (newHead.x === segment.x && newHead.y === segment.y) {
                this.endGame();
                return;
            }
        }
        
        this.snake.unshift(newHead);
        
        // Check food collision
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.score += 10;
            this.spawnFood();
        } else {
            this.snake.pop();
        }
        
        this.draw();
        
        setTimeout(() => this.gameLoop(), 100);
    }
    
    spawnFood() {
        let newFood;
        let onSnake = true;
        
        while (onSnake) {
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
            
            onSnake = this.snake.some(segment => 
                segment.x === newFood.x && segment.y === newFood.y
            );
        }
        
        this.food = newFood;
    }
    
    draw() {
        // Draw background
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.tileCount; i++) {
            const pos = i * this.gridSize;
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }
        
        // Draw food
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 1,
            this.food.y * this.gridSize + 1,
            this.gridSize - 2,
            this.gridSize - 2
        );
        
        // Draw snake
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                this.ctx.fillStyle = '#00FF00';
            } else {
                this.ctx.fillStyle = '#00AA00';
            }
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });
        
        // Draw score
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 20);
    }
    
    endGame() {
        this.gameRunning = false;
        this.gameOver = true;
        alert(`Game Over! Final Score: ${this.score}`);
    }
    
    pause() {
        this.gamePaused = true;
    }
    
    resume() {
        if (this.gameRunning) {
            this.gamePaused = false;
            this.gameLoop();
        }
    }
}
