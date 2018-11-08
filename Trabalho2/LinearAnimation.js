class LinearAnimation extends Animation {

    constructor(scene, object, deltaTime, controlPoints) {
        super(scene, object, deltaTime);
        this.controlPoints = controlPoints;
        this.velocity = [];
        this.lineSegments = [];
        this.lineSegmentsVel = [];
        this.currLineSegment = 0;
        this.isPointInSegment = function(x, y, z) {
          if (
            Math.abs(x) <= Math.abs(max(this.lineSegments[this.currLineSegment][0], this.lineSegments[this.currLineSegment][3])) && Math.abs(x) >= Math.abs(min(this.lineSegments[this.currLineSegment][0], this.lineSegments[this.currLineSegment][3])) &&
            Math.abs(y) <= Math.abs(max(this.lineSegments[this.currLineSegment][1], this.lineSegments[this.currLineSegment][4])) && Math.abs(x) >= Math.abs(min(this.lineSegments[this.currLineSegment][1], this.lineSegments[this.currLineSegment][4])) &&
            Math.abs(z) <= Math.abs(max(this.lineSegments[this.currLineSegment][2], this.lineSegments[this.currLineSegment][5])) && Math.abs(x) >= Math.abs(min(this.lineSegments[this.currLineSegment][2], this.lineSegments[this.currLineSegment][5]))
          ) {   
            return true;
          } 
          else {
            return false;
          }
        };
        this.originPoint = controlPoints[0];
        this.currPoint = originPoint;
    }

    initLinearAnimation() {

      let totalDistX = 0, totalDistY = 0, totalDistZ = 0;

      //determine line segments

      for (var i = 0; i < this.controlPoints.length - 1; i++) {

        this.lineSegments[i] = [ 
          controlPoints[i][0], controlPoints[i][1], controlPoints[i][2], // xi, yi, zi
          controlPoints[i+1][0], controlPoints[i+1][1], controlPoints[i+1][2] // xf, yf, zf
        ] 

        totalDistX += (controlPoints[i][0] - controlPoints[i+1][0]);
        totalDistY += (controlPoints[i][1] - controlPoints[i+1][1]);
        totalDistZ += (controlPoints[i][2] - controlPoints[i+1][2]);
      }

      //calculate scalar velocity

      this.velocity[0] = totalDistX / this.deltaTime;
      this.velocity[1] = totalDistY / this.deltaTime;
      this.velocity[2] = totalDistZ / this.deltaTime;

      //calculate vectorial velocity

      for (var i = 0; i < this.lineSegments.length; i++) {

        this.lineSegmentsVel[i] = [ 
          (this.lineSegments[i][3] - this.lineSegments[i][0]) * this.velocity[0], // x
          (this.lineSegments[i][4] - this.lineSegments[i][1]) * this.velocity[1], // y
          (this.lineSegments[i][5] - this.lineSegments[i][2]) * this.velocity[2],  // z
        ] 
      }
  
    }

    apply() {

    }

    update(deltaTime) {

      this.currPoint[0] = this.originPoint[0]+(this.lineSegmentsVel[this.currLineSegment][0]*deltaTime);
      this.currPoint[1] = this.originPoint[1]+(this.lineSegmentsVel[this.currLineSegment][1]*deltaTime);
      this.currPoint[2] = this.originPoint[2]+(this.lineSegmentsVel[this.currLineSegment][2]*deltaTime);

      //check if point is within the current line segment, if not, increment the currLineSegment value
      //the values reset after finishing the last line segment is traversed, so we're assuming the animation should be looping

      if (!this.isPointInSegment(this.currPoint[0], this.currPoint[1], this.currPoint[2])) {
        if (this.currLineSegment == this.lineSegments.length-1) {
          this.currLineSegment = 0;
          this.currPoint[0] = this.originPoint[0];
          this.currPoint[1] = this.originPoint[1];
          this.currPoint[2] = this.originPoint[2];
        } else {
          this.currLineSegment++;
        }
      }

      //translate the origin point to (velX*deltaTime, velY*deltaTime, velZ*deltaTime)

      this.scene.translate(
        this.currPoint[0],
        this.currPoint[1],
        this.currPoint[2]
      );

    }

}