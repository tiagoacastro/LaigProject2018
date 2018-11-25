#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D texture;
uniform sampler2D cloudmap;
uniform float offset;

void main() {

  vec4 color = texture2D(cloudmap, vTextureCoord + offset);
  //color.a = 0.3;

  gl_FragColor = color;

    if (color.r < 0.7) {
      discard;
    }

}