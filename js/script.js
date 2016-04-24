var type = Array(1,2);
var type1 = Array(true,false);
var obsX , obsY, obsY1;
var i;
var target;
var obstacle;
var ctx;
var levelSperatorDistance;
var levelNum = 500 / 50;
var leftArray = new Array(levelNum);
var rightArray = new Array(levelNum);
var create;
var player1, player2;
var speed;
var gamediffer;
var gamediffercounter;
var perodicTime;
var obstacleImg;
var targetImg;
var playerImg;
var roadImg;
var score;
var gameover;
var time;

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

function loadValues(){
	clearTimeout (time);
	obsX = 35; 
	obsY = -50; 
	obsY1 = -1000;
	i = 0;
	levelSperatorDistance = 150;
	levelNum = 500 / 50;
	create = true;
	speed = 10;
	gamediffer = 50;
	gamediffercounter = 0;
	perodicTime = 33.3;
	score = 0;
	gameover = false;
	var leftStartDelta = Math.floor(Math.random()*40);
	for (var x = 0; x < leftArray.length; x++) {
		leftArray[x] = new Level();
		leftArray[x].y = - (x * levelSperatorDistance) - leftStartDelta;
	};
	var rightStartDelta = Math.floor(Math.random()*40);
	for (var x = 0; x < rightArray.length; x++) {
		rightArray[x] = new Level();
		rightArray[x].y = - (x * levelSperatorDistance) - rightStartDelta;
	};
}

function runOnLoad () {
	obstacleImg = new Image();
	obstacleImg.src = 'img/obstacle1.png';
	targetImg = new Image();
	targetImg.src = 'img/target1.png';
	playerImg = new Image();
	playerImg.src = 'img/car1.png';
	player1 = new Player(2);
	player2 = new Player(1);
	roadImg = new Image();
	roadImg.src = 'img/road.png';
	ctx = Context.create("canvas");
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
		if((level.obj.x == 35 + 125 * lane && player.getState()) ||
			 (level.obj.x == 35 + 125 * (lane + 1) && !player.getState())) {
			if(level.obj.type == "obstacle") {
				// gameOver
				gameover = true
			}else if(level.obj.type == "target") {
				++score;
				document.getElementById("scoreUpdate").innerHTML = score;
				//console.log(score);
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

function objectCreation(level, side){
	if(type[Math.floor(Math.random()*type.length)] == 2) {
		drawObject(targetImg, level, side, "target");
	} else {
		drawObject(obstacleImg, level, side, "obstacle");
	}
}

function levelCreationHandler (level, side, player) {
	if(!level.hasObj) {
			if(type[Math.floor(Math.random()*type.length)] == 1) {
				objectCreation(level, 0 + 2 * side);
			} else {
				objectCreation(level, 1 + 2 * side);
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
	window.onkeyup = function(e) {
	   var key = e.keyCode ? e.keyCode : e.which;
	   if (key == 82 || key == 114) {
	   	 	loadValues();
	   		runOnLoad();
	   		startGameLoop();
	   }
	   if (key == 39) {
	   		player1.setState(!player1.getState());
	   }
	   if(key == 68 || key == 100){
	   	player2.setState(!player2.getState()); 
	   }
	}
	time = setTimeout(startGameLoop,perodicTime);
}

function Reset(){
	loadValues();
	runOnLoad();
	startGameLoop();
}

loadValues();
runOnLoad();
startGameLoop();
