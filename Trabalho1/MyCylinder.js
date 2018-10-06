class MyCylinder extends CGFobject
{
	constructor(scene, base, top, height, slices, stacks, minS, maxS, minT, maxT) {
		super(scene);
		this.slices = slices;
        this.stacks = stacks;
        this.base = base;
        this.top = top;
        this.height = height;

		this.minS = minS || 0.0;
        this.minT = minT || 0.0;
        this.maxS = maxS || 1.0;
        this.maxT = maxT || 1.0;

		this.initBuffers();
	}


	initBuffers() 
	{

		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

		//alpha in degrees
		var alpha = 360/this.slices;

		//convert to radian
		alpha = (alpha * Math.PI)/180;

        //stack increment
        var stackInc =  this.height/this.stacks;
        var stackHeight = 0;
        var prevStackHeight = 0;

        //texture coordinates
        var texS = 0;
		var texIncS = 1/this.slices;
		var texIncT = 1/this.stacks;
		var prevTexT = 0;
		var nextTexT = 0;

		var sumalpha = 0;

		for (var j = 0; j < this.stacks; j++) {

		    nextTexT += texIncT;
		    stackHeight += stackInc;

            for (var i = j*this.slices*4; i < (j+1)*this.slices*4; i += 4) {

                //vertice 1 da face 0
                this.vertices.push(Math.cos(sumalpha), Math.sin(sumalpha), prevStackHeight);
                this.normals.push(Math.cos(sumalpha), Math.sin(sumalpha), 0);
                this.texCoords.push(texS, prevTexT);
               
                //vertice 1 da face 1
                this.vertices.push(Math.cos(sumalpha), Math.sin(sumalpha), stackHeight);
                this.normals.push(Math.cos(sumalpha), Math.sin(sumalpha), 0);
                this.texCoords.push(texS, nextTexT);
        
                sumalpha += alpha;
                texS += texIncS;

                //vertice 2 da face 0
                this.vertices.push(Math.cos(sumalpha), Math.sin(sumalpha), prevStackHeight);
                this.normals.push(Math.cos(sumalpha), Math.sin(sumalpha), 0);
                this.texCoords.push(texS, prevTexT);

                //vertice 2 da face 1
                this.vertices.push(Math.cos(sumalpha), Math.sin(sumalpha), stackHeight);
                this.normals.push(Math.cos(sumalpha), Math.sin(sumalpha), 0);
                this.texCoords.push(texS, nextTexT);

                this.indices.push(i + 2);
                this.indices.push(i + 1);
                this.indices.push(i);
                this.indices.push(i + 1);
                this.indices.push(i + 2);
                this.indices.push(i + 3);
            }

            texS = 0;
            prevTexT = nextTexT;
            prevStackHeight = stackHeight;
        }

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};