var car;
var obstacles = [];
var score;

function startGame() {
    car = new Component(30, 30, "red", 10, 120);
    score = new Component("30px", "Consolas", "black", 280, 40, "text");
    gameArea.start();
}

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        document.addEventListener('keydown', function (e) {
            // myGameArea.key = e.keyCode;
            gameArea.keys = (gameArea.keys || []);
            gameArea.keys[e.keyCode] = true;
        });
        document.addEventListener('keyup', function (e) {
            // myGameArea.key = false;
            gameArea.keys[e.keyCode] = false; 
        });
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    }
}

function Component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = gameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < obstacles.length; i += 1) {
        if (car.crashWith(obstacles[i])) {
            gameArea.stop();
            return;
        } 
    }
    gameArea.clear();
    car.speedX = 0;
    car.speedY = 0;
    if (gameArea.keys && gameArea.keys[37]) {
        car.speedX = -1;
    }
    if (gameArea.keys && gameArea.keys[39]) {
        car.speedX = 1;
    }
    if (gameArea.keys && gameArea.keys[38]) {car.speedY = -1; }
    if (gameArea.keys && gameArea.keys[40]) {car.speedY = 1; }
    // if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -1; }
    // if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 1; }
    // if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -1; }
    // if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 1; }
    gameArea.frameNo += 1;
    if (gameArea.frameNo == 1 || everyinterval(150)) {
        x = gameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        obstacles.push(new Component(10, height, "green", x, 0));
        obstacles.push(new Component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < obstacles.length; i += 1) {
        obstacles[i].speedX = -1;
        obstacles[i].newPos();
        obstacles[i].update();
    }
    score.text="SCORE: " + gameArea.frameNo;
    score.update();
    car.newPos();    
    car.update();
}

function everyinterval(n) {
    if ((gameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}