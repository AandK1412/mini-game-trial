const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const narrativeContainer = document.getElementById('narrativeContainer');
const chapterBanner = document.getElementById('chapterBanner');

canvas.width = 800;
canvas.height = 400;

const girlSprite = new Image();
girlSprite.src = "assets/girl-sprite.png";
const motherSprite = new Image();
motherSprite.src = "assets/mother-sprite.png";

const spriteWidth = 32;
const spriteHeight = 32;
const scale = 2;
const displayWidth = spriteWidth * scale;
const displayHeight = spriteHeight * scale;

let frameIndex = 0;
const frameCount = 3;
let frameTimer = 0;
const frameSpeed = 10;
let direction = 0;
let currentChapter = 1;
let chapterBackground = "#002244";

const players = [
    { x: 100, y: 318, speed: 2, sprite: girlSprite },
    { x: 140, y: 318, speed: 2, sprite: motherSprite }
];

// Snow particles
const snowflakes = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    speed: Math.random() * 1 + 0.5
}));

// Mechanics
let isHiding = false;
let hideCooldown = 0;
let stamina = 100;
let maxStamina = 100;
let staminaDepletionRate = 0.3;
let staminaRegenRate = 0.1;

const keys = {};
document.addEventListener("keydown", e => {
    keys[e.key] = true;
    if (e.key === " ") {
        if (currentChapter === 2 && hideCooldown <= 0) {
            isHiding = !isHiding;
            hideCooldown = 20;
        }
    }
});
document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

loadChapter(currentChapter);

function loadChapter(chapter) {
    if (chapter === 1) {
        chapterBackground = "#002244";
        narrativeContainer.innerHTML = `<h2>❄ Chapter 1: Escape</h2><p>Crossing the frozen Yalu River...</p>`;
        showBanner('Chapter 1: Escape');
    } else if (chapter === 2) {
        chapterBackground = "#333300";
        narrativeContainer.innerHTML = `<h2>🏚 Chapter 2: Hiding in China</h2><p>Hiding from patrols and traffickers...</p>`;
        showBanner('Chapter 2: Hiding');
    } else if (chapter === 3) {
        chapterBackground = "#663300";
        narrativeContainer.innerHTML = `<h2>🏜 Chapter 3: Gobi Desert</h2><p>Crossing the desert at night...</p>`;
        showBanner('Chapter 3: Desert');
    } else if (chapter === 4) {
        chapterBackground = "#336600";
        narrativeContainer.innerHTML = `<h2>🏁 Chapter 4: Mongolia</h2><p>Final test at the border...</p>`;
        showBanner('Chapter 4: Freedom');
    }
}

function showBanner(text) {
    chapterBanner.textContent = text;
    chapterBanner.style.top = '20px';
    chapterBanner.style.opacity = 1;
    setTimeout(() => {
        chapterBanner.style.top = '0px';
        chapterBanner.style.opacity = 0;
    }, 3000);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    let moved = false;
    if (keys["ArrowLeft"]) {
        players.forEach(p => p.x -= p.speed);
        direction = 1;
        moved = true;
    } else if (keys["ArrowRight"]) {
        players.forEach(p => p.x += p.speed);
        direction = 2;
        moved = true;
    } else {
        direction = 0;
    }

    players.forEach(p => {
        p.x = Math.max(0, Math.min(canvas.width - displayWidth, p.x));
    });

    if (players[0].x + displayWidth >= canvas.width) {
        currentChapter++;
        if (currentChapter > 4) currentChapter = 1;
        players.forEach(p => p.x = 0);
        stamina = 100;
        isHiding = false;
        loadChapter(currentChapter);
    }

    if (currentChapter === 2 && hideCooldown > 0) hideCooldown--;

    if (currentChapter === 3) {
        if (keys["ArrowRight"] || keys["ArrowLeft"]) {
            stamina -= staminaDepletionRate;
            stamina = Math.max(0, stamina);
        } else {
            stamina += staminaRegenRate;
            stamina = Math.min(maxStamina, stamina);
        }
    }

    if (moved) {
        frameTimer++;
        if (frameTimer >= frameSpeed) {
            frameTimer = 0;
            frameIndex = (frameIndex + 1) % frameCount;
        }
    } else {
        frameIndex = 1;
    }

    snowflakes.forEach(snow => {
        snow.y += snow.speed;
        if (snow.y > canvas.height) {
            snow.y = 0;
            snow.x = Math.random() * canvas.width;
        }
    });
}

function draw() {
    ctx.fillStyle = chapterBackground;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (currentChapter === 1 || currentChapter === 3) {
        ctx.fillStyle = "#fff";
        snowflakes.forEach(snow => {
            ctx.beginPath();
            ctx.arc(snow.x, snow.y, snow.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    ctx.fillStyle = "#89c2d9";
    ctx.fillRect(0, 350, canvas.width, 50);
    ctx.fillStyle = "#495057";
    ctx.fillRect(0, 330, 50, 70);
    ctx.fillRect(canvas.width - 50, 330, 50, 70);

    players.forEach(p => {
        ctx.drawImage(
            p.sprite,
            frameIndex * spriteWidth,
            direction * spriteHeight,
            spriteWidth,
            spriteHeight,
            p.x,
            p.y,
            displayWidth,
            displayHeight
        );
    });

    if (currentChapter === 2 && isHiding) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = "20px Arial";
        ctx.fillText("Hiding...", canvas.width / 2 - 40, canvas.height / 2);
    }

    if (currentChapter === 3) {
        ctx.fillStyle = "#444";
        ctx.fillRect(20, 20, 200, 20);
        ctx.fillStyle = "#0f0";
        ctx.fillRect(20, 20, 200 * (stamina / maxStamina), 20);
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(20, 20, 200, 20);
    }
}

gameLoop();
