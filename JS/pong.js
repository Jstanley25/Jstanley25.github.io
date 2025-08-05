console.log("✅ Pong script loaded");

class PongGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.paddleHeight = 60;
        this.paddleWidth = 10;
        this.running = false;
        this.interval = null;
        this.keyHandler = this.handleKeys.bind(this);
        this.touchStartY = null;

        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);

        this.resetGame();
        console.log("🎮 PongGame initialized");
    }

    resetGame() {
        this.playerY = (this.canvas.height - this.paddleHeight) / 2;
        this.computerY = this.playerY;
        this.ball = { 
            x: this.canvas.width / 2, 
            y: this.canvas.height / 2, 
            dx: 4, 
            dy: 4, 
            size: 8 
        };
        console.log("🔄 Game reset:", this.ball);
    }

    start() {
        console.log("✅ PongGame.start() called");
        this.stop(); 
        this.resetGame();
        this.running = true;

        document.addEventListener('keydown', this.keyHandler);
        this.canvas.addEventListener('touchstart', this.handleTouchStart);
        this.canvas.addEventListener('touchmove', this.handleTouchMove);

        this.interval = setInterval(() => {
            this.update();
        }, 1000 / 60);
    }

    handleKeys(e) {
        if (e.key === "ArrowUp") {
            this.playerY = Math.max(0, this.playerY - 20);
        } else if (e.key === "ArrowDown") {
            this.playerY = Math.min(this.canvas.height - this.paddleHeight, this.playerY + 20);
        }
    }

    // ✅ Mobile touch controls
    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchMove(e) {
        let touchY = e.touches[0].clientY;
        let move = touchY - this.touchStartY;
        this.playerY = Math.min(
            this.canvas.height - this.paddleHeight,
            Math.max(0, this.playerY + move * 0.3)
        );
        this.touchStartY = touchY;
    }

    update() {
        if (!this.running) return;

        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Bounce off top/bottom
        if (this.ball.y <= 0 || this.ball.y + this.ball.size >= this.canvas.height) {
            this.ball.dy *= -1;
        }

        // Player paddle collision
        if (this.ball.x <= this.paddleWidth &&
            this.ball.y + this.ball.size >= this.playerY &&
            this.ball.y <= this.playerY + this.paddleHeight) {
            this.ball.dx = Math.abs(this.ball.dx);
        }

        // Computer paddle collision
        if (this.ball.x + this.ball.size >= this.canvas.width - this.paddleWidth &&
            this.ball.y + this.ball.size >= this.computerY &&
            this.ball.y <= this.computerY + this.paddleHeight) {
            this.ball.dx = -Math.abs(this.ball.dx);
        }

        // Simple AI
        this.computerY += (this.ball.y - (this.computerY + this.paddleHeight / 2)) * 0.1;

        // Out of bounds → reset
        if (this.ball.x < 0 || this.ball.x > this.canvas.width) {
            this.resetGame();
            this.ball.dx = this.ball.dx > 0 ? 4 : -4;
        }

        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Player paddle
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, this.playerY, this.paddleWidth, this.paddleHeight);

        // Computer paddle
        this.ctx.fillRect(this.canvas.width - this.paddleWidth, this.computerY, this.paddleWidth, this.paddleHeight);

        // Ball
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.size, 0, Math.PI * 2);
        this.ctx.fill();
    }

    stop() {
        console.log("🛑 Stopping Pong game");
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        document.removeEventListener('keydown', this.keyHandler);
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        this.canvas.removeEventListener('touchmove', this.handleTouchMove);
        this.running = false;
    }
}

window.PongGame = PongGame;