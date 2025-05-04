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
let frameIndex = 0;
const frameCount = 3;
let frameTimer = 0;
const frameSpeed = 10;
let direction = 0; // 0 = idle, 1 = left, 2 = right

// Player object
const player = {
    x: 100,
    y: 300,
    width: spriteWidth,
    height: spriteHeight,
    speed: 2
};

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
    // Player movement
    if (keys["ArrowLeft"]) {
        player.x -= player.speed;
        direction = 1;
    } else if (keys["ArrowRight"]) {
        player.x += player.speed;
        direction = 2;
    } else {
        direction = 0;
    }

    // Keep player in bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

    // Animate sprite
    frameTimer++;
    if (frameTimer >= frameSpeed) {
        frameTimer = 0;
        frameIndex = (frameIndex + 1) % frameCount;
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

    // Draw river (ice)
    ctx.fillStyle = "#89c2d9";
    ctx.fillRect(0, 350, canvas.width, 50);

    // Draw snowflakes
    ctx.fillStyle = "#fff";
    snowflakes.forEach(snow => {
        ctx.beginPath();
        ctx.arc(snow.x, snow.y, snow.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw player sprite
    ctx.drawImage(
        girlSprite,
        frameIndex * spriteWidth,       // source x
        direction * spriteHeight,      // source y
        spriteWidth,                   // source width
        spriteHeight,                  // source height
        player.x,                      // destination x
        player.y,                      // destination y
        spriteWidth,                   // destination width
        spriteHeight                   // destination height
    );
}

// Start the game
gameLoop();
