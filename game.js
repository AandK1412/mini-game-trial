const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const narrativeContainer = document.getElementById('narrativeContainer');
const chapterBanner = document.getElementById('chapterBanner');

canvas.width = 800;
canvas.height = 400;

// Load sprite images
const girlSprite = new Image();
girlSprite.src = "assets/girl-sprite.png";

const motherSprite = new Image();
motherSprite.src = "assets/mother-sprite.png"; // <-- you should provide this sprite or reuse girl sprite

// Sprite setup
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

// Characters
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

// Keys
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Initialize narrative
loadChapter(currentChapter);

function loadChapter(chapter) {
    if (chapter === 1) {
        narrativeContainer.innerHTML = `
            <h2>❄ Chapter 1: Escape Across the Frozen River</h2>
            <p>Under the cloak of a cold winter night, Yeonmi and her mother stand at the edge of the Yalu River, the border between North Korea and China...</p>
        `;
        showBanner('Chapter 1: Escape');
    } else if (chapter === 2) {
        narrativeContainer.innerHTML = `
            <h2>🌄 Chapter 2: Crossing Into China</h2>
            <p>They’ve crossed the ice and now face a new land of danger and uncertainty...</p>
        `;
        showBanner('Chapter 2: China');
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
        if (currentChapter > 2) currentChapter = 1;
        players.forEach(p => p.x = 0);
        loadChapter(currentChapter);
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
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#001d3d");
    gradient.addColorStop(1, "#003566");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    snowflakes.forEach(snow => {
        ctx.beginPath();
        ctx.arc(snow.x, snow.y, snow.radius, 0, Math.PI * 2);
        ctx.fill();
    });

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
}

gameLoop();
