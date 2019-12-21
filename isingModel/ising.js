var canvas = document.getElementById('canvas');
var tempSlide = document.getElementById('tempSlide');
var beta = 1.0/parseInt(tempSlide.value);
tempSlide.oninput = function(){beta = 1.0/parseInt(tempSlide.value);};
var arrowSpacing = 30;
var colLength = Math.floor(canvas.height/arrowSpacing);
var rowLength = Math.floor(canvas.width/arrowSpacing);
var arrowArray = new Array(rowLength);
var framePerSecond = 2;
var J= 1.;

function init() {
    //Form arrow array
    for (var row=0; row<arrowArray.length; row++) {
        arrowArray[row] = new Array(colLength);
        for (var col=0; col<arrowArray[row].length;col++){
            var direction = 'down'
            if (Math.random() < 0.5) {direction='up'}
            w = (row+0.5)*arrowSpacing;
            h = (col+0.5)*arrowSpacing;
            arrowArray[row][col] = new Arrow(canvas,[w,h],direction)
        }
    }
    drawArrows();

    window.requestAnimationFrame(draw);
}
function drawArrows() {
    for (var row=0; row<arrowArray.length; row++) {
        for (var col=0; col<arrowArray[row].length;col++) {
            arrowArray[row][col].draw();
        }
    }
}
function draw() {
    setInterval(function() {
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
        update();
        drawArrows();
    },1000/framePerSecond);
}

function update() {
    var previous = [...arrowArray];
    for (var i=0; i<previous.length;i++) {
        for (var j=0; j<previous[i].length; j++) {
            //U = -J*sum(si*sj)
            var currSpin = previous[i][j].spin;
            var oldU = -1.*J*(currSpin*previous[mod(i+1,rowLength)][j].spin+currSpin*previous[mod(i-1,rowLength)][j].spin+currSpin*previous[i][mod(j+1,colLength)].spin+currSpin*previous[i][mod(j-1,colLength)].spin);
            var newU = -1.*J*(-1*currSpin*previous[mod(i+1,rowLength)][j].spin-currSpin*previous[mod(i-1,rowLength)][j].spin-currSpin*previous[i][mod(j+1,colLength)].spin-currSpin*previous[i][mod(j-1,colLength)].spin);
            if (newU<oldU) {
                arrowArray[i][j].flip();
            }
            else if (Math.random() < Math.exp(-1.*beta*(newU-oldU))) {
                arrowArray[i][j].flip();
            }

        }


    }
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

init();
