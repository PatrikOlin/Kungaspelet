/* TODO: Spara scorelistan i en cookie */

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var screenFade = document.getElementById("screenFade");
var menu = document.getElementById("main-nav");
var menuLinks = menu.getElementsByClassName("menu-link");
var startScreen = document.getElementById("startScreen");

var x;
var y;
var r = 100;

var imgX;
var imgY;

var spotX;
var spotY;

var currentImg;
var prevImg = 0;

var timeLimit;
var timeLeft;
var timeHandler;
var movesMade;
var controlsLocked = true;

var gameMode;

var score;
var highscores;
var gameResult = {};

var images = [];

var gameMode = 0;

function init(gamemode = gameMode) {
  startScreen.style.display = "none";
  screenFade.style.display ="none";
  controlsLocked = true;
  timeLimit = 30;
  startTimer(timeLimit);
  gameMode = gamemode;
  console.log("gamemode: " + gameMode);
  fetchHighscoreFromLocalStorage();
  console.log("retrieved Highscores: ", highscores);
  displayHighscoreList(highscores, gameMode);
  document.getElementById("gameOverScreen").style.display = "none";
  window.addEventListener("resize", resizeCanvas, false);
  window.addEventListener("orientationchange", resizeCanvas, false);
  window.onkeydown = controller;
  score = 0;
  document.getElementById("scoreCounter").innerHTML = "Poäng: " + score;
  serveNewImage();
  screenFade.style.display = "none";
}

