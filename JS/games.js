let canvas, ctx;
let animationFrame;

let upPressed = false;
let downPressed = false;

let playerY, aiY, ballX, ballY;
let ballSpeedX, ballSpeedY;

const paddleHeight = 100;
const paddleWidth = 15;
const ballRadius = 10;

const gamePopup = document.getElementById('popup-game');
const gameControls = document.getElementById('gameControls');
const closeBtn = document.querySelector('#popup-game .close-btn');

console.log("✅ games.js loaded");


// =========================
// Load Selected Game
// =========================
function loadGame(game) {
    const instructions = {
        pong: `🎮 Controls:<br>↑ Arrow - Move Up<br>↓ Arrow - Move Down`,
        snake: `🎮 Controls:<br>Arrow Keys - Move<br>Eat food to grow<br>Avoid walls and yourself`,
        breakout: `🎮 Controls:<br>← Arrow - Move Left<br>→ Arrow - Move Right<br>Break all bricks to win`
    };

    // Prevent script injection by setting as textContent for title, innerHTML only for safe markup
    gameControls.innerHTML = `<h4>Controls</h4><p>${instructions[game] || 'No instructions available'}</p>`;

    if (game === 'pong') startPong();
    // Future: Add other games here
}

// =========================
// Pong Game
// =========================
function startPong() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    resizeCanvas();
    resetGame();

    // Remove old listeners to avoid duplication
    document.removeEventListener('keydown', keyDownHandler);
    document.removeEventListener('keyup', keyUpHandler);

    document.addEventListener('keydown', keyDownHandler, { passive: false });
    document.addEventListener('keyup', keyUpHandler, { passive: false });
    window.addEventListener('resize', resizeCanvas);

    cancelAnimationFrame(animationFrame);
    gameLoop();
}

function resizeCanvas() {
    if (canvas) {
        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.8;
    }
}

function resetGame() {
    playerY = canvas.height / 2 - paddleHeight / 2;
    aiY = canvas.height / 2 - paddleHeight / 2;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5;
    ballSpeedY = 3;
}

function keyDownHandler(e) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
    if (e.key === "ArrowUp") upPressed = true;
    if (e.key === "ArrowDown") downPressed = true;
}

function keyUpHandler(e) {
    if (e.key === "ArrowUp") upPressed = false;
    if (e.key === "ArrowDown") downPressed = false;
}

function move() {
    if (upPressed && playerY > 0) playerY -= 6;
    if (downPressed && playerY < canvas.height - paddleHeight) playerY += 6;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce off top/bottom
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // AI movement (slightly slower for fairness)
    const aiCenter = aiY + paddleHeight / 2;
    if (aiCenter < ballY - 10) aiY += 4;
    else if (aiCenter > ballY + 10) aiY -= 4;

    // Player paddle collision
    if (
        ballX - ballRadius <= 20 + paddleWidth &&
        ballY > playerY &&
        ballY < playerY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        ballX = 20 + paddleWidth + ballRadius; // Avoid sticking
    }

    // AI paddle collision
    if (
        ballX + ballRadius >= canvas.width - 40 &&
        ballY > aiY &&
        ballY < aiY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        ballX = canvas.width - 40 - ballRadius; // Avoid sticking
    }

    // Score reset
    if (ballX < 0 || ballX > canvas.width) {
        resetGame();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(20, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - 40, aiY, paddleWidth, paddleHeight);

    // Ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

function gameLoop() {
    move();
    draw();
    animationFrame = requestAnimationFrame(gameLoop);
}

// =========================
// Stop Game
// =========================
function stopGame() {
    cancelAnimationFrame(animationFrame);
    document.removeEventListener('keydown', keyDownHandler);
    document.removeEventListener('keyup', keyUpHandler);
    window.removeEventListener('resize', resizeCanvas);
}

// =========================
// Open Game from Button
// =========================
document.querySelectorAll('.open-game').forEach(button => {
    button.addEventListener('click', () => {
        const selectedGame = button.dataset.game;

        // Show the popup
        gamePopup.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Load the selected game
        loadGame(selectedGame);
    });
});


// =========================
// Popup Close
// =========================
closeBtn.addEventListener('click', () => {
    gamePopup.style.display = 'none';
    document.body.style.overflow = 'auto';
    stopGame();
});
