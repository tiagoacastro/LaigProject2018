#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D texture;
uniform sampler2D cloudmap;
uniform float offset;

void main() {

  vec4 color = texture2D(texture, vTextureCoord + offset);
  color.a = 0.8;

  gl_FragColor = color * color.a;

    if (texture2D(cloudmap, vTextureCoord + offset).r < 0.7) {
      discard;
    }

}