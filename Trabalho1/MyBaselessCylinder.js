class MyBaselessCylinder extends CGFobject
{
	constructor(scene, base, top, height, slices, stacks)
	{
		super(scene);
        
        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

		this.initBuffers();
	};

    initBuffers()
	{

        this.vertices = [];
        this.indices = [];
        this.normals = [];
		this.texCoords = [];

        var ang=2*Math.PI/this.slices;
        let dif = this.base - this.top;
        let abs = dif;
        if(abs < 0)
            abs = -abs;
        let incl = Math.tanh(abs/this.height);

        for(let j =0; j <= this.stacks; j++){
            let r = this.base - dif*j/this.stacks;

            for(let i=0; i < this.slices; i++){
                this.vertices.push(r*Math.cos(ang *i),r*Math.sin(ang*i),this.height*j/this.stacks);
                this.normals.push(Math.cos(i*ang) * Math.cos(incl),Math.sin(i*ang) * Math.cos(incl), Math.sin(incl));
                this.texCoords.push(i/this.slices,j/this.stacks);
            }
        }

        var numPontos=this.stacks*this.slices;

        for (let i =0; i < numPontos; i++){
            if((i+1)%this.slices==0){
                this.indices.push(i,i+1-this.slices, i+1);
                this.indices.push(i,i+1, i+this.slices);
            }
            else {
                this.indices.push(i, i+1, i+1+this.slices);
                this.indices.push(i, i+1+this.slices, i+this.slices);
            }
        }
        

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};