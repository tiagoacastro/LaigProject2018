class MyTerrain extends MyPlane {

  constructor(scene, heightmap, texture, parts, scale) {
    super(scene, parts, parts);
    this.heightmap = heightmap;
    this.texture = texture;
    this.scale = scale;

    this.shader = new CGFshader(this.scene.gl, "shaders/terrain.vert", "shaders/terrain.frag");
    this.shader.setUniformsValues({heightmap: 1});
    this.shader.setUniformsValues({texture: 0});
    this.shader.setUniformsValues({scale: this.scale});

    this.initBuffers();
  };

  display(){

    this.scene.setActiveShader(this.shader);

    this.scene.pushMatrix();
      this.texture.bind(0);
      this.heightmap.bind(1);
      this.obj.display();
    this.scene.popMatrix();

    this.scene.setActiveShader(this.scene.defaultShader);
  };

}
  