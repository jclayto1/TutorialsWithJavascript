class Plot {
    constructor(funcHandle,canvas,xRange,yRange){
        this.func = funcHandle;
        this.canvas = canvas
        this.context= this.canvas.getContext('2d');
        this.xRange = xRange;
        this.yRange = yRange;
    }

    drawPlot(xArray) {
        let pixArray = [];
        for (let i=0; i<xArray.length; i++) {
            let y = this.func(xArray[i]);
            pixArray.push(this._translate([xArray[i],y]));
        }
        this.context.beginPath();
        this.context.moveTo(pixArray[0][0],pixArray[0][1]);
        for (let i=1; i<pixArray.length; i++){
            this.context.lineTo(pixArray[i][0],pixArray[i][1]);
        }
        this.context.stroke();
    }
    drawLine(x,y) {
        let pixArray = [];
        for (i=0; i<x.length; i++) {
            pixArray.push(this._translate([x[i],y[i]]));
        }
        this.context.beginPath();
        this.context.moveTo(pixArray[0][0],pixArray[0][1]);
        for (i=1; i<pixArray.length; i++) {
            this.context.lineTo(pixArray[i][0],pixArray[i][1]);
        }
        this.context.stroke();
    }
    drawPoint(x) {
        let radius = 5;
        let y = this.func(x);
        let pixArray = this._translate([x,y]);
        this.context.beginPath();
        this.context.arc(pixArray[0],pixArray[1],radius,0,2.*Math.PI)
        this.context.fillStyle= 'red';
        this.context.fill();
        this.context.stroke();
    }
    drawAxisY(ticPos) {
        //TODO: add check in lengths
        let tickLength = 10;    //Units: pixels
        let labelOffset = 1;
//        let labelFontsize=12;
        ticPos.forEach(function(val,i) {
            this.context.beginPath();
            let ticPix = this._translate([0,val]);
            this.context.moveTo(0,ticPix[1]);
            this.context.lineTo(tickLength,ticPix[1]);
            this.context.stroke();
            this.context.fillText(val.toString(),tickLength+labelOffset,ticPix[1]);
        }.bind(this));
    }

    clearPlot() {
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
    _translate (pos) {
        let x = pos[0];
        let y = pos[1];
        let width = this.canvas.width;
        let height= this.canvas.height;
        let pix = (x-this.xRange[0])*width/(this.xRange[1]-this.xRange[0]);
        let piy = height - (y-this.yRange[0])*height/(this.yRange[1]-this.yRange[0]);
        return [pix,piy];
    }
}
