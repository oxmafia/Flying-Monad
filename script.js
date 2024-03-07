document.addEventListener('DOMContentLoaded', function () {
    // Add a click/tap event listener to the body
    document.body.addEventListener('click', function () {
        // Simulate the spacebar key press
        simulateSpacebarPress();
        console.log("flying");
    });

    // Function to simulate the spacebar key press
    function simulateSpacebarPress() {
        // Create a new KeyboardEvent for the 'keydown' event with the 'Space' key
        var spaceKeyEvent = new KeyboardEvent('keydown', {
            key: ' ',
            code: 'Space',
            which: 32,
            keyCode: 32,
            bubbles: true
        });

        // Dispatch the event to simulate the spacebar key press
        document.dispatchEvent(spaceKeyEvent);
    }
});




// Game variables
var canvas = document.getElementById("gameCanvas");
var retryButton = document.getElementById("retryButton");
var ctx = canvas.getContext("2d");
var birdX = 50;
var birdY = canvas.height / 2;
var birdSpeedY = 0;
var gravity = 0.075;
var jumpForce = 2;
var obstacles = [];
var obstacleWidth = 50;
var minGapHeight = 100;
var maxGapHeight = 200;
var obstacleSpeedX = 1.5;
var score = 0;
var isGameOver = false;

// Keyboard event listeners
document.addEventListener("keydown", jump);

retryButton.addEventListener("click", restartGame);

// Update game objects
function update() {
  if (!isGameOver) {
    // Move the bird
    birdSpeedY += gravity;
    birdY += birdSpeedY;

    // Move and generate obstacles
    for (var i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].x -= obstacleSpeedX;

      // Check collision with the obstacle
      if (
        birdX + 40 > obstacles[i].x &&
        birdX < obstacles[i].x + obstacleWidth &&
        (birdY < obstacles[i].topHeight ||
          birdY + 30 > obstacles[i].topHeight + obstacles[i].gapHeight)
      ) {
        gameOver();
        return;
      }

      // Increase score if bird passes the obstacle
      if (birdX > obstacles[i].x + obstacleWidth && !obstacles[i].scored) {
        obstacles[i].scored = true;
        score++;
      }

      // Remove obstacles that are off-screen
      if (obstacles[i].x + obstacleWidth < 0) {
        obstacles.splice(i, 1);
      }
    }

    // Generate new obstacles
    if (
      obstacles.length === 0 ||
      obstacles[obstacles.length - 1].x < canvas.width - 200
    ) {
      var gapHeight = Math.floor(
        Math.random() * (maxGapHeight - minGapHeight + 1) + minGapHeight
      );
      var topHeight = Math.floor(Math.random() * (canvas.height - gapHeight));
      var bottomY = topHeight + gapHeight;
      obstacles.push({
        x: canvas.width,
        topHeight: topHeight,
        gapHeight: gapHeight,
        bottomY: bottomY,
        scored: false
      });
    }

    // Game over if bird touches the ground or goes off-screen
    if (birdY + 50  > canvas.height || birdY < 0) {
      gameOver();
    }
  }
}

// Render game objects
function render() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the bird
 // Load the GIF image
 var birdImage = new Image();
 birdImage.src = 'pepe.png'; // Replace with the actual path to your GIF image
 ctx.drawImage(birdImage, birdX, birdY, 50, 50);
 


  // Draw the obstacles
  ctx.fillStyle = "#da37ff";
  for (var i = 0; i < obstacles.length; i++) {
    ctx.fillRect(obstacles[i].x, 0, obstacleWidth, obstacles[i].topHeight);
    ctx.fillRect(
      obstacles[i].x,
      obstacles[i].topHeight + obstacles[i].gapHeight,
      obstacleWidth,
      canvas.height - obstacles[i].topHeight - obstacles[i].gapHeight
    );
  }

  // Draw the score
  ctx.fillStyle = "white";
  ctx.fillRect(6,11, 120, 23);

  ctx.fillStyle = "purple";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  // Game over text
  if (isGameOver) {
    ctx.fillStyle = "white";
    ctx.fillRect( canvas.width / 2 - 100, canvas.height / 2, 200, 50);

    ctx.fillStyle = "black";
    ctx.font = "36px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 100, (canvas.height / 2)+36);
    retryButton.style.display = "block";
  } else {
    retryButton.style.display = "none";
  }
}

// Game loop
function gameLoop() {
  update();
  render();

  if (!isGameOver) {
    requestAnimationFrame(gameLoop);
  }
}

// Start the game loop
gameLoop();

// Handle jump event
function jump(event) {
  console.log("event", event);
  if (event.key === " ") {
    birdSpeedY = -jumpForce;
  }
}

// Game over logic
function gameOver() {
  isGameOver = true;
}

// Restart the game
function restartGame() {
  isGameOver = false;
  birdY = canvas.height / 2;
  birdSpeedY = 0;
  score = 0;
  obstacles = [];
  retryButton.style.display = "none";
  gameLoop();
}
