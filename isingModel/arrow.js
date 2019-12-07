class Arrow {
    constructor(canvas,pos,direction){
        this.ctx=canvas.getContext('2d');
        this.pos=pos;
        this.direction=direction;
        this.length = 16;
        this.arrowWidth=6;
        this.spin=0;
        if(this.direction == 'up'){this.spin=-1}
        if(this.direction == 'down'){this.spin=1}

    }
    draw(){
        this.ctx.beginPath();
        this.ctx.moveTo(this.pos[0],this.pos[1]-(this.length/2.));
        this.ctx.lineTo(this.pos[0],this.pos[1]+(this.length/2.));
        this.ctx.stroke();
        var dir = this.spin;
//        if(this.direction == 'up') { dir = -1; }
//        if(this.direction == 'down') { dir = 1;}
        this.ctx.beginPath();
        this.ctx.moveTo(this.pos[0]-(this.arrowWidth/2.),this.pos[1]);
        this.ctx.lineTo(this.pos[0],this.pos[1]+(this.length*dir/2.));
        this.ctx.lineTo(this.pos[0]+(this.arrowWidth/2.),this.pos[1]);
        this.ctx.stroke();
        }
    flip(){
        if(this.direction=='up'){this.direction='down';}
        if(this.direction=='down'){this.direction='up';}
        this.spin = this.spin*-1;
    }
}
