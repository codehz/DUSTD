import { textLoader, titleLoader } from './FontLoader'
import { gst } from './global'
import { BaseEntity, IEntity, IPointerEvent, ISceneS, makeOffset, XPointEventType } from './Scene'
import { draw, drawNinepatch } from './SpriteLoader'

enum MouseHoverState {
  normal, hover, press,
}

export class FrameLayout extends BaseEntity {
  private cache: { w: number; h: number; }
  private entities: IEntity[]
  constructor() {
    super()
    this.entities = []
  }
  public add(ent: IEntity) {
    this.entities.push(ent)
    return this
  }
  public measure(limit: { w: number; h: number; }): { w: number; h: number; } {
    this.entities.forEach((x) => x.measure(limit))
    return this.cache = limit
  }
  public tick(tick: number) {
    this.entities.forEach((x) => x.tick(tick))
  }
  public render(base: { x: number; y: number; }) {
    this.entities.forEach((x) => x.render(base))
  }
  public register(st) {
    this.entities.forEach((x) => x.register(st))
  }
  public mouse(evt: IPointerEvent) {
    const ret = super.mouse(evt)
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const entity = this.entities[i]
      const res = entity.mouse(evt)
      if (evt.done) {
        ret.push(...res)
        break
      }
    }
    return ret
  }
}

export class FPSIndicator extends BaseEntity {
  public static count = 10
  private lastTime: number
  private fps     : string
  constructor() {
    super()
    this.lastTime = performance.now()
    this.fps      = '0'
  }
  public measure(limit: { w: number; h: number; }): { w: number; h: number; } {
    return { w: 90, h: 10 }
  }
  public tick(tick: number) {
    if (tick % FPSIndicator.count === 0) {
      const now = performance.now()
      const fps = (gst.access('fcount') / (now - this.lastTime) * 1000).toFixed(1)

      this.lastTime = now
      gst.emit('fcount', 0)
      if (this.fps !== fps && fps !== '6.0') {
        gst.emit('validate', false)
      }
      this.fps = fps
    }
  }
  public render({ x, y }: { x: number; y: number; }) {
    textLoader.drawLine(`fps:${this.fps}`, { x, y: y + 10, scale: 0.5 })
  }
}

export class LayerBox extends BaseEntity {
  private cache   : { w: number, h: number }
  public  entities: {
    [key in LayerBox.Layer]?: {
      entity: IEntity
      size? : { w: number, h: number },
    }
  }
  constructor() {
    super()
    this.entities = {}
  }
  public set(key: LayerBox.Layer, entity: IEntity) {
    this.entities[key] = { entity }
    if (this.st) { entity.register(this.st) }
    return this
  }
  public add(child: IEntity | string) {
    if (child instanceof LayerBox.Stub) {
      this.set(child.layer, child.child)
    } else if (typeof child !== 'string') {
      this.set(LayerBox.Layer.C, child)
    }
  }
  public measure(limit: { w: number; h: number; }): { w: number; h: number; } {
    this.cache = limit
    Object.values(this.entities).forEach((v) => {
      v!.size = v!.entity.measure(limit)
    })
    return limit
  }
  public tick(tick: number) {
    Object.values(this.entities).forEach((value) => value!.entity.tick(tick))
  }
  public render(base: { x: number; y: number; }) {
    Object.entries(this.entities).forEach(([key, value]) => {
      const { entity, size: { w = 0, h = 0 } = {} } = value!

      const k      = +key
      let   [x, y] = [base.x, base.y]
      switch (k) {
        case LayerBox.Layer.LT: break
        case LayerBox.Layer.RT: x += this.cache.w - w; break
        case LayerBox.Layer.LB: y += this.cache.h - h; break
        case LayerBox.Layer.RB:
          x += this.cache.w - w
          y += this.cache.h - h
          break
        case LayerBox.Layer.C:
          x += (this.cache.w - w) / 2
          y += (this.cache.h - h) / 2
          break
      }
      entity.render({ x, y })
    })
  }
  public mouse(ev: IPointerEvent) {
    const { x: ex, y: ey } = ev
    for (const [key, value] of Object.entries(this.entities).reverse()) {
      const { entity, size: { w = 0, h = 0 } = {} } = value!

      const k      = +key
      let   [x, y] = [0, 0]
      switch (k) {
        case LayerBox.Layer.LT: break
        case LayerBox.Layer.RT: x += this.cache.w - w; break
        case LayerBox.Layer.LB: y += this.cache.h - h; break
        case LayerBox.Layer.RB:
          x += this.cache.w - w
          y += this.cache.h - h
          break
        case LayerBox.Layer.C:
          x += (this.cache.w - w) / 2
          y += (this.cache.h - h) / 2
          break
      }
      if (ex >= x && ex < x + w && ey >= y && ey < y + h) {
        const res = entity.mouse(ev.offset({ x, y }))
        if (!ev.done) { continue }
        return [
          ...super.mouse(ev),
          ...res,
        ]
      }
    }
    return super.mouse(ev)
  }
  public register(st) {
    super.register(st)
    Object.values(this.entities).forEach((value) => value!.entity.register(st))
  }
}

