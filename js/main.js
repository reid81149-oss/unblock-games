// Game Data
const games = [
    {
        id: 'snake',
        name: 'Snake',
        icon: '🐍',
        description: 'Classic Snake game - eat food and grow!',
        instructions: [
            'Use Arrow Keys or WASD to move',
            'Eat the red food to grow',
            'Avoid hitting walls and yourself',
            'Get the highest score!'
        ]
    },
    {
        id: 'flappy',
        name: 'Flappy Bird',
        icon: '🐦',
        description: 'Navigate through pipes without crashing',
        instructions: [
            'Press SPACE or CLICK to make the bird jump',
            'Avoid the green pipes',
            'Pass through the gaps to score points',
            'Try to get the highest score!'
        ]
    },
    {
        id: '2048',
        name: '2048',
        icon: '🎮',
        description: 'Slide tiles and combine numbers to reach 2048',
        instructions: [
            'Use Arrow Keys or WASD to move tiles',
            'Combine tiles with the same number',
            'Try to reach 2048',
            'Use strategy to maximize your score!'
        ]
    }
];

let currentGame = null;
let snakeGame = null;
let flappyGame = null;
let game2048 = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadGames();
    setupModal();
});

function loadGames() {
    const gameGrid = document.getElementById('gameGrid');
    gameGrid.innerHTML = '';
    
    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <div class="game-icon">${game.icon}</div>
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <button class="play-btn" onclick="openGame('${game.id}')">Play Now</button>
        `;
        gameGrid.appendChild(gameCard);
    });
}

function openGame(gameId) {
    currentGame = games.find(g => g.id === gameId);
    const modal = document.getElementById('gameModal');
    const gameTitle = document.getElementById('gameTitle');
    const gameContainer = document.getElementById('gameContainer');
    
    gameTitle.textContent = currentGame.name;
    gameContainer.innerHTML = '';
    
    let gameHTML = `
        <div class="game-info">${currentGame.description}</div>
        <canvas id="gameCanvas"></canvas>
        <div class="controls">
            <button onclick="startCurrentGame()">Start Game</button>
            <button onclick="pauseCurrentGame()">Pause</button>
            <button onclick="resumeCurrentGame()">Resume</button>
        </div>
        <div class="game-instructions">
            <h4>How to Play:</h4>
            ${currentGame.instructions.map(inst => `<p>• ${inst}</p>`).join('')}
        </div>
        <div class="score-display" id="scoreDisplay"></div>
    `;
    
    gameContainer.innerHTML = gameHTML;
    
    // Initialize game based on type
    if (gameId === 'snake') {
        snakeGame = new SnakeGame('gameCanvas');
    } else if (gameId === 'flappy') {
        flappyGame = new FlappyBirdGame('gameCanvas');
    } else if (gameId === '2048') {
        game2048 = new Game2048('gameCanvas');
        render2048();
    }
    
    modal.style.display = 'block';
}

function startCurrentGame() {
    if (currentGame.id === 'snake' && snakeGame) {
        snakeGame.start();
    } else if (currentGame.id === 'flappy' && flappyGame) {
        flappyGame.start();
    } else if (currentGame.id === '2048' && game2048) {
        game2048.start();
        render2048();
    }
}

function pauseCurrentGame() {
    if (currentGame.id === 'snake' && snakeGame) {
        snakeGame.pause();
    } else if (currentGame.id === 'flappy' && flappyGame) {
        flappyGame.pause();
    } else if (currentGame.id === '2048' && game2048) {
        game2048.gameRunning = false;
    }
}

function resumeCurrentGame() {
    if (currentGame.id === 'snake' && snakeGame) {
        snakeGame.resume();
    } else if (currentGame.id === 'flappy' && flappyGame) {
        flappyGame.resume();
    } else if (currentGame.id === '2048' && game2048) {
        game2048.gameRunning = true;
    }
}

function render2048() {
    const grid = game2048.getGrid();
    const gameContainer = document.getElementById('gameContainer');
    const scoreDisplay = document.getElementById('scoreDisplay');
    
    scoreDisplay.textContent = `Score: ${game2048.score}`;
    
    let gridHTML = '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; max-width: 300px; margin: 20px auto;">';
    
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const value = grid[i][j];
            const color = getTileColor(value);
            gridHTML += `
                <div style="
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: ${color};
                    color: white;
                    font-weight: bold;
                    font-size: 24px;
                    border-radius: 5px;
                    cursor: default;
                ">${value === 0 ? '' : value}</div>
            `;
        }
    }
    
    gridHTML += '</div>';
    
    if (game2048.gameOver) {
        gridHTML += '<p style="color: red; font-weight: bold; margin-top: 20px;">Game Over!</p>';
    }
    if (game2048.won) {
        gridHTML += '<p style="color: green; font-weight: bold; margin-top: 20px;">You reached 2048!</p>';
    }
    
    const controlsIndex = gameContainer.innerHTML.indexOf('<div class="controls">');
    gameContainer.innerHTML = gameContainer.innerHTML.substring(0, controlsIndex) + 
                              gridHTML + 
                              gameContainer.innerHTML.substring(controlsIndex);
}

function getTileColor(value) {
    const colors = {
        0: '#cdc1b4',
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e'
    };
    return colors[value] || '#3c3c2f';
}

function setupModal() {
    const modal = document.getElementById('gameModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
        if (snakeGame) snakeGame.pause();
        if (flappyGame) flappyGame.pause();
        if (game2048) game2048.gameRunning = false;
    }
    
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            if (snakeGame) snakeGame.pause();
            if (flappyGame) flappyGame.pause();
            if (game2048) game2048.gameRunning = false;
        }
    }
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const gameGrid = document.getElementById('gameGrid');
    const gameCards = gameGrid.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        const gameName = card.querySelector('h3').textContent.toLowerCase();
        const gameDesc = card.querySelector('p').textContent.toLowerCase();
        
        if (gameName.includes(searchTerm) || gameDesc.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});
