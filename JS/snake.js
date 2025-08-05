class SnakeGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = 20;
        this.keyHandler = null;
        this.running = false;
        this.resetGame();
    }

    resetGame() {
        this.snake = [{x: 100, y: 100}];
        this.direction = {x: this.gridSize, y: 0};
        this.food = this.randomPosition();
        this.score = 0;
    }

    start() {
        this.stop();
        this.resetGame();
        this.listenKeys();
        this.running = true;
        this.interval = setInterval(() => this.gameLoop(), 100);
    }

    listenKeys() {
        this.keyHandler = (e) => {
            switch (e.key) {
                case 'ArrowUp': if (this.direction.y === 0) this.direction = {x: 0, y: -this.gridSize}; break;
                case 'ArrowDown': if (this.direction.y === 0) this.direction = {x: 0, y: this.gridSize}; break;
                case 'ArrowLeft': if (this.direction.x === 0) this.direction = {x: -this.gridSize, y: 0}; break;
                case 'ArrowRight': if (this.direction.x === 0) this.direction = {x: this.gridSize, y: 0}; break;
            }
        };
        document.addEventListener('keydown', this.keyHandler);
    }

    gameLoop() {
        const head = {x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y};
        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.food = this.randomPosition();
            this.score++;
        } else {
            this.snake.pop();
        }

        if (
            head.x < 0 || head.y < 0 ||
            head.x >= this.canvas.width || head.y >= this.canvas.height ||
            this.snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y)
        ) {
            this.stop();
            alert("Game Over! Score: " + this.score);
            return;
        }

        this.draw();
    }

    draw() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'lime';
        this.snake.forEach(seg => this.ctx.fillRect(seg.x, seg.y, this.gridSize, this.gridSize));

        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.food.x, this.food.y, this.gridSize, this.gridSize);
    }

    randomPosition() {
        return {
            x: Math.floor(Math.random() * (this.canvas.width / this.gridSize)) * this.gridSize,
            y: Math.floor(Math.random() * (this.canvas.height / this.gridSize)) * this.gridSize
        };
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
