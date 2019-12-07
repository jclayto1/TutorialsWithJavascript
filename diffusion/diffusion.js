var canvasWidth = 0;
var canvasHeight= 0;
Matter.use('matter-wrap');
var drawSolvent = true;
var canvas = null;
var trailCanvas = null;

//Set callback for temperature control
var slider = document.getElementById("tempSlide");
var targetVel = parseInt(slider.value);                         //Sets initial value
slider.oninput = function(){targetVel=parseInt(slider.value)}   //Callback for user input

//Load "modules" (remember, everything is an object in JS!)
var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;

//Make the engine, world, a global object
var engine;
var world;

//Create empty lists for scene objects
var beads = [];
var solvent=[];
var numSolvent=250;
var tail = [];
var showTail = false;

//Create list for <x^2>
x2 = [];
initialPos = {x: -1, y: -1};
calcDiffusion = false;

function init(){
    canvas = document.getElementById('canvas'); //Better approach, build the page from this script?
    canvasWidth = canvas.width;
    canvasHeight= canvas.height;
    trailCanvas = document.getElementById("trail");
    //Prepare world
    engine = Engine.create();
    world = engine.world;
    world.gravity.scale = 0.0;

    //Build beads
    beads.push(new Circle(canvasWidth/2.,canvasHeight/2.,50));


    //Build solvent
    for (i=0; i<numSolvent; i++){
        solvent.push(new Circle(Matter.Common.random(0,canvasWidth),Matter.Common.random(0,canvasHeight),5));
        //Give solvent velocity
        solvent[i].giveRandomVelocity(targetVel);
    }

    //Add to world
    for (i=0;i<beads.length;i++) {
        World.add(world,beads[i].getBody())
    }
    for (i=0;i<solvent.length;i++) {
        World.add(world,solvent[i].getBody())
    }
    window.requestAnimationFrame(step);
}

function step(){
    //Clear the canvas
    var context = canvas.getContext('2d');
    context.clearRect(0,0,canvasWidth,canvasHeight);
    //Perform next step
    Engine.update(engine, delta = 8.);
    //Draw beads
    for(i=0;i<beads.length;i++) {
        beads[i].show();
    }
    //Draw solvent, scale velocity to target
    if(drawSolvent)
        for(i=0;i<solvent.length;i++) {
            solvent[i].show();
            if(Math.random()>.95){solvent[i].giveRandomVelocity(targetVel)};
        }
    //Calculate diffusion if desired
    if (calcDiffusion) {
        if (initialPos.x === -1) {
            initialPos = Matter.Vector.clone(beads[0].getBody().position);
        }
        else {
            let currX2 = Math.sqrt(Math.pow(initialPos.x-beads[0].getBody().position.x,2)+Math.pow(initialPos.y-beads[0].getBody().position.y,2));
            x2.push(currX2);
        }
        //Test: only calculate for 100 frames
        if (x2.length === 100) {
            let avgX2 = x2.reduce((a,b) => a+b, 0)/x2.length;  //reduce(callback(accumulator,currValue), initValue);
            let diffCoef = avgX2 /(2.* x2.length);
            document.getElementById("diffCoef").innerHTML = diffCoef;
            x2 = [];
//            calcDiffusion = false;
        }
    }
    //Draw tail if desired
    if (showTail) {
        var trailContext = document.getElementById("trail").getContext('2d');
//        trailContext = canvas.getContext('2d');
        trailContext.beginPath();
        tail.push(beads[0].getBody().position);
        trailContext.moveTo(tail[0].x,tail[0].y);
        for (i=1; i<tail.length;i++) {
            trailContext.lineTo(tail[i].x,tail[i].y);
            if(tail.length === 10){console.log(tail);}
//            trailContext.stroke();
            trailContext.fillRect(tail[i].x,tail[i].y,5,5);
        }
//        trailContext.strokeStyle = 'blue';
//        trailContext.stroke();
    }
    window.requestAnimationFrame(step);
}

function showVelocity(){
    var meanVar = 0.0;
    for(i=0;i<solvent.length;i++){
        meanVar += solvent[i].body.speed / solvent.length;
    }
    document.getElementById("avgVel").innerHTML = meanVar;
}

function showSolvent(){
    drawSolvent = !drawSolvent;
}

function restart(){
    var context = canvas.getContext('2d');
    context.clearRect(0,0,canvasWidth,canvasHeight);
    var trailContext = trailCanvas.getContext('2d');
    trailContext.clearRect(0,0,trailCanvas.width,trailCanvas.height)
    beads = [];
    solvent=[];
    tail =  [];
    x2   =  [];
    Engine.clear(engine);
    World.clear(world,true);
    //Build beads
    beads.push(new Circle(canvasWidth/2.,canvasHeight/2.,50));


    //Build solvent
    for (i=0; i<numSolvent; i++){
        solvent.push(new Circle(Matter.Common.random(0,canvasWidth),Matter.Common.random(0,canvasHeight),5));
        //Give solvent velocity
        solvent[i].giveRandomVelocity(targetVel);
    }

    //Add to world
    for (i=0;i<beads.length;i++) {
        World.add(world,beads[i].getBody())
    }
    for (i=0;i<solvent.length;i++) {
        World.add(world,solvent[i].getBody())
    }
    console.log(solvent.length);
}

function measureDiffusion() {
    calcDiffusion = !calcDiffusion
}

function showTailToggle() {
    showTail = !showTail
}

init()
