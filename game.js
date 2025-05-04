const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

let player = {
  x: 50,
  y: 300,
  width: 30,
  height: 30,
  color: "red",
  dy: 0,
  gravity: 1,
  jumpPower: -15,
  grounded: false
};

let keys = {};

document.addEventListener("keydown", (e) => keys[e.code] = true);
document.addEventListener("keyup", (e) => keys[e.code] = false);

function update() {
  // Gravity
  player.dy += player.gravity;
  player.y += player.dy;

  // Ground collision
  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.grounded = true;
  }

  // Jump
  if (keys["Space"] && player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
