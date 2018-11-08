class Animation {

    constructor(scene, object, deltaTime) {
      this.scene = scene;
      this.object = object;
      this.deltaTime = deltaTime;
    }

    setObject(object) {
        this.object = object;
    }

    setDeltaTime(deltaTime) {
        this.deltaTime = deltaTime; 
    } 

    getObject() {
        return this.object;
    }

    getDeltaTime() {
        return this.deltaTime;
    }

    apply() {

    }

    update() {

    }

}