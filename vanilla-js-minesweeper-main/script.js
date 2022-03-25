// declare constant settings
let settings = {
    rows: 10,
    cols: 10,
    width: 30,
    height: 30
};

let context;
// array of mines
let mines = [];
// array of clicked cells
let clickedCells = [];
// display gamegrid when window is loaded
window.onload = () => {
    let grid = document.getElementById("grid");
    context = grid.getContext("2d");
    // call the timer function
    timer();
    // call the init function
    init();
}

let x_axis;
let y_axis;
let clickedX;
let clickedY;
// add onclick event
window.onclick = (e) => {
    x_axis = e.pageX;
    y_axis = e.pageY;

    // determine which cell is clicked
    if (Math.floor(x_axis / settings.width) < settings.cols && Math.floor(y_axis / settings.height) < settings.rows) {
        clickedX = Math.floor(x_axis / settings.width);
        clickedY = Math.floor(y_axis / settings.height);
    }

    for (i in mines) {
        if (clickedX == mines[i][0] && clickedY == mines[i][1]) {
            gameEnds();
        }
    }

    // check if mine is clicked
    let mineClicked = false;
    for (let i = 0; i < 10; i++) {
        if (clickedX == mines[i][0] && clickedY == mines[i][1]) {
            mineClicked = true;
            gameEnds();
        }
    }
    if (mineClicked == false && x_axis < settings.rows * settings.width && y_axis < settings.cols * settings.height) {
        let clickedTotal = rightClickedCells.length + clickedCells.length;
        console.log(clickedTotal);
        if (clickedTotal == 100) {
            won();
        }
        gameContinue(clickedX, clickedY);
    }
}

// add a right-click event
let rightClickedX;
let rightClickedY;
let rightClickedCells = [];
let rightClicks = 0;
window.oncontextmenu = (e) => {
    e.preventDefault();

    x_axis = e.pageX;
    y_axis = e.pageY;
    // determine which cell is clicked
    if (Math.floor(x_axis / settings.width) < settings.cols && Math.floor(y_axis / settings.height) < settings.rows) {
        rightClickedX = Math.floor(x_axis / settings.width);
        rightClickedY = Math.floor(y_axis / settings.height);
    }

    let inRClickedCells = [false, 0];
    for (i in rightClickedCells) {
        if (rightClickedCells[i][0] == rightClickedX && rightClickedCells[i][1] == rightClickedY) {
            inRClickedCells = [true, i];
        }
    }
    if (inRClickedCells[0] == false) {
        if (rightClicks.length < 10) {
            // rightClicks++;
            let n = rightClickedCells.length;
            rightClickedCells[n] = [];
            rightClickedCells[n][0] = rightClickedX;
            rightClickedCells[n][1] = rightClickedY;

            let clickedTotal = rightClickedCells.length + clickedCells.length;
            console.log(clickedTotal);
            if (clickedTotal == 100) {
                won();
            }
        }
    } else {
        rightClickedCells.splice(inRClickedCells[1], 1);
        // rightClicks--;
    }

    drawGrid();

}

let cell;
let num;
let zero;
let flag;
// initiate the game
function init() {
    cell = new Image();
    cell.src = "imgs/start.png";
    // for each mine, will excute 10 times
    for (let i = 0; i < 10; i++) {
        mines[i] = [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10)
        ]
    }
    drawGrid();
}

// Set timer
let time = 0;

function timer() {
    setTimeout(() => {
        let timerDiv = document.getElementById("timer");
        time++;
        timerDiv.innerHTML = time + "s";
        timer();
    }, 1000)
}

