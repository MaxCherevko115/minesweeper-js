
const cols = 50;
const rows = 50;
const qtyMines = 100;

let mapMines = [];
let time = 0;
let qtyFlags = 0;
let gameOver = false;

function generateCoordsMines(){

    const coordsMines = new Array();

    let totalMines = qtyMines;

    while(totalMines > 0){
        let col = Math.floor(Math.random() * (cols));
        let row = Math.floor(Math.random() * (rows));
        let curCoord = col + '-' + row;

        if(!coordsMines.includes(curCoord)){
            coordsMines.push(curCoord);
            totalMines--;
        }
    }
    return coordsMines;
}

function generateCell(){

    // to change size playing field 

    const placeToPlay = document.getElementById('place_to_play');

    placeToPlay.style.width = cols * 25 +'px';
    placeToPlay.style.minHeight = rows * 25 + 'px';

    // create HTML cells
    
    for(let row = 0; row < rows; row++){
        for (let col = 0; col < cols; col++) {
            let cell = document.createElement('div');
            let readyCoords = col + '-' + row;

            cell.className = 'cell';
            cell.id = readyCoords;
            cell.addEventListener('click', onClickLeft);
            cell.addEventListener('contextmenu', onClickRight);

            placeToPlay.append(cell);
        }
    }
}

function onClickLeft(){

    const cellId = this.id;
    const mines = checkCell(cellId);

    if(gameOver || this.classList.contains('flag')){
        return;
    }

    if(mines == 0){
        openEmtCells(cellId)
    }

    if(mines > 0){
        this.innerText = mines;
        this.classList.add('opened')
    }

    const openCells = document.getElementsByClassName('opened').length;

    if(openCells == rows * cols - qtyMines && !gameOver){
        win();
    }

    if(mapMines.includes(cellId)){
        loss();
    }
}

function onClickRight(element){

    element.preventDefault();

    const flags = document.getElementById('flags');

    if(gameOver || this.classList.contains('opened')) {
        return;
    }
    
    if(this.classList.toggle('flag')){
        qtyFlags--;
        flags.innerText = qtyFlags;
    }else{
        qtyFlags++;
        flags.innerText = qtyFlags;
    }
}

function checkCell(idCell){

    const coords = idCell.split('-');
    const col = parseInt(coords[0]);
    const row = parseInt(coords[1]);

    let mines = 0;

    for(let yOff = -1; yOff <= 1; yOff++){
        for(let xOff = -1; xOff <= 1; xOff++){
            let y = yOff + col;
            let x = xOff + row;

            if(y > -1 && y < cols && x > -1 && x < rows){
                mapMines.includes(y + '-' + x) ? mines++ : null;
            }
        }
    }
    return mines;
}

function openEmtCells(idCell){

    // if cell empty, to open neighborhood

    const coords = idCell.split('-');
    const col = parseInt(coords[0]);
    const row = parseInt(coords[1]);

    for(let yOff = -1; yOff <= 1; yOff++){
        for(let xOff = -1; xOff <= 1; xOff++){
            let y = yOff + col;
            let x = xOff + row;
            
            if(y > -1 && y < cols && x > -1 && x < rows){
                let idNeib = y + '-' + x;
                let cell = document.getElementById(idNeib);

                if(!mapMines.includes(cell) && !cell.classList.contains('opened') && !cell.classList.contains('flag')){
                    cell.classList.add('opened');

                    // don't output 0 and to recurs function for to open all 0
                    checkCell(idNeib) ? cell.innerText = checkCell(idNeib) : openEmtCells(idNeib);
                }
            }
        }
    }
}

function openAllMines(){

    // to open mines after lose game

    const cells = document.getElementsByClassName('cell');
    
    for(let i = 0; i < cells.length; i++){
        let cell = cells[i];

        if(mapMines.includes(cell.id)){
            !cell.classList.contains('flag') ? cell.classList.add('mine') : null;
        }else{
            cell.classList.contains('flag') ? cell.classList.add('falseFlag') : null;
        }
    }
}

function setFlags(){

    // to set flags after win game

    const cells = document.getElementsByClassName('cell');
    const flags = document.getElementById('flags');
    
    for(let i = 0; i < cells.length; i++){
        let cell = cells[i];

        if(mapMines.includes(cell.id)){
            cell.classList.add('flag');
        }
    }

    flags.innerText = 0;
}

function startTimer(){

    const timer = document.getElementById('timer');

    let seconds = 0;

    const idInterval = setInterval(function(){
        seconds++;
        timer.innerText = seconds;
    },1000);

    return idInterval;
}

function stopTimer(idInterval){

    clearInterval(idInterval);
}

function loss(){

    const message = document.getElementById('message');

    message.innerText = 'LOSE';
    gameOver = true;

    stopTimer(time);
    openAllMines();
}

function win(){

    const message = document.getElementById('message');

    message.innerText = 'WIN';
    gameOver = true;
    
    stopTimer(time);
    setFlags();
}

function reset(){

    const place_to_play = document.getElementById('place_to_play');

    while(place_to_play.firstChild){
        place_to_play.lastChild.remove();
    }
    stopTimer(time);
}

function startGame(){

    const timer = document.getElementById('timer');
    const message = document.getElementById('message');
    const flags = document.getElementById('flags');

    if(mapMines.length > 1){
        reset();
    }

    generateCell();

    time = startTimer();
    timer.innerText = 0;

    message.innerText = '';

    qtyFlags = qtyMines;
    flags.innerText = qtyFlags;

    mapMines = generateCoordsMines();
    gameOver = false;
}

