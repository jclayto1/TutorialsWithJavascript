shift = 1.0
count = 0.

function Box(x,y,length,height) {
    var canvas = document.getElementById('canvas');
    var canvasWidth = canvas.width;
    var canvasHeight= canvas.height;
    var options = {
        frictionAir: 0.0,
    	frictionStatic: 0.0,
    	friction: 0.0,
    	restitution: 1.0,
    	inertia: Infinity,
    	plugin: {
    		wrap: {
    			min: { x:shift, y:shift },
    			max: { x:canvasWidth-length-shift, y:canvasHeight-height-shift}
    		}
    	}
    }
    this.body = Bodies.rectangle(x,y,length,height,options);

    this.getBody = function() {return this.body}
    this.show = function() {
        var context = document.getElementById('canvas').getContext('2d');
        var pos = this.body.position;
        context.beginPath();
        context.rect(pos.x-length/2.,pos.y-height/2.,length,height);
        context.stroke();
    }

    this.giveRandomVelocity = function(target) {
        var x = (2*Math.random())-1;
        var y = (2*Math.random())-1;
        var scale = Math.sqrt(Math.pow(x,2)+Math.pow(y,2))
        var speed = target + BoxMullerTrans()
        var vel = Matter.Vector.div({x:x,y:y},(scale/speed))
        Matter.Body.setVelocity(this.body,vel)
    }
    function BoxMullerTrans(){
        var a = 0,
            b = 0;
        while(a===0) a = Math.random(); //Excludes zero
        while(b===0) b = Math.random();
        return Math.sqrt(-2.*Math.log(a)) * Math.cos(2*Math.PI*b)
    }

    // this.shiftVelocity = function(targetVel) {
    //     var vel = {x:this.body.velocity.x,y:this.body.velocity.y};
    //     var speed=this.body.speed;
    //     var velUnit = Matter.Vector.div(vel,speed);
    //     alpha = targetVel - speed;
    //     var addVect = {x:Math.pow(alpha,2)*velUnit.x,y:Math.pow(alpha,2)*velUnit.y};
    //     Matter.Body.setVelocity(this.body,Matter.Vector.add(vel,addVect));
    //     count++;
    //     if(count==500){console.log(this.body.velocity);}
    //
    // }
}
