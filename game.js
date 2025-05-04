const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const narrativeContainer = document.getElementById('narrativeContainer');
const chapterBanner = document.getElementById('chapterBanner');

const backgrounds = {
    2: new Image(),
    3: new Image(),
    4: new Image()
};

backgrounds[2].src = "assets/chapter2.png";
backgrounds[3].src = "assets/chapter3.png";
backgrounds[4].src = "assets/chapter4.png";

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
    { x: 70, y: 318, speed: 2, sprite: girlSprite },
    { x: 110, y: 318, speed: 2, sprite: motherSprite }
];

const snowflakes = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    speed: Math.random() * 1 + 0.5
}));

let isHiding = false;
let hideCooldown = 0;
let stamina = 100;
const maxStamina = 100;
const staminaDepletionRate = 0.3;
const staminaRegenRate = 0.1;

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
    const chapterData = [
        {
            bg: "#002244",
            title: "❄ Chapter 1: Escape Across the Frozen River",
            text: `The bitter wind slices through their clothes as Yeonmi and her mother creep toward the Yalu River...`,
            info: `<ul>
                <li>The Yalu River is about 800 km long and serves as a natural border between North Korea and China.</li>
                <li>Many defectors cross at night to avoid detection, often without guides or proper equipment.</li>
                <li>Falling into the freezing water can mean hypothermia or death within minutes.</li>
            </ul>`
        },
        {
            bg: "#333300",
            title: "🏚 Chapter 2: Hiding in China",
            text: `Hidden in an unfamiliar house, Yeonmi and her mother barely dare to whisper...`,
            info: `<ul>
                <li>China classifies North Koreans as “economic migrants.”</li>
                <li>Many defectors are forced into trafficking or labor to survive.</li>
                <li>NGOs and networks help them hide and escape safely.</li>
            </ul>`
        },
        {
            bg: "#663300",
            title: "🏜 Chapter 3: Crossing the Gobi Desert",
            text: `A vast sea of sand and frost stretches before them...`,
            info: `<ul>
                <li>The Gobi spans 1.3 million km² across China and Mongolia.</li>
                <li>Defectors often cross on foot in brutal cold and heat.</li>
                <li>Survival depends on endurance and luck.</li>
            </ul>`
        },
        {
            bg: "#336600",
            title: "🏁 Chapter 4: Reaching Mongolia",
            text: `Beyond the final fence lies Mongolia — and the promise of freedom...`,
            info: `<ul>
                <li>Mongolia works with South Korea and the UN to help defectors.</li>
                <li>They are flown to Seoul for resettlement programs.</li>
                <li>Adjustment takes years, with language and culture shifts.</li>
            </ul>`
        }
    ];
    const c = chapterData[chapter - 1];
    chapterBackground = c.bg;
    narrativeContainer.innerHTML = `<h2>${c.title}</h2><p>${c.text}</p><h3>📌 Info</h3>${c.info}`;
    showBanner(c.title);
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
    }
    if (keys["ArrowRight"]) {
        players.forEach(p => p.x += p.speed);
        direction = 2;
        moved = true;
    }
    if (!moved) direction = 0;

    players.forEach((p, index) => {
        p.x = Math.max(0, Math.min(canvas.width - displayWidth, p.x));
        if (index > 0 && p.x < players[index - 1].x + displayWidth + 2) {
            p.x = players[index - 1].x + displayWidth + 2;
        }
    });

    // dynamic right edge
    let rightEdge = currentChapter === 1 ? canvas.width - 50 : canvas.width;

    if (players[0].x + displayWidth >= rightEdge) {
        currentChapter = currentChapter < 4 ? currentChapter + 1 : 1;
        players.forEach((p, idx) => p.x = 70 + idx * 40);
        stamina = maxStamina;
        isHiding = false;
        loadChapter(currentChapter);
    }

    if (currentChapter === 2 && hideCooldown > 0) hideCooldown--;

    if (currentChapter === 3) {
        if (keys["ArrowRight"] || keys["ArrowLeft"]) {
            stamina = Math.max(0, stamina - staminaDepletionRate);
        } else {
            stamina = Math.min(maxStamina, stamina + staminaRegenRate);
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
    // Draw background image or fallback color
    if (currentChapter >= 2 && backgrounds[currentChapter]) {
        ctx.drawImage(backgrounds[currentChapter], 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = chapterBackground;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Snow only in chapter 1 and 3
    if (currentChapter === 1 || currentChapter === 3) {
        ctx.fillStyle = "#fff";
        snowflakes.forEach(snow => {
            ctx.beginPath();
            ctx.arc(snow.x, snow.y, snow.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Only draw ground if no background image is used (chapter 1)
    if (currentChapter === 1) {
        ctx.fillStyle = "#89c2d9";
        ctx.fillRect(0, 350, canvas.width, 50);
        ctx.fillStyle = "#495057";
        ctx.fillRect(0, 330, 50, 70);
        ctx.fillRect(canvas.width - 50, 330, 50, 70);
    }

    // Draw players (on top of background)
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

    // Hiding overlay
    if (currentChapter === 2 && isHiding) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = "20px Arial";
        ctx.fillText("Hiding...", canvas.width / 2 - 40, canvas.height / 2);
    }

    // Stamina bar
    if (currentChapter === 3) {
        ctx.fillStyle = "#444";
        ctx.fillRect(20, 20, 200, 20);
        ctx.fillStyle = "#0f0";
        ctx.fillRect(20, 20, 200 * (stamina / maxStamina), 20);
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(20, 20, 200, 20);
    }
}