export namespace LayerBox {
  export enum Layer {
    C, LT, RT, LB, RB,
  }

  export class Stub extends BaseEntity {
    public layer: LayerBox.Layer
    public child: IEntity
    constructor({ layer = LayerBox.Layer.C }: { layer: LayerBox.Layer }) {
      super()
      this.layer = layer
    }
    public add(child: IEntity | string) {
      if (typeof child !== 'string') {
        this.child = child
      }
    }
    public measure(limit: { w: number; h: number; }): { w: number; h: number; } {
      throw new Error('Method not implemented.')
    }
    public render(base: { x: number; y: number; }) {
      throw new Error('Method not implemented.')
    }
  }
}

export class CenterBox extends BaseEntity {
  private cache    : { w: number, h: number }
  private innerSize: { w: number, h: number }
  public  entity   : IEntity
  constructor() {
    super()
  }
  public add(child: IEntity | string) {
    if (typeof child !== 'string') {
      this.entity = child
    }
  }
  public measure(limit) {
    this.cache     = limit
    this.innerSize = this.entity.measure(limit)
    return limit
  }
  public tick(tick: number) {
    this.entity.tick(tick)
  }
  public render(base: { x: number; y: number; }) {
    this.entity.render({
      x: base.x + (this.cache.w - this.innerSize.w) / 2,
      y: base.y + (this.cache.h - this.innerSize.h) / 2,
    })
  }
  public mouse(ev: IPointerEvent) {
    const { x, y } = ev
    if (x >= (this.cache.w - this.innerSize.w) / 2 && x < (this.cache.w + this.innerSize.w) / 2 &&
      y >= (this.cache.h - this.innerSize.h) / 2 && y < (this.cache.h + this.innerSize.h) / 2) {
      return [
        ...super.mouse(ev),
        ...this.entity.mouse(ev.offset({
          x: (this.cache.w - this.innerSize.w) / 2,
          y: (this.cache.h - this.innerSize.h) / 2,
        })),
      ]
    }
    return super.mouse(ev)
  }
  public register(st) {
    super.register(st)
    this.entity.register(st)
  }
}

