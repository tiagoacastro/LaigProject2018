class MyMaterial {
    constructor(id, emission, ambient, diffuse, specular) {
        this.id = id || "";
        this.emission = emission || [];
        this.ambient = ambient || [];
        this.diffuse = diffuse || [];
        this.specular = specular || [];
        }
}