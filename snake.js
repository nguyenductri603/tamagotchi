class SnakeGame {
    constructor(canvasId, customImage = null) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 400;
        
        // Game settings
        this.tileSize = 20;
        this.cols = 20;
        this.rows = 20;
        
        // Snake settings
        this.snake = [{ x: 10, y: 10 }];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.customImage = customImage;
        this.imageLoaded = false;
        
        // Load custom image if provided
        if (this.customImage) {
            this.playerImg = new Image();
            this.playerImg.onload = () => {
                this.imageLoaded = true;
            };
            this.playerImg.src = this.customImage;
        }
        
        // Food
        this.food = this.generateFood();
        
        // Game state
        this.score = 0;
        this.gameRunning = false;
        this.gameOver = false;
        this.gameWon = false;
        this.gameSpeed = 200; // milliseconds
        this.lastMoveTime = 0;
        
        // Bind keyboard events
        this.bindEvents();
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
                    if (this.direction !== 'down') {
                        this.nextDirection = 'up';
                        e.preventDefault();
                    }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (this.direction !== 'up') {
                        this.nextDirection = 'down';
                        e.preventDefault();
                    }
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.direction !== 'right') {
                        this.nextDirection = 'left';
                        e.preventDefault();
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.direction !== 'left') {
                        this.nextDirection = 'right';
                        e.preventDefault();
                    }
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
    
    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.cols),
                y: Math.floor(Math.random() * this.rows)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        
        return food;
    }
    
    moveSnake() {
        this.direction = this.nextDirection;
        
        const head = { ...this.snake[0] };
        
        switch(this.direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
            this.gameOver = true;
            this.gameRunning = false;
            return;
        }
        
        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver = true;
            this.gameRunning = false;
            return;
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            
            // Win condition - snake fills 30% of the board
            if (this.snake.length >= (this.cols * this.rows) * 0.3) {
                this.gameWon = true;
                this.gameRunning = false;
            }
        } else {
            this.snake.pop();
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.cols; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.tileSize, 0);
            this.ctx.lineTo(i * this.tileSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i <= this.rows; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.tileSize);
            this.ctx.lineTo(this.canvas.width, i * this.tileSize);
            this.ctx.stroke();
        }
        
        // Draw snake
        this.snake.forEach((segment, index) => {
            const x = segment.x * this.tileSize;
            const y = segment.y * this.tileSize;
            
            if (index === 0) {
                // Draw head (Tamagotchi)
                if (this.customImage && this.imageLoaded) {
                    this.ctx.save();
                    this.ctx.imageSmoothingEnabled = false;
                    this.ctx.drawImage(this.playerImg, x + 2, y + 2, this.tileSize - 4, this.tileSize - 4);
                    this.ctx.restore();
                } else {
                    this.ctx.fillStyle = '#00FF00';
                    this.ctx.fillRect(x + 2, y + 2, this.tileSize - 4, this.tileSize - 4);
                    
                    // Eyes
                    this.ctx.fillStyle = '#000000';
                    this.ctx.fillRect(x + 6, y + 6, 2, 2);
                    this.ctx.fillRect(x + 12, y + 6, 2, 2);
                }
            } else {
                // Draw body
                this.ctx.fillStyle = '#008800';
                this.ctx.fillRect(x + 2, y + 2, this.tileSize - 4, this.tileSize - 4);
            }
        });
        
        // Draw food
        const foodX = this.food.x * this.tileSize;
        const foodY = this.food.y * this.tileSize;
        this.ctx.fillStyle = '#FF0000';
        this.ctx.beginPath();
        this.ctx.arc(foodX + this.tileSize/2, foodY + this.tileSize/2, this.tileSize/2 - 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw score
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '16px Press Start 2P';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        this.ctx.fillText(`Length: ${this.snake.length}`, 10, 50);
    }
    
    gameLoop(timestamp) {
        if (!this.gameRunning) return;
        
        if (timestamp - this.lastMoveTime > this.gameSpeed) {
            this.moveSnake();
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
        this.snake = [{ x: 10, y: 10 }];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.food = this.generateFood();
        this.score = 0;
        this.gameRunning = false;
        this.gameOver = false;
        this.gameWon = false;
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