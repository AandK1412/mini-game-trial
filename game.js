const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const narrativeContainer = document.getElementById('narrativeContainer');
const chapterBanner = document.getElementById('chapterBanner');

let backgroundColor = '#002244';
let groundColor = '#80cfff';
let groundHeight = 50;
let currentChapter = 1;

let player = {
  x: 50,
  y: canvas.height - groundHeight - 48,
  width: 32,
  height: 48,
  speed: 3,
  dx: 0
};

function loadChapter(chapter) {
  if (chapter === 1) {
    backgroundColor = '#002244';
    narrativeContainer.innerHTML = `
      <h2>❄ Narrative: Escape Across the Frozen River</h2>
      <p>Under the cloak of a cold winter night, Yeonmi and her mother stand at the edge...</p>
    `;
    showBanner('Chapter 1: Escape');
  } else if (chapter === 2) {
    backgroundColor = '#001122';
    narrativeContainer.innerHTML = `
      <h2>🌄 Chapter 2: Crossing Into China</h2>
      <p>They’ve crossed the ice and face a new land of danger and uncertainty.</p>
      <h3>📌 Did You Know?</h3>
      <ul>
        <li>Defectors often rely on underground networks.</li>
        <li>China does not recognize North Korean refugees and may deport them.</li>
      </ul>
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

function update() {
  player.x += player.dx;

  if (player.x + player.width >= canvas.width) {
    currentChapter++;
    player.x = 0;
    loadChapter(currentChapter);
  }

  if (player.x < 0) player.x = 0;
}

function drawPlayer() {
  ctx.fillStyle = 'magenta';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawGround() {
  ctx.fillStyle = groundColor;
  ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
}

function drawBackground() {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
  update();
  drawBackground();
  drawGround();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

function keyDown(e) {
  if (e.key === 'ArrowRight') {
    player.dx = player.speed;
  } else if (e.key === 'ArrowLeft') {
    player.dx = -player.speed;
  }
}

function keyUp(e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    player.dx = 0;
  }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

loadChapter(currentChapter);
gameLoop();
