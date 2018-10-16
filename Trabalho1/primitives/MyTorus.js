class MyTorus extends CGFobject
{
	constructor(scene, inner, outer, slices, loops) {
		super(scene);
    
        this.slices = slices;
        this.loops = loops;

        this.r = inner;

        this.dist = outer;

		this.initBuffers();
	}


	initBuffers() 
	{
		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

        var slicesAng = 2 * Math.PI / this.slices;
        var loopsAng = 2 * Math.PI / this.loops;  

        var patchLengthx = 1 / this.slices;
        var patchLengthy = 1 / this.loops;
        var xCoord = 0;
        var yCoord = 0;

        for (var l = 0; l < this.loops+1 ; l++) {

            var x = Math.cos(l * loopsAng) * this.dist;
            var y = Math.sin(l * loopsAng) * this.dist;

            for (var s = 0; s <= this.slices; s++) {
    
                this.vertices.push(Math.cos(s * slicesAng) * this.r * Math.cos(l * loopsAng) + x, Math.cos(s * slicesAng) * this.r * Math.sin(l * loopsAng) + y, Math.sin(s * slicesAng) * this.r);
                this.normals.push(Math.cos(l * loopsAng) * Math.cos(s * slicesAng), Math.cos(s * slicesAng) * Math.sin(l * loopsAng), Math.sin(s * slicesAng));
    
                this.texCoords.push(xCoord, yCoord);
    
                yCoord += patchLengthy;
            }

            yCoord = 0;
            xCoord += patchLengthx; 
        }

        var sides = this.slices +1;

        for (var l = 0; l < this.loops; l++) {
            for (var s = 0; s < this.slices; s++) {

                this.indices.push(sides*l+s, sides*(l+1)+s, sides*l+s+1);
                this.indices.push(sides*l+s+1, sides*(l+1)+s, sides*(l+1)+s+1);

                this.indices.push(sides*l+s, sides*l+s+1, sides*(l+1)+s);
                this.indices.push(sides*l+s+1, sides*(l+1)+s+1, sides*(l+1)+s);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
}; 