// redraw grid when game is refreshed
function drawGrid() {
    // draw image
    cell.onload = () => {
            context.clearRect(0, 0, 400, 400);
            // for each row in the grid
            for (let i = 0; i < settings.rows; i++) {
                // for each column in a row
                for (let j = 0; j < settings.cols; j++) {
                    let x = j * settings.width;
                    let y = i * settings.height;

                    let hasBeenClicked = [0, false];

                    if (clickedCells.length > 0) {
                        for (let k = 0; k < clickedCells.length; k++) {
                            if (clickedCells[k][0] == j && clickedCells[k][1] == i) {
                                hasBeenClicked = [k, true];
                            }
                        }
                    }

                    if (hasBeenClicked[1] == true) {
                        if (clickedCells[(hasBeenClicked[0])][2] > 0) {
                            num = new Image();
                            num.onload = () => {
                                context.drawImage(num, x, y);
                            }
                            num.src = "imgs/open.png";
                        } else {
                            zero = new Image();
                            zero.onload = () => {
                                context.drawImage(zero, x, y);
                            }
                            zero.src = "imgs/mine.png";
                        }
                    } else {
                        let rightBeenClicked = [0, false];
                        if (rightClickedCells.length > 0) {
                            for (let k = 0; k < rightClickedCells.length; k++) {
                                if (rightClickedCells[k][0] == j && rightClickedCells[k][1] == i) {
                                    rightBeenClicked = [k, true];
                                }
                            }
                        }
                        if (rightBeenClicked[1] == true) {
                            flag = new Image();
                            flag.onload = () => {
                                context.drawImage(flag, x, y);
                            }
                            flag.src = "imgs/flag.png";
                        } else {
                            context.drawImage(cell, x, y);
                        }
                    }

                }
            }
        }
        // number of mines surrounding a box
    for (let i in clickedCells) {
        if (clickedCells[i][2] > 0) {
            context.font = "20px arial";
            context.fillText(clickedCells[i][2], clickedCells[i][0] * settings.width + 9, clickedCells[i][1] * settings.height + 21);
        }

    }
}

// function to end game
function gameEnds() {
    console.log("Shame, You Lost!!!");
    newGame();
}

// win function
function won() {
    console.log("Cheers, You Won...");
}

// start a new game
function newGame() {
    mines = [];
    clickedCells = [];
    time = 0;
    init();
}

// function to continue game
function gameContinue(x, y) {
    // cells neighboring the clicked cell
    let adjacentCells = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0]
    ];
    // loop through array to check for any adjacent mine
    let adjacentMines = 0;
    for (i in adjacentCells) {
        for (let j = 0; j < 10; j++) {
            if (checkMine(j, x + adjacentCells[i][0], y + adjacentCells[i][1]) == true) {
                adjacentMines++;
            }
        }
    }

    for (k in rightClickedCells) {
        if (rightClickedCells[k][0] == x && rightClickedCells[k][1] == y) {
            rightClickedCells.splice(k, 1);
        }
    }

    let clicked = false;
    for (k in clickedCells) {
        if (clickedCells[k][0] == x && clickedCells[k][1] == y) {
            clicked = true;
        }
    }
    // add a clicked cell to list of clicked cells
    if (clicked == false) {
        clickedCells[(clickedCells.length)] = [x, y, adjacentMines];
    }

    if (adjacentMines == 0) {
        for (i in adjacentCells) {
            if (x + adjacentCells[i][0] >= 0 && x + adjacentCells[i][0] <= 9 && y + adjacentCells[i][1] >= 0 && y + adjacentCells[i][1] <= 9) {
                let x1 = x + adjacentCells[i][0];
                let y1 = y + adjacentCells[i][1];

                let alreadyClicked = false;
                for (j in clickedCells) {
                    if (clickedCells[j][0] == x1 && clickedCells[j][1] == y1) {
                        alreadyClicked = true;
                    }
                }
                if (alreadyClicked == false) {
                    gameContinue(x1, y1);
                }
            }
        }
    }
    // call the grid function
    drawGrid();
}

// check for any adjacent mines
function checkMine(i, x, y) {
    if (mines[i][0] == x && mines[i][1] == y) {
        return true;
    } else {
        return false;
    }
}