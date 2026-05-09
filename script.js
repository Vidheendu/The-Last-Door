const startBtn = document.getElementById("startBtn");
const introScreen = document.getElementById("introScreen");
const gameArea = document.getElementById("gameArea");
const timerDisplay = document.getElementById("timer");
const messageBox = document.getElementById("messageBox");
const codeBox = document.getElementById("codeBox");
const codeInput = document.getElementById("codeInput");
const unlockBtn = document.getElementById("unlockBtn");

const successScreen = document.getElementById("successScreen");
const failureScreen = document.getElementById("failureScreen");

const terminal = document.getElementById("terminal");
const file = document.getElementById("file");
const screenObj = document.getElementById("screenObj");
const door = document.getElementById("door");
const hiddenClue = document.getElementById("hiddenClue");

const flashlight = document.querySelector(".flashlight");

const clickSound = document.getElementById("clickSound");
const successSound = document.getElementById("successSound");
const errorSound = document.getElementById("errorSound");

let level = 1;
let totalSeconds = 300;
let gameStarted = false;
let health = 100;

let level1Code;
let level2Code;
let finalCode;

function generateCodes(){

    const codes = ["2719","4832","6154"];
    const laserCodes = ["7313","1737","3177"];
    const aiCodes = ["0451","9912","1107"];

    level1Code =
    codes[Math.floor(Math.random()*codes.length)];

    level2Code =
    laserCodes[Math.floor(Math.random()*laserCodes.length)];

    finalCode =
    aiCodes[Math.floor(Math.random()*aiCodes.length)];
}
const exitBtn =
document.getElementById("exitBtn");
startBtn.addEventListener("click",()=>{

    generateCodes();

    loadGame();

    introScreen.classList.add("hidden");
    gameArea.classList.remove("hidden");

    gameStarted = true;

    loadLevel();

});

function loadLevel(){

    codeInput.value = "";

    if(level === 1){

        typeMessage(
        "LEVEL 1: Find the hidden access code."
        );

    }

    else if(level === 2){

        roomLevel2();

    }

    else if(level === 3){

        roomLevel3();

    }

}

terminal.addEventListener("click",()=>{

    clickSound.play();

    if(level === 1){

        typeMessage(
        `Terminal: code starts with ${level1Code[0]} and ${level1Code[1]}`
        );

        document.getElementById("slot1").innerHTML = "💾";

    }

});

file.addEventListener("click",()=>{

    clickSound.play();

    if(level === 1){

        typeMessage(
        `File: code ends with ${level1Code[2]} and ${level1Code[3]}`
        );

        document.getElementById("slot2").innerHTML = "📄";

    }

});

screenObj.addEventListener("click",()=>{

    clickSound.play();

    if(level === 1){

        typeMessage("Security system active.");

    }

});

hiddenClue.addEventListener("click",()=>{

    typeMessage("SECRET MESSAGE FOUND");

    document.getElementById("slot3").innerHTML = "🔑";

});

function roomLevel2(){

    typeMessage("LEVEL 2: Decode laser sequence.");

    terminal.onclick = () => {

        typeMessage(
        "BLUE = 7 | RED = 3 | GREEN = 1"
        );

    };

    file.onclick = () => {

        typeMessage(
        "Laser order: BLUE RED GREEN RED"
        );

    };

    screenObj.onclick = () => {

        typeMessage(
"Translate the color sequence into numbers."
);

    };

}

function roomLevel3(){

    typeMessage("LEVEL 3: Override the AI.");

    terminal.onclick = () => {

        typeMessage(
        "The protocol starts with 0..."
        );

    };

    file.onclick = () => {

        typeMessage(
        "Only the hidden protocol stops the AI."
        );

    };

    screenObj.onclick = () => {

        typeMessage(
        "Override the AI"
        );

    };

}

door.addEventListener("click",()=>{

    codeBox.classList.remove("hidden");

});

unlockBtn.addEventListener("click",()=>{

    const code = codeInput.value.trim();

    if(level === 1 && code === level1Code){

        nextLevel();

    }

    else if(level === 2 && code === level2Code){

        nextLevel();

    }

    else if(level === 3 && code === finalCode){

        successSound.play();

        typeMessage("Door opening...");

        door.classList.add("door-open");

        document.querySelector(".door-light")
        .style.background = "lime";

        setTimeout(()=>{

            gameArea.classList.add("hidden");
            successScreen.classList.remove("hidden");

            localStorage.removeItem("escapeGame");

        },2500);

    }

    else{

        wrongAnswerEffect();

    }

});

function nextLevel(){

    level++;

    saveGame();

    const rooms =
    document.querySelectorAll(".map-room");

    rooms.forEach(room =>
    room.classList.remove("active-room"));

    rooms[level - 1].classList.add("active-room");

    typeMessage("LEVEL COMPLETE");

    setTimeout(()=>{

        loadLevel();

    },1500);

}

function wrongAnswerEffect(){

    errorSound.play();

    document.body.classList.add("shake");

    setTimeout(()=>{

        document.body.classList.remove("shake");

    },300);

    totalSeconds -= 10;

    takeDamage(20);

    typeMessage("ACCESS DENIED");

}

function takeDamage(amount){

    health -= amount;

    if(health < 0){
        health = 0;
    }

    document.getElementById("healthBar")
    .style.width = health + "%";

    if(health <= 0){

        gameArea.classList.add("hidden");
        failureScreen.classList.remove("hidden");

    }

}

function typeMessage(text){

    messageBox.innerHTML = "";

    let index = 0;

    const typing = setInterval(()=>{

        messageBox.innerHTML += text.charAt(index);

        index++;

        if(index >= text.length){

            clearInterval(typing);

        }

    },20);

}

function saveGame(){

    const gameData = {

        level,
        totalSeconds,
        health

    };

    localStorage.setItem(
    "escapeGame",
    JSON.stringify(gameData)
    );

}

function loadGame(){

    const saved =
    localStorage.getItem("escapeGame");

    if(saved){

        const data = JSON.parse(saved);

        level = data.level;
        totalSeconds = data.totalSeconds;
        health = data.health;

        document.getElementById("healthBar")
        .style.width = health + "%";

    }

}

document.addEventListener("mousemove",(e)=>{

    flashlight.style.left = e.clientX + "px";
    flashlight.style.top = e.clientY + "px";

});

const countdown = setInterval(()=>{

    if(!gameStarted) return;

    totalSeconds--;

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    timerDisplay.textContent =
    `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;

    if(totalSeconds <= 0){

        gameArea.classList.add("hidden");
        failureScreen.classList.remove("hidden");

    }

},1000);

exitBtn.addEventListener("click",()=>{

    const confirmExit =
    confirm("Exit the game?");

    if(confirmExit){

        localStorage.removeItem("escapeGame");

        location.reload();

    }

});