for(var i = 0; i < menuLinks.length; i++) {
  menuLinks[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

function toggleGameMode(mode) {
  if (mode == 0) {
    gameMode = 0;
  } else if (mode == 1) {
    gameMode = 1;
  }
  init();
}

function preload() {
  for (var i = 0; i < arguments.length; i++) {
    images[i] = new Image();
    images[i].src = preload.arguments[i];
  }
}

// Hämtar tidigare highscores ur localstorage och parsar JSONen till en array,
function fetchHighscoreFromLocalStorage() {
  if (localStorage.getItem("highscores")) {
    highscores = JSON.parse(localStorage.getItem("highscores"));
  } else {
    highscores = [];
  }
}

function timer() {
  var countdown = document.getElementById("countdownTimer");

  if (timeLeft == 0) {
    clearInterval(timeHandler);
    countdown.innerHTML = "Slut på tid!";
    handleGameOver();
  } else {
    countdown.innerHTML = timeLeft + " sekunder kvar";
    timeLeft--;
  }
}

function startTimer(seconds) {
  timeLeft = seconds;
  clearInterval(timeHandler);
  timeHandler = setInterval(timer, 1000);
}

function handleGameOver() {
  controlsLocked = true;

  var gameOverScreen = document.getElementById("gameOverScreen");
  var gameOverScore = document.getElementById("gameOverScore");
  document.getElementById("highscoreEntry").reset();
  document.getElementById("submitHighScore").disabled = false;
  document.getElementById("initials").disabled = false;
  screenFade.style.display = "block";
  gameOverScreen.style.display = "block";
  gameOverScore.innerHTML = score;
}

function openStartMenu(){
  controlsLocked = true;

  var settingsScreen = document.getElementById("startScreen");
  screenFade.style.display = "block";
  settingsScreen.style.display = "block";
}

function closeStartMenu() {
  controlsLocked = false;

  document.getElementById("startScreen").style.display="none";
  screenFade.style.display="none";
}

function clearHighscores() {
  window.localStorage.clear();
  highscores = [];
  displayHighscoreList(highscores, gameMode);
}

function addToHighScore() {
  var initials = document.getElementById("initials").value;
  gameResult = {
    mode: gameMode,
    name: initials,
    pts: score
  };

  highscores.push(gameResult);

  highscores.sort(function(a, b) {
    return b.pts - a.pts;
  });

  if (highscores.length > 20) {
    highscores.length = 20;
  }
  // Konverterar vår highscores-array till en JSON-sträng och sparar den i localStorage
  localStorage.setItem("highscores", JSON.stringify(highscores));

  displayHighscoreList(highscores, gameMode);
  document.getElementById("highscoreEntry").reset();
  document.getElementById("submitHighScore").disabled = true;
  document.getElementById("initials").disabled = true;
}

function displayHighscoreList(arr, gameMode) {
  var scoreList = document.getElementById("scoreList");
  var li;

  // Filtrerar vår highscore-lista så att bara dom scores som gäller det aktuella game modet visas.
  // (När man spelar puzzle mode så ska inte high scores för chase mode visas, och vice versa)
  var HighScoresToDisplay = arr.filter(val => {
    return val.mode == gameMode;
  });

  //Först tar vi bort alla li-element som finns i listan
  while (scoreList.firstChild) {
    scoreList.removeChild(scoreList.firstChild);
  }

  // sedan skriver vi ut vår array med highscores som li-element i listan
  // för att få allting sorterat och utan dubletter.
  HighScoresToDisplay.forEach(function(item) {
    if (Array.isArray(item)) {
      return;
    }
    li = document.createElement("li");
    li.appendChild(
      document.createTextNode(item.name + " ––– " + item.pts + " pts")
    );
    scoreList.appendChild(li);
  });
}

/* function addTime(seconds) {
  if (timeLimit == 0) {
    resetTimer(5);
  } else {
    timeLimit = timeLimit + seconds;
  }
  console.log(timeLimit);
  document.getElementById("countdownTimer").innerHTML =
    timeLimit + " sekunder kvar";
} */



function serveNewImage() {
  controlsLocked = true;
  resizeCanvas();

  preload(
    "assets/img/grodhatten.jpg",
    "assets/img/aelghatten.jpg",
    "assets/img/vikingahatten.jpg",
    "assets/img/rastahatten.jpg",
    "assets/img/regnhatten.jpg",
    "assets/img/vikingahatten-2.jpg",
    "assets/img/soldathatten.jpg",
    "assets/img/tjyvhatten.jpg",
    "assets/img/fedoran.jpg",
    "assets/img/krigsbaskern.jpg",
    "assets/img/silverhatten.jpg",
    "assets/img/bygghatten.jpg"
  );
  /*   document.fonts.ready.then(_ => {
    setTimeout(_ => markTheSpot(spotX, spotY), 500)
  }); */
  
  markTheSpot(spotX, spotY);  
  shuffleImage();

  movesMade = 0;
  if (gameMode == 0) {
    timeLimit = 30;
    startTimer(timeLimit);
  } else if (gameMode == 1) {
    if (timeLimit <= 5) {
      handleGameOver();
    } else {
      startTimer(timeLimit);
      timeLimit = timeLimit - 5;
    }
  }
}

function markTheSpot(newSpotX, newSpotY) {
  ctx.font = '900 30px "Font Awesome 5 Free"';
  ctx.fillStyle = "#A71554";
  ctx.fillText("\uf521", newSpotX, newSpotY);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ställer in storleken på canvas utifrån fönstrets storlek. Märkte att man inte kunde ändra den direkt i CSSen, eftersom
// att canvas har två storlekar, och ökar man storleken i CSSen så blir innehållet bara uppskalat (1 px blir uppskalad och ser lågupplöst ut)
function resizeCanvas() {
  if (window.innerWidth < 800) {
    canvas.width = window.innerWidth * 0.8;
  } else {
    canvas.width = window.innerWidth * 0.6;
  }

  canvas.height = window.innerHeight * 0.6;
  x = canvas.width / 2;
  y = canvas.height / 2;
}

// Funktion som gör den superläskiga matten för att kolla om kronan finns inom viewporten/titthålet/cirkeln,
// dvs kollar om radien är mindre än avståndet mellan viewportens mittpunkt och kronans position.
function checkIfCrownFound() {
  x0 = canvas.width / 2;
  y0 = canvas.height / 2;
  x1 = spotX;
  y1 = spotY;
  if (Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)) < r) {
    console.log("Kronan hittad!");
    return true;
  } else {
    return false;
  }
}

function shuffleImage() {
  do {
    currentImg = images[Math.floor(Math.random() * images.length)];
  } while (prevImg.src == currentImg.src);
  prevImg = currentImg;
  currentImg.onload = function() {
    imgX = currentImg.width / 2;
    imgY = currentImg.height / 2;
    spotX = getRandomInt(75, currentImg.width - 75);
    spotY = getRandomInt(50, currentImg.height - 50);
    ctx.save();
    ctx.drawImage(currentImg, x - imgX, y - imgY);
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    movesMade = 0;
    checkIfCrownFound();
    controlsLocked = false;
  }; 
}

function moveImage(spotX, spotY) {
  movesMade++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.drawImage(currentImg, x - imgX, y - imgY);
  markTheSpot(spotX, spotY);
  ctx.globalCompositeOperation = "destination-in";
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  checkIfCrownFound();
}

function controller(e) {
  const key = event.key || e.target.id;
  console.log(key);

  if (!controlsLocked) {
    switch (key) {
      case "ArrowUp":
      case "w":
        if (y >= currentImg.height - 95) {
          break;
        } else {
          y = y + 5;
          spotY = spotY + 5;
          moveImage(spotX, spotY);
        }

        break;

      case "ArrowDown":
      case "s":
        if (y <= 105) {
          y = y;
        } else {
          y = y - 5;
          spotY = spotY - 5;
          moveImage(spotX, spotY);
        }
        break;

      case "ArrowLeft":
      case "a":
        if (x >= currentImg.width - 35) {
          break;
        } else {
          x = x + 5;
          spotX = spotX + 5;
          moveImage(spotX, spotY);
        }

        break;

      case "ArrowRight":
      case "d":
        if (x <= 165) {
          break;
        } else {
          x = x - 5;
          spotX = spotX - 5;
          moveImage(spotX, spotY);
        }

        break;

      case " ":
        if (checkIfCrownFound()) {
          score++;
          document.getElementById("scoreCounter").innerHTML = "Score: " + score;
          serveNewImage();
        } else {
          break;
        }
        break;
    }
  }
}
