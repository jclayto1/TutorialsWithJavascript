var canvasWidth = 0;
var canvasHeight= 0;
Matter.use('matter-wrap');
var drawSolvent = true;
var canvas = null;

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
var targetVel = 3;

//Create list for <x^2>
x2 = [];
initialPos = {x: -1, y: -1};

function _buildSystem() {
    //Reset system
    beads = []
    solvent=[]

    //Build boxes
    beads.push(new Box(canvasWidth/2.,canvasHeight/2.,canvasWidth/2.,20));
    beads.push(new Box(canvasWidth/2.,canvasHeight/2.+20,canvasWidth/2.,20));

    //Build solvent
    for (i=0; i<numSolvent; i++){
        solvent.push(new Circle(Matter.Common.random(0,canvasWidth),Matter.Common.random(0,canvasHeight),5));
        //Give solvent velocity
        solvent[i].giveRandomVelocity(targetVel);
    }
}

function init(){
    canvas = document.getElementById('canvas'); //Better approach, build the page from this script?
    canvasWidth = canvas.width;
    canvasHeight= canvas.height;
    //Prepare world
    engine = Engine.create();
    world = engine.world;
    world.gravity.scale = 0.0;

    //Build objects
    _buildSystem();

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

    window.requestAnimationFrame(step);
}

function showSolvent(){
    drawSolvent = !drawSolvent;
}
function restart(){
    var context = canvas.getContext('2d');
    context.clearRect(0,0,canvasWidth,canvasHeight);
    beads = [];
    solvent=[];
    Engine.clear(engine);
    World.clear(world,true);

    _buildSystem();

    //Add to world
    for (i=0;i<beads.length;i++) {
        World.add(world,beads[i].getBody())
    }
    for (i=0;i<solvent.length;i++) {
        World.add(world,solvent[i].getBody())
    }
}


init()
