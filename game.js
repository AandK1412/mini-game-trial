const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

let player = {
  x: 100,
  y: 300,
  width: 20,
  height: 40,
  color: "pink" // little girl
};

let companion = {
  x: 130,
  y: 300,
  width: 25,
  height: 50,
  color: "purple" // woman
};

let keys = {};

document.addEventListener("keydown", (e) => keys[e.code] = true);
document.addEventListener("keyup", (e) => keys[e.code] = false);

function update() {
  // Move both left/right
  if (keys["ArrowLeft"]) {
    player.x -= 3;
    companion.x -= 3;
  }
  if (keys["ArrowRight"]) {
    player.x += 3;
    companion.x += 3;
  }

  // Prevent going out of bounds
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  companion.x = Math.max(0, Math.min(canvas.width - companion.width, companion.x));
}

function drawBackground() {
  // Night sky
  ctx.fillStyle = "#0b1d26";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Frozen river
  ctx.fillStyle = "#8ecae6";
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
}

function drawCharacters() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y - player.height, player.width, player.height);

  ctx.fillStyle = companion.color;
  ctx.fillRect(companion.x, companion.y - companion.height, companion.width, companion.height);
}

function gameLoop() {
  update();
  drawBackground();
  drawCharacters();
  requestAnimationFrame(gameLoop);
}

gameLoop();
