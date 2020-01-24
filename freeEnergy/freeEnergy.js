let canvas = null;
let trajPlot = null;
let height = 300;
let width  = 800;
let xRange = [-5,5];
let yRange = [-5,0];
let numPoints = 50;
let points = []
for (i=xRange[0]; i<xRange[1]; i+=1./numPoints) {points.push(i);}
//let ballPosIndex = Math.floor(Math.random()*points.length);
let ballPosIndex = Math.floor(points.length/2.0);
let plot = null;
let traj = null;
let drawTraj = false;
let drawHist = false;
let xList = [];
let t = [];
let binNum = 20;
let counts = new Array(binNum).fill(0);
let frame = 0;
let frameLimit = 500;
let beta = 1.;
let maxStep = 5;
let numHistFrames = 1000;
let potentialFunc = singleWell
function init() {
        //Grab canvas
        canvas = document.getElementById("potentialSpace");
        canvas.height = height;
        canvas.width = width;
        canvas.linewidth = 1;
        trajPlot = document.getElementById("trajectory");
        trajPlot.height = height;
        trajPlot.width = width;
        trajPlot.linewidth = 1;
        trajPlot.style.visibility = 'hidden';
        //Grab slider for temperature
        let tSlide = document.getElementById("kT");
        document.getElementById("kTVal").innerHTML = tSlide.value;
        tSlide.oninput = function(){
            beta = 1. /tSlide.value;
            document.getElementById("kTVal").innerHTML = tSlide.value};
        //Grab slider for max step
        let stepSlide = document.getElementById("maxStep");
        stepSlide.oninput = function(){maxStep = stepSlide.value};
        //Build the plotting object
        plot = new Plot(potentialFunc,canvas,xRange,yRange);
        //Draw the potential
//        drawFunction(points,potential);
        plot.drawPlot(points);
        //Draw the ball
        plot.drawPoint(points[ballPosIndex]);
        window.requestAnimationFrame(step);
}

function step() {
    //Choose left or right
    let choice = Math.random();
    let goLeft = choice<0.5;
    let stepSize = Math.ceil(Math.random()*maxStep);
    //Make monte carlo step
    let propose = ballPosIndex;
    if (goLeft) {
        propose-=stepSize;
    }
    else {
        propose+=stepSize;
    }
    newE = potentialFunc(points[propose]);
    oldE = potentialFunc(points[ballPosIndex]);
    if (newE<oldE) {
        ballPosIndex=propose;
    }
    else if (Math.random() < Math.exp(-1.*beta*(newE-oldE))) {
        ballPosIndex=propose;
    }
    else {
        ballPosIndex=ballPosIndex;
    }

    //Update canvas
    plot.clearPlot();
    plot.drawPlot(points);
    plot.drawPoint(points[ballPosIndex]);
    plot.drawAxisY([-5,-4,-3,-2,-1]);

    //Update trajectory canvas if needed
    if (drawTraj) {
        xList.push(points[ballPosIndex]);
        t.push(frame);
        frame++;
        traj.drawLine(t,xList);
        if (frame == frameLimit) {
            frame = 0;
            t = [];
            xList = [];
            traj.clearPlot();
        }
    }
    //Calculate histogram if wanted
    if (drawHist) {
        let x = points[ballPosIndex];
        let bin = Math.floor((x-xRange[0])/(xRange[1]-xRange[0])*binNum);
        counts[bin]++;
        frame++;
        traj = new Plot(function(x){return counts[x]},trajPlot,xRange,[-0.1,500]);
        traj.clearPlot();
        let tmp = [...Array(binNum).keys()].map((val) => ((val+.5)/binNum)*(xRange[1]-xRange[0])+xRange[0]);
        traj.drawLine(tmp,counts);
        if(frame>numHistFrames) {
            document.getElementById("trajButton").disabled = false;
            document.getElementById("histButton").disabled = false;
            drawHist = false;
            frame = 0;
        }
    }

    window.requestAnimationFrame(step);
}

function showTrajectory() {
    trajPlot.style.visibility = 'visible';
    traj = new Plot(function(x){return points[ballPosIndex]},trajPlot,[0,500],xRange);
    traj.clearPlot();
    if (drawTraj) {     //Clear plot if it was drawing
        xList = [];
        t = [];
        frame = 0;
    }
    drawTraj = !drawTraj;
}

function showHistogram() {
    document.getElementById("trajButton").disabled = true;
    document.getElementById("histButton").disabled = true;
    trajPlot.style.visibility = 'visible';
    if (drawTraj) {
        traj.clearPlot();
        drawTraj = false;
    }
    drawHist = !drawHist;
    frame = 0;
    xList = [];
    counts.fill(0);
}

function singleButton() {
    potentialFunc = singleWell;
    plot = new Plot(potentialFunc,canvas,xRange,yRange);
}

function doubleButton() {
    potentialFunc = doubleWell;
    plot = new Plot(potentialFunc,canvas,xRange,yRange);
}

function largeSmallButton() {
    potentialFunc = largeSmallWell;
    plot = new Plot(potentialFunc,canvas,xRange,yRange)
}

function singleWell(x) {
    return gaussian(x,-5,0,.8) + harmonic(x,.01);
}
function doubleWell(x) {
    return gaussian(x,-5,-1.5,.8)+gaussian(x,-5,1.5,.8)+harmonic(x,.01);
}
function largeSmallWell(x) {
    return gaussian(x,-5,-1.5,.8)+gaussian(x,-5,3,1.4)+harmonic(x,.05);
}
function gaussian(x,amp,mean,sig) {
    return amp*Math.exp(-1*Math.pow(x-mean,2)/(2*sig*sig));
}
function harmonic(x,a){
    return a*Math.pow(x-0.,2);
}

init();
