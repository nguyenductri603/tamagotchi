class MemoryGame {
    constructor(canvasId, customImage = null) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 400;
        
        // Game settings
        this.gridSize = 4;
        this.cardSize = 80;
        this.cardGap = 10;
        this.offsetX = 50;
        this.offsetY = 50;
        
        // Card symbols (emojis)
        this.symbols = ['🐾', '🍎', '💤', '💊', '🎯', '❤️', '⭐', '🌟'];
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
        
        // Game state
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.totalPairs = 8;
        this.score = 0;
        this.moves = 0;
        this.gameRunning = false;
        this.gameOver = false;
        this.gameWon = false;
        this.canFlip = true;
        
        this.initializeCards();
        this.bindEvents();
    }
    
    initializeCards() {
        this.cards = [];
        
        // Create pairs of cards
        const cardPairs = [];
        for (let i = 0; i < this.totalPairs; i++) {
            cardPairs.push(this.symbols[i], this.symbols[i]);
        }
        
        // Shuffle the cards
        for (let i = cardPairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
        }
        
        // Create card objects
        let index = 0;
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                this.cards.push({
                    x: this.offsetX + col * (this.cardSize + this.cardGap),
                    y: this.offsetY + row * (this.cardSize + this.cardGap),
                    symbol: cardPairs[index],
                    flipped: false,
                    matched: false,
                    row: row,
                    col: col
                });
                index++;
            }
        }
    }
    
    bindEvents() {
        this.canvas.addEventListener('click', (e) => {
            if (!this.gameRunning || !this.canFlip) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.handleCardClick(x, y);
        });
    }
    
    handleCardClick(x, y) {
        for (let card of this.cards) {
            if (x >= card.x && x <= card.x + this.cardSize &&
                y >= card.y && y <= card.y + this.cardSize &&
                !card.flipped && !card.matched) {
                
                card.flipped = true;
                this.flippedCards.push(card);
                
                if (this.flippedCards.length === 2) {
                    this.moves++;
                    this.canFlip = false;
                    
                    setTimeout(() => {
                        this.checkMatch();
                    }, 1000);
                }
                
                this.draw();
                break;
            }
        }
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.symbol === card2.symbol) {
            // Match found
            card1.matched = true;
            card2.matched = true;
            this.matchedPairs++;
            this.score += 100;
            
            // Check win condition
            if (this.matchedPairs === this.totalPairs) {
                this.gameWon = true;
                this.gameRunning = false;
                // Bonus points for fewer moves
                this.score += Math.max(0, 500 - (this.moves * 10));
            }
        } else {
            // No match
            card1.flipped = false;
            card2.flipped = false;
        }
        
        this.flippedCards = [];
        this.canFlip = true;
        this.draw();
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw cards
        this.cards.forEach(card => {
            // Card background
            if (card.matched) {
                this.ctx.fillStyle = '#27ae60';
            } else if (card.flipped) {
                this.ctx.fillStyle = '#3498db';
            } else {
                this.ctx.fillStyle = '#34495e';
            }
            
            this.ctx.fillRect(card.x, card.y, this.cardSize, this.cardSize);
            
            // Card border
            this.ctx.strokeStyle = '#ecf0f1';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(card.x, card.y, this.cardSize, this.cardSize);
            
            // Card content
            if (card.flipped || card.matched) {
                if (card.symbol === '🐾' && this.customImage && this.imageLoaded) {
                    // Use custom Tamagotchi image for the pet symbol
                    this.ctx.save();
                    this.ctx.imageSmoothingEnabled = false;
                    this.ctx.drawImage(this.playerImg, 
                        card.x + 10, card.y + 10, 
                        this.cardSize - 20, this.cardSize - 20);
                    this.ctx.restore();
                } else {
                    // Draw emoji symbol
                    this.ctx.font = '36px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillStyle = '#fff';
                    this.ctx.fillText(card.symbol, 
                        card.x + this.cardSize / 2, 
                        card.y + this.cardSize / 2);
                }
            } else {
                // Draw question mark for face-down cards
                this.ctx.font = '40px Press Start 2P';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillStyle = '#95a5a6';
                this.ctx.fillText('?', 
                    card.x + this.cardSize / 2, 
                    card.y + this.cardSize / 2);
            }
        });
        
        // Draw score and moves
        this.ctx.font = '14px Press Start 2P';
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        this.ctx.fillText(`Moves: ${this.moves}`, 10, 50);
        this.ctx.fillText(`Pairs: ${this.matchedPairs}/${this.totalPairs}`, 10, 70);
    }
    
    start() {
        this.gameRunning = true;
        this.gameOver = false;
        this.gameWon = false;
        this.draw();
    }
    
    reset() {
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.score = 0;
        this.moves = 0;
        this.gameRunning = false;
        this.gameOver = false;
        this.gameWon = false;
        this.canFlip = true;
        
        this.initializeCards();
        this.draw();
    }
    
    getGameResult() {
        return {
            score: this.score,
            won: this.gameWon,
            lost: this.gameOver,
            moves: this.moves
        };
    }
} 