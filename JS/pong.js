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

        this.playerScore = 0;
        this.computerScore = 0;

        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);

        // ✅ Append restart button to popup instead of body
        const popupContainer = document.getElementById("popup-game");

        // Remove old button if it exists
        const oldBtn = popupContainer.querySelector(".restart-btn");
        if (oldBtn) oldBtn.remove();

        this.restartBtn = document.createElement("button");
        this.restartBtn.textContent = "🔄 Restart";
        this.restartBtn.className = "restart-btn";
        this.restartBtn.style.position = "absolute";
        this.restartBtn.style.top = "10px";
        this.restartBtn.style.left = "50%";
        this.restartBtn.style.transform = "translateX(-50%)";
        this.restartBtn.style.padding = "8px 16px";
        this.restartBtn.style.fontSize = "16px";
        this.restartBtn.style.backgroundColor = "#333";
        this.restartBtn.style.color = "white";
        this.restartBtn.style.border = "none";
        this.restartBtn.style.borderRadius = "5px";
        this.restartBtn.style.cursor = "pointer";
        this.restartBtn.style.zIndex = "9999";
        this.restartBtn.style.display = "none";

        popupContainer.appendChild(this.restartBtn);

        this.restartBtn.addEventListener("click", () => this.start());

    }

    resetGame() {
        this.playerY = (this.canvas.height - this.paddleHeight) / 2;
        this.computerY = this.playerY;
        this.ball = { 
            x: this.canvas.width / 2, 
            y: this.canvas.height / 2, 
            dx: Math.random() > 0.5 ? 4 : -4, 
            dy: 4, 
            size: 8 
        };
        this.restartBtn.style.display = "none"; // hide restart
        console.log("🔄 Game reset:", this.ball);
    }

    start() {
        console.log("✅ PongGame.start() called");
        this.stop(); 
        this.playerScore = 0;
        this.computerScore = 0;
        this.resetGame();
        this.running = true;

        document.addEventListener('keydown', this.keyHandler);
        this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });

        this.interval = setInterval(() => {
            this.update();
        }, 1000 / 60);
    }

    handleKeys(e) {
        const moveSpeed = 25; // ✅ Faster paddle response
        if (e.key === "ArrowUp") {
            this.playerY = Math.max(0, this.playerY - moveSpeed);
        } else if (e.key === "ArrowDown") {
            this.playerY = Math.min(this.canvas.height - this.paddleHeight, this.playerY + moveSpeed);
        }
    }

    // ✅ Mobile touch controls + prevent scroll
    handleTouchStart(e) {
        e.preventDefault();
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchMove(e) {
        e.preventDefault();
        let touchY = e.touches[0].clientY;
        let move = touchY - this.touchStartY;
        this.playerY = Math.min(
            this.canvas.height - this.paddleHeight,
            Math.max(0, this.playerY + move * 0.5) // ✅ faster paddle on touch
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

        // Out of bounds → scoring
        if (this.ball.x < 0) {
            this.computerScore++;
            this.resetGame();
        } else if (this.ball.x > this.canvas.width) {
            this.playerScore++;
            this.resetGame();
        }

        // Check win condition
        if (this.playerScore >= 5 || this.computerScore >= 5) {
            this.running = false;
            clearInterval(this.interval);
            this.restartBtn.style.display = "block"; // show restart button
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

        // ✅ Scores
        this.ctx.font = "20px Arial";
        this.ctx.fillText(this.playerScore, this.canvas.width / 4, 30);
        this.ctx.fillText(this.computerScore, (this.canvas.width / 4) * 3, 30);
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
