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

const BorderguardSpritepro = new Image();
BorderguardSpritepro.src = "assets/Borderguardpro.png";

const hostSprite = new Image();
hostSprite.src = "assets/host.png";

const hostSpritepro = new Image();
hostSpritepro.src = "assets/hostpro.png";

const humantraffickSprite = new Image();
humantraffickSprite.src = "assets/humantraffick.png";

const humantraffickSpritepro = new Image();
humantraffickSpritepro.src = "assets/humantraffickpro.png";

const NGOSprite = new Image();
NGOSprite.src = "assets/NGO.png";

const NGOSpritepro = new Image();
NGOSpritepro.src = "assets/NGOpro.png";

const DesertguideSprite = new Image();
DesertguideSprite.src = "assets/Desertguide.png";

const DesertguideSpritepro = new Image();
DesertguideSpritepro.src = "assets/Desertguidepro.png";

const MongolianOfficialSprite = new Image();
MongolianOfficialSprite.src = "assets/MongolianOfficial.png";

const MongolianOfficialSpritepro = new Image();
MongolianOfficialSpritepro.src = "assets/MongolianOfficialpro.png";



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
const groundY = canvas.height - displayHeight - 20;

const players = [
    { x: 70, y: groundY, speed: 2, sprite: girlSprite },
    { x: 140, y: groundY, speed: 2, sprite: motherSprite }
];

// Set NPCs based on the chapter
let npcPositions = [];

