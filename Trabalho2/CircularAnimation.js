class CircularAnimation extends Animation {

    constructor(object, deltaTime, centre, radius, initAngle, rotAngle) {
        super(object, deltaTime);
        this.centre = centre;
        this.radius = radius;
        this.initAngle = initAngle;
        this.rotAngle = rotAngle;
    }

    setCentre(centre) {
        this.centre = centre;
    }

    setRadius(radius) {
        this.radius = radius;
    }

    setInitAngle(initAngle) {
        this.initAngle = initAngle;
    }

    setRotAngle(rotAngle) {
        this.rotAngle = rotAngle;
    }

    getCentre() {
        return this.centre;
    }

    getRadius() {
        return this.radius;
    }

    getInitAngle() {
        return this.initAngle;
    }

    getRotAngle() {
        return this.rotAngle;
    }

}