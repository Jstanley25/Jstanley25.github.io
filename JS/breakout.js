class BreakoutGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyHandler = null;
        this.running = false;
        this.resetGame();
    }

    resetGame() {
        this.paddle = { x: this.canvas.width/2 - 40, y: this.canvas.height - 15, w: 80, h: 10 };
        this.ball = { x: this.canvas.width/2, y: this.canvas.height - 20, dx: 2, dy: -2, size: 8 };
        this.bricks = [];
        this.rows = 4;
        this.cols = 5;
        this.score = 0;
        this.createBricks();
    }

    start() {
        this.stop();
        this.resetGame();
        this.listenKeys();
        this.running = true;
        this.interval = setInterval(() => this.update(), 16);
    }

    createBricks() {
        this.bricks = [];
        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
                this.bricks.push({
                    x: c * 80 + 10,
                    y: r * 20 + 10,
                    w: 70,
                    h: 15,
                    destroyed: false
                });
            }
        }
    }

    listenKeys() {
        this.keyHandler = (e) => {
            if (e.key === "ArrowLeft") this.paddle.x = Math.max(0, this.paddle.x - 20);
            if (e.key === "ArrowRight") this.paddle.x = Math.min(this.canvas.width - this.paddle.w, this.paddle.x + 20);
        };
        document.addEventListener('keydown', this.keyHandler);
    }

    update() {
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        if (this.ball.x <= 0 || this.ball.x + this.ball.size >= this.canvas.width) this.ball.dx *= -1;
        if (this.ball.y <= 0) this.ball.dy *= -1;

        if (this.ball.x > this.paddle.x &&
            this.ball.x < this.paddle.x + this.paddle.w &&
            this.ball.y + this.ball.size >= this.paddle.y) {
            this.ball.dy *= -1;
            this.ball.y = this.paddle.y - this.ball.size;
        }

        this.bricks.forEach(brick => {
            if (!brick.destroyed &&
                this.ball.x > brick.x && this.ball.x < brick.x + brick.w &&
                this.ball.y > brick.y && this.ball.y < brick.y + brick.h) {
                this.ball.dy *= -1;
                brick.destroyed = true;
                this.score++;
            }
        });

        if (this.ball.y > this.canvas.height) {
            this.stop();
            alert("Game Over! Score: " + this.score);
        }

        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.w, this.paddle.h);

        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.size, 0, Math.PI * 2);
        this.ctx.fill();

        this.bricks.forEach(b => {
            if (!b.destroyed) {
                this.ctx.fillStyle = "red";
                this.ctx.fillRect(b.x, b.y, b.w, b.h);
            }
        });
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
