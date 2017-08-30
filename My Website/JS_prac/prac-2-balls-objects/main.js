// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Shape(x,y,velX,velY){
	this.x=x;
	this.y=y;
	this.velX=velX;
	this.velY=velY;
	this.exists=true;
}

function Ball(x,y,velX,velY,color,size){
	Shape.call(this,x,y,velX,velY);
	this.color=color;
	this.size=size;
}

Ball.prototype=Object.create(Shape.prototype);
Ball.prototype.constructor=Ball;

function EvilCircle(x,y){
	Shape.call(this,x,y);
	this.color='white';
	this.velX=20;
	this.velY=20;
	this.size=10;
}

EvilCircle.prototype=Object.create(Shape.prototype);
EvilCircle.prototype.constructor=EvilCircle;

EvilCircle.prototype.draw=function(){
	ctx.beginPath();
	ctx.lineWidth=3;
	ctx.strokeStyle=this.color;
	ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
	ctx.stroke();
}

EvilCircle.prototype.checkBounds=function(){
	if((this.x+this.size)>=width){
		this.x-=this.size;
	}
	if((this.x-this.size)<=0){
		this.x+=this.size;
	}
	
	if((this.y+this.size)>=height){
		this.y-=this.size;
	}
	if((this.y-this.size)<=0){
		this.y+=this.size;
	}
}

EvilCircle.prototype.setControls=function(){
	var _this = this;
	window.onkeydown = function(e) {
	    if (e.keyCode === 65) {
	      _this.x -= _this.velX;
	    } else if (e.keyCode === 68) {
	      _this.x += _this.velX;
	    } else if (e.keyCode === 87) {
	      _this.y -= _this.velY;
	    } else if (e.keyCode === 83) {
	      _this.y += _this.velY;
	    }
  	}
}

EvilCircle.prototype.collisionDetect=function(){
 for (var j = 0; j < balls.length; j++) {
    if (balls[j].exists) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < (this.size + balls[j].size)) {
        balls[j].exists=false;
        num_balls--;
      }
    }
  }
}

Ball.prototype.draw=function(){
	ctx.beginPath();
	ctx.fillStyle=this.color;
	ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
	ctx.fill();
}

Ball.prototype.update=function(){
	if((this.x+this.size)>=width || (this.x-this.size)<=0){
		this.velX=-this.velX;
	}
	if((this.y+this.size)>=height || (this.y-this.size)<=0){
		this.velY=-this.velY;
	}
	this.x+=this.velX;
	this.y+=this.velY;
}

Ball.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (this !== balls[j]) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < (this.size + balls[j].size)) {
        balls[j].color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
        this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
        var temp=this.velX;
        this.velX=balls[j].velX;
        balls[j].velX=temp;
        temp=this.velY;
        this.velY=balls[j].velY;
        balls[j].velY=temp;
      }
    }
  }
}

var balls=[];

var ec=new EvilCircle(random(0,width),random(0,height));
ec.setControls();

var num_balls=0;
var count=document.querySelector('p');

while(balls.length < 25){
	var ball=new Ball(random(0,width),random(0,height),random(-7,7),random(-7,7),'rgb('+random(0,255)+','+random(0,255)+','+random(0,255)+')',random(10,20));
	balls.push(ball);
	num_balls++;
}

function loop(){
	ctx.fillStyle='rgba(0,0,0,0.25)';
	ctx.fillRect(0,0,width,height);

	for(var i=0;i<balls.length;i++){
		if(balls[i].exists){
			balls[i].draw();
			balls[i].update();
			balls[i].collisionDetect();
		}
		ec.draw();
		ec.checkBounds();
		ec.collisionDetect();
	}

	count.textContent="Ball Count: "+num_balls;
	requestAnimationFrame(loop);
}

loop();
