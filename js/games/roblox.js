// Roblox-Inspired Tycoon Game
class RobloxTycoonGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.gameRunning = false;
        this.gamePaused = false;
        this.money = 1000;
        this.income = 1;
        this.incomePerSecond = 0;
        this.level = 1;
        this.score = 0;
        this.gameTime = 0;
        
        // Businesses/Upgrades
        this.businesses = [
            { 
                name: 'Pizza Shop',
                icon: '🍕',
                cost: 100,
                income: 5,
                count: 0,
                owned: false,
                x: 50,
                y: 100
            },
            {
                name: 'Bakery',
                icon: '🥐',
                cost: 250,
                income: 15,
                count: 0,
                owned: false,
                x: 150,
                y: 100
            },
            {
                name: 'Coffee Shop',
                icon: '☕',
                cost: 500,
                income: 30,
                count: 0,
                owned: false,
                x: 250,
                y: 100
            },
            {
                name: 'Restaurant',
                icon: '🍽️',
                cost: 1000,
                income: 75,
                count: 0,
                owned: false,
                x: 350,
                y: 100
            },
            {
                name: 'Hotel',
                icon: '🏨',
                cost: 2500,
                income: 200,
                count: 0,
                owned: false,
                x: 450,
                y: 100
            },
            {
                name: 'Casino',
                icon: '🎰',
                cost: 5000,
                income: 500,
                count: 0,
                owned: false,
                x: 550,
                y: 100
            }
        ];
        
        // Upgrades
        this.upgrades = [
            { name: 'Worker Efficiency', cost: 200, multiplier: 1.25, purchased: false, x: 50, y: 300 },
            { name: 'Better Equipment', cost: 500, multiplier: 1.5, purchased: false, x: 150, y: 300 },
            { name: 'Marketing', cost: 1000, multiplier: 2.0, purchased: false, x: 250, y: 300 },
            { name: 'Automation', cost: 2000, multiplier: 2.5, purchased: false, x: 350, y: 300 }
        ];
        
        this.selectedBusiness = -1;
        this.messageQueue = [];
        this.lastIncomeTime = Date.now();
        
        this.setupControls();
    }
    
    setupControls() {
        this.canvas.addEventListener('click', (e) => {
            if (!this.gameRunning) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Check business clicks
            this.businesses.forEach((business, idx) => {
                if (x > business.x && x < business.x + 80 && 
                    y > business.y && y < business.y + 80) {
                    this.buyBusiness(idx);
                }
            });
            
            // Check upgrade clicks
            this.upgrades.forEach((upgrade, idx) => {
                if (x > upgrade.x && x < upgrade.x + 90 && 
                    y > upgrade.y && y < upgrade.y + 50) {
                    this.buyUpgrade(idx);
                }
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch(e.key.toLowerCase()) {
                case ' ':
                    this.clickIncome();
                    e.preventDefault();
                    break;
            }
        });
    }
    
    start() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.money = 1000;
        this.income = 1;
        this.incomePerSecond = 0;
        this.level = 1;
        this.score = 0;
        this.gameTime = 0;
        this.businesses.forEach(b => { b.count = 0; b.owned = false; });
        this.upgrades.forEach(u => { u.purchased = false; });
        this.lastIncomeTime = Date.now();
        this.gameLoop();
    }
    
    buyBusiness(index) {
        const business = this.businesses[index];
        if (this.money >= business.cost) {
            this.money -= business.cost;
            business.count++;
            business.owned = true;
            this.incomePerSecond += business.income;
            this.score += business.cost;
            this.addMessage(`+${business.name}!`, business.x);
        } else {
            this.addMessage('Not enough money!', business.x);
        }
    }
    
    buyUpgrade(index) {
        const upgrade = this.upgrades[index];
        if (upgrade.purchased) {
            this.addMessage('Already purchased!', upgrade.x);
            return;
        }
        
        if (this.money >= upgrade.cost) {
            this.money -= upgrade.cost;
            upgrade.purchased = true;
            this.incomePerSecond = Math.floor(this.incomePerSecond * upgrade.multiplier);
            this.score += upgrade.cost;
            this.addMessage(`${upgrade.name} ⬆️`, upgrade.x);
        } else {
            this.addMessage('Not enough money!', upgrade.x);
        }
    }
    
    clickIncome() {
        this.money += Math.floor(this.income * (1 + this.level * 0.1));
        this.score += 1;
    }
    
    addMessage(text, x) {
        this.messageQueue.push({
            text: text,
            x: x,
            y: 450,
            time: 0,
            duration: 1
        });
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        if (!this.gamePaused) {
            // Calculate passive income
            const now = Date.now();
            const deltaTime = (now - this.lastIncomeTime) / 1000;
            this.lastIncomeTime = now;
            
            const passiveIncome = this.incomePerSecond * deltaTime;
            this.money += passiveIncome;
            this.score += Math.floor(passiveIncome);
            this.gameTime += deltaTime;
            
            // Update level
            if (this.score > this.level * 5000) {
                this.level++;
                this.addMessage(`LEVEL UP! 🎉`, 400);
            }
            
            // Update messages
            this.messageQueue = this.messageQueue.filter(msg => {
                msg.time += deltaTime;
                return msg.time < msg.duration;
            });
        }
        
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    draw() {
        // Background
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Title
        this.ctx.fillStyle = '#00d4ff';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText('ROBLOX TYCOON', 20, 40);
        
        // Stats
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`💰 Money: $${Math.floor(this.money)}`, 20, 65);
        this.ctx.fillText(`📈 Income/sec: $${Math.floor(this.incomePerSecond)}`, 300, 65);
        this.ctx.fillText(`🎯 Level: ${this.level} | Score: ${Math.floor(this.score)}`, 600, 65);
        
        // Businesses section
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('🏢 BUSINESSES', 20, 95);
        
        this.businesses.forEach((business, idx) => {
            this.drawBusinessBox(business, idx);
        });
        
        // Upgrades section
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('⭐ UPGRADES', 20, 270);
        
        this.upgrades.forEach((upgrade, idx) => {
            this.drawUpgradeBox(upgrade, idx);
        });
        
        // Messages
        this.messageQueue.forEach(msg => {
            const alpha = 1 - (msg.time / msg.duration);
            this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillText(msg.text, msg.x, msg.y);
        });
        
        // Instructions
        this.ctx.fillStyle = '#888';
        this.ctx.font = '12px Arial';
        this.ctx.fillText('Click on businesses to buy | Click upgrades to improve | Press SPACE to tap for coins', 20, this.canvas.height - 10);
    }
    
    drawBusinessBox(business, idx) {
        const x = business.x;
        const y = business.y;
        const width = 80;
        const height = 80;
        const canAfford = this.money >= business.cost;
        
        // Box background
        this.ctx.fillStyle = business.owned ? '#00aa00' : (canAfford ? '#0066cc' : '#666666');
        this.ctx.fillRect(x, y, width, height);
        
        // Border
        this.ctx.strokeStyle = canAfford ? '#00ff00' : '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
        
        // Icon
        this.ctx.font = '32px Arial';
        this.ctx.fillText(business.icon, x + 24, y + 45);
        
        // Info
        this.ctx.font = 'bold 10px Arial';
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(`${business.name}`, x + 5, y + 65);
        this.ctx.fillText(`$${business.cost}`, x + 20, y + 78);
        
        // Count
        if (business.owned) {
            this.ctx.fillStyle = '#ffff00';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.fillText(`x${business.count}`, x + 60, y + 15);
        }
    }
    
    drawUpgradeBox(upgrade, idx) {
        const x = upgrade.x;
        const y = upgrade.y;
        const width = 90;
        const height = 50;
        const canAfford = this.money >= upgrade.cost && !upgrade.purchased;
        
        // Box background
        this.ctx.fillStyle = upgrade.purchased ? '#00aa00' : (canAfford ? '#9900cc' : '#666666');
        this.ctx.fillRect(x, y, width, height);
        
        // Border
        this.ctx.strokeStyle = canAfford ? '#00ff00' : '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
        
        // Text
        this.ctx.font = 'bold 11px Arial';
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(upgrade.name, x + 5, y + 18);
        this.ctx.fillText(`$${upgrade.cost}`, x + 20, y + 33);
        this.ctx.fillText(`x${upgrade.multiplier}`, x + 30, y + 45);
        
        // Purchased indicator
        if (upgrade.purchased) {
            this.ctx.fillStyle = '#ffff00';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillText('✓', x + 65, y + 30);
        }
    }
    
    pause() {
        this.gamePaused = true;
    }
    
    resume() {
        this.gamePaused = false;
        this.gameLoop();
    }
}
