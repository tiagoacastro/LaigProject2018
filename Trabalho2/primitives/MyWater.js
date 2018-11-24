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

    this.shader = new CGFshader(this.scene.gl, "shaders/water.vert", "shaders/water.frag");
    this.shader.setUniformsValues({wavemap: 1});
    this.shader.setUniformsValues({texture: 0});
    this.shader.setUniformsValues({offset: this.offset});
    this.shader.setUniformsValues({texScale: this.texScale});
    this.shader.setUniformsValues({heightScale: this.heightScale});
  };

  update(deltaTime) {
    
    this.offset += this.speed * (deltaTime/1000);
    this.shader.setUniformsValues({offset: this.offset});
  };

  display(){

    this.scene.setActiveShader(this.shader);

    this.scene.pushMatrix();
      this.texture.bind(0);
      this.wavemap.bind(1);
      this.obj.display();
    this.scene.popMatrix();

    this.scene.setActiveShader(this.scene.defaultShader);
  };

}
  