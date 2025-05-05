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

const girlSprite = new Image();
girlSprite.src = "assets/girl-sprite.png";
const motherSprite = new Image();
motherSprite.src = "assets/mother-sprite.png";

// Adjusted sprite sizes to better fit
const spriteWidth = 40;  // Increased width
const spriteHeight = 40; // Increased height
const scale = 2;
const displayWidth = spriteWidth * scale;
const displayHeight = spriteHeight * scale;  

let frameIndex = 0;
const frameCount = 3;
let frameTimer = 0;
const frameSpeed = 10;
let direction = 0;  // 0 = Idle, 1 = Right, 2 = Left
let currentChapter = 1;
let chapterBackground = "#002244";

// Adjust Y position to make characters fully visible
const groundY = canvas.height - displayHeight - 10;

const players = [
    { x: 70, y: groundY, speed: 2, sprite: girlSprite },
    { x: 140, y: groundY, speed: 2, sprite: motherSprite }
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

let keys = {};
let isNearNPC = false;
let currentNPC = null;
let playerChoice = "";

// Define NPCs and their options for each chapter
const npcData = {
    1: [  // Chapter 1: Escape Across the Frozen River
        {
            name: "Border Guard",
            x: 250,
            y: canvas.height - displayHeight - 10,
            options: [
                { text: "Crossing this river is suicide. Turn back before it's too late.", action: "end" },
                { text: "Stop or I’ll shoot!", action: "continue" }
            ]
        },
        {
            name: "Smuggler/Guide",
            x: 400,
            y: canvas.height - displayHeight - 10,
            options: [
                { text: "Pay me now, or find your own way across.", action: "continue" },
                { text: "Stay quiet and follow my lead. One sound, and it's over.", action: "end" }
            ]
        }
    ],
    2: [  // Chapter 2: Hiding in China
        {
            name: "Host/Villager",
            x: 250,
            y: canvas.height - displayHeight - 10,
            options: [
                { text: "Don't tell anyone you were here, understood?", action: "continue" },
                { text: "You can stay here for the night, but leave by morning.", action: "end" }
            ]
        },
        {
            name: "Human Trafficker",
            x: 400,
            y: canvas.height - displayHeight - 10,
            options: [
                { text: "A pretty girl like you could make good money, you know.", action: "end" },
                { text: "I can get you across the city—if you pay the price.", action: "continue" }
            ]
        }
    ],
    3: [  // Chapter 3: Crossing the Gobi Desert
        {
            name: "Desert Guide",
            x: 250,
            y: canvas.height - displayHeight - 10,
            options: [
                { text: "We move at night. The sun will kill you by day.", action: "continue" },
                { text: "No water, no journey. Are you prepared?", action: "end" }
            ]
        },
        {
            name: "Border Patrol Scout",
            x: 400,
            y: canvas.height - displayHeight - 10,
            options: [
                { text: "What’s that over the dune? Stop right there!", action: "end" },
                { text: "You're lost, aren’t you? This desert has buried stronger than you.", action: "continue" }
            ]
        }
    ],
    4: [  // Chapter 4: Reaching Mongolia
        {
            name: "Mongolian Border Official",
            x: 250,
            y: canvas.height - displayHeight - 10,
            options: [
                { text: "Papers? Where are your papers?", action: "end" },
                { text: "South Korean embassy is that way. Hurry.", action: "continue" }
            ]
        },
        {
            name: "South Korean Diplomat / Resettlement Officer",
            x: 400,
            y: canvas.height - displayHeight - 10,
            options: [
                { text: "You’re safe now. Welcome to freedom.", action: "continue" },
                { text: "We’ll take care of you from here on.", action: "continue" }
            ]
        }
    ]
};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function loadChapter(chapter) {
    const chapterData = [
        {
            bg: "#002244",
            title: "❄ Chapter 1: Escape Across the Frozen River",
            text: `The bitter wind slices through their clothes as Yeonmi and her mother creep toward the Yalu River. Guards patrol nearby...`,
            info: `<ul><li>The Yalu River is about 800 km long...</li></ul>`
        },
        {
            bg: "#333300",
            title: "🏚 Chapter 2: Hiding in China",
            text: `Hidden in an unfamiliar house, Yeonmi and her mother barely dare to whisper. Outside, the streets bustle, but inside...`,
            info: `<ul><li>China classifies North Koreans as “economic migrants”...</li></ul>`
        },
        {
            bg: "#663300",
            title: "🏜 Chapter 3: Crossing the Gobi Desert",
            text: `A vast sea of sand and frost stretches before them...`,
            info: `<ul><li>The Gobi Desert spans 1.3 million km²...</li></ul>`
        },
        {
            bg: "#336600",
            title: "🏁 Chapter 4: Reaching Mongolia",
            text: `Beyond the final fence lies Mongolia — and the promise of freedom.`,
            info: `<ul><li>Mongolia cooperates with South Korea and the UN...</li></ul>`
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
        direction = 2;
        moved = true;
    }
    if (keys["ArrowRight"]) {
        players.forEach(p => p.x += p.speed);
        direction = 1;
        moved = true;
    }
    if (!moved) direction = 0;

    players.forEach((p, index) => {
        p.x = Math.max(0, Math.min(canvas.width - displayWidth, p.x));
        if (index > 0 && p.x < players[index - 1].x + displayWidth + 2) {
            p.x = players[index - 1].x + displayWidth + 2;
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

    if (currentChapter === 3) {
        if (keys["ArrowRight"] || keys["ArrowLeft"]) {
            stamina = Math.max(0, stamina - staminaDepletionRate);
        } else {
            stamina = Math.min(maxStamina, stamina + staminaRegenRate);
        }
    }

    snowflakes.forEach(snow => {
        snow.y += snow.speed;
        if (snow.y > canvas.height) {
            snow.y = 0;
            snow.x = Math.random() * canvas.width;
        }
    });

    checkNPCInteraction();
    if (isNearNPC) {
        showDialogue();
    }
}

function draw() {
    ctx.fillStyle = chapterBackground;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    players.forEach(p => {
        ctx.drawImage(p.sprite, frameIndex * spriteWidth, direction * spriteHeight, spriteWidth, spriteHeight, p.x, p.y, displayWidth, displayHeight);
    });

    drawNPCs();
}

function drawNPCs() {
    npcData[currentChapter].forEach(npc => {
        ctx.fillStyle = "#ff0000";  // NPC's location marker color
        ctx.beginPath();
        ctx.arc(npc.x, npc.y, 15, 0, Math.PI * 2);
        ctx.fill();
    });
}

function checkNPCInteraction() {
    npcData[currentChapter].forEach(npc => {
        const distance = Math.hypot(players[0].x - npc.x, players[0].y - npc.y);
        if (distance < 50) {
            isNearNPC = true;
            currentNPC = npc;
        }
    });
}

function showDialogue() {
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(currentNPC.name + " says:", canvas.width / 2 - 50, 30);
    
    currentNPC.options.forEach((option, index) => {
        ctx.fillText(`${index + 1}. ${option.text}`, canvas.width / 2 - 150, 60 + index * 30);
    });
}

function handleChoice(choice) {
    const action = currentNPC.options[choice].action;
    if (action === "end") {
        alert("Game Over! The journey ends here.");
        resetGame();
    } else if (action === "continue") {
        alert("The story continues...");
        loadNextChapter();
    }
}

function resetGame() {
    currentChapter = 1;
    players[0].x = 70;
    players[1].x = 140;
    stamina = maxStamina;
}

function loadNextChapter() {
    currentChapter++;
    loadChapter(currentChapter);
}

document.addEventListener("keydown", e => {
    if (isNearNPC && e.key === "1") {
        handleChoice(0);
    } else if (isNearNPC && e.key === "2") {
        handleChoice(1);
    }
});

gameLoop();
