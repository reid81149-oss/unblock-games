# 🎮 Unblock Games Website

A fun collection of unblocked games that you can play directly in your browser! Perfect for when you want to take a quick gaming break.

## 🎯 Features

- **Multiple Games**: Snake, Flappy Bird, 2048, FNAF World, and more coming soon!
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Search Functionality**: Easily find your favorite games
- **Score Tracking**: Keep track of your high scores
- **No Installation**: Play directly in your browser
- **Free & Open Source**: Completely free to use and modify

## 🕹️ Games Included

### Snake 🐍
Classic Snake game with smooth controls and grid-based gameplay.
- **Controls**: Arrow Keys or WASD to move
- **Goal**: Eat food and grow without hitting walls or yourself
- **Scoring**: Get points for each food eaten

### Flappy Bird 🐦
Navigate your bird through obstacles and avoid crashing.
- **Controls**: SPACE or CLICK to jump
- **Goal**: Pass through green pipes without hitting them
- **Scoring**: Points for each pipe successfully passed

### 2048 🎮
Slide tiles and combine numbers to reach the 2048 tile.
- **Controls**: Arrow Keys or WASD to move tiles
- **Goal**: Combine tiles with the same number to create larger ones
- **Scoring**: Combine tiles strategically to reach 2048

### FNAF World 🤖
Five Nights at Freddy's - Strategy RPG Battle Game
- **Controls**: 
  - Press `1-3` to select your character (Freddy, Bonnie, or Chica)
  - Press `A` to Attack enemies
  - Press `D` to Defend (boost defense temporarily)
  - Press `H` to Heal your character
  - Press `SPACE` to start battles
- **Goal**: Defeat all enemies in each level
- **Features**: 
  - Progressive difficulty with increasing levels
  - Character HP and stat system
  - Strategic turn-based combat
  - Score multiplier based on level

## 🚀 Quick Start

1. Visit the website: [Unblock Games](https://reid81149-oss.github.io/unblock-games)
2. Browse the available games
3. Click "Play Now" on any game
4. Follow the on-screen instructions
5. Have fun!

## 📦 Installation (For Development)

If you want to run this locally:

```bash
# Clone the repository
git clone https://github.com/reid81149-oss/unblock-games.git

# Navigate to the directory
cd unblock-games

# Open in your browser
open index.html
# or
start index.html
```

## 📁 Project Structure

```
unblock-games/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── main.js            # Core game logic and initialization
│   └── games/
│       ├── snake.js       # Snake game implementation
│       ├── flappy.js      # Flappy Bird game implementation
│       ├── twentyfortyeight.js  # 2048 game implementation
│       └── fnafworld.js   # FNAF World game implementation
└── README.md              # This file
```

## 🎓 How to Add More Games

To add a new game:

1. Create a new file in `js/games/` with your game class
2. Add a game object to the `games` array in `main.js`
3. Import your game script in `index.html`
4. Create the game class with `start()`, `pause()`, and `resume()` methods

Example:
```javascript
class MyGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.gameRunning = false;
    }
    
    start() {
        this.gameRunning = true;
        // Initialize and start your game
    }
    
    pause() {
        this.gameRunning = false;
    }
    
    resume() {
        this.gameRunning = true;
    }
}
```

## 🌐 Deployment to GitHub Pages

This site is automatically deployed to GitHub Pages. Every push to the `main` branch updates the live site!

To enable GitHub Pages for your fork:
1. Go to repository Settings
2. Navigate to Pages section
3. Select `main` branch as source
4. Your site will be live at `https://yourusername.github.io/unblock-games`

## 🛠️ Technologies Used

- **HTML5**: Structure and canvas elements
- **CSS3**: Modern styling and animations
- **JavaScript (Vanilla)**: Game logic without external dependencies

## 📝 License

This project is open source and available under the MIT License. Feel free to use, modify, and distribute!

## 🤝 Contributing

Found a bug? Want to add a new game? Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-game`)
3. Commit your changes (`git commit -am 'Add new game'`)
4. Push to the branch (`git push origin feature/new-game`)
5. Open a Pull Request

## 💡 Upcoming Features

- [ ] Tetris
- [ ] Pac-Man
- [ ] Tic-Tac-Toe
- [ ] Leaderboard system
- [ ] Sound effects and music
- [ ] More difficulty levels
- [ ] Multiplayer games
- [ ] Game themes/skins

## 📧 Support

If you have any questions or need help, feel free to open an issue on GitHub!

## ⭐ Show Your Support

If you like this project, please give it a star! Your support helps motivate further development.

---

**Made with ❤️ by Reid**

*Last Updated: 2026-05-17*
