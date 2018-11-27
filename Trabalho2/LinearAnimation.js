class LinearAnimation extends Animation {

    constructor(scene, span, controlPoints) {
        super(scene, span);
        this.controlPoints = controlPoints;
        this.timeCounter = 0;
        this.velocity = [];
        this.lineSegments = [];
        this.lineSegmentsVel = [];
        this.lineSegmentsTimes = [];
        this.lineSegmentsDist = [];
        this.currLineSegment = 0;
        this.isDone = 0;
        this.isActive = 0;
        this.incAngle = 0;
        this.getCurrSegment = function(timestamp) {
          var currSegment = -1;

          for (let i = 0; i < this.lineSegmentsTimes.length; i++) {
            if (timestamp >= this.lineSegmentsTimes[i][0] && timestamp < this.lineSegmentsTimes[i][1]) {
              currSegment = i;
              break;
            }
          }

          if (currSegment == -1) {
            //assuming that the timestamp cant be negative and the only reason for currSegment to still be -1 once it gets here is because the animation time was surpassed
            this.timeCounter = timestamp % this.lineSegmentsTimes[this.lineSegmentsTimes.length-1][1]; // timestamp % animationLength
          }

          return currSegment;

        };

        this.originPoint = [];
        this.originPoint.push(this.controlPoints[0][0]); 
        this.originPoint.push(this.controlPoints[0][1]);
        this.originPoint.push(this.controlPoints[0][2]);

        this.currPoint = [];
        this.currPoint.push(this.originPoint[0]);
        this.currPoint.push(this.originPoint[1]);
        this.currPoint.push(this.originPoint[2]);

        this.orientation = 0;

        this.initLinearAnimation();
    }

    initLinearAnimation() {

      let totalDist = 0, totalDistSeg = 0;

      //determine line segments

      for (var i = 0; i < this.controlPoints.length - 1; i++) {

        this.lineSegments[i] = [ 
          this.controlPoints[i][0], this.controlPoints[i][1], this.controlPoints[i][2], // xi, yi, zi
          this.controlPoints[i+1][0], this.controlPoints[i+1][1], this.controlPoints[i+1][2] // xf, yf, zf
        ]

        totalDistSeg = 
          Math.sqrt(
            Math.pow(Math.abs(this.controlPoints[i][0] - this.controlPoints[i+1][0]), 2) +
            Math.pow(Math.abs(this.controlPoints[i][1] - this.controlPoints[i+1][1]), 2) +
            Math.pow(Math.abs(this.controlPoints[i][2] - this.controlPoints[i+1][2]), 2)
          );
        this.lineSegmentsDist[i] = totalDistSeg;
        totalDist += totalDistSeg;
      }

      this.speed = totalDist/this.span;

      //calculate vectorial velocity

      for (var i = 0; i < this.lineSegments.length; i++) {

        this.lineSegmentsVel[i] = [ 
          ((this.lineSegments[i][3] - this.lineSegments[i][0]) / this.lineSegmentsDist[i]) * this.speed, // x
          ((this.lineSegments[i][4] - this.lineSegments[i][1]) / this.lineSegmentsDist[i]) * this.speed, // y
          ((this.lineSegments[i][5] - this.lineSegments[i][2]) / this.lineSegmentsDist[i]) * this.speed,  // z
        ];
      }

      //determine timestamps for each segment [ti, tf]

      let beginTime = 0, endTime = 0;

      for (var i = 0; i < this.lineSegments.length; i++) {

        endTime =  
          (Math.sqrt(
            Math.pow(this.lineSegments[i][3] - this.lineSegments[i][0], 2) +
            Math.pow(this.lineSegments[i][4] - this.lineSegments[i][1], 2) +
            Math.pow(this.lineSegments[i][5] - this.lineSegments[i][2], 2) 
          ) / this.speed) + beginTime;

        this.lineSegmentsTimes[i] = [beginTime, endTime];

        beginTime = endTime;
      }

      this.inc = 2*Math.PI / this.span;

      //set object orientation

      this.orientation = Math.atan2(this.lineSegments[this.currLineSegment][5] - this.lineSegments[this.currLineSegment][2], this.lineSegments[this.currLineSegment][3] - this.lineSegments[this.currLineSegment][0]);
    }

    apply() {

      this.scene.translate(
        this.currPoint[0],
        this.currPoint[1],
        this.currPoint[2]
      );
      this.scene.rotate( Math.PI / 2 - this.orientation, 0, 1, 0);

      this.scene.rotate(this.incAngle, 0, 0, 1);
    }

    update(deltaTime) {

      if (this.isActive) {

        this.timeCounter += (deltaTime/1000);
        this.currLineSegment = this.getCurrSegment(this.timeCounter);

        //reset animation
        if (this.currLineSegment == -1) {
          this.reset();
          return;
        }

        var timeElapsedInSegment = this.timeCounter - this.lineSegmentsTimes[this.currLineSegment][0];
        
        this.currPoint[0] = this.lineSegments[this.currLineSegment][0] + (this.lineSegmentsVel[this.currLineSegment][0]*timeElapsedInSegment);
        this.currPoint[1] = this.lineSegments[this.currLineSegment][1] + (this.lineSegmentsVel[this.currLineSegment][1]*timeElapsedInSegment);
        this.currPoint[2] = this.lineSegments[this.currLineSegment][2] + (this.lineSegmentsVel[this.currLineSegment][2]*timeElapsedInSegment);

        this.orientation = Math.atan2(this.lineSegments[this.currLineSegment][5] - this.lineSegments[this.currLineSegment][2], this.lineSegments[this.currLineSegment][3] - this.lineSegments[this.currLineSegment][0]);

        this.incAngle += this.inc * (deltaTime/1000);
      }
    }

    reset() {
      this.isDone = 1;
      this.currLineSegment = 0;
      this.timeCounter = 0;
      this.currPoint[0] = this.originPoint[0];
      this.currPoint[1] = this.originPoint[1];
      this.currPoint[2] = this.originPoint[2];
      this.orientation = Math.atan2(this.lineSegments[0][5] - this.lineSegments[0][2], this.lineSegments[0][3] - this.lineSegments[0][0]);
    }

}