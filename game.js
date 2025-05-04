const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

let player = {
  x: 100,
  y: canvas.height - 50 - 40, // on top of ice
  width: 20,
  height: 40,
  color: "pink"
};

let companion = {
  x: 130,
  y: canvas.height - 50 - 50, // on top of ice
  width: 25,
  height: 50,
  color: "purple"
};

let keys = {};

document.addEventListener("keydown", (e) => keys[e.code] = true);
document.addEventListener("keyup", (e) => keys[e.code] = false);

function update() {
  if (keys["ArrowLeft"]) {
    if (player.x > 0 && player.x - 3 < companion.x - companion.width) {
      player.x -= 3;
      companion.x -= 3;
    }
  }
  if (keys["ArrowRight"]) {
    if (companion.x + companion.width < canvas.width && player.x + player.width + 3 < companion.x) {
      player.x += 3;
      companion.x += 3;
    }
  }

  // Keep them inside screen bounds
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  companion.x = Math.max(0, Math.min(canvas.width - companion.width, companion.x));
}

function drawBackground() {
  ctx.fillStyle = "#0b1d26"; // night
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#8ecae6"; // ice
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
}

function drawCharacters() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = companion.color;
  ctx.fillRect(companion.x, companion.y, companion.width, companion.height);
}

function gameLoop() {
  update();
  drawBackground();
  drawCharacters();
  requestAnimationFrame(gameLoop);
}

gameLoop();
