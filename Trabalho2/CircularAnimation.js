var DEGREE_TO_RAD = Math.PI / 180;

class CircularAnimation extends Animation {

    constructor(scene, span, centre, radius, initAngle, rotAngle) {
        super(scene, span);
        this.centre = centre;
        this.radius = radius;
        this.initAngle = initAngle * DEGREE_TO_RAD;
        this.rotAngle = rotAngle * DEGREE_TO_RAD;
        
        if (this.rotAngle > 0) {
            this.initOrientation = Math.PI/2;
        } else {
            this.initOrientation = -Math.PI/2;
        }

        this.angularspeed = 0;
        this.currAngle = this.initAngle;
        this.isDone = 0;
        this.isActive = 0;
        this.initCircularAnimation();
    }

    initCircularAnimation() {
        this.currAngle = this.initAngle * DEGREE_TO_RAD;
        if (this.rotAngle >= 0) {
            this.angularspeed = this.rotAngle / this.span;
        } else {
            this.angularspeed = -this.rotAngle / this.span;
        }
    }

    apply() {
        this.scene.translate(this.centre[0], this.centre[1], this.centre[2]);
        this.scene.rotate(this.currAngle, 0, 1, 0);
        this.scene.translate(0, 0, this.radius);
        this.scene.rotate(this.initOrientation, 0, 1, 0);

        //console.log((((Math.PI/2) - this.currAngle) * 180)/Math.PI);
        
        if (this.rotang > 0) {
            this.scene.rotate(Math.PI, 0, 1, 0);
        }
        
    }

    update(deltaTime) {

        //console.log(this.isActive);

        if (this.isActive) {
            this.currAngle += this.angularspeed * (deltaTime/1000);
            if (this.currAngle >= (this.initAngle+this.rotAngle)) {
                this.reset();
            }
        }
    }

    reset() {
        this.currAngle = this.initAngle;
        this.isDone = 1;
    }

}