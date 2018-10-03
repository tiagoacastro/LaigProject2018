class MyTransformation {
    constructor(id, translate, rotate, scale) {
        this.id = id || "";
        this.translate = translate || [];
        this.rotate = rotate || [];
        this.scale = scale || [];
    }
}