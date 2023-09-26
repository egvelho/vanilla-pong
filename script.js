const table = document.getElementById("table");
const racket = document.getElementById("racket");
const ball = document.getElementById("ball");

ball.style.top = 0;
ball.style.left = 0;
racket.style.left = `${table.clientWidth / 2 - racket.clientWidth / 2}px`;
racket.style.top = `${table.clientHeight - racket.clientHeight}px`;
const tablePositions = {
  startX: 0,
  endX: table.clientWidth,
  startY: 0,
  endY: table.clientHeight,
};
const racketSpeed = 48;
const racketWidth = racket.clientWidth;
const racketHeight = racket.clientHeight;
const ballWidth = ball.clientWidth;
const ballHeight = ball.clientHeight;

const minBallPositionY = tablePositions.startY;
const maxBallDirectionY = tablePositions.endY - ballWidth;
const minBallPositionX = tablePositions.startX;
const maxBallDirectionX = tablePositions.endX - ballHeight;

const minRacketPosition = tablePositions.startX;
const maxRacketPosition = tablePositions.endX - racketWidth;

let ballSpeed = {
  x: 8,
  y: 8,
};
let ballDirection = {
  x: "right",
  y: "bottom",
};

window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    moveRacket("left");
  } else if (event.code === "ArrowRight") {
    moveRacket("right");
  }
});

setInterval(tickBall, 20);

function tickBall() {
  onRacketHit(applyRacketHitPhysics);
  moveBall();
  chooseBallDirection();
  const isGameLost = checkIsGameLost();
  if (isGameLost) {
    alert("Você perdeu!");
    location.reload();
  }
}

function getBallDirection() {
  return ballDirection;
}

function setBallDirection(nextBallDirection) {
  if (
    !["left", "right"].includes(nextBallDirection.x) ||
    !["top", "bottom"].includes(nextBallDirection.y)
  ) {
    throw new Error("Invalid ball direction");
  }

  ballDirection = nextBallDirection;
}

function moveBall() {
  const ballPosition = getBallPosition();
  const ballDirection = getBallDirection();

  let nextBallPositionX =
    ballDirection.x === "right"
      ? ballPosition.x + ballSpeed.x
      : ballPosition.x - ballSpeed.x;

  let nextBallPositionY =
    ballDirection.y === "bottom"
      ? ballPosition.y + ballSpeed.y
      : ballPosition.y - ballSpeed.y;

  if (nextBallPositionX <= minBallPositionX) {
    nextBallPositionX = minBallPositionX;
  } else if (nextBallPositionX >= maxBallDirectionX) {
    nextBallPositionX = maxBallDirectionX;
  }

  if (nextBallPositionY <= minBallPositionY) {
    nextBallPositionY = minBallPositionY;
  } else if (nextBallPositionY >= maxBallDirectionY) {
    nextBallPositionY = maxBallDirectionY;
  }

  const nextBallPosition = {
    x: nextBallPositionX,
    y: nextBallPositionY,
  };
  setBallPosition(nextBallPosition);
}

function onRacketHit(callback) {
  const isRacketHit = checkIsRacketHit();
  if (isRacketHit) {
    callback();
  }
}

function applyRacketHitPhysics() {
  const hitSpot = getRacketHitSpot();
  switch (hitSpot) {
    case "center":
      ballSpeed.x *= 0.8;
      ballSpeed.y *= 1.2;
      break;
    case "center-left":
    case "center-right":
      ballSpeed.y *= 1.1;
      ballSpeed.x *= 1.2;
      break;
    case "border-left":
    case "border-right":
      ballSpeed.y *= 0.9;
      ballSpeed.x *= 1.4;
      break;
  }
}

function getRacketHitSpot() {
  const isRacketHit = checkIsRacketHit();
  if (isRacketHit) {
    const ballPosition = getBallPosition();
    const racketPosition = getRacketPosition();
    const relativeHitSpot =
      racketPosition.x + racketWidth - ballPosition.x - ballHeight / 2;
    const hitSpot = 100 - (relativeHitSpot * 100) / racketWidth;

    if (hitSpot >= 85) {
      return "border-right";
    } else if (hitSpot >= 60) {
      return "center-right";
    } else if (hitSpot >= 40) {
      return "center";
    } else if (hitSpot > 15) {
      return "center-left";
    } else {
      return "border-left";
    }
  }
}

function chooseBallDirection() {
  const ballPosition = getBallPosition();
  let ballDirection = getBallDirection();

  if (ballPosition.y <= minBallPositionY) {
    ballDirection.y = "bottom";
  } else if (ballPosition.y >= maxBallDirectionY) {
    ballDirection.y = "top";
  }

  if (checkIsRacketHit()) {
    ballDirection.y = "top";
  }

  if (ballPosition.x <= minBallPositionX) {
    ballDirection.x = "right";
  } else if (ballPosition.x >= maxBallDirectionX) {
    ballDirection.x = "left";
  }

  setBallDirection(ballDirection);
}

function checkIsGameLost() {
  const isRacketHit = checkIsRacketHit();
  const ballPosition = getBallPosition();
  const racketPosition = getRacketPosition();
  const ballAfterRacket = ballPosition.y + ballHeight * 0.25 > racketPosition.y;
  return !isRacketHit && ballAfterRacket;
}

function checkIsRacketHit() {
  const ballPosition = getBallPosition();
  const racketPosition = getRacketPosition();
  const ballDirection = getBallDirection();

  const isBottomDirection = ballDirection.y === "bottom";
  const isNearYRacket =
    ballPosition.y + ballHeight * 0.75 - racketPosition.y > 0;
  const isNearXRacket =
    ballPosition.x + ballWidth / 2 > racketPosition.x &&
    ballPosition.x - ballWidth / 2 < racketPosition.x + racketWidth;
  return isBottomDirection && isNearYRacket && isNearXRacket;
}

function getBallPosition() {
  return {
    x: parseFloat(ball.style.left),
    y: parseFloat(ball.style.top),
  };
}

function setBallPosition(ballPosition) {
  if (
    typeof ballPosition.x !== "number" ||
    typeof ballPosition.y !== "number"
  ) {
    throw new Error("Ball coords must be numbers!");
  }
  ball.style.top = `${ballPosition.y}px`;
  ball.style.left = `${ballPosition.x}px`;
}

function getRacketPosition() {
  return {
    x: parseFloat(racket.style.left),
    y: parseFloat(racket.style.top),
  };
}

function setRacketPosition(x) {
  if (typeof x !== "number") {
    throw new Error("Racket coords must be numbers!");
  }
  racket.style.left = `${x}px`;
}

function moveRacket(direction) {
  if (direction === "left") {
    const racketPosition = getRacketPosition().x;
    const nextRacketPosition = racketPosition - racketSpeed;

    setRacketPosition(
      nextRacketPosition < minRacketPosition
        ? minRacketPosition
        : nextRacketPosition
    );
  } else if (direction === "right") {
    const racketPosition = getRacketPosition().x;
    const nextRacketPosition = racketPosition + racketSpeed;
    setRacketPosition(
      nextRacketPosition > maxRacketPosition
        ? maxRacketPosition
        : nextRacketPosition
    );
  } else {
    throw new Error("Bad direction");
  }
}
