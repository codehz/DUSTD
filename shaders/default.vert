#version 300 es

layout(location = 0) in ivec2 a_position;
layout(location = 1) in vec2 a_texcoord;
layout(location = 2) in int a_textsele;

uniform ivec2 u_resolution;

out vec2 v_texcoord;
flat out int v_textsele;
 
void main() {
  vec2 zeroToOne = vec2(a_position) / vec2(u_resolution);
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  v_texcoord = a_texcoord;
  v_textsele = a_textsele;
}