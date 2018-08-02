import { Map as ImMap } from 'immutable'
import { BlockPair, Blocks, colorMap, emptyPair, makePair } from './Blocks'
import { IBullet } from './Bullet'
import { IEMap, IEnemy, TargetEnemy } from './Enemy'
import { textLoader, titleLoader } from './FontLoader'
import { gst } from './global'
import { CoreMachine, IMachine, StaticMachine } from './Machine'
import { BaseEntity, IKeyboardEvent, IPointerEvent, makeOffset, XKeyboardEventType, XPointEventType } from './Scene'
import { drawNinepatch } from './SpriteLoader'
import ST from './ST'

export interface IMap {
  get(pos: { x: number, y: number }): BlockPair
  getSpot(): { x: number, y: number }
}

export class ActualMap implements IMap {
  private width    : number
  private height   : number
  private data     : DataView
  private start?   : { x: number; y: number }
  private redpoints: Array<{ x: number; y: number }>
  constructor(img: HTMLImageElement) {
    const canvas = document.createElement('canvas')
    const ctx    = canvas.getContext('2d')!

    this.width     = canvas.width  = img.naturalWidth
    this.height    = canvas.height = img.naturalHeight
    this.redpoints = []
    ctx.drawImage(img, 0, 0)
    const data = ctx.getImageData(0, 0, this.width, this.height)

    this.data   = new DataView(data.data.buffer)
    this.findSpot()
  }
  public findSpot() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const color = this.data.getUint32((i * this.width + j) * 4, false) >>> 8
        if (color === 0x00ff00) {
          this.start = {
            x: j,
            y: i,
          }
        } else if (color === 0xff0000) {
          this.redpoints.push({
            x: j,
            y: i,
          })
        }
      }
    }
    if (undefined === this.start) { throw new Error('Map is no start point') }
    this.redpoints.forEach((pt) => {
      pt.x -= this.start!.x
      pt.y -= this.start!.y
    })
  }
  public get({ x: ox, y: oy }: { x: number; y: number; }): BlockPair {
    const [x, y] = [ox + this.start!.x, oy + this.start!.y]
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return emptyPair
    }
    const color = this.data.getUint32((y * this.width + x) * 4, false) >>> 8
    return colorMap[color] || emptyPair
  }
  public getSpot() {
    return {...this.redpoints[this.redpoints.length * Math.random() | 0]}
  }
}

export class CachedMap implements IMap {
  private source: IMap
  private cache : Map<string, BlockPair>
  constructor(source: IMap) {
    this.source = source
    this.cache  = new Map
  }
  public get({ x, y }: { x: number; y: number; }): BlockPair {
    const key = `${x}|${y}`
    if (this.cache.has(key)) { return this.cache.get(key)! }
    const v = this.source.get({ x, y })
    if (v.base instanceof Blocks.air) {
      return v
    }
    this.cache.set(key, v)
    return v
  }
  public getSpot() {
    return this.source.getSpot()
  }
}

class BaseMachineMap implements IEMap {
  private source : IMap
  public  macs   : Map<string, IMachine>
  public  bullets: Set<IBullet>
  public  enemies: Set<IEnemy>
  constructor(source: IMap) {
    this.source  = source
    this.macs    = new Map
    this.bullets = new Set
    this.enemies = new Set
    this.macs.set(`[0,0]`, new CoreMachine)
  }
  public tryPlace({ x, y }: { x: number, y: number }, mac: IMachine): boolean {
    const bp = this.source.get({x, y})
    if (this.checkPos(x, y) || bp === emptyPair || !mac.canplace(bp)) { return false }
    this.macs.set(`[${x},${y}]`, mac.clone())
    return true
  }
  private checkPos(x: number, y: number): BaseMachineMap.CheckResult {
    const curr = this.macs.get(`[${x},${y}]`)
    if (curr) { return curr }
    for (const [minsize, ox, oy] of BaseMachineMap.checks) {
      const [rx, ry] = [x + ox, y + oy]
      const temp = this.macs.get(`[${rx},${ry}]`)
      if (temp && temp.size >= minsize) {
        return true
      }
    }
    return false
  }
  public get({x, y}: {x: number; y: number; }): [BlockPair, IMachine | null] {
    const res = this.checkPos(x, y)
    if (BaseMachineMap.isMac(res)) {
      if (res instanceof StaticMachine) {
        return [makePair(this.source.get({x, y}), res.block), null]
      }
      return [this.source.get({x, y}), res]
    } else if (res) {
      return [makePair(this.source.get({x, y})), null]
    }
    return [this.source.get({x, y}), null]
  }
  public value({x, y}: {x: number; y: number; }) {
    const [block, mac] = this.get({x, y})
    if (Math.abs(x) + Math.abs(y) === 1 || (x === 0 && y === 0)) { return 0 }
    if (block === emptyPair ||
      block.base instanceof Blocks.deepwater ||
      block.base instanceof Blocks.oil ||
      block.base instanceof Blocks.lava ||
      !(block.top instanceof Blocks.air)
    ) {
      return -1
    }
    if (mac || block.top instanceof StaticMachine) {
      return 1
    }
    return 0
  }
  public trySpawnEnemy() {
    const point = this.source.getSpot()
    this.enemies.add(new TargetEnemy(point))
  }
}

