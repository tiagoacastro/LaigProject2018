#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform sampler2D cloudmap; 
uniform float offset;

void main() {

    vTextureCoord = aTextureCoord + offset;

    vec4 newVertex = vec4(aVertexPosition.x, aVertexPosition.y + texture2D(cloudmap, vTextureCoord).r * 0.05, aVertexPosition.z,
    1.0); 
    //texture2D(cloud, aTextureCoord).r was choosen arbitrarily, we could have picked the g or b values as well, since it's a grayscale map
    
    gl_Position = uPMatrix * uMVMatrix * newVertex;
}