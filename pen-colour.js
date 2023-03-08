const unitLength = 30;
const boxColor = "#9494a8";
const strokeColor = "#737375";
let columns;
let rows;
let currentBoard;
let nextBoard;
let frSlider;

let pause = false;
let resetGame = document.querySelector("#reset-game");
let playPause = document.querySelector("#pause-game");

function setup() {
  noCursor();
  /* Set the canvas to be under the element #canvas*/
  const canvas = createCanvas(windowWidth * 0.9, windowHeight * 0.5);
  canvas.parent(document.querySelector("#canvas"));

  frSlider = createSlider(1, 50, 10);
  frSlider.parent(document.querySelector("#slider"));
  frSlider.size(windowHeight * 0.4, 20);

  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength);
  rows = floor((height / unitLength) * 0.95);

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }
  // Now both currentBoard and nextBoard are array of array of undefined values.
  init(); // Set the initial values of the currentBoard and nextBoard
}

/**
 * Initialize/reset the board state
 */
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
}

function draw() {
  background("#f0f0f5");
  generate();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        fill(r, g, b);
      } else {
        fill("#f0f0f5");
      }
      stroke(strokeColor);
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }
  frameRate(frSlider.value());

  fill("#000000");
  textSize(16);
  textAlign(CENTER, BOTTOM);
  text("frame rate: " + frSlider.value(), width * 0.5, height * 0.985);

  fill(boxColor);
  square(mouseX, mouseY, unitLength);
}

function generate() {
  //Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighbors = 0;
      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i == 0 && j == 0) {
            // the cell itself is not its own neighbor
            continue;
          }
          // The modulo operator is crucial for wrapping on the edge
          neighbors +=
            currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
        }
      }

      // Rules of Life
      if (currentBoard[x][y] == 1 && neighbors < 2) {
        // Die of Loneliness
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 1 && neighbors > 3) {
        // Die of Overpopulation
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 0 && neighbors == 3) {
        // New life due to Reproduction
        nextBoard[x][y] = 1;
      } else {
        // Stasis
        nextBoard[x][y] = currentBoard[x][y];
      }
    }
  }

  // Swap the nextBoard to be the current Board
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

/**
 * When mouse is dragged
 */
function mouseDragged() {
  /**
   * If the mouse coordinate is outside the board
   */
  if (
    mouseX > unitLength * columns ||
    mouseY > unitLength * rows ||
    mouseX < 0 ||
    mouseY < 0
  ) {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  currentBoard[x][y] = 1;
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);
  fill(`rgba(${r}, ${g}, ${b}, 0.4)`);
  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

/**
 * When mouse is pressed
 */
function mousePressed() {
  pause = false;
  playPause.innerHTML = "pause";
  noLoop();
  mouseDragged();
}

/**
 * When mouse is released
 */
function mouseReleased() {
  loop();
}

function mouseDragged() {
  /**
   * If the mouse coordinate is outside the board
   */
  if (
    mouseX > unitLength * columns ||
    mouseY > unitLength * rows ||
    mouseX < 0 ||
    mouseY < 0
  ) {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  currentBoard[x][y] = 1;
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);
  fill(`rgba(${r}, ${g}, ${b}, 0.4)`);
  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

// Reset the game with mouse
resetGame.addEventListener("click", function () {
  init();
});

// Play and pause the game with mouse
playPause.addEventListener("click", function () {
  pause = !pause;
  if (pause == true) {
    noLoop();
    playPause.innerHTML = "resume";
  } else if (pause == false) {
    loop();
    playPause.innerHTML = "pause";
  }
});

// Play and pause the game with keyboard
function keyTyped() {
  if (key === " ") {
    pause = !pause;
    if (pause == true) {
      noLoop();
      playPause.innerHTML = "resume";
    } else if (pause == false) {
      loop();
      playPause.innerHTML = "pause";
    }
  }
}

// Reset the game with keyboard
function keyPressed() {
  if (keyCode === BACKSPACE) {
    if (pause == true) {
      loop();
      init();
      pause = !pause;
      playPause.innerHTML = "pause";
    } else if (pause == false) {
      init();
    }
  }
}

// Resize board according to window (responsive)
function windowResized() {
  resizeCanvas(windowWidth * 0.9, windowHeight * 0.5);

  columns = floor(width / unitLength);
  rows = floor((height / unitLength) * 0.95);

  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }
  init();
}
