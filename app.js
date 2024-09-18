document.addEventListener("DOMContentLoaded", function(){
    const gameArena = document.querySelector("#game-arena");
    const cellSize = 20;
    const arenaSize = 600;
    const cellCount = arenaSize/cellSize;
    let score = 0;
    let isGameStarted = false; 
    let food = {x : 15*cellSize, y : 20*cellSize}; // coordinates of food 
    let snake = [{x:15*cellSize , y:4*cellSize},{x:15*cellSize , y:3*cellSize},{x:15*cellSize , y:2*cellSize}];
    let initialSnake = [{x:15*cellSize , y:4*cellSize},{x:15*cellSize , y:3*cellSize},{x:15*cellSize , y:2*cellSize}];
    let initialFood = {x : 15*cellSize, y : 20*cellSize};
    let gameSpeed = 200;
    let loopid;

    let dx = 0;
    let dy = cellSize;

    //  cellsize -> in + direction
    //  -cellsize -> in - direction

    function generateFoodCoordinates(){
        do{
            const xCordinate = Math.floor(Math.random() * cellCount);
            const yCordinate = Math.floor(Math.random() * cellCount);
            food.x = xCordinate*cellSize;
            food.y = yCordinate*cellSize;
        }while(checkfoodPosition());
    }


    function isGameOver(){
        //  if hits body
        const snakeHead = snake[0];
        for(let i = 1; i < snake.length; i++){
            if(snakeHead.x == snake[i].x && snakeHead.y == snake[i].y){
                return true;
            }
        }
        //  if hits walls
        if(snakeHead.x >= 600 || snakeHead.y >= 600 || snakeHead.x < 0 || snakeHead.y < 0){
            return true;
        }
    }
    function checkfoodPosition(){
        for(let i = 0 ; i < snake.length; i++){
            if(food.x == snake[i].x && food.y == snake[i].y){
                true;
                break;
            }
        }
    }
    function updateSnake(){
        let newHead = {x : snake[0].x+dx, y : snake[0].y + dy};
        let scoreBoard = document.querySelector('#score-board');
        snake.unshift(newHead);
        if(newHead.x == food.x && newHead.y == food.y){
            score += 10;
            if(gameSpeed > 50){
                clearInterval(loopid);
                gameSpeed -= 5;
                moveSnake();
            }
            generateFoodCoordinates();
            drawFoodAndSnake('food');
            scoreBoard.textContent = `Score : ${score}`;
        }else{
            snake.pop();
        }
        if(isGameOver()){
            isGameStarted = false;
            gameArena.innerHTML = "";
            let startButton = document.querySelector('.start-button');
            startButton.style.display = "block";
            scoreBoard.textContent = 
            `Game Over !! \n
            Score : ${score}`;
            score = 0;
            return;
        }
    }

    function moveSnake(){
        loopid = setInterval(()=>{
            if(isGameStarted == false){
                clearInterval(loopid);
                return;
            }
            updateSnake();
            drawFoodAndSnake()
        },gameSpeed);
    }

    function changeDirection(e){
        if(e.code == "ArrowUp"){
            if(dx != cellSize){
                dy = 0;
                dx = -cellSize;
            }
        }else if(e.code == "ArrowDown"){
            if(dx != -cellSize){
                dy = 0;
                dx = cellSize;
            }
        }else if(e.code == "ArrowLeft"){
            if(dy != cellSize){
                dx = 0;
                dy = -cellSize;
            }
        }else if(e.code == "ArrowRight"){
            if(dy != -cellSize){
                dx = 0;
                dy = cellSize;
            }
        }
    }

    function drawDiv(x, y, itemClass){
        const divElement = document.createElement('div');
        divElement.classList.add(itemClass);
        divElement.style.top = `${x}px`;
        divElement.style.left = `${y}px`;
        return divElement;
    }

    function drawFoodAndSnake(){
        gameArena.innerHTML = ''; // reset the arena to draw from scratch
        const foodElement = drawDiv(food.x, food.y, 'food');
        gameArena.appendChild(foodElement);

        snake.forEach((snakeCell)=>{
            const snakeElement = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(snakeElement);
        });
    }

    function runGame(){
        if(!isGameStarted){
            isGameStarted = true;
            document.addEventListener('keydown',changeDirection);
            // gameloop(); // to be implemented
            drawFoodAndSnake();
            moveSnake();
        }
    }

    function buildGame(){
        const scoreBoard = document.createElement('div');
        scoreBoard.id = "score-board";
        scoreBoard.textContent = `Score : ${score}`;
        document.body.insertBefore(scoreBoard,gameArena);

        const startButton = document.createElement('div');
        startButton.textContent = "Start Game";
        startButton.classList.add('start-button');
        document.body.appendChild(startButton);

        startButton.addEventListener('click',function startGame(){
            startButton.style.display = 'none';
            snake = JSON.parse(JSON.stringify(initialSnake));
            dx = 0;
            dy = cellSize;
            score = 0;
            food = { ...initialFood };
            gameSpeed = 200;
            scoreBoard.textContent = `Score : ${score}`;
            runGame();
        });
    }
    buildGame();
});