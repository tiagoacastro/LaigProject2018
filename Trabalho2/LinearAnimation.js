class LinearAnimation extends Animation {

    constructor(scene, span, controlPoints) {
        super(scene, span);
        this.controlPoints = controlPoints;

        console.log(this.controlPoints.toString());

        this.velocity = [];
        this.lineSegments = [];
        this.lineSegmentsVel = [];
        this.currLineSegment = 0;
        this.isPointInSegment = function(x, y, z) {
          if (
            (x) <= (Math.max(this.lineSegments[this.currLineSegment][0], this.lineSegments[this.currLineSegment][3])) && (x) >= (Math.min(this.lineSegments[this.currLineSegment][0], this.lineSegments[this.currLineSegment][3])) &&
            (y) <= (Math.max(this.lineSegments[this.currLineSegment][1], this.lineSegments[this.currLineSegment][4])) && (y) >= (Math.min(this.lineSegments[this.currLineSegment][1], this.lineSegments[this.currLineSegment][4])) &&
            (z) <= (Math.max(this.lineSegments[this.currLineSegment][2], this.lineSegments[this.currLineSegment][5])) && (z) >= (Math.min(this.lineSegments[this.currLineSegment][2], this.lineSegments[this.currLineSegment][5]))
          ) {   
            return true;
          } 
          else {
            return false;
          }
        };

        this.originPoint = [];
        this.originPoint.push(this.controlPoints[0][0]); 
        this.originPoint.push(this.controlPoints[0][1]);
        this.originPoint.push(this.controlPoints[0][2]);

        this.currPoint = [];
        this.currPoint.push(this.originPoint[0]);
        this.currPoint.push(this.originPoint[1]);
        this.currPoint.push(this.originPoint[2]);

        this.initLinearAnimation();
    }

    initLinearAnimation() {

      let totalDistX = 0, totalDistY = 0, totalDistZ = 0;

      //determine line segments

      for (var i = 0; i < this.controlPoints.length - 1; i++) {

        this.lineSegments[i] = [ 
          this.controlPoints[i][0], this.controlPoints[i][1], this.controlPoints[i][2], // xi, yi, zi
          this.controlPoints[i+1][0], this.controlPoints[i+1][1], this.controlPoints[i+1][2] // xf, yf, zf
        ] 

        totalDistX += Math.abs(this.controlPoints[i][0] - this.controlPoints[i+1][0]);
        totalDistY += Math.abs(this.controlPoints[i][1] - this.controlPoints[i+1][1]);
        totalDistZ += Math.abs(this.controlPoints[i][2] - this.controlPoints[i+1][2]);
      }

      console.log(totalDistX, totalDistY, totalDistZ);

      //calculate scalar velocity

      this.velocity[0] = totalDistX / this.span;
      this.velocity[1] = totalDistY / this.span;
      this.velocity[2] = totalDistZ / this.span;

      console.log(this.velocity);

      //calculate vectorial velocity

      for (var i = 0; i < this.lineSegments.length; i++) {

        this.lineSegmentsVel[i] = [ 
          (this.lineSegments[i][3] - this.lineSegments[i][0]) * this.velocity[0], // x
          (this.lineSegments[i][4] - this.lineSegments[i][1]) * this.velocity[1], // y
          (this.lineSegments[i][5] - this.lineSegments[i][2]) * this.velocity[2],  // z
        ];
      }

      console.log(this.lineSegmentsVel);
      console.log(this.lineSegments);
  
    }

    apply() {

      //translate the origin point to (velX*deltaTime, velY*deltaTime, velZ*deltaTime)

      //console.log(this.currPoint);

      this.scene.translate(
        this.currPoint[0],
        this.currPoint[1],
        this.currPoint[2]
      );
      this.scene.translate(
        this.originPoint[0],
        this.originPoint[1],
        this.originPoint[2]
      );

    }

    update(deltaTime) {

      this.currPoint[0] +=(this.lineSegmentsVel[this.currLineSegment][0]*(deltaTime/1000));
      this.currPoint[1] +=(this.lineSegmentsVel[this.currLineSegment][1]*(deltaTime/1000));
      this.currPoint[2] +=(this.lineSegmentsVel[this.currLineSegment][2]*(deltaTime/1000));

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
          this.currPoint[0] = this.lineSegments[this.currLineSegment][0];
          this.currPoint[1] = this.lineSegments[this.currLineSegment][1];
          this.currPoint[2] = this.lineSegments[this.currLineSegment][2];
        }
      }

    }

}