namespace BaseMachineMap {
  export const checks = [
    [2, -1, -1],
    [2, -1, 0],
    [2, 0, -1],
    [3, 1, -1],
    [3, 1, 0],
    [3, -1, 1],
    [3, 0, 1],
    [3, 1, 1],
  ]
  export type CheckResult = boolean | IMachine
  export function isMac(res: CheckResult): res is IMachine {
    return typeof res === 'object'
  }
}

export class InfoBoard extends BaseEntity {
  private cache        : { w: number; h: number; }
  private engine: GameEngine
  constructor(engine: GameEngine) {
    super()
    this.engine = engine
  }
  public measure(limit: { w: number; h: number; }): { w: number; h: number; } {
    return this.cache = {
      w: 100,
      h: 58,
    }
  }
  public render(pos: { x: number; y: number; }) {
    drawNinepatch('window', {
      ...pos,
      ...this.cache,
    })
    titleLoader.drawLine('Info Board', {
      x    : pos.x + 14,
      y    : pos.y + 20,
      scale: 1,
    })
    textLoader.drawLine(`score: ${this.engine.lst.access('score')}`, {
      x    : pos.x + 8,
      y    : pos.y + 28,
      scale: 1 / 4,
    })
    textLoader.drawLine(`money: $${this.engine.lst.access('money')}`, {
      x    : pos.x + 8,
      y    : pos.y + 36,
      scale: 1 / 4,
    })
    textLoader.drawLine(`life: ${this.engine.lst.access('core')}`, {
      x    : pos.x + 8,
      y    : pos.y + 44,
      scale: 1 / 4,
    })
  }
}

export class MachineSelector extends BaseEntity {
  private readonly list: IMachine[]
  private cache        : { w: number; h: number; }
  private hook         : (mac: IMachine) => void
  constructor(list: IMachine[], hook: (mac: IMachine) => void) {
    super(true)
    this.list = list
    this.hook = hook
  }
  public measure(limit: { w: number; h: number; }): { w: number; h: number; } {
    return this.cache = {
      w: limit.w - 85,
      h: 85,
    }
  }
  public mouse(evt: IPointerEvent) {
    const { x, y } = evt
    if (evt.type === XPointEventType.pointerdown && x >= 8 && y >= 10 && y < 62) {
      const id = Math.floor((x - 8) / 40)
      if (id < this.list.length) {
        this.hook(this.list[id])
      }
    }
    return super.mouse(evt)
  }
  public render(pos: { x: number; y: number; }) {
    drawNinepatch('window', {
      ...pos,
      ...this.cache,
    })
    const base = {
      x    : pos.x + 8,
      y    : pos.y + 15,
      scale: 3,
    }
    for (const item of this.list) {
      item.icon({
        ...base,
        x: base.x + 4,
      })
      textLoader.drawLine(item.firstline, {
        x: base.x + (20 - textLoader.textWidth(item.firstline) / 8),
        y: base.y + 36,
        scale: 1 / 4,
      })
      textLoader.drawLine(item.secondline, {
        x: base.x + (20 - textLoader.textWidth(item.secondline) / 8),
        y: base.y + 46,
        scale: 1 / 4,
      })
      textLoader.drawLine(`$${item.price}`, {
        x: base.x + (20 - textLoader.textWidth(`$${item.price}`) / 8),
        y: base.y + 56,
        scale: 1 / 4,
      })
      base.x += 40
    }
  }
}

export class FloatItem extends BaseEntity {
  private mac?: IMachine
  private position: {x: number, y: number}
  private hook: (mac: IMachine) => void
  constructor(hook: (mac: IMachine) => void) {
    super(false)
    this.hook = hook
  }
  public setFloat(mac: IMachine) {
    this.mac = mac
  }
  public measure(limit: { w: number; h: number; }): { w: number; h: number; } {
    return limit
  }
  public mouse(evt: IPointerEvent) {
    this.position = {
      x: evt.globalX - 16,
      y: evt.globalY - 16,
    }
    if (this.mac) {
      gst.emit('validate', false)
      if (evt.type === XPointEventType.pointerup) {
        this.hook(this.mac)
        this.mac = undefined
      }
    }
    return super.mouse(evt)
  }
  public render(base: { x: number; y: number; }) {
    if (this.mac) {
      this.mac.icon({
        ...this.position,
        scale: 3,
      })
    }
  }
}

