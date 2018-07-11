#version 300 es

precision lowp float;
 
in vec2 v_texcoord;
flat in int v_textsele;

uniform sampler2D u_texture0;
uniform sampler2D u_texture1;
uniform sampler2D u_texture2;

out vec4 fragcolor;

#define texturefor(x) texture(x, uv)

vec4 getSample(int ndx, vec2 uv) {
  if (ndx == 0) {
    return texturefor(u_texture0);
  } else if (ndx == 1) {
    return texturefor(u_texture1);
  } else {
    return texturefor(u_texture2);
  }
}
 
void main() {
  fragcolor = getSample(v_textsele, v_texcoord);
}