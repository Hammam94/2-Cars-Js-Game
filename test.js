var type = Array(1,2);
var column = Array(1,2,3,4);
var obsX = 35, obsY = -50; obsY1 = -1000;
var i = 0;
var target;
var obstacle;
var ctx;
var drawobs = new Queue();
var drawtar = new Queue();
var create = true;

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
	this.create = function(context){	
		imageObj.onload = function() {
		    context.drawImage(imageObj, objX, objY, 30,30);
		};
		imageObj.src = 'file:///C:/Users/Hammam/Downloads/Subject/projects/obstacle.png';
		return imageObj;
	}
    this.getobjY = function(){return objY;}
    this.setobjY = function(){
    	objY+= 50;  
    	if(objY > Context.canvas.height) {
    		objY = -50; 
    		delete drawobs.get(); 
    		alert(drawobs.getsize());
    		create = true;	
    		alert(drawobs.get());
    	}
    	/*if(objY > Context.canvas.height * 5 / 6 ) {
    		create = true;
    	}*/
    }
    this.setobjX = function(data){objX = data;}
}

var Target = function (){
	var imageObj = new Image();
	var objY = -50;
	var objX;
	this.create = function(context){	
		imageObj.onload = function() {
		    context.drawImage(imageObj, objX, objY, 30,30);
		};
		imageObj.src = 'file:///C:/Users/Hammam/Downloads/Subject/projects/target.png';
		return imageObj;
	}
	this.getobjY = function(){return objY;}
    this.setobjY = function(){
    	objY+= 50; 
    	if(objY > Context.canvas.height) {
    		objY = -50;  
    		delete drawtar.get(); 
    		alert(drawtar.getsize());
    		create = true;	
    		alert(drawtar.get());

    	}
    	/*if(objY > Context.canvas.height * 5/6 ) {
    		create = true;
    	}*/
    }
    this.setobjX = function(data){objX = data;}
}




function move(obj){
	obj.setobjY();
	obj.create(ctx);
}

function loadpic(){
	ctx = Context.create("canvas");
	var road = new Image();
	road.onload = function() {
	    ctx.drawImage(road, 0, 0, Context.canvas.width,Context.canvas.height);
	};
	road.src = 'file:///C:/Users/Hammam/Downloads/Subject/projects/road.png';
	var obstacle = new Obstacle();
	if(create){
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
			drawobs.add(obstacle);
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
			drawtar.add(target);
		}
		create = false;
	}

}


function init(){
	loadpic()
	ctx.clearRect(0, 0, Context.canvas.width, Context.canvas.height);
	
	var waitobs = Array(); var waitTar = Array();

	alert("obs "+drawobs.getsize());
	for(var j=0;j< drawobs.getsize();j++){
		waitobs.push(drawobs.get());
		move(waitobs[j]);
	}
	alert("tar"+drawtar.getsize());
	for(var j=0;j< drawtar.getsize();j++){
		waitTar.push(drawtar.get());
		move(waitTar[j]);
	}

	
	for(var j=0;j<waitobs.length;j++){
		if(waitobs[j].getobjY() < Context.canvas.height){
			drawobs.add(waitobs[j]);
		}
	}
	for(var j=0;j<waitTar.length;j++){
		if(waitTar[j].getobjY() < Context.canvas.height){
			drawtar.add(waitTar[j]);
		}
	}

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
	  offset++;
	  alert(offset);
	  return item;
	}

	this.getsize = function(){return arr.length - offset;}
}