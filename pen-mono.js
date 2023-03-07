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

let pattern = "none";
let patternButton = document
  .querySelector("#pattern-selection")
  .addEventListener("change", (e) => {
    pattern = e.target.value;
  });

function setup() {
  noCursor();
  /* Set the canvas to be under the element #canvas*/
  const canvas = createCanvas(windowWidth * 0.9, windowHeight * 0.5);
  canvas.parent(document.querySelector("#canvas"));

  frSlider = createSlider(1, 50, 10);
  frSlider.parent(document.querySelector("#slider"));
  // frSlider.position(200, 400);
  // frSlider.position(850, 1090);
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
      // currentBoard[i][j] = Math.round(Math.random());
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
}

function draw() {
  console.log('draw')
  background("#f0f0f5");
  generate();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        // let r = Math.floor(Math.random() * 255);
        // let g = Math.floor(Math.random() * 255);
        // let b = Math.floor(Math.random() * 255);
        fill(boxColor);
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
  text("frame rate: " + frSlider.value(), width * 0.475, height * 0.985);

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
  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    return;
  }
  if (pattern != "none") {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  currentBoard[x][y] = 1;
  // let r = Math.floor(Math.random() * 255);
  // let g = Math.floor(Math.random() * 255);
  // let b = Math.floor(Math.random() * 255);
  fill(boxColor);
  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

/**
 * When mouse is pressed
 */
function mousePressed() {
  /**
   * If the mouse coordinate is outside the board
   */
  if (mouseX > unitLength * columns || mouseY > unitLength * rows || mouseX < 0 || mouseY < 0) {
    return;
  }
  noLoop();
  if (pattern != "none") {
    mouseBoxX = Math.floor(mouseX / unitLength)
    mouseBoxY = Math.floor(mouseY / unitLength)
    console.log(mouseBoxX, mouseBoxY)
    if (pattern == "1") {
      for (let i = 0; i < pattern1.length; i++){
        for (let j = 0; j < pattern1[i].length; j++){
          const newX = (mouseBoxX + i + columns) % columns
          const newY = (mouseBoxY + j + rows) % rows
          currentBoard[newX][newY] = pattern1[i][j]
          console.log(`pattern[${i}][${j}]: ${pattern1[i][j]}`)
          fill(100)
          stroke(strokeColor);
          rect(newX * unitLength, newY * unitLength, unitLength, unitLength);
        }
      }

    } else if (pattern == "2") {
      console.log("pattern: ", pattern);
    }
  } else {
    mouseDragged();
  }
}

const pattern1 = [
  [0, 0, 0, 0],
  [1, 1, 1, 1],
  [0, 0, 0, 0]
]

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
  if (mouseX > unitLength * columns || mouseY > unitLength * rows || mouseX < 0 || mouseY < 0) {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  currentBoard[x][y] = 1;
  // let r = Math.floor(Math.random() * 255);
  // let g = Math.floor(Math.random() * 255);
  // let b = Math.floor(Math.random() * 255);
  fill(boxColor);
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
  console.log("keyTyped");
  if (key === " ") {
    pause = !pause;

    if (pause == true) {
      noLoop();
    } else if (pause == false) {
      loop();
    }
  }
}

// Reset the game with keyboard
function keyPressed() {
  console.log("keypressed");
  if (keyCode === BACKSPACE) {
    console.log("backspace");
    if (pause == true) {
      loop();
      init();
      pause = !pause;
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
