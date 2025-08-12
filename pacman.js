class PacManGame {
    constructor(canvasId, customImage = null) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 560;
        this.canvas.height = 560;
        
        // Game settings
        this.tileSize = 20;
        this.cols = 28;
        this.rows = 28;
        
        // Player (Tamagotchi) settings
        this.player = {
            x: 13,
            y: 23,
            direction: 'up',
            nextDirection: null,
            customImage: customImage,
            imageLoaded: false
        };
        
        // Load custom image if provided
        if (this.player.customImage) {
            this.playerImg = new Image();
            this.playerImg.onload = () => {
                this.player.imageLoaded = true;
            };
            this.playerImg.src = this.player.customImage;
        }
        
        // Game state
        this.score = 0;
        this.gameRunning = false;
        this.gameWon = false;
        this.gameOver = false;
        
        // Simple maze layout (1 = wall, 0 = empty, 2 = dot, 3 = power pellet)
        this.maze = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
            [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
            [0,0,0,0,0,1,2,1,1,0,1,1,0,0,0,0,1,1,0,1,1,2,1,0,0,0,0,0],
            [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
            [0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
            [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
            [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
            [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
            [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,3,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,3,1],
            [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
            [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        // Ghosts
        this.ghosts = [
            { x: 13, y: 11, direction: 'up', color: '#FF0000' },
            { x: 14, y: 11, direction: 'down', color: '#FFB8FF' },
            { x: 13, y: 12, direction: 'left', color: '#00FFFF' },
            { x: 14, y: 12, direction: 'right', color: '#FFB852' }
        ];
        
        this.directions = ['up', 'down', 'left', 'right'];
        this.gameSpeed = 200; // milliseconds
        this.lastMoveTime = 0;
        
        // Count total dots
        this.totalDots = 0;
        this.dotsEaten = 0;
        this.countDots();
        
        // Bind keyboard events
        this.bindEvents();
    }
    
    countDots() {
        this.totalDots = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.maze[row] && (this.maze[row][col] === 2 || this.maze[row][col] === 3)) {
                    this.totalDots++;
                }
            }
        }
    }
    
    bindEvents() {
        // Remove any existing event listener first
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
        }
        
        // Create a new event handler
        this.keyHandler = (e) => {
            if (!this.gameRunning) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.player.nextDirection = 'up';
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.player.nextDirection = 'down';
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.player.nextDirection = 'left';
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.player.nextDirection = 'right';
                    e.preventDefault();
                    break;
            }
        };
        
        document.addEventListener('keydown', this.keyHandler);
    }
    
    unbindEvents() {
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
            this.keyHandler = null;
        }
    }
    
    canMove(x, y) {
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) {
            return x === -1 || x === this.cols; // Allow tunnel movement
        }
        return this.maze[y] && this.maze[y][x] !== 1;
    }
    
    movePlayer() {
        // Try to change direction if requested
        if (this.player.nextDirection) {
            const nextPos = this.getNextPosition(this.player.x, this.player.y, this.player.nextDirection);
            if (this.canMove(nextPos.x, nextPos.y)) {
                this.player.direction = this.player.nextDirection;
                this.player.nextDirection = null;
            }
        }
        
        // Move in current direction
        const nextPos = this.getNextPosition(this.player.x, this.player.y, this.player.direction);
        
        if (this.canMove(nextPos.x, nextPos.y)) {
            this.player.x = nextPos.x;
            this.player.y = nextPos.y;
            
            // Handle tunnel (wrap around)
            if (this.player.x < 0) this.player.x = this.cols - 1;
            if (this.player.x >= this.cols) this.player.x = 0;
            
            // Check for dots/pellets
            if (this.maze[this.player.y] && this.maze[this.player.y][this.player.x] === 2) {
                this.maze[this.player.y][this.player.x] = 0;
                this.score += 10;
                this.dotsEaten++;
            } else if (this.maze[this.player.y] && this.maze[this.player.y][this.player.x] === 3) {
                this.maze[this.player.y][this.player.x] = 0;
                this.score += 50;
                this.dotsEaten++;
                // Power pellet effect could be added here
            }
            
            // Check win condition
            if (this.dotsEaten >= this.totalDots) {
                this.gameWon = true;
                this.gameRunning = false;
            }
        }
    }
    
    getNextPosition(x, y, direction) {
        switch(direction) {
            case 'up': return { x, y: y - 1 };
            case 'down': return { x, y: y + 1 };
            case 'left': return { x: x - 1, y };
            case 'right': return { x: x + 1, y };
            default: return { x, y };
        }
    }
    
    moveGhosts() {
        this.ghosts.forEach(ghost => {
            // Simple AI: random movement with some player tracking
            const directions = ['up', 'down', 'left', 'right'];
            const validDirections = [];
            
            directions.forEach(dir => {
                const nextPos = this.getNextPosition(ghost.x, ghost.y, dir);
                if (this.canMove(nextPos.x, nextPos.y)) {
                    validDirections.push(dir);
                }
            });
            
            if (validDirections.length > 0) {
                // 30% chance to move towards player, 70% random
                if (Math.random() < 0.3) {
                    // Move towards player
                    const dx = this.player.x - ghost.x;
                    const dy = this.player.y - ghost.y;
                    
                    if (Math.abs(dx) > Math.abs(dy)) {
                        ghost.direction = dx > 0 ? 'right' : 'left';
                    } else {
                        ghost.direction = dy > 0 ? 'down' : 'up';
                    }
                    
                    // Check if this direction is valid
                    if (!validDirections.includes(ghost.direction)) {
                        ghost.direction = validDirections[Math.floor(Math.random() * validDirections.length)];
                    }
                } else {
                    // Random movement
                    ghost.direction = validDirections[Math.floor(Math.random() * validDirections.length)];
                }
                
                const nextPos = this.getNextPosition(ghost.x, ghost.y, ghost.direction);
                if (this.canMove(nextPos.x, nextPos.y)) {
                    ghost.x = nextPos.x;
                    ghost.y = nextPos.y;
                    
                    // Handle tunnel
                    if (ghost.x < 0) ghost.x = this.cols - 1;
                    if (ghost.x >= this.cols) ghost.x = 0;
                }
            }
        });
    }
    
    checkCollisions() {
        this.ghosts.forEach(ghost => {
            if (ghost.x === this.player.x && ghost.y === this.player.y) {
                this.gameOver = true;
                this.gameRunning = false;
            }
        });
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw maze
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const x = col * this.tileSize;
                const y = row * this.tileSize;
                
                if (this.maze[row] && this.maze[row][col] === 1) {
                    // Wall
                    this.ctx.fillStyle = '#0000FF';
                    this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
                } else if (this.maze[row] && this.maze[row][col] === 2) {
                    // Dot
                    this.ctx.fillStyle = '#FFFF00';
                    this.ctx.beginPath();
                    this.ctx.arc(x + this.tileSize/2, y + this.tileSize/2, 2, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (this.maze[row] && this.maze[row][col] === 3) {
                    // Power pellet
                    this.ctx.fillStyle = '#FFFF00';
                    this.ctx.beginPath();
                    this.ctx.arc(x + this.tileSize/2, y + this.tileSize/2, 6, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
        
        // Draw player (Tamagotchi)
        const playerX = this.player.x * this.tileSize;
        const playerY = this.player.y * this.tileSize;
        
        if (this.player.customImage && this.player.imageLoaded) {
            // Draw custom Tamagotchi image
            this.ctx.save();
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.drawImage(this.playerImg, playerX + 2, playerY + 2, this.tileSize - 4, this.tileSize - 4);
            this.ctx.restore();
        } else {
            // Draw default Pac-Man
            this.ctx.fillStyle = '#FFFF00';
            this.ctx.beginPath();
            this.ctx.arc(playerX + this.tileSize/2, playerY + this.tileSize/2, this.tileSize/2 - 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw mouth based on direction
            this.ctx.fillStyle = '#000000';
            this.ctx.beginPath();
            const centerX = playerX + this.tileSize/2;
            const centerY = playerY + this.tileSize/2;
            const radius = this.tileSize/2 - 2;
            
            switch(this.player.direction) {
                case 'right':
                    this.ctx.moveTo(centerX, centerY);
                    this.ctx.arc(centerX, centerY, radius, -Math.PI/4, Math.PI/4);
                    break;
                case 'left':
                    this.ctx.moveTo(centerX, centerY);
                    this.ctx.arc(centerX, centerY, radius, 3*Math.PI/4, 5*Math.PI/4);
                    break;
                case 'up':
                    this.ctx.moveTo(centerX, centerY);
                    this.ctx.arc(centerX, centerY, radius, 5*Math.PI/4, 7*Math.PI/4);
                    break;
                case 'down':
                    this.ctx.moveTo(centerX, centerY);
                    this.ctx.arc(centerX, centerY, radius, Math.PI/4, 3*Math.PI/4);
                    break;
            }
            this.ctx.fill();
        }
        
        // Draw ghosts
        this.ghosts.forEach(ghost => {
            const ghostX = ghost.x * this.tileSize;
            const ghostY = ghost.y * this.tileSize;
            
            this.ctx.fillStyle = ghost.color;
            this.ctx.beginPath();
            this.ctx.arc(ghostX + this.tileSize/2, ghostY + this.tileSize/2, this.tileSize/2 - 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Ghost eyes
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillRect(ghostX + 4, ghostY + 4, 4, 4);
            this.ctx.fillRect(ghostX + 12, ghostY + 4, 4, 4);
        });
        
        // Draw score
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '16px Press Start 2P';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    }
    
    gameLoop(timestamp) {
        if (!this.gameRunning) return;
        
        if (timestamp - this.lastMoveTime > this.gameSpeed) {
            this.movePlayer();
            this.moveGhosts();
            this.checkCollisions();
            this.lastMoveTime = timestamp;
        }
        
        this.draw();
        
        if (this.gameRunning) {
            requestAnimationFrame((ts) => this.gameLoop(ts));
        }
    }
    
    start() {
        this.gameRunning = true;
        this.gameOver = false;
        this.gameWon = false;
        this.lastMoveTime = 0;
        this.bindEvents(); // Ensure events are bound when starting
        requestAnimationFrame((ts) => this.gameLoop(ts));
    }
    
    reset() {
        this.unbindEvents(); // Clean up events when resetting
        this.player.x = 13;
        this.player.y = 23;
        this.player.direction = 'up';
        this.player.nextDirection = null;
        this.score = 0;
        this.dotsEaten = 0;
        this.gameRunning = false;
        this.gameOver = false;
        this.gameWon = false;
        
        // Reset ghosts
        this.ghosts = [
            { x: 13, y: 11, direction: 'up', color: '#FF0000' },
            { x: 14, y: 11, direction: 'down', color: '#FFB8FF' },
            { x: 13, y: 12, direction: 'left', color: '#00FFFF' },
            { x: 14, y: 12, direction: 'right', color: '#FFB852' }
        ];
        
        // Reset maze
        this.maze = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
            [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
            [0,0,0,0,0,1,2,1,1,0,1,1,0,0,0,0,1,1,0,1,1,2,1,0,0,0,0,0],
            [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
            [0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
            [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
            [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
            [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
            [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,3,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,3,1],
            [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
            [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        this.countDots();
        this.draw();
    }
    
    getGameResult() {
        return {
            score: this.score,
            won: this.gameWon,
            lost: this.gameOver
        };
    }
} 