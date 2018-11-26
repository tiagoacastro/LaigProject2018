class MyWater extends MyPlane {

  constructor(scene, wavemap, texture, parts, heightScale, texScale) {
    super(scene, parts, parts);
    this.parts = parts;
    this.wavemap = wavemap;
    this.texture = texture;
    this.heightScale = heightScale;
    this.texScale = texScale;
    this.offset = 0;
    this.speed = 0.01;

    this.cloudmap = new CGFtexture(this.scene, "./scenes/images/water.jpg");
    this.cloudTexture = new CGFtexture(this.scene, "./scenes/images/water.jpg");

    this.shader = new CGFshader(this.scene.gl, "shaders/water.vert", "shaders/water.frag");
    this.cloudShader = new CGFshader(this.scene.gl, "shaders/clouds.vert", "shaders/clouds.frag");

    this.shader.setUniformsValues({wavemap: 1, texture: 0, offset: this.offset, texScale: this.texScale, heightScale: this.heightScale});
    this.cloudShader.setUniformsValues({cloudmap: 1, texture: 0, offset: this.offset});
  };

  update(deltaTime) {
    
    this.offset += this.speed * (deltaTime/1000);
    this.shader.setUniformsValues({offset: this.offset});
    this.cloudShader.setUniformsValues({offset: this.offset});
  };

  display(){

    this.scene.setActiveShader(this.shader);

    this.scene.pushMatrix();
      this.texture.bind(0);
      this.wavemap.bind(1);
      this.obj.display();
    this.scene.popMatrix();

    this.scene.gl.blendFunc(this.scene.gl.GL_SRC_ALPHA, this.scene.gl.GL_ONE_MINUS_SRC_ALPHA);
    this.scene.gl.enable(this.scene.gl.GL_BLEND);
    this.scene.setActiveShader(this.cloudShader);

    this.scene.pushMatrix();
      this.cloudTexture.bind(0);
      this.cloudmap.bind(1);
      this.scene.translate(0,1.5,0);
      this.obj.display();
    this.scene.popMatrix();

    this.scene.gl.disable(this.scene.gl.GL_BLEND);
    this.scene.setActiveShader(this.scene.defaultShader);
  };

}
  