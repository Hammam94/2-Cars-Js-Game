var type = Array(1,2);
var type1 = Array(true,false);
var obsX = 35, obsY = -50; obsY1 = -1000;
var i = 0;
var target;
var obstacle;
var ctx;
var levelSperatorDistance = 150;
var levelNum = 500 / 50;
var leftArray = new Array(levelNum);
var rightArray = new Array(levelNum);
var create = true;
var player1, player2;
var speed = 10;
var gamediffer = 50;
var gamediffercounter = 0;
var perodicTime = 33.3;
var obstacleImg;
var targetImg;
var playerImg;
var roadImg;
var score = 0;
var gameover = false;

var Context = {
	canvas : null,
	create : function(canvas_tag_id) {
		this.canvas = document.getElementById(canvas_tag_id);
		return this.canvas.getContext("2d");
	}
};

var Level = function () {
	var y;
	var state;
	var obj;
	var hasObj = false;
}

function runOnLoad () {
	obstacleImg = new Image();
	obstacleImg.src = 'img/obstacle.png';
	targetImg = new Image();
	targetImg.src = 'img/target.png';
	playerImg = new Image();
	playerImg.src = 'img/car.png';
	player1 = new Player(2);
	player2 = new Player(1);
	window.onkeyup = function(e) {
	   var key = e.keyCode ? e.keyCode : e.which;
	   if (key == 39) {
	   		player1.setState(!player1.getState());
	   }

	   if(key == 68 || key == 100){
	   	player2.setState(!player2.getState()); 
	   }
	}
	roadImg = new Image();
	roadImg.src = 'img/road.png';
	ctx = Context.create("canvas");
	var leftStartDelta = Math.floor(Math.random()*40);
	for (var i = 0; i < leftArray.length; i++) {
		leftArray[i] = new Level();
		leftArray[i].y = - (i * levelSperatorDistance) - leftStartDelta;
	};
	var rightStartDelta = Math.floor(Math.random()*40);
	for (var i = 0; i < rightArray.length; i++) {
		rightArray[i] = new Level();
		rightArray[i].y = - (i * levelSperatorDistance) - rightStartDelta;
	};
}

var Object = function (img){
	var x;
	var type;
	this.draw = function(y){	
		ctx.drawImage(img, this.x, y, 30,30);
	}
}


var Player = function (carType){
	var state = true;
	this.setState = function(data){ state = data; }
	this.getState = function(){return state;}

	this.draw = function(){
		if(carType == 1){
			if(state){
			    ctx.drawImage(playerImg, 35, 480, 40,60);
			} else {
				ctx.drawImage(playerImg, 35 +125, 480, 40,60);
			}
		}else{
			if(state){
			    ctx.drawImage(playerImg, 35+250, 480, 40,60);
			} else {
				ctx.drawImage(playerImg, 35+375, 480, 40,60);
			}
		}
	}
}

function drawObject (img, level, laneOffset, type) {
	level.obj = new Object(img);
	level.obj.y = leftArray[i].y;
	level.obj.x = 35 + 125 * laneOffset;
	level.obj.type = type;
}

function collision (level, lane, player) {
	if(level.y >= 480 - 30 && level.y <= 480 + 60) {
		if((level.obj.x == 35 + 125 * (lane) && player.getState()) ||
			 (level.obj.x == 35 + 125 * (lane + 1) && !player.getState())) {
			if(level.obj.type == "obstacle") {
				// gameOver
				gameover = true
			}else if(level.obj.type == "target") {
				console.log("score");
				++score;
				level.obj.type = "free";
			}
		}
	}
	if(level.y > Context.canvas.height){
		level.y = level.y  - levelSperatorDistance * 10;
		if(level.hasObj && level.obj.type == "target") {
			// gameOver
			gameover = true;
		}
		level.hasObj = false;
	}
	if(level.obj.type != "free"){
		level.obj.draw(level.y);
	}
}

function levelCreationHandler (level, side, player) {
	if(!level.hasObj) {
			if(type[Math.floor(Math.random()*type.length)] == 1) {
				if(type[Math.floor(Math.random()*type.length)] == 2) {
					drawObject(targetImg, level, 0 + 2 * side, "target");
				} else {
					drawObject(obstacleImg, level, 0 + 2 * side, "obstacle");
				}
			} else {
				if(type[Math.floor(Math.random()*type.length)] == 2) {
					drawObject(targetImg, level, 1 + 2 * side, "target");
				} else {
					drawObject(obstacleImg, level, 1 + 2 * side, "obstacle");
				}
			}
			level.hasObj = true;
			level.obj.draw(level.y);
		}else {
			collision(level, (side != 0)? side + 1 : side, player);
		}
}

function render () {
	for (var i = 0; i < levelNum; i++) {
		leftArray[i].y += speed;
		rightArray[i].y += speed;
		levelCreationHandler(leftArray[i], 0, player2);
		levelCreationHandler(rightArray[i], 1, player1);
	};
	player1.draw();
	player2.draw();
	gamediffercounter++;
	if(gamediffercounter % gamediffer == 0) {
		perodicTime -= 3;
	}
}


function startGameLoop(){
	if(!gameover) {
		ctx.clearRect(roadImg, 0, 0, Context.canvas.width, Context.canvas.height);
		ctx.drawImage(roadImg, 0, 0, Context.canvas.width, Context.canvas.height);
		render();	
	}
	setTimeout(startGameLoop,perodicTime);
}

runOnLoad();
startGameLoop();
