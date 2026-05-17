// 2048 Game
class Game2048 {
    constructor(canvasId) {
        this.gridSize = 4;
        this.tiles = [];
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        this.gameRunning = false;
        
        this.initTiles();
        this.setupControls();
    }
    
    initTiles() {
        this.tiles = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(0));
        this.addNewTile();
        this.addNewTile();
        this.score = 0;
        this.gameOver = false;
        this.won = false;
    }
    
    addNewTile() {
        const empty = [];
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.tiles[i][j] === 0) {
                    empty.push({x: i, y: j});
                }
            }
        }
        
        if (empty.length > 0) {
            const pos = empty[Math.floor(Math.random() * empty.length)];
            this.tiles[pos.x][pos.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            let moved = false;
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    moved = this.moveUp();
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    moved = this.moveDown();
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    moved = this.moveLeft();
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    moved = this.moveRight();
                    e.preventDefault();
                    break;
            }
            
            if (moved) {
                this.addNewTile();
                this.checkGameStatus();
            }
        });
    }
    
    move(tiles) {
        const newTiles = tiles.map(row => [...row]);
        let moved = false;
        
        for (let i = 0; i < this.gridSize; i++) {
            const row = newTiles[i].filter(val => val !== 0);
            
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                }
            }
            
            while (row.length < this.gridSize) {
                row.push(0);
            }
            
            if (JSON.stringify(newTiles[i]) !== JSON.stringify(row)) {
                moved = true;
            }
            newTiles[i] = row;
        }
        
        return { tiles: newTiles, moved };
    }
    
    moveLeft() {
        const result = this.move(this.tiles);
        this.tiles = result.tiles;
        return result.moved;
    }
    
    moveRight() {
        this.tiles = this.tiles.map(row => row.reverse());
        const result = this.move(this.tiles);
        this.tiles = result.tiles.map(row => row.reverse());
        return result.moved;
    }
    
    moveUp() {
        const transposed = Array(this.gridSize).fill(null).map((_, i) => 
            Array(this.gridSize).fill(null).map((_, j) => this.tiles[j][i])
        );
        const result = this.move(transposed);
        this.tiles = Array(this.gridSize).fill(null).map((_, i) => 
            Array(this.gridSize).fill(null).map((_, j) => result.tiles[j][i])
        );
        return result.moved;
    }
    
    moveDown() {
        const transposed = Array(this.gridSize).fill(null).map((_, i) => 
            Array(this.gridSize).fill(null).map((_, j) => this.tiles[j][i]).reverse()
        );
        const result = this.move(transposed);
        this.tiles = Array(this.gridSize).fill(null).map((_, i) => 
            Array(this.gridSize).fill(null).map((_, j) => result.tiles[j][this.gridSize - 1 - i])
        );
        return result.moved;
    }
    
    checkGameStatus() {
        // Check for 2048
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.tiles[i][j] === 2048 && !this.won) {
                    this.won = true;
                }
            }
        }
        
        // Check for game over
        if (this.isGameOver()) {
            this.gameOver = true;
        }
    }
    
    isGameOver() {
        // Check for empty tiles
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.tiles[i][j] === 0) return false;
            }
        }
        
        // Check for possible merges
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const current = this.tiles[i][j];
                if ((i < this.gridSize - 1 && current === this.tiles[i + 1][j]) ||
                    (j < this.gridSize - 1 && current === this.tiles[i][j + 1])) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    start() {
        this.initTiles();
        this.gameRunning = true;
    }
    
    getGrid() {
        return this.tiles;
    }
}
