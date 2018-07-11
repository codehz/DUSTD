import * as sprites from './assets/sprites/sprites.json!json'
import spritesImage from './assets/sprites/sprites.png!image'
import { drawImage, drawImageRotate, ITexture, loadTexture } from './GL'
import { gst } from './global'

const tex: ITexture = loadTexture(spritesImage)

export type FrameName = keyof typeof sprites.frames

export function draw<T extends FrameName>(name: T, { x: nx, y: ny, scale = 1 }: { x: number, y: number, scale?: number }) {
  const globalScale = gst.access('scale')
  const [x, y] = [nx * globalScale, ny * globalScale]
  const { frame } = sprites.frames[name]
  drawImage(tex, frame.x, frame.y, frame.w, frame.h, x, y, frame.w * scale * globalScale, frame.h * scale * globalScale)
}

export function drawRotate<T extends FrameName>(name: T, { x: nx, y: ny, scale = 1 }: { x: number, y: number, scale?: number }, rotate: number, center: { x: number, y: number }) {
  const globalScale = gst.access('scale')
  const [x, y] = [nx * globalScale, ny * globalScale]
  const { frame } = sprites.frames[name]
  drawImageRotate(tex, frame.x, frame.y, frame.w, frame.h, x, y, frame.w * scale * globalScale, frame.h * scale * globalScale, rotate, { x: center.x * scale * globalScale, y: center.y * scale * globalScale })
}

export function drawRotateCenter<T extends FrameName>(name: T, { x: nx, y: ny, scale = 1 }: { x: number, y: number, scale?: number }, rotate: number, center: { x: number, y: number }, center2: { x: number, y: number }) {
  const globalScale = gst.access('scale')
  const [x, y] = [nx * globalScale, ny * globalScale]
  const { frame } = sprites.frames[name]
  drawImageRotate(tex, frame.x, frame.y, frame.w, frame.h, x - center.x * scale * globalScale, y - center.y * scale * globalScale, frame.w * scale * globalScale, frame.h * scale * globalScale, rotate, { x: center2.x * scale * globalScale, y: center2.y * scale * globalScale })
}

export function drawNinepatch<T extends FrameName>(name: T, { x: nx, y: ny, w: nw, h: nh, scale = 1 }: { x: number, y: number, w: number, h: number, scale?: number }) {
  const globalScale = gst.access('scale')
  const [x, y, w, h] = [nx * globalScale, ny * globalScale, nw * globalScale, nh * globalScale]
  const { frame } = sprites.frames[name]
  const [fw, fh] = [frame.w * scale * globalScale, frame.h * scale * globalScale]
  drawImage(tex, frame.x, frame.y, frame.w / 2, frame.h / 2, x, y, fw / 2, fh / 2) // left top
  drawImage(tex, frame.x + frame.w / 2, frame.y, frame.w / 2, frame.h / 2, x + w - fw / 2, y, fw / 2, fh / 2) // right top
  drawImage(tex, frame.x + frame.w / 2, frame.y + frame.h / 2 - 1, frame.w / 2, 2, x + w - fw / 2, y + fh / 2, fw / 2, h - fh) // right
  drawImage(tex, frame.x + frame.w / 2 - 1, frame.y, 2, frame.h / 2, x + fw / 2, y, w - fw, fh / 2)  // top
  drawImage(tex, frame.x, frame.y + frame.h / 2, frame.w / 2, frame.h / 2, x, y + h - fh / 2, fw / 2, fh / 2) // left bottom
  drawImage(tex, frame.x, frame.y + frame.h / 2 - 1, frame.w / 2, 2, x, y + fh / 2, fw / 2, h - fh) // left
  drawImage(tex, frame.x + frame.w / 2 - 1, frame.y + frame.h / 2, 2, frame.h / 2, x + fw / 2, y + h - fh / 2, w - fw, fh / 2) // bottom
  drawImage(tex, frame.x + frame.w / 2, frame.y + frame.h / 2, frame.w / 2, frame.h / 2, x + w - fw / 2, y + h - fh / 2, fw / 2, fh / 2) // right bottom
  drawImage(tex, frame.x + frame.w / 2 - 1, frame.y + frame.h / 2 - 1, 2, 2, x + fw / 2, y + fh / 2, w - fw, h - fh) // center
}
