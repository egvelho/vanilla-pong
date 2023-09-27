const screen = document.getElementById("screen");
const table = document.getElementById("table");
const ball = document.getElementById("ball");
const racket = document.getElementById("racket");

const tableWidth = table.clientWidth;
const tableHeight = table.clientHeight;

const racketWidth = racket.clientWidth;
const racketHeight = racket.clientHeight;

const ballWidth = ball.clientWidth;
const ballHeight = ball.clientHeight;

const racketSpeed = 48;
let ballSpeed = 32;

const racketMaxRight = tableWidth - racketWidth;
const racketMaxLeft = 0;

const ballMaxTop = 0;
const ballMaxBottom = tableHeight - ballHeight;
const ballMaxLeft = 0;
const ballMaxRight = tableWidth - ballWidth;

const initialRacketX = tableWidth / 2 - racketWidth / 2;
const initialRacketY = tableHeight - racketHeight;

const initialBallX = 0;
const initialBallY = 0;

let ballDirection = {
  x: "right",
  y: "bottom",
};

let score = 0;

setRacketPosition(initialRacketX, initialRacketY);
setBallPosition(initialBallX, initialBallY);

window.onkeydown = function (event) {
  if (event.code === "ArrowLeft") {
    moveRacket("left");
  } else if (event.code === "ArrowRight") {
    moveRacket("right");
  }
};

setInterval(gameTick, 100);

function gameTick() {
  chooseBallDirection();
  moveBall();
  gameOver();
  updateScore();
}

function gameOver() {
  const isGameOver = checkIsGameOver();
  if (isGameOver) {
    alert("Você perdeu! Pontuação: " + score);
    location.reload();
  }
}

function updateScore() {
  const isRacketHit = checkIsRacketHit();
  if (isRacketHit) {
    ballSpeed *= 1.1;
    score++;
  }
}

function checkIsGameOver() {
  const isRacketHit = checkIsRacketHit();
  const ballPosition = getBallPosition();
  if (!isRacketHit && ballPosition.y >= ballMaxBottom) {
    return true;
  } else {
    return false;
  }
}

function checkIsRacketHit() {
  const ballPosition = getBallPosition();
  const racketPosition = getRacketPosition();

  const isNearX =
    ballPosition.x > racketPosition.x - ballWidth * 0.75 &&
    ballPosition.x < racketPosition.x + racketWidth + ballWidth * 0.75;
  const isNearY = ballPosition.y + ballHeight - racketPosition.y > 0;

  return isNearX && isNearY && ballDirection.y === "bottom";
}

function moveBall() {
  let ballPosition = getBallPosition();

  if (ballDirection.x === "right") {
    const nextBallX = ballPosition.x + ballSpeed;
    ballPosition.x = nextBallX > ballMaxRight ? ballMaxRight : nextBallX;
  } else if (ballDirection.x === "left") {
    const nextBallX = ballPosition.x - ballSpeed;
    ballPosition.x = nextBallX < ballMaxLeft ? ballMaxLeft : nextBallX;
  }

  if (ballDirection.y === "top") {
    const nextBallY = ballPosition.y - ballSpeed;
    ballPosition.y = nextBallY < ballMaxTop ? ballMaxTop : nextBallY;
  } else if (ballDirection.y === "bottom") {
    const nextBallY = ballPosition.y + ballSpeed;
    ballPosition.y = nextBallY > ballMaxBottom ? ballMaxBottom : nextBallY;
  }

  setBallPosition(ballPosition.x, ballPosition.y);
}

function chooseBallDirection() {
  let ballPosition = getBallPosition();

  if (ballPosition.x >= ballMaxRight) {
    ballDirection.x = "left";
  } else if (ballPosition.x <= ballMaxLeft) {
    ballDirection.x = "right";
  }

  if (checkIsRacketHit()) {
    ballDirection.y = "top";
  } else if (ballPosition.y >= ballMaxBottom) {
    ballDirection.y = "top";
  } else if (ballPosition.y <= ballMaxTop) {
    ballDirection.y = "bottom";
  }
}

function moveRacket(direction) {
  const racketPosition = getRacketPosition();

  if (direction === "left") {
    const nextRacketX = racketPosition.x - racketSpeed;
    setRacketPosition(
      nextRacketX < racketMaxLeft ? racketMaxLeft : nextRacketX,
      racketPosition.y
    );
  } else if (direction === "right") {
    const nextRacketX = racketPosition.x + racketSpeed;
    setRacketPosition(
      nextRacketX > racketMaxRight ? racketMaxRight : nextRacketX,
      racketPosition.y
    );
  } else {
    throw new Error("Invalid racket position");
  }
}

function setBallPosition(x, y) {
  ball.style.top = y + "px";
  ball.style.left = x + "px";
}

function getBallPosition() {
  return {
    x: parseFloat(ball.style.left),
    y: parseFloat(ball.style.top),
  };
}

function setRacketPosition(x, y) {
  racket.style.top = y + "px";
  racket.style.left = x + "px";
}

function getRacketPosition() {
  return {
    x: parseFloat(racket.style.left),
    y: parseFloat(racket.style.top),
  };
}
