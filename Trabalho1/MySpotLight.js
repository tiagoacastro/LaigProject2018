class MySpotLight {
    constructor(id, enabled, angle, exponent, location, target, ambient, diffuse, specular) {
        this.ref = "spot";
        this.id = id || "";
        this.enabled = enabled || 1;
        this.angle = angle || 0;
        this.exponent = exponent || 0;
        this.location = location || [];
        this.target = target || [];
        this.ambient = ambient || [];
        this.diffuse = diffuse || [];
        this.specular = specular || [];
    }
}