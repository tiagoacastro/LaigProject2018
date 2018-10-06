class MySphere extends CGFobject {
    
    constructor(scene, radius, slices, stacks, minS, maxS, minT, maxT){
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;

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

        //texture coordinates
        var texS = 0;
        var texIncS = 1/this.slices;
        var texIncT = 1/this.stacks;
        var prevTexT = 0;
        var nextTexT = 0;


        //alpha in degrees
        var alpha = 360/this.slices;

        //convert to radian
        alpha = (alpha * Math.PI)/180;

        //radius of both surfaces
        var radiusTop = this.radius;
        var radiusBottom = this.radius;

        //height of each stack
        var stackHeight = this.radius/this.stacks;

        var sumalpha = 0;
        var heightSum = 0;

        for (var j = 0; j < this.stacks; j++) {

            nextTexT += texIncT;

            for (var i = j*this.slices*4; i < (j+1)*this.slices*4; i += 4) {

                //calculating the radius of the top
                radiusTop = Math.sqrt(this.radius-(((j+1)*stackHeight)*((j+1)*stackHeight)));

                //vertice 1 da face 0
                this.vertices.push(radiusBottom*Math.cos(sumalpha),radiusBottom*Math.sin(sumalpha), heightSum);
                this.normals.push(radiusBottom*Math.cos(sumalpha), radiusBottom*Math.sin(sumalpha), 0);
                this.texCoords.push(texS, prevTexT);

                //vertice 1 da face 1
                this.vertices.push(radiusTop*Math.cos(sumalpha), radiusTop*Math.sin(sumalpha), heightSum+stackHeight);
                this.normals.push(radiusTop*Math.cos(sumalpha), radiusTop*Math.sin(sumalpha), 0);
                this.texCoords.push(texS, nextTexT);

                sumalpha += alpha;
                texS += texIncS;

                //vertice 2 da face 0
                this.vertices.push(radiusBottom*Math.cos(sumalpha), radiusBottom*Math.sin(sumalpha), heightSum);
                this.normals.push(radiusBottom*Math.cos(sumalpha),radiusBottom*Math.sin(sumalpha), 0);
                this.texCoords.push(texS, prevTexT);

                //vertice 2 da face 1
                this.vertices.push(radiusTop*Math.cos(sumalpha), radiusTop*Math.sin(sumalpha), heightSum+stackHeight);
                this.normals.push(radiusTop*Math.cos(sumalpha), radiusTop*Math.sin(sumalpha), 0);
                this.texCoords.push(texS, nextTexT);

                this.indices.push(i + 2);
                this.indices.push(i + 1);
                this.indices.push(i);
                this.indices.push(i + 1);
                this.indices.push(i + 2);
                this.indices.push(i + 3);

            }
            
            sumalpha = 0;
            radiusBottom = radiusTop;
            heightSum += stackHeight;
            texS = 0;
            prevTexT = nextTexT;

        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};