console.log("✅ Snake script loaded");

class SnakeGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.gridSize = 20;
        this.running = false;
        this.interval = null;
        this.direction = "RIGHT";
        this.nextDirection = "RIGHT";
        this.score = 0;

        // Touch tracking
        this.touchStartX = 0;
        this.touchStartY = 0;

        this.handleKey = this.handleKey.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);

        this.createRestartButton();
        this.resetGame();

        console.log("🎮 SnakeGame initialized");
    }

    createRestartButton() {
        const popupContainer = document.getElementById("popup-game");
        const oldBtn = popupContainer.querySelector(".restart-btn");
        if (oldBtn) oldBtn.remove();

        this.restartBtn = document.createElement("button");
        this.restartBtn.textContent = "🔄 Restart";
        this.restartBtn.className = "restart-btn";
        Object.assign(this.restartBtn.style, {
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 16px",
            fontSize: "16px",
            backgroundColor: "#333",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            zIndex: "9999",
            display: "none"
        });

        popupContainer.appendChild(this.restartBtn);
        this.restartBtn.addEventListener("click", () => this.start());
    }

    resetGame() {
        this.snake = [{ x: 100, y: 100 }];
        this.food = this.getRandomFood();
        this.direction = "RIGHT";
        this.nextDirection = "RIGHT";
        this.score = 0;
    }

    getRandomFood() {
        return {
            x: Math.floor(Math.random() * (this.canvas.width / this.gridSize)) * this.gridSize,
            y: Math.floor(Math.random() * (this.canvas.height / this.gridSize)) * this.gridSize
        };
    }

    start() {
        this.stop();
        this.resetGame();
        this.running = true;
        this.restartBtn.style.display = "none";

        document.addEventListener("keydown", this.handleKey);
        this.canvas.addEventListener("touchstart", this.handleTouchStart, { passive: false });
        this.canvas.addEventListener("touchend", this.handleTouchEnd, { passive: false });

        this.interval = setInterval(() => this.update(), 100);
    }

    handleKey(e) {
        if (e.key === "ArrowUp" && this.direction !== "DOWN") this.nextDirection = "UP";
        if (e.key === "ArrowDown" && this.direction !== "UP") this.nextDirection = "DOWN";
        if (e.key === "ArrowLeft" && this.direction !== "RIGHT") this.nextDirection = "LEFT";
        if (e.key === "ArrowRight" && this.direction !== "LEFT") this.nextDirection = "RIGHT";
    }

    handleTouchStart(e) {
        if (e.touches.length === 1) {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        }
        e.preventDefault();
    }

    handleTouchEnd(e) {
        if (e.changedTouches.length === 1) {
            const dx = e.changedTouches[0].clientX - this.touchStartX;
            const dy = e.changedTouches[0].clientY - this.touchStartY;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0 && this.direction !== "LEFT") this.nextDirection = "RIGHT";
                else if (dx < 0 && this.direction !== "RIGHT") this.nextDirection = "LEFT";
            } else {
                if (dy > 0 && this.direction !== "UP") this.nextDirection = "DOWN";
                else if (dy < 0 && this.direction !== "DOWN") this.nextDirection = "UP";
            }
        }
        e.preventDefault();
    }

    update() {
        if (!this.running) return;

        // ✅ Apply next direction ONCE per tick
        this.direction = this.nextDirection;

        const head = { ...this.snake[0] };
        if (this.direction === "UP") head.y -= this.gridSize;
        if (this.direction === "DOWN") head.y += this.gridSize;
        if (this.direction === "LEFT") head.x -= this.gridSize;
        if (this.direction === "RIGHT") head.x += this.gridSize;

        // Check wall or self collision
        if (
            head.x < 0 || head.y < 0 ||
            head.x >= this.canvas.width ||
            head.y >= this.canvas.height ||
            this.snake.some(s => s.x === head.x && s.y === head.y)
        ) {
            this.running = false;
            this.restartBtn.style.display = "block";
            return;
        }

        this.snake.unshift(head);

        // Eat food
        if (head.x === this.food.x && head.y === this.food.y) {
            this.food = this.getRandomFood();
            this.score++;
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Snake
        this.ctx.fillStyle = "lime";
        this.snake.forEach(segment => {
            this.ctx.fillRect(segment.x, segment.y, this.gridSize, this.gridSize);
        });

        // Food
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.food.x, this.food.y, this.gridSize, this.gridSize);

        // Score
        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Arial";
        this.ctx.fillText("Score: " + this.score, 10, 20);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        document.removeEventListener("keydown", this.handleKey);
        this.canvas.removeEventListener("touchstart", this.handleTouchStart);
        this.canvas.removeEventListener("touchend", this.handleTouchEnd);
        this.running = false;
    }
}

window.SnakeGame = SnakeGame;
