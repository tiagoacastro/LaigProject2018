class MyMaterial {
    constructor(id, shininess, emission, ambient, diffuse, specular) {
        this.id = id || "";
        this.shininess = shininess || 0;
        this.emission = emission || [];
        this.ambient = ambient || [];
        this.diffuse = diffuse || [];
        this.specular = specular || [];
        }
}