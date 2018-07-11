import * as font from './assets/ui/square.fnt.json!json'
import fontRes from './assets/ui/square.png!image'
import * as title from './assets/ui/title.fnt.json!json'
import titleRes from './assets/ui/title.png!image'
import { drawTexture, ITexture, loadTexture } from './GL'
import { gst } from './global'

class FontLoader {
  private tex: ITexture
  private def: typeof font

  constructor(res: HTMLImageElement, def: typeof font) {
    this.def = def
    this.tex = loadTexture(res)
  }

  public charWidth(char: number): number {
    if (char === ' '.charCodeAt(0)) { return this.def.info.size / 4 }
    const info = this.def.chars.find(({ id }) => id === char)
    if (!info) { return 0 }
    return info.width
  }

  public textWidth(text: string): number {
    return text.split('').map((x) => x.charCodeAt(0)).map((x) => this.charWidth(x)).reduce((p, c) => p + c, 0)
  }

  public draw(char: number, { x, y, scale = 1 }: { x: number, y: number, scale?: number }) {
    const globalScale = gst.access('scale')
    if (char === ' '.charCodeAt(0)) { return this.def.info.size / 4 }
    const info = this.def.chars.find(({ id }) => id === char)
    if (!info) { return 0 }
    drawTexture(this.tex, {
      x: info.x,
      y: info.y,
      w: info.width,
      h: info.height,
    }, {
      x: x * globalScale,
      y: (y + (info.yoffset - this.def.common.base) * scale) * globalScale,
      w: info.width * scale * globalScale,
      h: info.height * scale * globalScale,
    })
    return info.width * scale
  }

  public drawLine(text: string, { x, y, scale = 1 }: { x: number, y: number, scale?: number }) {
    let mx = x
    for (const char of text.split('').map((ch) => ch.charCodeAt(0))) {
      mx += this.draw(char, { x: mx, y, scale })
    }
  }
}

export const textLoader  = new FontLoader(fontRes, font)
export const titleLoader = new FontLoader(titleRes, title)
