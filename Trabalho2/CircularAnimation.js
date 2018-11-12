var DEGREE_TO_RAD = Math.PI / 180;

class CircularAnimation extends Animation {

    constructor(scene, span, centre, radius, initAngle, rotAngle) {
        super(scene, span);
        this.centre = centre;
        this.radius = radius;
        this.initAngle = initAngle * DEGREE_TO_RAD;
        this.rotAngle = rotAngle * DEGREE_TO_RAD;
        this.velocity = 0;
        this.angularVelocity = 0;
        this.currAngle = initAngle;
        this.initCircularAnimation();
    }

    initCircularAnimation() {
        this.currAngle = this.initAngle * DEGREE_TO_RAD;
        let arcLength = this.radius * this.rotAngle;
        this.velocity = arcLength / this.span;
        this.angularVelocity = this.velocity / this.radius;
    }

    apply() {
        this.scene.translate(this.centre[0], this.centre[1], this.centre[2]);
        this.scene.rotate(this.currAngle, 0, 1, 0);
        this.scene.translate(0, 0, this.radius);
    }

    update(deltaTime) {
        this.currAngle += this.angularVelocity * (deltaTime/1000);
        if (this.currAngle >= (this.initAngle+this.rotAngle)) {
            this.currAngle = this.initAngle;
        }
    }

}