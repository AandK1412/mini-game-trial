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
        narrativeContainer.innerHTML = `
            <h2>❄ Chapter 1: Escape Across the Frozen River</h2>
            <p>The bitter wind slices through their clothes as Yeonmi and her mother creep toward the Yalu River. Behind them, the familiar shadows of home; ahead, a frozen no-man’s land. Guards patrol nearby, their boots crunching on snow. Every crack of ice feels like a gunshot in the silence. Yeonmi grips her mother’s hand, her heart racing — they have only one chance.</p>
            <h3>📌 Info</h3>
            <ul>
                <li>The Yalu River is about 800 km long and serves as a natural border between North Korea and China.</li>
                <li>Many defectors cross at night to avoid detection, often without guides or proper equipment.</li>
                <li>Falling into the freezing water can mean hypothermia or death within minutes.</li>
            </ul>`;
        showBanner('Chapter 1: Escape');
    } else if (chapter === 2) {
        chapterBackground = "#333300";
        narrativeContainer.innerHTML = `
            <h2>🏚 Chapter 2: Hiding in China</h2>
            <p>Hidden in an unfamiliar house, Yeonmi and her mother barely dare to whisper. Outside, the streets bustle, but inside, time moves painfully slow. They depend on strangers and underground helpers, each knock on the door sending chills down their spines. Food is scarce; trust is scarcer. The risk of capture hangs over every day.</p>
            <h3>📌 Info</h3>
            <ul>
                <li>China classifies North Koreans as “economic migrants” rather than refugees, making them subject to deportation.</li>
                <li>Many defectors are forced into human trafficking, forced labor, or marriages to survive.</li>
                <li>Religious groups, NGOs, and underground networks play key roles in hiding and moving defectors.</li>
            </ul>`;
        showBanner('Chapter 2: Hiding');
    } else if (chapter === 3) {
        chapterBackground = "#663300";
        narrativeContainer.innerHTML = `
            <h2>🏜 Chapter 3: Crossing the Gobi Desert</h2>
            <p>A vast sea of sand and frost stretches out before them. The Gobi Desert shows no mercy — the freezing nights, the endless horizon, the whisper of the wind. Yeonmi’s legs ache, her lips crack from thirst, but she keeps walking. With every step, the guide’s words echo in her mind: 'Keep moving, no matter what.' Around her, the desert swallows sound and hope alike.</p>
            <h3>📌 Info</h3>
            <ul>
                <li>The Gobi Desert covers 1.3 million km² across China and Mongolia, with extreme temperature swings.</li>
                <li>Defectors cross mainly on foot, sometimes guided by smugglers, with little water or supplies.</li>
                <li>Temperatures in winter can drop to -40°C (-40°F), making the journey life-threatening.</li>
            </ul>`;
        showBanner('Chapter 3: Desert');
    } else if (chapter === 4) {
        chapterBackground = "#336600";
        narrativeContainer.innerHTML = `
            <h2>🏁 Chapter 4: Reaching Mongolia</h2>
            <p>Beyond the final fence lies Mongolia — and the promise of freedom. Yeonmi can hardly believe they’ve made it this far. At the border post, the air is tense. Every passport stamp, every glance from a guard feels like a lifetime. As the gates open, her mother’s grip tightens. This is it. After years of fear, they may finally have a future.</p>
            <h3>📌 Info</h3>
            <ul>
                <li>Mongolia has quietly cooperated with South Korea and the UN to allow North Korean defectors to transit safely.</li>
                <li>Once processed, most defectors are flown to Seoul, where they enter resettlement programs.</li>
                <li>Defectors face years of adjustment, learning a new language, culture, and rebuilding their lives.</li>
            </ul>`;
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
