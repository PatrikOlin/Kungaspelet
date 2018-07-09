var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var x;
var y;

var imgX;
var imgY;

var spotX;
var spotY;

var currentImg;


/* var img1 = new Image();
img1.src = "/img/grodhatten.jpg";
var img2 = new Image();
img2.src = "/img/aelghatten.jpg";
var img3 = new Image();
img3.src = "/img/vikingahatten.jpg";

var images = [img1, img2, img3]; */

var images = [];

function preload() {
  for (var i = 0; i < arguments.length; i++) {
    images[i] = new Image();
    images[i].src = preload.arguments[i];
  }
}


init();

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  ctx.font = "30px FontAwesome 5 Free";
  ctx.fillStyle = "red";

  window.addEventListener("resize", resizeCanvas, false);
  window.addEventListener("orientationchange", resizeCanvas, false);

  preload(
    "assets/img/grodhatten.jpg",
    "assets/img/aelghatten.jpg",
    "assets/img/vikingahatten.jpg",
    "assets/img/rastahatten.jpg",
    "assets/img/regnhatten.jpg"
  )

  resizeCanvas();
  window.onkeydown = controller;
  shuffleImage();
  spotX = getRandomInt(50, currentImg.width - 50);
  spotY = getRandomInt(50, currentImg.height - 50);
  document.fonts.ready.then(_ => {
    setTimeout(_ => markTheSpot(spotX, spotY), 500)
  })

}

function markTheSpot(newSpotX, newSpotY) {
    ctx.font = '900 30px "Font Awesome 5 Free"';
    ctx.fillStyle = "red";
    ctx.fillText("\uf00d", newSpotX, newSpotY);
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

function shuffleImage() {
  currentImg = images[Math.floor(Math.random() * images.length)];
  currentImg.onload = function () {
    imgX = currentImg.width / 2;
    imgY = currentImg.height / 2;
    ctx.save();
    ctx.drawImage(currentImg, (x - imgX), (y - imgY));
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

/*   function preloadImage(url) {
    var img=new Image();
    img.src=url;
} */

function moveImage(spotX, spotY) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.drawImage(currentImg, (x - imgX), (y - imgY));
  markTheSpot(spotX, spotY);
  ctx.globalCompositeOperation = "destination-in";
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function controller(e) {
  const key = event.key || e.target.id;
  console.log(key);

  switch (key) {
    case "ArrowUp":
    case "w":
      
      if(y >= currentImg.height - 95) {
        break;
      } else {
        y = y + 5;
        spotY = spotY + 5;
        moveImage(spotX, spotY);
      }
 
      break;

    case "ArrowDown":
    case "s":
      
    if(y <= 105){
      y=y;
    } else {
      y = y - 5;
      spotY = spotY - 5;
      moveImage(spotX, spotY);
    }
      break;

    case "ArrowLeft":
    case "a":
      
    if(x >= currentImg.width - 35) {
      break;
    } else {
      x = x + 5;
      spotX = spotX + 5;
      moveImage(spotX, spotY);
    }
     
      break;

    case "ArrowRight":
    case "d":
      
    if(x <= 165) {
      break;
    } else {
      x = x - 5;
      spotX = spotX - 5;
      moveImage(spotX, spotY);
    }

      break;
  }
}