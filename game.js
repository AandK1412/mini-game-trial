const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

// Load sprite image
const girlSprite = new Image();
girlSprite.src = "assets/girl-sprite.png";

// Sprite setup
const spriteWidth = 32;
const spriteHeight = 32;
const scale = 2; // make it 2x larger
const displayWidth = spriteWidth * scale;
const displayHeight = spriteHeight * scale;
let frameIndex = 0;
const frameCount = 3;
let frameTimer = 0;
const frameSpeed = 10;
let direction = 0; // 0 = idle, 1 = left, 2 = right

// Player objects (girl + mother)
const players = [
    { x: 100, y: 318, speed: 2 },
    { x: 140, y: 318, speed: 2 }
];

// Snow particles
const snowflakes = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    speed: Math.random() * 1 + 0.5
}));

// Key handling
const keys = {};
document.addEventListener("keydown", e => {
    keys[e.key] = true;
});
document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

// Game loop
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

    // Keep players in bounds
    players.forEach(p => {
        p.x = Math.max(0, Math.min(canvas.width - displayWidth, p.x));
    });

    // Animate sprite only when moving
    if (moved) {
        frameTimer++;
        if (frameTimer >= frameSpeed) {
            frameTimer = 0;
            frameIndex = (frameIndex + 1) % frameCount;
        }
    } else {
        frameIndex = 1; // middle idle frame
    }

    // Update snow
    snowflakes.forEach(snow => {
        snow.y += snow.speed;
        if (snow.y > canvas.height) {
            snow.y = 0;
            snow.x = Math.random() * canvas.width;
        }
    });
}

function draw() {
    // Draw night gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#001d3d");
    gradient.addColorStop(1, "#003566");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snowflakes
    ctx.fillStyle = "#fff";
    snowflakes.forEach(snow => {
        ctx.beginPath();
        ctx.arc(snow.x, snow.y, snow.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw river (ice ground)
    ctx.fillStyle = "#89c2d9";
    ctx.fillRect(0, 350, canvas.width, 50);

    // Draw land on both sides
    ctx.fillStyle = "#495057";
    ctx.fillRect(0, 330, 50, 70); // left bank
    ctx.fillRect(canvas.width - 50, 330, 50, 70); // right bank

    // Draw players
    players.forEach(p => {
        ctx.drawImage(
            girlSprite,
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

// Start game
gameLoop();
