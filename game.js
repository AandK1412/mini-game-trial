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
            text: `The bitter wind slices through their clothes as Yeonmi and her mother creep toward the Yalu River.
            Behind them, the familiar shadows of home; ahead, a frozen no-man’s land. Guards patrol nearby, their boots crunching on snow.
            Every crack of ice feels like a gunshot in the silence. Yeonmi grips her mother’s hand, her heart racing — they have only one chance.`,
            info: `<ul>
                <li>The Yalu River is about 800 km long and serves as a natural border between North Korea and China.</li>
                <li>Many defectors cross at night to avoid detection, often without guides or proper equipment.</li>
                <li>Falling into the freezing water can mean hypothermia or death within minutes.</li>
            </ul>`
        },
        {
            bg: "#333300",
            title: "🏚 Chapter 2: Hiding in China",
            text: `Hidden in an unfamiliar house, Yeonmi and her mother barely dare to whisper.
            Outside, the streets bustle, but inside, time moves painfully slow.
            They depend on strangers and underground helpers, each knock on the door sending chills down their spines.`,
            info: `<ul>
                <li>China classifies North Koreans as “economic migrants” rather than refugees.</li>
                <li>Many defectors are forced into human trafficking or forced labor to survive.</li>
                <li>NGOs and underground networks are vital to helping defectors hide and move safely.</li>
            </ul>`
        },
        {
            bg: "#663300",
            title: "🏜 Chapter 3: Crossing the Gobi Desert",
            text: `A vast sea of sand and frost stretches before them.
            The Gobi Desert shows no mercy — freezing nights, endless horizon.
            With every step, Yeonmi recalls the guide’s words: "Keep moving, no matter what."`,
            info: `<ul>
                <li>The Gobi Desert spans 1.3 million km² across China and Mongolia.</li>
                <li>Defectors often walk on foot, enduring brutal cold and heat.</li>
                <li>Temperatures can drop to -40°C in winter — survival depends on endurance and luck.</li>
            </ul>`
        },
        {
            bg: "#336600",
            title: "🏁 Chapter 4: Reaching Mongolia",
            text: `Beyond the final fence lies Mongolia — and the promise of freedom.
            At the border post, every passport stamp feels like an eternity.
            As the gates open, Yeonmi’s mother squeezes her hand: this is it.`,
            info: `<ul>
                <li>Mongolia cooperates with South Korea and the UN to assist North Korean defectors.</li>
                <li>Defectors are flown to Seoul for resettlement programs after processing.</li>
                <li>They face years of adjustment, learning language, culture, and rebuilding lives.</li>
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

    function draw() {
        if (backgrounds[currentChapter]?.complete && backgrounds[currentChapter].naturalHeight !== 0) {
            ctx.drawImage(backgrounds[currentChapter], 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = chapterBackground;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    
        if (currentChapter === 1 || currentChapter === 3) {
            ctx.fillStyle = "#fff";
            snowflakes.forEach(snow => {
                ctx.beginPath();
                ctx.arc(snow.x, snow.y, snow.radius, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    
       players.forEach(p => {
        // Manually shifting the crop window (adjust these values for fine-tuning)
        const sxOffset = -5;  // Shift the crop window horizontally (right)
        const syOffset = -5;  // Shift the crop window vertically (down)
    
        // Ensure the sprite is correctly cropped based on frame width and height
        const frameX = frameIndex * spriteWidth + sxOffset; // Apply the horizontal offset
        const frameY = direction * spriteHeight + syOffset; // Apply the vertical offset
    
        // Draw the sprite with the shifted crop window
        ctx.drawImage(
            p.sprite,
            frameX,  // Starting X position for cropping (with horizontal offset)
            frameY,  // Starting Y position for cropping (with vertical offset)
            spriteWidth,  // Width of the cropped frame
            spriteHeight,  // Height of the cropped frame
            p.x,  // X position on the canvas to draw the sprite
            p.y + yOffset,  // Y position on the canvas to draw the sprite (with vertical offset)
            displayWidth,  // Display width on the canvas
            displayHeight  // Display height on the canvas
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
