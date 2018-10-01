class MyOmniLight {

    constructor(id, enabled, location, ambient, difuse, specular) {
        this.id = id;
        this.enabled = enabled || 0;
        this.location = location || [0,0,0];
        this.ambient = ambient || [0,0,0];
        this.difuse = difuse || [0,0,0];
        this.specular = specular || [0,0,0];
    }

}