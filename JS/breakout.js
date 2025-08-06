console.log("✅ Breakout script loaded");

class BreakoutGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.running = false;
        this.interval = null;
        this.keyHandler = this.handleKeys.bind(this);
        this.touchHandler = this.handleTouch.bind(this);

        // Bricks setup
        this.brickRowCount = 6;
        this.brickColumnCount = 9;
        this.brickWidth = 70;
        this.brickHeight = 20;
        this.brickPadding = 10;
        this.brickOffsetTop = 30;
        this.brickOffsetLeft = 30;

        this.resetGame();
        console.log("🎮 BreakoutGame initialized");
    }

    resetGame() {
        this.paddleHeight = 10;
        this.paddleWidth = 100;
        this.paddleX = (this.canvas.width - this.paddleWidth) / 2;

        // ✅ Dynamic paddle speed
        this.paddleSpeed = Math.max(6, Math.floor(this.canvas.width * 0.015));

        this.ballRadius = 8;
        this.ballX = this.canvas.width / 2;
        this.ballY = this.canvas.height - 30;
        this.ballDX = 4;
        this.ballDY = -4;
        this.score = 0;
        this.lives = 3;

        // Create bricks
        this.bricks = [];
        for (let c = 0; c < this.brickColumnCount; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < this.brickRowCount; r++) {
                this.bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        // Remove restart button if exists
        const oldBtn = document.getElementById("restart-btn");
        if (oldBtn) oldBtn.remove();
    }

    start() {
        this.stop();
        this.resetGame();
        this.running = true;

        document.addEventListener("keydown", this.keyHandler);
        document.addEventListener("touchstart", this.touchHandler);
        document.addEventListener("touchmove", this.touchHandler);

        this.interval = setInterval(() => this.update(), 1000 / 60);
    }

    handleKeys(e) {
        if (e.key === "ArrowLeft") {
            this.paddleX -= this.paddleSpeed;
        } else if (e.key === "ArrowRight") {
            this.paddleX += this.paddleSpeed;
        }
    }

    handleTouch(e) {
        const touchX = e.touches[0].clientX - this.canvas.getBoundingClientRect().left;

        // ✅ Paddle follows touch faster
        if (touchX < this.paddleX + this.paddleWidth / 2) {
            this.paddleX -= this.paddleSpeed * 1.5;
        } else {
            this.paddleX += this.paddleSpeed * 1.5;
        }

        // Prevent background scroll on mobile
        e.preventDefault();
    }

    collisionDetection() {
        for (let c = 0; c < this.brickColumnCount; c++) {
            for (let r = 0; r < this.brickRowCount; r++) {
                let b = this.bricks[c][r];
                if (b.status === 1) {
                    if (
                        this.ballX > b.x &&
                        this.ballX < b.x + this.brickWidth &&
                        this.ballY > b.y &&
                        this.ballY < b.y + this.brickHeight
                    ) {
                        this.ballDY = -this.ballDY;
                        b.status = 0;
                        this.score++;

                        if (this.score === this.brickRowCount * this.brickColumnCount) {
                            this.endGame(true);
                        }
                    }
                }
            }
        }
    }

    endGame(won = false) {
        this.stop();

        setTimeout(() => {
            alert(won ? "🎉 YOU WIN! 🎉" : "💀 GAME OVER 💀");
            this.showRestartButton();
        }, 100);
    }

    showRestartButton() {
        let btn = document.createElement("button");
        btn.id = "restart-btn";
        btn.textContent = "Restart Game";
        btn.style.position = "absolute";
        btn.style.top = "20px";
        btn.style.left = "50%";
        btn.style.transform = "translateX(-50%)";
        btn.style.padding = "10px 20px";
        btn.style.fontSize = "18px";
        btn.style.zIndex = "2000";
        btn.style.cursor = "pointer";

        btn.addEventListener("click", () => {
            btn.remove();
            this.start();
        });

        document.body.appendChild(btn);
    }

    update() {
        if (!this.running) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Bricks
        for (let c = 0; c < this.brickColumnCount; c++) {
            for (let r = 0; r < this.brickRowCount; r++) {
                if (this.bricks[c][r].status === 1) {
                    let brickX = c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
                    let brickY = r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
                    this.bricks[c][r].x = brickX;
                    this.bricks[c][r].y = brickY;

                    this.ctx.beginPath();
                    this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
                    this.ctx.fillStyle = "#0095DD";
                    this.ctx.fill();
                    this.ctx.closePath();
                }
            }
        }

        // Draw Ball
        this.ctx.beginPath();
        this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = "#fff";
        this.ctx.fill();
        this.ctx.closePath();

        // Draw Paddle
        this.ctx.beginPath();
        this.ctx.rect(this.paddleX, this.canvas.height - this.paddleHeight - 10, this.paddleWidth, this.paddleHeight);
        this.ctx.fillStyle = "#fff";
        this.ctx.fill();
        this.ctx.closePath();

        // Draw Score
        this.ctx.fillStyle = "#fff";
        this.ctx.font = "16px Arial";
        this.ctx.fillText("Score: " + this.score, 8, 20);

        // Ball movement
        this.ballX += this.ballDX;
        this.ballY += this.ballDY;

        // Wall collisions
        if (this.ballX + this.ballDX > this.canvas.width - this.ballRadius || this.ballX + this.ballDX < this.ballRadius) {
            this.ballDX = -this.ballDX;
        }
        if (this.ballY + this.ballDY < this.ballRadius) {
            this.ballDY = -this.ballDY;
        } else if (this.ballY + this.ballDY > this.canvas.height - this.ballRadius) {
            if (this.ballX > this.paddleX && this.ballX < this.paddleX + this.paddleWidth) {
                this.ballDY = -this.ballDY;
            } else {
                this.lives--;
                if (!this.lives) {
                    this.endGame(false);
                } else {
                    this.ballX = this.canvas.width / 2;
                    this.ballY = this.canvas.height - 30;
                    this.ballDX = 4;
                    this.ballDY = -4;
                    this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
                }
            }
        }

        // Paddle boundaries
        if (this.paddleX < 0) this.paddleX = 0;
        if (this.paddleX > this.canvas.width - this.paddleWidth) this.paddleX = this.canvas.width - this.paddleWidth;

        this.collisionDetection();
    }

    stop() {
        console.log("🛑 Stopping Breakout game");
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        document.removeEventListener("keydown", this.keyHandler);
        document.removeEventListener("touchstart", this.touchHandler);
        document.removeEventListener("touchmove", this.touchHandler);
        this.running = false;
    }
}

window.BreakoutGame = BreakoutGame;
