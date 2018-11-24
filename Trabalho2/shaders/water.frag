#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D texture;
uniform float texScale;

void main() {
    gl_FragColor = texture2D(texture, vTextureCoord);
}