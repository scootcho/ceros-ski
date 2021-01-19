import * as Constants from '../Constants';

export class Snow {
    // credit: https://codepen.io/oklai/pen/DvChG

    mp = 50; //max particles
    particles = [];
    angle = 0;
    W = Constants.GAME_WIDTH;
    H = Constants.GAME_HEIGHT;

    constructor(canvas) {
        canvas.width = this.W;
        canvas.height = this.H;
        this.ctx = canvas.ctx;

        for (var i = 0; i < this.mp; i++) {
            this.particles.push({
                x: Math.random() * this.W, //x-coordinate
                y: Math.random() * this.H, //y-coordinate
                r: Math.random() * 4 + 1, //radius
                d: Math.random() * this.mp, //density
            });
        }
    }

    //draw the flakes
    draw() {
        this.ctx.clearRect(0, 0, this.W, this.H);

        this.ctx.fillStyle = 'Aqua';
        this.ctx.beginPath();
        for (var i = 0; i < this.mp; i++) {
            var p = this.particles[i];
            this.ctx.moveTo(p.x, p.y);
            this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
        }
        this.ctx.fill();
        this.update();
    }

    //Function to move the snowflakes
    //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
    update() {
        this.angle += 0.01;
        for (var i = 0; i < this.mp; i++) {
            var p = this.particles[i];
            //Updating X and Y coordinates
            //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
            //Every particle has its own density which can be used to make the downward movement different for each flake
            //Lets make it more random by adding in the radius
            p.y += Math.cos(this.angle + p.d) + 1 + p.r / 2;
            p.x += Math.sin(this.angle) * 2;

            //Sending flakes back from the top when it exits
            //Lets make it a bit more organic and let flakes enter from the left and right also.
            if (p.x > this.W + 5 || p.x < -5 || p.y > this.H) {
                if (i % 3 > 0) {
                    //66.67% of the flakes
                    this.particles[i] = { x: Math.random() * this.W, y: -10, r: p.r, d: p.d };
                } else {
                    //If the flake is exitting from the right
                    if (Math.sin(this.angle) > 0) {
                        //Enter from the left
                        this.particles[i] = { x: -5, y: Math.random() * this.H, r: p.r, d: p.d };
                    } else {
                        //Enter from the right
                        this.particles[i] = {
                            x: this.W + 5,
                            y: Math.random() * this.H,
                            r: p.r,
                            d: p.d,
                        };
                    }
                }
            }
        }
    }
}
