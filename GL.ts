import { gl } from './prepare'
import defFrag from './shaders/default.frag!text'
import defVert from './shaders/default.vert!text'

export interface ITexture {
  width : number
  height: number
  source: WebGLTexture
  idx   : number
}

let program: WebGLProgram
let debugShaders: WEBGL_debug_shaders | null
let resolutionLocation: WebGLUniformLocation
const SIZE = 1048576
let rectbuffer: WebGLBuffer
let textbuffer: WebGLBuffer
let selebuffer: WebGLBuffer
const rectarray = new Int16Array(SIZE * 12)
const textarray = new Float32Array(SIZE * 12)
const selearray = new Int8Array(SIZE * 6)
const rectcache = new Int16Array(12)
const textcache = new Float32Array(12)
const idxcache = new Int8Array(6)
let ptr = 0

function loadShader(type: number, source: string) {
  const shader = gl.createShader(type)
  gl.shaderSource (shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`Shader failed to compile: ${gl.getShaderInfoLog(shader)}`)
  }
  return shader
}

function loadProgram(vertSource, fragSource) {
  const vert = loadShader(gl.VERTEX_SHADER, vertSource)!
  const frag = loadShader(gl.FRAGMENT_SHADER, fragSource)!

  console.log(debugShaders!.getTranslatedShaderSource(vert))
  console.log(debugShaders!.getTranslatedShaderSource(frag))

  program = gl.createProgram()!
  gl.attachShader(program, vert)
  gl.attachShader(program, frag)
  gl.linkProgram (program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Program failed to link: ${gl.getShaderInfoLog(program)}`)
  }
}

function initGL() {
  debugShaders = gl.getExtension('WEBGL_debug_shaders')
  const debug = gl.getExtension('WEBGL_debug')
  if (debug) {
    console.log('exi')
    debug.addEventListener('message', console.log)
  }
  loadProgram(defVert, defFrag)
  gl.colorMask(true, true, true, false)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
  gl.useProgram(program)
  rectbuffer = gl.createBuffer()!
  textbuffer = gl.createBuffer()!
  selebuffer = gl.createBuffer()!

  const positionLocation = 0 // gl.getAttribLocation (program, 'a_position')
  const texcoordLocation = 1 // gl.getAttribLocation (program, 'a_texcoord')
  const textseleLocation = 2 // gl.getAttribLocation (program, 'a_textsele')

  gl.bindBuffer(gl.ARRAY_BUFFER, rectbuffer)
  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribIPointer(positionLocation, 2, gl.SHORT, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, textbuffer)
  gl.enableVertexAttribArray(texcoordLocation)
  gl.vertexAttribPointer (texcoordLocation, 2, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, selebuffer)
  gl.enableVertexAttribArray(textseleLocation)
  gl.vertexAttribIPointer(textseleLocation, 1, gl.BYTE, 0, 0)

  resolutionLocation = gl.getUniformLocation(program, 'u_resolution')!
}

let minpos = 0

export function loadTexture(img: HTMLImageElement) {
  const tex = gl.createTexture()
  gl.activeTexture(gl.TEXTURE0 + minpos)
  gl.bindTexture  (gl.TEXTURE_2D, tex)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texImage2D   (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
  const uniform = gl.getUniformLocation(program, `u_texture${minpos}`)
  gl.uniform1i(uniform, minpos)
  return {
    width : img.naturalWidth,
    height: img.naturalHeight,
    source: tex!,
    idx   : minpos++,
  }
}

export interface IRect {
  x: number,
  y: number,
  w: number,
  h: number,
}

function pushRectBuffer({ x, y, w, h }: IRect) {
  const x1 = x
  const x2 = x + w
  const y1 = y
  const y2 = y + h

  rectcache[0] = x1
  rectcache[1] = y1
  rectcache[2] = x2
  rectcache[3] = y1
  rectcache[4] = x1
  rectcache[5] = y2
  rectcache[6] = x1
  rectcache[7] = y2
  rectcache[8] = x2
  rectcache[9] = y1
  rectcache[10] = x2
  rectcache[11] = y2

  rectarray.set(rectcache, 12 * ptr)
}

function rotate(x, y, cx, cy, deg) {
  const [ox, oy] = [x - cx, y - cy]
  const [c, s] = [Math.cos(deg), Math.sin(deg)]
  return [c * ox - s * oy + cx, s * ox + c * oy + cy]
}

function pushRectBufferR({ x, y, w, h }: IRect, deg: number, { x: rcx, y: rcy }: { x: number, y: number }) {
  const sx1 = x
  const sx2 = x + w
  const sy1 = y
  const sy2 = y + h
  const cx = x + rcx
  const cy = y + rcy

  const [x1, y1] = rotate(sx1, sy1, cx, cy, deg)
  const [x2, y2] = rotate(sx2, sy1, cx, cy, deg)
  const [x3, y3] = rotate(sx1, sy2, cx, cy, deg)
  const [x4, y4] = rotate(sx2, sy2, cx, cy, deg)

  rectcache[0] = x1
  rectcache[1] = y1
  rectcache[2] = x2
  rectcache[3] = y2
  rectcache[4] = x3
  rectcache[5] = y3
  rectcache[6] = x3
  rectcache[7] = y3
  rectcache[8] = x2
  rectcache[9] = y2
  rectcache[10] = x4
  rectcache[11] = y4

  rectarray.set(rectcache, 12 * ptr)
}

function pushTextBuffer({ x, y, w, h }: IRect, size: {width: number, height: number}) {
  const x1 = x / size.width
  const x2 = (x + w) / size.width
  const y1 = y / size.height
  const y2 = (y + h) / size.height

  textcache[0] = x1
  textcache[1] = y1
  textcache[2] = x2
  textcache[3] = y1
  textcache[4] = x1
  textcache[5] = y2
  textcache[6] = x1
  textcache[7] = y2
  textcache[8] = x2
  textcache[9] = y1
  textcache[10] = x2
  textcache[11] = y2

  textarray.set(textcache, 12 * ptr)
}

function pushSelectArray(idx: number) {
  idxcache[0] = idx
  idxcache[1] = idx
  idxcache[2] = idx
  idxcache[3] = idx
  idxcache[4] = idx
  idxcache[5] = idx

  selearray.set(idxcache, 6 * ptr)
}

export function drawTexture(tex: ITexture, src: IRect, dst: IRect) {
  pushRectBuffer (dst)
  pushTextBuffer (src, tex)
  pushSelectArray(tex.idx)
  ptr++
}

export function drawTextureWithRotate(tex: ITexture, src: IRect, dst: IRect, deg: number, center: { x: number, y: number }) {
  pushRectBufferR(dst, deg, center)
  pushTextBuffer (src, tex)
  pushSelectArray(tex.idx)
  ptr++
}

export function drawQueue() {
  gl.uniform2i(resolutionLocation, gl.canvas.width, gl.canvas.height)

  gl.bindBuffer(gl.ARRAY_BUFFER, rectbuffer)
  gl.bufferData(gl.ARRAY_BUFFER, rectarray.subarray(0, ptr * 12), gl.STREAM_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, textbuffer)
  gl.bufferData(gl.ARRAY_BUFFER, textarray.subarray(0, ptr * 12), gl.STREAM_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, selebuffer)
  gl.bufferData(gl.ARRAY_BUFFER, selearray.subarray(0, ptr * 6), gl.STREAM_DRAW)

  gl.drawArrays(gl.TRIANGLES, 0, ptr * 6)
  ptr = 0
}

export function drawImage(tex: ITexture, srcX: number, srcY: number, srcW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number) {
  return drawTexture(tex, { x: srcX, y: srcY, w: srcW, h: srcH }, { x: dstX, y: dstY, w: dstW, h: dstH })
}

export function drawImageRotate(tex: ITexture, srcX: number, srcY: number, srcW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number, deg: number, center: { x: number, y: number }) {
  return drawTextureWithRotate(tex, { x: srcX, y: srcY, w: srcW, h: srcH }, { x: dstX, y: dstY, w: dstW, h: dstH }, deg, center)
}

initGL()