export class GameEngine extends BaseEntity {
  private cache       : { w: number; h: number; }
  private map         : BaseMachineMap
  private spos?       : { x: number, y: number }
  private willPlace?  : IMachine
  public  readonly lst: ST<{
    offset     : { x: number, y: number },
    move       : { x: number, y: number },
    scale      : number,
    map        : BaseMachineMap,
    valuemap   : ImMap<string, number>,
    die        : IEnemy | undefined,
    enter      : IEnemy | undefined,
    killBullet : IBullet | undefined,
    spawnBullet: IBullet | undefined,
    score      : number,
    money      : number,
    core       : number,
    gameover   : boolean,
  }>
  constructor(map: IMap) {
    super(true)
    this.map = new BaseMachineMap(map)
    this.lst = new ST({
      offset     : { x: 0, y: 0 },
      move       : { x: 0, y: 0 },
      scale      : 4,
      map        : this.map,
      valuemap   : ImMap<string, number>(),
      die        : undefined,
      enter      : undefined,
      killBullet : undefined,
      spawnBullet: undefined,
      score      : 0,
      money      : 100,
      core       : 100,
      gameover   : false,
    })
    this.lst.on('scale', (scale, old) => this.lst.emitFn('offset', ({ x, y }) => ({ x: x / old * scale, y: y / old * scale })))
    this.lst.on('offset', ({x: nx, y: ny}, {x: ox, y: oy}) => {
      if (nx !== ox || ny !== oy) {
        gst.emit('validate', false)
      }
    })
    this.lst.on('die', (ene) => {
      this.lst.emitFn('score', (s) => s + ene!.score)
      this.lst.emitFn('money', (m) => m + ene!.money)
      this.map.enemies.delete(ene!)
    })
    this.lst.on('enter', (ene) => {
      this.lst.emitFn('core', (s) => s - 1)
      this.map.enemies.delete(ene!)
    })
    this.lst.on('killBullet', (bullet) => {
      this.map.bullets.delete(bullet!)
    })
    this.lst.on('spawnBullet', (bullet) => {
      this.map.bullets.add(bullet!)
    })
    this.lst.on('core', (core) => {
      if (core < 0) {
        console.log('gameover')
        this.lst.emit('gameover', true)
      }
    })
  }
  public mayPlace(mac: IMachine) {
    this.willPlace = mac
    setTimeout((x) => this.willPlace = undefined)
  }
  public measure(limit: { w: number; h: number; }): { w: number; h: number; } {
    return this.cache = limit
  }
  public tick(tick) {
    if (this.lst.access('gameover')) { return }
    const { x: mx, y: my } = this.lst.access('move')
    if (mx !== 0 || my !== 0) {
      this.lst.emitFn('offset', ({ x, y }) => ({ x: x + mx, y: y + my }))
    }
    if (tick % 100 === 0 && this.map.enemies.size < 20) {
      this.map.trySpawnEnemy()
    }
    if (this.map.enemies.size) {
      this.map.enemies.forEach((ene) => ene.tick(tick, this.lst))
      gst.emit('validate', false)
    }
    if (this.map.bullets.size) {
      this.map.bullets.forEach((bullet) => bullet.tick(tick, this.map.enemies, this.lst))
      gst.emit('validate', false)
    }
    this.map.macs.forEach((mac, pos) => {
      const [x, y] = JSON.parse(pos)
      const queue: Array<[IEnemy, number, [number, number]]> = []
      for (const ene of this.map.enemies) {
        const xpos: [number, number] = [ene.pos.x - x, ene.pos.y - y]
        const d2 = xpos[0] ** 2 + xpos[1] ** 2
        if (d2 <= mac.range ** 2) {
          queue.push([ene, Math.sqrt(d2), xpos])
        }
      }
      if (queue.length) {
        mac.tick(tick, queue, this.lst, {x, y})
      }
    })
  }
  public render(base: { x: number; y: number; }) {
    const scale          = this.lst.access('scale')
    const blocksize      = 8 * scale
    const {w, h}         = this.cache
    const {x: ox, y: oy} = this.lst.access('offset')
    const [hb, wb]       = [h / 8 / scale, w / 8 / scale]
    const [px, py]       = [ox / 8 / scale | 0, oy / 8 / scale | 0]

    const queue: Array<[IMachine, {x: number, y: number, scale: number}]> = []

    for (let i = (-hb / 2 - 2) | 0; i < hb / 2 + 1; i++) {
      for (let j = (-wb / 2 - 2) | 0; j < wb / 2 + 1; j++) {
        const pos = {
          x: base.x + w / 2 + j * blocksize - ox % blocksize,
          y: base.y + h / 2 + i * blocksize - oy % blocksize,
          scale,
        }
        const [pair, mac] = this.map.get({ x: j + px, y: i + py })
        if (pair.top.block) { continue }
        if (!pair.top.fullBlock) {
          pair.base.render(pos)
        }
        if (typeof pair.top.offset !== 'undefined') {
          pos.x += pair.top.offset.x * blocksize
          pos.y += pair.top.offset.y * blocksize
        }
        pair.top.render(pos)
        if (mac) {
          queue.push([mac, pos])
        }
        // const v = this.lst.access('valuemap').get(`[${j + px},${i + py}]`)
        // if (v) {
        //   textLoader.drawLine(v.toFixed(1), {
        //     ...pos,
        //     y: pos.y + blocksize / 4,
        //     scale: 1 / 4,
        //   })
        // }
      }
    }
    this.map.enemies.forEach((ene) => {
      ene.render(({ x, y }) => ({
        x: base.x + w / 2 + (x - px + 0.25) * blocksize - ox % blocksize,
        y: base.y + h / 2 + (y - py + 0.25) * blocksize - oy % blocksize,
        scale: scale / 2,
      }))
    })
    this.map.bullets.forEach((bullet) => {
      bullet.render(({ x, y }) => ({
        x: base.x + w / 2 + (x - px + 0.25) * blocksize - ox % blocksize,
        y: base.y + h / 2 + (y - py + 0.25) * blocksize - oy % blocksize,
        scale: scale / 2,
      }))
    })
    for (const [mac, pos] of queue) {
      mac.render(pos)
    }
  }
  public mouse(ev: IPointerEvent) {
    const scale          = this.lst.access('scale')
    const blocksize      = 8 * scale
    const {w, h}         = this.cache
    const {x: ox, y: oy} = this.lst.access('offset')
    const [hb, wb]       = [h / 8 / scale, w / 8 / scale]
    const [bx, by]       = [Math.floor((ev.x + ox) / blocksize - wb / 2), Math.floor((ev.y + oy) / blocksize - hb / 2)]
    switch (ev.type) {
      case XPointEventType.pointerdown:
        this.spos = {
          x: ev.x,
          y: ev.y,
        }
        break
      case XPointEventType.pointermove:
        if (this.spos) {
          this.lst.emitFn('offset', ({x, y}) => ({
            x: x - ev.x + this.spos!.x,
            y: y - ev.y + this.spos!.y,
          }))
          this.spos = {
            x: ev.x,
            y: ev.y,
          }
        }
        break
      case XPointEventType.pointerup:
        if (this.willPlace && this.willPlace.price < this.lst.access('money')) {
          this.lst.emitFn('money', (m) => m - this.willPlace!.price)
          this.map.tryPlace({x: bx, y: by}, this.willPlace)
        }
        this.st.emit('focused', this)
      case XPointEventType.pointerleave:
        if (this.spos) {
          this.lst.emitFn('offset', ({x, y}) => ({
            x: x - ev.x + this.spos!.x,
            y: y - ev.y + this.spos!.y,
          }))
          this.spos = undefined
        }
        break
      case XPointEventType.wheel:
        this.lst.emitFn('offset', ({ x, y }) => ({ x: x + ev.wheelX!, y: y + ev.wheelY! }))
        break
    }
    return super.mouse(ev)
  }
  public register(st) {
    super.register(st)
    this.st.emit('focused', this)
  }
  public keyboard({ code, type }: IKeyboardEvent) {
    if (type === XKeyboardEventType.keydown) {
      switch (code) {
        case 'ArrowLeft':
          return this.lst.emitFn('move', ({ x, y }) => ({ x: -5, y }))
        case 'ArrowRight':
          return this.lst.emitFn('move', ({ x, y }) => ({ x: 5, y }))
        case 'ArrowUp':
          return this.lst.emitFn('move', ({ x, y }) => ({ x, y: -5 }))
        case 'ArrowDown':
          return this.lst.emitFn('move', ({ x, y }) => ({ x, y: 5 }))
      }
    }
    if (type === XKeyboardEventType.keyup) {
      switch (code) {
        case 'ArrowLeft':
          return this.lst.emitFn('move', ({ x, y }) => ({ x: x < 0 ? 0 : x, y }))
        case 'ArrowRight':
          return this.lst.emitFn('move', ({ x, y }) => ({ x: x > 0 ? 0 : x, y }))
        case 'ArrowUp':
          return this.lst.emitFn('move', ({ x, y }) => ({ x, y: y < 0 ? 0 : y }))
        case 'ArrowDown':
          return this.lst.emitFn('move', ({ x, y }) => ({ x, y: y > 0 ? 0 : y }))
        case 'Minus':
          return this.lst.emitFn('scale', (scale) => scale > 1 ? scale - 1 : scale)
        case 'Equal':
          return this.lst.emitFn('scale', (scale) => scale < 8 ? scale + 1 : scale)
      }
    }
  }
}
