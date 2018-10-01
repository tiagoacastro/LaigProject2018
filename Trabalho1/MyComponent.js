class MyComponent {
    constructor(transformation, materials, texture, textureLengthS, textureLengthT, children) {
        this.transformation = transformation || [];
        this.materials = materials || [];
        this.texture = texture || "";
        this.textureLengthS = textureLengthS || 1;
        this.textureLengthT = textureLengthT || 1;
    }
}