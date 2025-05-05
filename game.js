const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const narrativeContainer = document.getElementById('narrativeContainer');
const chapterBanner = document.getElementById('chapterBanner');

canvas.width = 800;
canvas.height = 400;

const backgrounds = {
    1: new Image(),
    2: new Image(),
    3: new Image(),
    4: new Image()
};
backgrounds[1].src = "assets/chapter1.png";
backgrounds[2].src = "assets/chapter2.png";
backgrounds[3].src = "assets/chapter3.png";
backgrounds[4].src = "assets/chapter4.png";

// Create unique variables for each NPC sprite
const girlSprite = new Image();
girlSprite.src = "assets/girl-sprite.png";

const motherSprite = new Image();
motherSprite.src = "assets/mother-sprite.png";

// NPC sprites
const BorderguardSprite = new Image();
BorderguardSprite.src = "assets/Borderguard.png";

// Adjusted sprite sizes to better fit
const spriteWidth = 50;  // Width of each frame (50px)
const spriteHeight = 50; // Height of each frame (50px)
const scale = 2;        // Scale factor for displaying sprite sheet
const displayWidth = spriteWidth * scale;
const displayHeight = spriteHeight * scale;

let frameIndex = 0;
const frameCount = 3; // Number of frames per animation cycle (adjust as needed)
let frameTimer = 0;
const frameSpeed = 10;  // Controls animation speed
let direction = 0;  // 0 = Idle, 1 = Right, 2 = Left
let currentChapter = 1;
let chapterBackground = "#002244";

// Adjust Y position to make characters fully visible
const groundY = canvas.height - displayHeight - 10;

const players = [
    { x: 70, y: groundY, speed: 2, sprite: girlSprite },
    { x: 140, y: groundY, speed: 2, sprite: motherSprite }
];

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
            text: "The bitter wind slices through their clothes as Yeonmi and her mother creep toward the Yalu River.\nBehind them, the familiar shadows of home; ahead, a frozen no-man’s land. Guards patrol nearby, their boots crunching on snow.\nEvery crack of ice feels like a gunshot in the silence. Yeonmi grips her mother’s hand, her heart racing — they have only one chance.",
            info: "<ul><li>The Yalu River is about 800 km long and serves as a natural border between North Korea and China.</li><li>Many defectors cross at night to avoid detection, often without guides or proper equipment.</li><li>Falling into the freezing water can mean hypothermia or death within minutes.</li></ul>"
        },
        {
            bg: "#333300",
            title: "🏚 Chapter 2: Hiding in China",
            text: "Hidden in an unfamiliar house, Yeonmi and her mother barely dare to whisper.\nOutside, the streets bustle, but inside, time moves painfully slow.\nThey depend on strangers and underground helpers, each knock on the door sending chills down their spines.",
            info: "<ul><li>China classifies North Koreans as “economic migrants” rather than refugees.</li><li>Many defectors are forced into human trafficking or forced labor to survive.</li><li>NGOs and underground networks are vital to helping defectors hide and move safely.</li></ul>"
        },
        {
            bg: "#663300",
            title: "🏜 Chapter 3: Crossing the Gobi Desert",
            text: "A vast sea of sand and frost stretches before them.\nThe Gobi Desert shows no mercy — freezing nights, endless horizon.\nWith every step, Yeonmi recalls the guide’s words: 'Keep moving, no matter what.'",
            info: "<ul><li>The Gobi Desert spans 1.3 million km² across China and Mongolia.</li><li>Defectors often walk on foot, enduring brutal cold and heat.</li><li>Temperatures can drop to -40°C in winter — survival depends on endurance and luck.</li></ul>"
        },
        {
            bg: "#336600",
            title: "🏁 Chapter 4: Reaching Mongolia",
            text: "Beyond the final fence lies Mongolia — and the promise of freedom.\nAt the border post, every passport stamp feels like an eternity.\nAs the gates open, Yeonmi’s mother squeezes her hand: this is it.",
            info: "<ul><li>Mongolia cooperates with South Korea and the UN to assist North Korean defectors.</li><li>Defectors are flown to Seoul for resettlement programs after processing.</li><li>They face years of adjustment, learning language, culture, and rebuilding lives.</li></ul>"
        }
    ];

    const c = chapterData[chapter - 1];
    chapterBackground = c.bg;
    narrativeContainer.innerHTML = `<h2>${c.title}</h2><p>${c.text}</p><h3>📌 Info</h3>${c.info}`;
    showBanner(c.title);
    setChapterNPCs(chapter); // Set NPCs based on the current chapter
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
        direction = 2;  // Left (third row)
        moved = true;
    }
    if (keys["ArrowRight"]) {
        players.forEach(p => p.x += p.speed);
        direction = 1;  // Right (second row)
        moved = true;
    }
    if (!moved) direction = 0;  // Idle (first row)

    players.forEach((p, index) => {
        p.x = Math.max(0, Math.min(canvas.width - displayWidth, p.x));
        if (index > 0 && p.x < players[index - 1].x + displayWidth + 2) {
            p.x = players[index - 1].x + displayWidth + 2;
        }
    });

    npcPositions.forEach(npc => {
        if (Math.abs(players[0].x - npc.x) < 50) {
            displayDialogue(npc.dialogue);  // Trigger dialogue display when in proximity
        }
    });

    if (players[0].x + displayWidth >= canvas.width - 50) {
        currentChapter = currentChapter < 4 ? currentChapter + 1 : 1;
        players.forEach((p, idx) => p.x = 70 + idx * 70);
        stamina = maxStamina;
        isHiding = false;
        loadChapter(currentChapter);
    }

    if (currentChapter === 2 && hideCooldown > 0) hideCooldown--;

    if (moved) {
        frameTimer++;
        if (frameTimer >= frameSpeed) {
            frameTimer = 0;
            frameIndex = (frameIndex + 1) % frameCount;  // Cycle through frames for animation
        }
    } else {
        frameIndex = 1; // Idle
    }

    snowflakes.forEach(snow => {
        snow.y += snow.speed;
        if (snow.y > canvas.height) {
            snow.y = 0;
            snow.x = Math.random() * canvas.width;
        }
    });
}

function displayDialogue(dialogue) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(50, canvas.height - 100, canvas.width - 100, 70);  // Background for dialogue
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(dialogue, 60, canvas.height - 60);  // Display text
}

function draw() {
    if (backgrounds[currentChapter]?.complete && backgrounds[currentChapter].naturalHeight !== 0) {
        ctx.drawImage(backgrounds[currentChapter], 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = chapterBackground;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    players.forEach(p => {
        const yOffset = -10;  // Adjust vertical positioning of players
        ctx.drawImage(
            p.sprite,
            frameIndex * spriteWidth,    // Use the frame index for animation
            direction * spriteHeight,    // Use direction for left/right animation
            spriteWidth, 
            spriteHeight, 
            p.x, p.y + yOffset, 
            displayWidth, displayHeight
        );
    });

    npcPositions.forEach(npc => {
        ctx.drawImage(npc.sprite, 0, 0, spriteWidth, spriteHeight, npc.x, npc.y, displayWidth, displayHeight);
    });
}

gameLoop();