export class PaddingBox extends BaseEntity {
  public size: {
    w: number,
    h: number,
  }
  public readonly padding : number
  public readonly autoaxis: PaddingBox.Axis
  public entity           : IEntity
  constructor({ size, padding, autoaxis = PaddingBox.Axis.Y }: { size: { w: number; h: number }, padding: number, autoaxis?: PaddingBox.Axis }) {
    super()
    this.size     = size
    this.padding  = padding
    this.autoaxis = autoaxis
  }
  public add(child: IEntity | string) {
    if (typeof child !== 'string') {
      this.entity = child
    }
  }
  public measure(limit: { w: number; h: number; }): { w: number; h: number; } {
    const inner = this.entity.measure({
      w: (this.autoaxis === PaddingBox.Axis.X ? limit.w : this.size.w) - this.padding * 2,
      h: (this.autoaxis === PaddingBox.Axis.Y ? limit.h : this.size.h) - this.padding * 2,
    })
    return this.size = {
      w: this.autoaxis === PaddingBox.Axis.X ? inner.w : this.size.w,
      h: this.autoaxis === PaddingBox.Axis.Y ? inner.h : this.size.h,
    }
  }
  public tick(tick: number) {
    this.entity.tick(tick)
  }
  public render(base: { x: number; y: number; }) {
    this.entity.render({
      x: base.x + this.padding,
      y: base.y + this.padding,
    })
  }
  public mouse(ev: IPointerEvent) {
    const { x, y } = ev
    if (x >= this.padding && x < this.size.w - this.padding && y >= this.padding && y < this.size.h - this.padding) {
      return [...super.mouse(ev), ...this.entity.mouse(ev.offset({ x: this.padding, y: this.padding }))]
    }
    return super.mouse(ev)
  }
  public register(st) {
    super.register(st)
    this.entity.register(st)
  }
}

export namespace PaddingBox {
  export enum Axis {
    X, Y,
  }
}

export class Logo extends BaseEntity {
  public static size = {
    w: 62 * 4,
    h: 21 * 4,
  }
  constructor() {
    super(true)
  }
  public measure(): { w: number; h: number; } {
    return Logo.size
  }
  public render({ x, y }: { x: number; y: number; }) {
    draw('logotext', { x, y, scale: 4 })
  }
}

export class SimplePadding extends BaseEntity {
  public readonly size: {
    w: number,
    h: number,
  }
  constructor(size: { w: number; h: number }) {
    super()
    this.size = size
  }
  public measure(): { w: number; h: number; } {
    return this.size
  }
  public render() {
    //
  }
}

export class TitleText extends BaseEntity {
  public  text : string
  private width: number
  constructor() {
    super(true)
  }
  public add(child: IEntity | string) {
    if (typeof child === 'string') {
      this.text   = child
      this.width  = titleLoader.textWidth(child)
    }
  }
  public measure(limit: { w: number; h: number; }): { w: number; h: number; } {
    return { w: this.width, h: 18 }
  }
  public render(base: { x: number; y: number; }) {
    titleLoader.drawLine(this.text, { x: base.x, y: base.y + 18 })
  }
}

export class PlainText extends BaseEntity {
  public  text : string
  private width: number
  constructor() {
    super(true)
  }
  public add(child: IEntity | string) {
    if (typeof child === 'string') {
      this.text  = child
      this.width = textLoader.textWidth(child) / 2
    }
  }
  public measure(limit: { w: number; h: number; }): { w: number; h: number; } {
    return { w: this.width, h: 10 }
  }
  public render(base: { x: number; y: number; }) {
    textLoader.drawLine(this.text, { x: base.x, y: base.y + 10, scale: 0.5 })
  }
}

export class TitleButton extends BaseEntity {
  public  text  : string
  public  action: () => any
  private width : number
  private cache : number
  private state : MouseHoverState
  constructor({ action }: { action: () => any }) {
    super(true)
    this.action = action
    this.state  = MouseHoverState.normal
  }
  public add(child: IEntity | string) {
    if (typeof child === 'string') {
      this.text   = child
      this.width  = titleLoader.textWidth(child)
    }
  }
  public mouse(ev: IPointerEvent) {
    const { type } = ev
    if (type === XPointEventType.pointerenter) {
      this.state = MouseHoverState.hover
      gst.emit('validate', false)
    } else if (type === XPointEventType.pointerleave) {
      this.state = MouseHoverState.normal
      gst.emit('validate', false)
    } else if (type === XPointEventType.pointerdown) {
      this.state = MouseHoverState.press
      gst.emit('validate', false)
    } else if (type === XPointEventType.pointerup) {
      this.action()
    }
    return super.mouse(ev)
  }
  public measure(limit: { w: number; h: number; }): { w: number; h: number; } {
    this.cache = limit.w
    return { w: limit.w, h: 40 }
  }
  public render(base: { x: number; y: number; }) {
    drawNinepatch(
      this.state === MouseHoverState.normal ? 'button' :
        this.state === MouseHoverState.hover ? 'button-over' :
          'button-down', { x: base.x, y: base.y, w: this.cache, h: 40 })
    titleLoader.drawLine(this.text, { x: base.x + (this.cache - this.width) / 2, y: base.y + 24 })
  }
}

