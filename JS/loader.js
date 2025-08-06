let currentGame = null;
let loadedScripts = {};

document.querySelectorAll('.open-game').forEach(button => {
    button.addEventListener('click', () => {
        const game = button.dataset.game;
        openPopup();
        loadGame(game);
    });
});

// ✅ Use a more specific selector to only close the game popup
document.querySelector('#popup-game .close-btn').addEventListener('click', closePopup);

function openPopup() {
    document.getElementById('popup-game').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup-game').style.display = 'none';
    if (currentGame && typeof currentGame.stop === 'function') {
        currentGame.stop();
    }
}

function loadGame(game) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ✅ Stop and destroy the old game if active
    if (currentGame && typeof currentGame.stop === 'function') {
        currentGame.stop();
        currentGame = null;
    }

    // ✅ Reset canvas size before loading a new game
    canvas.width = document.querySelector('.popup-content').offsetWidth;
    canvas.height = document.querySelector('.popup-content').offsetHeight;


    // ✅ Load the game script only once, then restart it
    if (loadedScripts[game]) {
        startGame(game, canvas);
    } else {
        const script = document.createElement('script');
        script.src = `JS/${game}.js?cacheBust=${Date.now()}`;
        script.onload = () => {
            loadedScripts[game] = true;
            startGame(game, canvas);
        };
        document.body.appendChild(script);
    }
}

function startGame(game, canvas) {
    // ✅ Always create a fresh instance (forces reset)
    if (game === 'pong') {
        if (typeof window.PongGame === "undefined") {
            console.error("❌ PongGame is not defined. Check if pong.js loaded correctly.");
        } else {
            currentGame = new PongGame(canvas);
        }
    }
    if (game === 'snake') currentGame = new SnakeGame(canvas);
    if (game === 'breakout') currentGame = new BreakoutGame(canvas);

    // ✅ Start the game loop
    if (currentGame && typeof currentGame.start === 'function') {
        currentGame.start();
    } else {
        console.error(`❌ Failed to start game: ${game}`);
    }
}


// ✅ Prevent arrow keys from scrolling the page during gameplay
window.addEventListener("keydown", function(e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
    }
}, false);
