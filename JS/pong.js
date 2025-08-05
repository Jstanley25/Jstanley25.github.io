console.log("✅ Pong script loaded");

class PongGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Game settings
        this.paddleHeight = 60;
        this.paddleWidth = 10;
        this.initialBallSpeed = 4;
        this.maxBallSpeed = 10;
        this.color = "white";

        this.running = false;
        this.interval = null;
        this.keyHandler = this.handleKeys.bind(this);

        this.playerScore = 0;
        this.computerScore = 0;

        this.resetGame();
        console.log("🎮 PongGame initialized");
    }

    resetGame(direction = 1) {
        this.playerY = (this.canvas.height - this.paddleHeight) / 2;
        this.computerY = this.playerY;

        this.ball = { 
            x: this.canvas.width / 2, 
            y: this.canvas.height / 2, 
            dx: this.initialBallSpeed * direction, 
            dy: this.initialBallSpeed * (Math.random() > 0.5 ? 1 : -1), 
            size: 8,
            speed: this.initialBallSpeed
        };
    }

    start() {
        this.stop();
        this.resetGame();
        this.running = true;

        document.addEventListener('keydown', this.keyHandler);
        this.interval = setInterval(() => this.update(), 1000 / 60);
    }

    handleKeys(e) {
        if (e.key === "ArrowUp") {
            this.playerY = Math.max(0, this.playerY - 20);
        } else if (e.key === "ArrowDown") {
            this.playerY = Math.min(this.canvas.height - this.paddleHeight, this.playerY + 20);
        }
    }

    update() {
        if (!this.running) return;

        // Move ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Bounce top/bottom
        if (this.ball.y <= 0 || this.ball.y + this.ball.size >= this.canvas.height) {
            this.ball.dy *= -1;
        }

        // Player paddle collision
        if (this.ball.x <= this.paddleWidth &&
            this.ball.y + this.ball.size >= this.playerY &&
            this.ball.y <= this.playerY + this.paddleHeight) {
            this.ball.dx = Math.abs(this.ball.dx);
            this.increaseBallSpeed();
        }

        // Computer paddle collision
        if (this.ball.x + this.ball.size >= this.canvas.width - this.paddleWidth &&
            this.ball.y + this.ball.size >= this.computerY &&
            this.ball.y <= this.computerY + this.paddleHeight) {
            this.ball.dx = -Math.abs(this.ball.dx);
            this.increaseBallSpeed();
        }

        // Computer AI
        const targetY = this.ball.y - (this.paddleHeight / 2);
        this.computerY += (targetY - this.computerY) * 0.1;
        this.computerY = Math.max(0, Math.min(this.canvas.height - this.paddleHeight, this.computerY));

        // Check scoring
        if (this.ball.x < 0) {
            this.computerScore++;
            this.resetGame(1); // ball goes toward player
        } 
        else if (this.ball.x > this.canvas.width) {
            this.playerScore++;
            this.resetGame(-1); // ball goes toward computer
        }

        this.draw();
    }

    increaseBallSpeed() {
        // Increase speed slightly each hit, up to maxBallSpeed
        let speedFactor = 1.05;
        this.ball.dx *= speedFactor;
        this.ball.dy *= speedFactor;

        // Limit max speed
        this.ball.dx = Math.max(Math.min(this.ball.dx, this.maxBallSpeed), -this.maxBallSpeed);
        this.ball.dy = Math.max(Math.min(this.ball.dy, this.maxBallSpeed), -this.maxBallSpeed);
    }

    draw() {
        // Clear screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.color;

        // Draw player paddle
        this.ctx.fillRect(0, this.playerY, this.paddleWidth, this.paddleHeight);

        // Draw computer paddle
        this.ctx.fillRect(this.canvas.width - this.paddleWidth, this.computerY, this.paddleWidth, this.paddleHeight);

        // Draw ball
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.size, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw score
        this.ctx.font = "30px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`${this.playerScore}   |   ${this.computerScore}`, this.canvas.width / 2, 40);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        document.removeEventListener('keydown', this.keyHandler);
        this.running = false;
    }
}

window.PongGame = PongGame;
