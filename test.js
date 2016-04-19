var type = Array(1,2);
var type1 = Array(true,false);
var column = Array(1,2,3,4);
var obsX = 35, obsY = -50; obsY1 = -1000;
var i = 0;
var target;
var obstacle;
var ctx;
var draw = new Queue();
var drawtar = new Queue();
var create = true;
var player1, player2;

function Sleep(ms){
	var date1 = new Date().getTime();
	do{
		var date2 = new Date().getTime();
	}while(date2 - date1 <= ms);
}

var Context = {
	canvas : null,
	create : function(canvas_tag_id) {
		this.canvas = document.getElementById(canvas_tag_id);
		return this.canvas.getContext("2d");
	}
};


var Obstacle = function (){
	var imageObj = new Image();
	var objY = -50;
	var objX;
	this.create = function(){	
		imageObj.onload = function() {
		    ctx.drawImage(imageObj, objX, objY, 30,30);
		};
		imageObj.src = 'file:///C:/Users/Hammam/Downloads/Subject/projects/obstacle.png';
		return imageObj;
	}
    this.getobjY = function(){return objY;}
    this.setobjY = function(){
    	objY+= 50;  
    	if(objY > Context.canvas.height) { 
    		delete draw.get(); 
    		//alert("Size = " + draw.getsize());
    	}
    	if(objY > Context.canvas.height * 6 / 7 ) {
    		create = true;
    	}
    }
    this.setobjX = function(data){objX = data;}
}

var Target = function (){
	var imageObj = new Image();
	var objY = -50;
	var objX;
	this.create = function(){	
		imageObj.onload = function() {
		    ctx.drawImage(imageObj, objX, objY, 30,30);
		};
		imageObj.src = 'file:///C:/Users/Hammam/Downloads/Subject/projects/target.png';
		return imageObj;
	}
	this.getobjY = function(){return objY;}
    this.setobjY = function(){
    	objY+= 50; 
    	if(objY > Context.canvas.height) {
    		delete draw.get(); 
    		//alert("Size : " +draw.getsize());		
    	}
    	if(objY > Context.canvas.height * 6 / 7 ) {create = true;}
    }
    this.setobjX = function(data){objX = data;}
}

var Player = function (){
	var imageObj = new Image();
	var State = true;

	this.setState = function(data){ State = data; }
	this.getState = function(){return State;}

	this.create = function(carType){
		imageObj.onload = function() {
			if(carType == 1){
				if(State){
				    ctx.drawImage(imageObj, 35, 480, 40,60);
				} else {
					ctx.drawImage(imageObj, 35 +125, 480, 40,60);
				}

			}else{
				if(State){
				    ctx.drawImage(imageObj, 35+250, 480, 40,60);
				} else {
					ctx.drawImage(imageObj, 35+375, 480, 40,60);
				}
			}
		};
		imageObj.src = 'file:///C:/Users/Hammam/Downloads/Subject/projects/car.png';
		return imageObj;
	}

}


function move(obj){
	obj.setobjY();
	obj.create();
}

function loadpic(){
	ctx = Context.create("canvas");
	var road = new Image();
	road.onload = function() {
	    ctx.drawImage(road, 0, 0, Context.canvas.width,Context.canvas.height);
	};
	road.src = 'file:///C:/Users/Hammam/Downloads/Subject/projects/road.png';
	if(i == 0){
		player1 = new Player();
		player2 = new Player();
		i++;
	}
	//player1.setState(type1[Math.floor(Math.random()*type1.length)]);
	window.onkeyup = function(e) {
	   var key = e.keyCode ? e.keyCode : e.which;
	   if (key == 39) {
	   		player1.setState(!player1.getState());
	   }

	   if(key == 68 || key == 100){
	   	player2.setState(!player2.getState());
	   }
	}
	//player2.setState(type[Math.floor(Math.random()*type.length)]);
	player1.create(1);
	player2.create(2);
	if(create){
		create = false;
		//alert("Add Object");
		if(type[Math.floor(Math.random()*type.length)] == 1){
			var obstacle = new Obstacle();
			if(column[Math.floor(Math.random()*column.length)] == 1){
				obstacle.setobjX(obsX);
			}else if (column[Math.floor(Math.random()*column.length)] == 2){
				obstacle.setobjX(obsX+125);
			}else if (column[Math.floor(Math.random()*column.length)] == 3){
				obstacle.setobjX(obsX+250);
			}else {
				obstacle.setobjX(obsX+375);
			} 
			draw.add(obstacle);
		} else {
			var target = new Target();
			if(column[Math.floor(Math.random()*column.length)] == 1){
				target.setobjX(obsX);
			}else if (column[Math.floor(Math.random()*column.length)] == 2){
				target.setobjX(obsX+125);
			}else if (column[Math.floor(Math.random()*column.length)] == 3){
				target.setobjX(obsX+250);
			}else {
				target.setobjX(obsX+375);
			} 
			draw.add(target);
		}
		
	}

}


function init(){
	loadpic()
	ctx.clearRect(0, 0, Context.canvas.width, Context.canvas.height);
	
	var wait = Array();
	var obsi = 0;

	while(!draw.isEmpty()){
		wait.push(draw.get());
		move(wait[obsi]);
		obsi++;
	}
	
	//alert("Size befor" + draw.getsize());

	for(var j=0;j<wait.length;j++){	
		if(wait[j].getobjY() < Context.canvas.height){

			draw.add(wait[j]);
		}
		else{
			delete wait[j];
		}
	}
	//alert( "Size in init = " + draw.getsize());

	setTimeout(init,200);
}

init();

//magdy queue implemantation
function Queue(){

	var arr =Array() ;
	var offset= 0;

	this.add = function (element) {
	  arr.push(element);
	}


	this.get = function (){
	  if(arr.length - offset < 1) {
	    console.log("embty queue");
	    return;
	  }
	  var item = arr[offset];
	  arr.shift();
	  return item;
	}

	this.getsize = function(){return arr.length - offset;}
	this.isEmpty = function(){return arr.length < 1;}
}


/*function testQueue(){
	var test = new Queue();
	for(var i = 0; i < 10; i++){
		test.add(i);
	}

	//alert(test.getsize());

	for(var i = 0; i < test.getsize(); i++){
		alert(test.get());
		alert(test.getsize() + " index :" + i);
	}

	alert('size = ' + test.getsize());

}*/

//testQueue();