export class LinearLayout extends BaseEntity {
  private children: Array<{
    align : LinearLayout.Align
    entity: IEntity
    cache?: {
      x: number
      y: number
      w: number
      h: number,
    },
  }>
  public readonly reverse  : boolean
  public readonly direction: LinearLayout.Direction
  public readonly padding  : number
  constructor(pack: { direction?: LinearLayout.Direction, padding?: number, reverse?: boolean } = {}) {
    super()
    const { direction = LinearLayout.Direction.column, padding = 0, reverse = false } = pack || {}
    this.direction = direction
    this.padding   = padding
    this.reverse   = reverse
    this.children  = []
  }
  public add(entity: IEntity, align: LinearLayout.Align = LinearLayout.Align.center) {
    this.children.push({
      align,
      entity,
    })
    if (this.st) { entity.register(this.st) }
    return this
  }
  public measure(limit: { w: number; h: number; }): { w: number; h: number; } {
    let   [ox, oy]         = [0, 0]
    let   { w: lw, h: lh } = limit
    const list             = this.reverse ? [...this.children].reverse() : this.children
    if (this.direction === LinearLayout.Direction.column) {
      for (const item of list) {
        const { w: nw, h: nh } = item.entity.measure({ w: lw, h: lh })
        item.cache = {
          x: item.align === LinearLayout.Align.start ? ox : item.align === LinearLayout.Align.center ? ox + (lw - nw) / 2 : ox + lw - nw,
          y: oy,
          w: nw,
          h: nh,
        }
        oy += nh + this.padding
        lh -= nh + this.padding
      }
      return { w: limit.w, h: limit.h - lh - this.padding }
    } else {
      for (const item of list) {
        const { w: nw, h: nh } = item.entity.measure({ w: lw, h: lh })
        item.cache = {
          x: this.reverse ? limit.w - ox - nw : ox,
          y: item.align === LinearLayout.Align.start ? oy : item.align === LinearLayout.Align.center ? oy + (lh - nh) / 2 : oy + lh - nh,
          w: nw,
          h: nh,
        }
        ox += nw + this.padding
        lw -= nw + this.padding
      }
      return { w: limit.w - lw - this.padding, h: limit.h }
    }
  }
  public tick(tick: number) {
    for (const item of this.children) {
      item.entity.tick(tick)
    }
  }
  public render(base: { x: number; y: number; }) {
    for (const item of this.children) {
      item.entity.render({
        x: item.cache!.x + base.x,
        y: item.cache!.y + base.y,
      })
    }
  }
  public mouse(ev: IPointerEvent) {
    const { x, y } = ev
    for (const item of this.children) {
      if (item.cache!.x <= x && x < item.cache!.x + item.cache!.w &&
        item.cache!.y <= y && y < item.cache!.y + item.cache!.h) {
        return [
          ...super.mouse(ev),
          ...item.entity.mouse(ev.offset(item.cache!)),
        ]
      }
    }
    return super.mouse(ev)
  }
  public register(st) {
    super.register(st)
    this.children.forEach(({ entity }) => entity.register(st))
  }
}

export namespace LinearLayout {
  export enum Align {
    center, start, end,
  }
  export enum Direction {
    column, row,
  }
}
