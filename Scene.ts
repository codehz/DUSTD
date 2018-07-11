import { Map } from 'immutable'
import { gst } from './global'
import ST from './ST'

export interface IPointerEvent {
  readonly x      : number
  readonly y      : number
  readonly globalX: number
  readonly globalY: number
  readonly type   : XPointEventType
  readonly done   : boolean
  readonly wheelX?: number
  readonly wheelY?: number
  setHandled()
  offset  (offset: { x: number, y: number }): IPointerEvent
  toString()                                : string
}

export interface IKeyboardEvent {
  readonly key      : number
  readonly code     : string
  readonly type     : XKeyboardEventType
  readonly boardcast: boolean
}

class IPointerEventOffset implements IPointerEvent {
  private readonly source: IPointerEvent
  private off            : { x: number, y: number }
  constructor(source: IPointerEvent, offset: { x: number, y: number }) {
    this.source = source
    this.off    = offset
  }
  get x() {
    return this.source.x - this.off.x
  }
  get y() {
    return this.source.y - this.off.y
  }
  get globalX() {
    return this.source.globalX
  }
  get globalY() {
    return this.source.globalY
  }
  get wheelX() {
    return this.source.wheelX
  }
  get wheelY() {
    return this.source.wheelY
  }
  get type() {
    return this.source.type
  }
  get done() {
    return this.source.done
  }
  public setHandled() {
    this.source.setHandled()
  }
  public offset({ x, y }: { x: number, y: number }) {
    return new IPointerEventOffset(this.source, {
      x: x + this.off.x,
      y: y + this.off.y,
    })
  }
  public toString() {
    return `(${this.x}, ${this.y})@(${this.globalX}, ${this.globalY})#${XPointEventType[this.type]}!(${this.off.x}, ${this.off.y})`
  }
}

class XPointerEvent implements IPointerEvent {
  public  readonly globalX: number
  public  readonly globalY: number
  public  readonly wheelX?: number
  public  readonly wheelY?: number
  public  readonly type   : XPointEventType
  private handled         : boolean
  constructor(temp: {
    x      : number
    y      : number
    wheelX?: number
    wheelY?: number
    type   : XPointEventType,
  }) {
    this.globalX = temp.x
    this.globalY = temp.y
    this.wheelX  = temp.wheelX
    this.wheelY  = temp.wheelY
    this.type    = temp.type
    this.handled = false
  }

  get x() {
    return this.globalX
  }

  get y() {
    return this.globalY
  }

  public setHandled() {
    this.handled = true
  }

  public offset(offset: { x: number, y: number }): IPointerEvent {
    return new IPointerEventOffset(this, offset)
  }

  get done() {
    return this.handled
  }
  public toString() {
    return `(${this.x}, ${this.y})@(${this.globalX}, ${this.globalY})#${XPointEventType[this.type]}`
  }
}

export enum XPointEventType {
  pointermove, pointerdown, pointerup, pointerenter, pointerleave, wheel,
}

export enum XKeyboardEventType {
  keydown, keyup,
}

export interface ISceneS {
  focused: IEntity | null
  hotkeys: Map<string, () => void>
}

export interface IEntity {
  measure(limit: { w: number, h: number }): { w: number, h: number }
  render(base: { x: number, y: number })
  tick(tick: number)
  mouse(ev: IPointerEvent): Array<{
    entity: IEntity,
    offset: { x: number, y: number },
  }>
  keyboard(ev: IKeyboardEvent)
  register(st: ST<ISceneS>)
  add(child: IEntity | string)
}

export function makeOffset(ev: IPointerEvent): { x: number, y: number } {
  return {
    x: ev.globalX - ev.x,
    y: ev.globalY - ev.y,
  }
}

function send(type: XPointEventType, { x, y }: { x: number, y: number }, item: {
  entity: IEntity,
  offset: { x: number, y: number },
}) {
  item.entity.mouse(new XPointerEvent({ x, y, type }).offset(item.offset))
}

export abstract class BaseEntity implements IEntity {
  public abstract measure(limit: { w: number, h: number }): { w: number, h: number }
  public abstract render(base: { x: number, y: number })
  public tick(tick: number) {
    //
  }
  private   done: boolean
  protected st  : ST<ISceneS>
  constructor(done: boolean = false) {
    this.done = done
  }
  public mouse(ev: IPointerEvent): Array<{
    entity: IEntity,
    offset: { x: number, y: number },
  }> {
    if (this.done) { ev.setHandled() }
    return [{
      entity: this,
      offset: makeOffset(ev),
    }]
  }
  public keyboard(ev: IKeyboardEvent) {
    console.log(ev)
  }
  public register(st: ST<ISceneS>) {
    this.st = st
  }
  public add(child: IEntity | string) {
    //
  }
}

export class Scene {
  public entity: IEntity
  private lastChain      : Array<{
    entity: IEntity,
    offset: { x: number, y: number },
  }>
  private st: ST<ISceneS>
  constructor() {
    this.lastChain = []
    this.st        = new ST({
      focused: null,
      hotkeys: Map<string, () => any>(),
    })
  }
  public add(child: IEntity | string) {
    if (typeof child !== 'string') {
      this.entity = child
      this.entity.register(this.st)
    }
  }
  public measure(size: { w: number, h: number }) {
    return this.entity.measure(size)
  }
  public render() {
    this.entity.render({ x: 0, y: 0 })
  }
  public tick(tick: number) {
    this.entity.tick(tick)
  }
  public mouse(ev: PointerEvent & {deltaX?: number, deltaY?: number}) {
    const globalScale = gst.access('scale')
    const [x, y] = [
      ev.offsetX / globalScale * window.devicePixelRatio | 0,
      ev.offsetY / globalScale * window.devicePixelRatio | 0,
    ]
    // console.log(ev)
    const chain = this.entity.mouse(new XPointerEvent({
      x,
      y,
      wheelX: ev.deltaX,
      wheelY: ev.deltaY,
      type  : XPointEventType[ev.type],
    }))
    const minlen = Math.min(this.lastChain.length, chain.length)
    let   done   = false
    for (let i = 0; i < minlen; i++) {
      if (chain[i].entity !== this.lastChain[i].entity) {
        done = true
        for (let j = i; j < this.lastChain.length; j++) {
          send(XPointEventType.pointerleave, { x, y }, this.lastChain[j])
        }
        send(XPointEventType.pointerenter, { x, y }, chain[i])
      }
    }
    if (!done) {
      if (minlen !== this.lastChain.length) {
        for (let j = minlen; j < this.lastChain.length; j++) {
          send(XPointEventType.pointerleave, { x, y }, this.lastChain[j])
        }
      } else if (minlen !== chain.length) {
        send(XPointEventType.pointerenter, { x, y }, chain[minlen])
      }
    }
    this.lastChain = chain
  }
  public keyboard(ev: KeyboardEvent) {
    const focused = this.st.access('focused')
    const hotkeys = this.st.access('hotkeys')
    if (focused) {
      focused.keyboard({
        key      : ev.keyCode,
        code     : ev.code,
        type     : XKeyboardEventType[ev.type],
        boardcast: false,
      })
    }
    if (hotkeys.has(ev.code)) {
      hotkeys.get(ev.code)()
    }
  }
}
