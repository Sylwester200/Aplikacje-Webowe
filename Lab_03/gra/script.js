// Ustawienia Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Obrazy gry
const bgImage = new Image();
bgImage.src = "img/board-bg.jpg";

const zombieImage = new Image();
zombieImage.src = "img/walkingdead.png";

const aimImage = new Image();
aimImage.src = "img/aim.png";

const fullHeart = new Image();
fullHeart.src = "img/full_heart.png";

const emptyHeart = new Image();
emptyHeart.src = "img/empty_heart.png";

// Parametry gry
let score = 30;
let health = 3;
let zombies = [];
let gameRunning = true;

// Celownik
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
canvas.style.cursor = "none";

// Klasa Zombie
class Zombie {
    constructor() {
        this.frameCount = 10;
        this.spriteWidth = zombieImage.width / this.frameCount;
        this.spriteHeight = zombieImage.height;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.speed = Math.random() * 2 + 2;
        this.frame = 0;
        this.frameTimer = 0;
        this.frameInterval = 100;
        this.scale = Math.random() * 0.7 + 0.8;
    }

    draw(deltaTime) {
        this.frameTimer += deltaTime;
        if (this.frameTimer > this.frameInterval) {
            this.frame = (this.frame + 1) % this.frameCount;
            this.frameTimer = 0;
        }
        ctx.drawImage(
            zombieImage,
            this.frame * this.spriteWidth,
            0,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width * this.scale,
            this.height * this.scale
        );
    }

    update() {
        this.x -= this.speed;
        if (this.x + this.width * this.scale < 0) {
            health--;
            this.remove();
        }
    }

    isClicked(mouseX, mouseY) {
        return (
            mouseX >= this.x &&
            mouseX <= this.x + this.width * this.scale &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height * this.scale
        );
    }

    remove() {
        zombies = zombies.filter((z) => z !== this);
    }
}

// Funkcja rysująca tło
function drawBackground() {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
}

// Funkcja rysująca serca
function drawLives() {
    for (let i = 0; i < 3; i++) {
        const heart = i < health ? fullHeart : emptyHeart;
        ctx.drawImage(heart, 20 + i * 40, 20, 32, 32);
    }
}

// Funkcja rysująca wynik
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width - 150, 40);
}

// Funkcja rysująca celownik
function drawAim() {
    const aimSize = 50;
    ctx.drawImage(aimImage, mouseX - aimSize / 2, mouseY - aimSize / 2, aimSize, aimSize);
}

// Generowanie zombie
function spawnZombie() {
    zombies.push(new Zombie());
}

// Pętla gry
let lastTime = 0;
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawLives();
    drawScore();

    zombies.forEach((zombie) => {
        zombie.update();
        zombie.draw(deltaTime);
    });

    drawAim();

    if (health <= 0 || score < 0) {
        gameOver();
        return;
    }

    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

// Obsługa kliknięć
canvas.addEventListener("click", () => {
    let hit = false;
    for (let i = 0; i < zombies.length; i++) {
        if (zombies[i].isClicked(mouseX, mouseY)) {
            zombies[i].remove();
            score += 20;
            hit = true;
            break;
        }
    }
    if (!hit) {
        score -= 5;
    }
});

// Obsługa ruchu myszy
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

// Funkcja końca gry
function gameOver() {
    gameRunning = false;
    document.getElementById("gameOverPopup").classList.remove("hidden");
    document.getElementById("finalScore").textContent = score;

    const sadMusic = document.getElementById("sadMusic");
    sadMusic.currentTime = 0;
    sadMusic.play();
}

// Restart gry
document.getElementById("playAgainButton").addEventListener("click", () => {
    document.getElementById("gameOverPopup").classList.add("hidden");
    const sadMusic = document.getElementById("sadMusic");
    sadMusic.pause();
    sadMusic.currentTime = 0;
    score = 30;
    health = 3;
    zombies = [];
    gameRunning = true;
    spawnZombie();
    gameLoop(0);
});

// Start gry
bgImage.onload = () => {
    zombieImage.onload = () => {
        spawnZombie();
        setInterval(spawnZombie, 1500);
        gameLoop(0);
    };
};
