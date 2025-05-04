const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

// Load girl sprite
const girlImg = new Image();
girlImg.src = 'assets/girl-sprite.png';

// Load mother sprite
const motherImg = new Image();
motherImg.src = 'assets/mother-sprite.png';

// Sprite settings
const frameWidth = 32;
const frameHeight = 32;
const maxFrames = 3;
let currentFrame = 0;
const animationSpeed = 10;
let tick = 0;

const player = {
    x: 100,
    y: 300,
    width: frameWidth,
    height: frameHeight,
    speed: 2,
    dx: 0
};

const mother = {
    x: 60,
    y: 300,
    width: frameWidth,
    height: frameHeight
};

// Snow particle system
const snowflakes = [];
for (let i = 0; i < 100; i++) {
    snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 1 + 0.5
    });
}

function updateSnow() {
    for (let flake of snowflakes) {
        flake.y += flake.speed;
        if (flake.y > canvas.height) {
            flake.y = 0;
            flake.x = Math.random() * canvas.width;
        }
    }
}

function update() {
    player.x += player.dx;
    mother.x += player.dx;

    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - frameWidth) player.x = canvas.width - frameWidth;

    if (mother.x < 0) mother.x = 0;
    if (mother.x > canvas.width - frameWidth) mother.x = canvas.width - frameWidth;

    tick++;
    if (tick % animationSpeed === 0) {
        currentFrame = (currentFrame + 1) % maxFrames;
    }

    updateSnow();
}

function drawGradientBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a1e3d');  // dark blue top
    gradient.addColorStop(1, '#1c3b63');  // lighter blue bottom
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnow() {
    ctx.fillStyle = 'white';
    for (let flake of snowflakes) {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawRiver() {
    ctx.fillStyle = '#87ceeb';  // frozen river light blue
    ctx.fillRect(0, 350, canvas.width, 50);
}

function draw() {
    drawGradientBackground();
    drawSnow();
    drawRiver();

    let row = player.dx >= 0 ? 1 : 3;

    // Draw mother
    ctx.drawImage(
        motherImg,
        currentFrame * frameWidth, row * frameHeight, frameWidth, frameHeight,
        mother.x, mother.y, frameWidth, frameHeight
    );

    // Draw girl
    ctx.drawImage(
        girlImg,
        currentFrame * frameWidth, row * frameHeight, frameWidth, frameHeight,
        player.x, player.y, frameWidth, frameHeight
    );
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') player.dx = player.speed;
    if (e.key === 'ArrowLeft') player.dx = -player.speed;
});

document.addEventListener('keyup', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') player.dx = 0;
});

loop();