function setChapterNPCs(chapter) {
    switch (chapter) {
        case 1:
            npcPositions = [
                { x: 300, y: groundY, sprite: BorderguardSprite, dialogue: "Stop! Where are you going?" }
            ];
            break;
        case 2:
            npcPositions = [
                { x: 300, y: groundY, sprite: hostSprite, dialogue: "Welcome to my house. You must stay hidden." },
                { x: 400, y: groundY, sprite: NGOSprite, dialogue: "NGOs help us. We must get you to safety." },
                { x: 500, y: groundY, sprite: humantraffickSprite, dialogue: "You should be careful. They are watching." }
            ];
            break;
        case 3:
            npcPositions = [
                { x: 350, y: groundY, sprite: DesertguideSprite, dialogue: "Keep walking. We will get through the desert." }
            ];
            break;
        case 4:
            npcPositions = [
                { x: 350, y: groundY, sprite: MongolianOfficialSprite, dialogue: "Welcome to Mongolia. You're safe now." }
            ];
            break;
    }
}

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
            title: "❄ Chapter 1: Escape Change Across the Frozen River",
            text: "The bitter wind slices through their clothes as Yeonmi and her mother creep toward the Yalu River.\nBehind them, the familiar shadows of home; ahead, a frozen no-man’s land. Guards patrol nearby, their boots crunching on snow.\nEvery crack of ice feels like a gunshot in the silence. Yeonmi grips her mother’s hand, her heart racing — they have only one chance.",
            info: "<ul><li>The Yalu River is about 800 km long and serves as a natural border between North Korea and China.</li><li>Many defectors cross at night to avoid detection, often without guides or proper equipment.</li><li>Falling into the freezing water can mean hypothermia or death within minutes.</li></ul>",
            character: [
                {
                    name: "Borderguard",
                    risk: "High — The Borderguard is at high risk of getting caught by the authorities while trying to prevent defectors from crossing the border.",
                    resources: "Limited — Patrols the border, has minimal resources, and no ability to assist defectors beyond enforcing the law.",
                    cost: "None — The Borderguard has authority to detain or stop individuals at the border but requires no immediate payment.",
                    trust: "Low — The Borderguard is motivated by duty, not compassion, and views defectors as criminals. Trust is minimal.",
                    image: "assets/borderguardpro.png"  // Adjust to actual image path
                }
            ]
        },
        {
            bg: "#333300",
            title: "🏚 Chapter 2: Hiding in China",
            text: "Hidden in an unfamiliar house, Yeonmi and her mother barely dare to whisper.\nOutside, the streets bustle, but inside, time moves painfully slow.\nThey depend on strangers and underground helpers, each knock on the door sending chills down their spines.",
            info: "<ul><li>China classifies North Koreans as “economic migrants” rather than refugees.</li><li>Many defectors are forced into human trafficking or forced labor to survive.</li><li>NGOs and underground networks are vital to helping defectors hide and move safely.</li></ul>",
            character: [
                {
                    name: "Host",
                    risk: "Medium — The host risks being caught for harboring defectors but has less direct danger than a Borderguard.",
                    resources: "Moderate — The host provides a safe house for hiding but does not have large-scale resources to assist.",
                    cost: "None — The host is primarily seeking safety for themselves and is helping Yeonmi and her mother without a high personal cost.",
                    trust: "Medium — The host is trustworthy but may not offer full safety as their own safety is at risk.",
                    image: "assets/hostpro.png"  // Adjust to actual image path
                },
                {
                    name: "NGO Worker",
                    risk: "Medium — The NGO Worker faces exposure due to their underground assistance but is working within non-governmental frameworks.",
                    resources: "High — The NGO worker has access to a network of support systems and can help provide safety and information for defectors.",
                    cost: "Low — The NGO worker requires minimal resources, mainly information and safe passage routes.",
                    trust: "High — The NGO worker is motivated by humanitarian goals and can be trusted to help defectors without personal profit.",
                    image: "assets/Ngopro.png"  // Adjust to actual image path
                },
                {
                    name: "Human Trafficker",
                    risk: "High — The human trafficker is involved in illegal activities, which puts them at high personal risk of being caught by authorities.",
                    resources: "Moderate — The trafficker has access to resources but uses them for exploitative purposes.",
                    cost: "High — The trafficker demands significant payment for their services and may demand more depending on the situation.",
                    trust: "Low — The trafficker is motivated by profit and is known for exploiting defectors. They can’t be trusted.",
                    image: "assets/humantraffickpro.png"  // Adjust to actual image path
                }
            ]
        },
        {
            bg: "#663300",
            title: "🏜 Chapter 3: Crossing the Gobi Desert",
            text: "A vast sea of sand and frost stretches before them.\nThe Gobi Desert shows no mercy — freezing nights, endless horizon.\nWith every step, Yeonmi recalls the guide’s words: 'Keep moving, no matter what.'",
            info: "<ul><li>The Gobi Desert spans 1.3 million km² across China and Mongolia.</li><li>Defectors often walk on foot, enduring brutal cold and heat.</li><li>Temperatures can drop to -40°C in winter — survival depends on endurance and luck.</li></ul>",
            character: [
                {
                    name: "Desert Guide",
                    risk: "High — The Desert Guide faces extreme risks of guiding people through a dangerous desert. There is a high likelihood of getting lost or encountering harsh environmental conditions.",
                    resources: "Moderate — The guide possesses survival gear and knowledge of the desert but lacks large-scale support.",
                    cost: "High — The Desert Guide charges high fees for their services, and the cost could also include significant items or resources.",
                    trust: "Medium — While they provide essential services, the guide is primarily motivated by payment, and there is no guarantee of success.",
                    Question:"Should you help them?",
                    image: "assets/Desertguidepro.png"  // Adjust to actual image path
                }
            ]
        },
        {
            bg: "#336600",
            title: "🏁 Chapter 4: Reaching Mongolia",
            text: "Beyond the final fence lies Mongolia — and the promise of freedom.\nAt the border post, every passport stamp feels like an eternity.\nAs the gates open, Yeonmi’s mother squeezes her hand: this is it.",
            info: "<ul><li>Mongolia cooperates with South Korea and the UN to assist North Korean defectors.</li><li>Defectors are flown to Seoul for resettlement programs after processing.</li><li>They face years of adjustment, learning language, culture, and rebuilding lives.</li></ul>",
            character: [
                {
                    name: "Mongolian Official",
                    risk: "Low — The Mongolian Official is not at risk in the same way as the others. They are part of the formal system assisting defectors.",
                    resources: "High — The official has significant resources, including authority to grant asylum, process defectors, and provide safe passage to other countries.",
                    cost: "Low — The official requires little in return for processing asylum. Their role is part of the formal system.",
                    trust: "High — The Mongolian Official is an authority figure responsible for protecting defectors, and their role is aligned with international efforts to assist.",
                    image: "assets/mongolianOfficialpro.png"  // Adjust to actual image path
                }
            ]
        }
    ];

    const c = chapterData[chapter - 1];
    chapterBackground = c.bg;
    narrativeContainer.innerHTML = `<h2>${c.title}</h2><p>${c.text}</p><h3>📌 Info</h3>${c.info}`;

    // Add character profiles to the page
    let characterHtml = "<h3>👥 Characters</h3>";
    c.character.forEach((char) => {
        characterHtml += `
            <div class="character-profile">
                <img src="${char.image}" alt="${char.name}" class="character-image">
                <h4>${char.name}</h4>
                <ul>
                    <li><strong>Risk:</strong> ${char.risk}</li>
                    <li><strong>Resources:</strong> ${char.resources}</li>
                    <li><strong>Cost:</strong> ${char.cost}</li>
                    <li><strong>Trust:</strong> ${char.trust}</li>
                </ul>
            </div>
        `;
    });

    narrativeContainer.innerHTML += characterHtml;

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

    // Check for proximity and trigger dialogue if near NPC
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
            frameIndex = (frameIndex + 1) % frameCount;
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
    // Show dialogue on the canvas or anywhere you like
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
        // Adjust y position to move characters higher or lower
        const yOffset = -10; // Negative values move the character higher, e.g., -10 for higher

        // Draw the character with adjusted y position
        ctx.drawImage(
            p.sprite,
            frameIndex * -3,
            direction * 50,  // Direction: idle, right, or left
            spriteWidth,
            spriteHeight,
            p.x,
            p.y + yOffset,  // Apply the vertical offset here
            displayWidth,
            displayHeight
        );
    });

    npcPositions.forEach(npc => {
        ctx.drawImage(npc.sprite, 0, 0, spriteWidth, spriteHeight, npc.x, npc.y, displayWidth, displayHeight);
    });
}

gameLoop();
