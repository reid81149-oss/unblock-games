// FNAF World Game - Simplified Strategy RPG
class FNAFWorldGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 600;
        this.canvas.height = 500;
        
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameState = 'menu'; // menu, battle, victory, defeat
        this.score = 0;
        this.level = 1;
        this.turn = 0;
        
        // Player team
        this.playerTeam = [
            { name: 'Freddy', hp: 100, maxHp: 100, attack: 15, defense: 5, x: 80, y: 350 },
            { name: 'Bonnie', hp: 80, maxHp: 80, attack: 18, defense: 3, x: 160, y: 350 },
            { name: 'Chica', hp: 75, maxHp: 75, attack: 12, defense: 4, x: 240, y: 350 }
        ];
        
        // Enemy team
        this.enemyTeam = [
            { name: 'Shadow Freddy', hp: 90, maxHp: 90, attack: 16, defense: 4, x: 480, y: 100 },
            { name: 'Puppet', hp: 70, maxHp: 70, attack: 20, defense: 2, x: 400, y: 100 }
        ];
        
        this.selectedCharacter = 0;
        this.selectedEnemy = 0;
        this.battleLog = [];
        this.turnCounter = 0;
        
        this.setupControls();
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch(e.key.toLowerCase()) {
                case '1':
                    this.selectedCharacter = 0;
                    break;
                case '2':
                    this.selectedCharacter = 1;
                    break;
                case '3':
                    this.selectedCharacter = 2;
                    break;
                case 'a':
                    if (this.gameState === 'battle') {
                        this.playerAttack();
                    }
                    break;
                case 'd':
                    if (this.gameState === 'battle') {
                        this.playerDefend();
                    }
                    break;
                case 'h':
                    if (this.gameState === 'battle') {
                        this.playerHeal();
                    }
                    break;
                case ' ':
                    if (this.gameState === 'menu') {
                        this.startBattle();
                    }
                    e.preventDefault();
                    break;
            }
        });
    }
    
    start() {
        this.gameRunning = true;
        this.gameState = 'menu';
        this.score = 0;
        this.level = 1;
        this.resetTeams();
        this.gameLoop();
    }
    
    resetTeams() {
        this.playerTeam = [
            { name: 'Freddy', hp: 100, maxHp: 100, attack: 15, defense: 5, x: 80, y: 350 },
            { name: 'Bonnie', hp: 80, maxHp: 80, attack: 18, defense: 3, x: 160, y: 350 },
            { name: 'Chica', hp: 75, maxHp: 75, attack: 12, defense: 4, x: 240, y: 350 }
        ];
        
        this.enemyTeam = [
            { name: 'Shadow Freddy', hp: 90 + (this.level * 10), maxHp: 90 + (this.level * 10), attack: 16 + this.level, defense: 4, x: 480, y: 100 },
            { name: 'Puppet', hp: 70 + (this.level * 8), maxHp: 70 + (this.level * 8), attack: 20 + this.level, defense: 2, x: 400, y: 100 }
        ];
    }
    
    startBattle() {
        this.gameState = 'battle';
        this.battleLog = ['Battle Started!'];
        this.turnCounter = 0;
    }
    
    playerAttack() {
        if (this.selectedCharacter >= this.playerTeam.length) return;
        
        const attacker = this.playerTeam[this.selectedCharacter];
        const defender = this.enemyTeam[this.selectedEnemy];
        const damage = Math.max(1, attacker.attack + Math.floor(Math.random() * 10) - defender.defense);
        
        defender.hp = Math.max(0, defender.hp - damage);
        this.battleLog.push(`${attacker.name} attacks ${defender.name} for ${damage} damage!`);
        
        if (defender.hp <= 0) {
            this.battleLog.push(`${defender.name} has been defeated!`);
            this.enemyTeam.splice(this.selectedEnemy, 1);
            
            if (this.enemyTeam.length === 0) {
                this.victory();
                return;
            }
            
            this.selectedEnemy = Math.min(this.selectedEnemy, this.enemyTeam.length - 1);
        }
        
        this.enemyTurn();
    }
    
    playerDefend() {
        const defender = this.playerTeam[this.selectedCharacter];
        defender.defense += 5;
        this.battleLog.push(`${defender.name} takes a defensive stance!`);
        
        setTimeout(() => {
            defender.defense = Math.max(1, defender.defense - 5);
        }, 1500);
        
        this.enemyTurn();
    }
    
    playerHeal() {
        const healer = this.playerTeam[this.selectedCharacter];
        const healAmount = 25;
        healer.hp = Math.min(healer.maxHp, healer.hp + healAmount);
        this.battleLog.push(`${healer.name} heals for ${healAmount} HP!`);
        
        this.enemyTurn();
    }
    
    enemyTurn() {
        this.turnCounter++;
        
        setTimeout(() => {
            if (this.gameState !== 'battle') return;
            
            const enemy = this.enemyTeam[Math.floor(Math.random() * this.enemyTeam.length)];
            const target = this.playerTeam[Math.floor(Math.random() * this.playerTeam.length)];
            
            const damage = Math.max(1, enemy.attack + Math.floor(Math.random() * 10) - target.defense);
            target.hp = Math.max(0, target.hp - damage);
            
            this.battleLog.push(`${enemy.name} attacks ${target.name} for ${damage} damage!`);
            
            if (target.hp <= 0) {
                this.battleLog.push(`${target.name} has been defeated!`);
                this.playerTeam = this.playerTeam.filter(c => c.hp > 0);
                
                if (this.playerTeam.length === 0) {
                    this.defeat();
                    return;
                }
            }
        }, 500);
    }
    
    victory() {
        this.gameState = 'victory';
        this.level++;
        this.score += 100 * this.level;
        this.battleLog.push('VICTORY! You defeated all enemies!');
    }
    
    defeat() {
        this.gameState = 'defeat';
        this.battleLog.push('DEFEAT! All your characters have fallen!');
    }
    
    gameLoop() {
        this.draw();
        
        if (this.gameRunning) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw title
        this.ctx.fillStyle = '#FF6600';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText('FNAF WORLD', 20, 30);
        
        // Draw level and score
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillText(`Level: ${this.level}  Score: ${this.score}`, 20, 55);
        
        if (this.gameState === 'menu') {
            this.drawMenu();
        } else if (this.gameState === 'battle') {
            this.drawBattle();
        } else if (this.gameState === 'victory') {
            this.drawVictory();
        } else if (this.gameState === 'defeat') {
            this.drawDefeat();
        }
    }
    
    drawMenu() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(0, 100, this.canvas.width, 300);
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('FNAF WORLD', this.canvas.width / 2, 180);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('Battle Strategy Game', this.canvas.width / 2, 220);
        this.ctx.fillText('Press SPACE to Start Battle', this.canvas.width / 2, 320);
        
        this.ctx.textAlign = 'left';
    }
    
    drawBattle() {
        // Draw player team
        this.playerTeam.forEach((char, idx) => {
            const selected = idx === this.selectedCharacter;
            this.drawCharacter(char, selected, '#00FF00');
        });
        
        // Draw enemy team
        this.enemyTeam.forEach((enemy, idx) => {
            const selected = idx === this.selectedEnemy;
            this.drawCharacter(enemy, selected, '#FF0000');
        });
        
        // Draw battle log
        this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
        this.ctx.fillRect(0, 400, this.canvas.width, 100);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '12px Arial';
        const logLines = this.battleLog.slice(-3);
        logLines.forEach((line, idx) => {
            this.ctx.fillText(line, 10, 420 + (idx * 20));
        });
        
        // Draw controls
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.font = '12px Arial';
        this.ctx.fillText('1-3: Select | A: Attack | D: Defend | H: Heal', 10, 485);
    }
    
    drawCharacter(char, selected, color) {
        // Draw character box
        const boxColor = selected ? '#FFFF00' : color;
        this.ctx.strokeStyle = boxColor;
        this.ctx.lineWidth = selected ? 3 : 1;
        this.ctx.strokeRect(char.x - 30, char.y - 40, 60, 80);
        
        // Draw character name
        this.ctx.fillStyle = boxColor;
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(char.name, char.x, char.y - 20);
        
        // Draw HP bar
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(char.x - 25, char.y + 5, 50, 8);
        
        const hpPercent = Math.max(0, char.hp / char.maxHp);
        this.ctx.fillStyle = hpPercent > 0.3 ? '#00FF00' : '#FF0000';
        this.ctx.fillRect(char.x - 25, char.y + 5, 50 * hpPercent, 8);
        
        // Draw HP text
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '10px Arial';
        this.ctx.fillText(`${char.hp}/${char.maxHp}`, char.x, char.y + 25);
        
        this.ctx.textAlign = 'left';
    }
    
    drawVictory() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
        this.ctx.fillRect(100, 150, 400, 200);
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('VICTORY!', this.canvas.width / 2, 220);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '18px Arial';
        this.ctx.fillText(`Level ${this.level} - Score: ${this.score}`, this.canvas.width / 2, 270);
        this.ctx.fillText('Press SPACE for next battle', this.canvas.width / 2, 310);
        
        this.ctx.textAlign = 'left';
    }
    
    drawDefeat() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
        this.ctx.fillRect(100, 150, 400, 200);
        
        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, 220);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '18px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, 270);
        this.ctx.fillText('Press SPACE to return to menu', this.canvas.width / 2, 310);
        
        this.ctx.textAlign = 'left';
    }
    
    pause() {
        this.gamePaused = true;
    }
    
    resume() {
        this.gamePaused = false;
        this.gameLoop();
    }
}
