import { Map as ImMap, OrderedMap as ImOrderedMap } from 'immutable'
import { drawRotateCenter, FrameName } from './SpriteLoader'
import ST from './ST'

export interface IEMap {
  value(pos: { x: number, y: number })
}

export interface IEnemyStore {
  valuemap: ImMap<string, number>
  map     : IEMap | undefined
  die     : IEnemy | undefined
  enter   : IEnemy | undefined
}

export interface IEnemy {
  readonly money : number
  readonly score : number
  readonly level : number
  readonly health: number
  readonly pos   : { x: number; y: number; }
  tick(tick: number, st: ST<IEnemyStore>)
  render(calc: (pos: {x: number, y: number}) => { x: number; y: number; scale: number })
  hit(dmg: number)
}

abstract class BaseEnemy implements IEnemy {
  private   basename: string
  protected deg     : number
  public    level   : number
  public    health  : number
  protected real    : { x: number; y: number; }
  protected target  : { x: number; y: number; }
  protected progress: number
  constructor(basename: string, level: number, maxhealth: number, startpos: { x: number; y: number; }) {
    this.basename = basename
    this.deg      = 0
    this.level    = level
    this.health   = maxhealth
    this.real     = startpos
    this.target   = startpos
    this.progress = -1
  }
  public get pos() {
    return {
      x: (this.target.x - this.real.x) * this.progress + this.real.x,
      y: (this.target.y - this.real.y) * this.progress + this.real.y,
    }
  }
  public abstract tick(tick: number, st: ST<IEnemyStore>)
  public abstract get money()
  public abstract get score()
  public render(calc: (pos: {x: number, y: number}) => { x: number; y: number; scale: number }) {
    drawRotateCenter(`${this.basename}-t${this.level}` as FrameName, calc(this.pos), this.deg, {x: 3, y: 3}, {x: 7, y: 7})
  }
  public hit(dmg: number) {
    this.health -= dmg
  }
}

function encoding(x: number, y: number) {
  return `[${x},${y}]`
}

function getXY(vm: ImMap<string, number>, x: number, y: number) {
  return vm.get(`[${x},${y}]`, (x ** 2 + y ** 2) ** 0.8)
}

function setXY(vm: ImMap<string, number>, x: number, y: number, value: number) {
  return vm.set(`[${x},${y}]`, value)
}

const dirs = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

export class TargetEnemy extends BaseEnemy {
  private history: ImOrderedMap<string, number>
  constructor(startpos: { x: number; y: number; }) {
    super('targetenemy', 1, 30, startpos)
    this.history = ImOrderedMap()
  }
  public get money() { return 2 }
  public get score() { return 10 }
  public tick(tick: number, st: ST<IEnemyStore>) {
    if (this.health <= 0) {
      const vm = st.access('valuemap')
      st.emit('valuemap', setXY(vm, this.real.x, this.real.y, getXY(vm, this.real.x, this.real.y) + 1.0))
      return st.emit('die', this)
    }
    if (this.progress === -1) {
      let vm     = st.access('valuemap')
      let min    = Number.MAX_SAFE_INTEGER
      let lasmin = Number.MAX_SAFE_INTEGER
      let tgt: [number, number] | undefined
      do {
        for (const [ox, oy] of dirs) {
          const temp = getXY(vm, this.real.x + ox, this.real.y + oy)
          if (temp < min) {
            tgt    = [ox, oy]
            lasmin = min
            min    = temp
          }
        }
        if (st.access('map')!.value({ x: this.real.x + tgt![0], y: this.real.y + tgt![1] }) !== 0) {
          vm = setXY(vm, this.real.x, this.real.y, getXY(vm, this.real.x, this.real.y) + 0.1)
          vm = setXY(vm, this.real.x + tgt![0], this.real.y + tgt![1], (lasmin !== Number.MAX_SAFE_INTEGER ? lasmin : min) + 1.0)
          min = Number.MAX_SAFE_INTEGER
          continue
        }
        break
      } while (true)
      if (this.history.has(encoding(this.real.x, this.real.y))) {
        vm = setXY(vm, this.real.x, this.real.y, getXY(vm, this.real.x, this.real.y) + this.history.get(encoding(this.real.x, this.real.y)) ** 2)
        this.history = this.history.update(encoding(this.real.x, this.real.y), (x) => x + 1)
      } else {
        vm = setXY(vm, this.real.x, this.real.y, getXY(vm, this.real.x, this.real.y) - 0.1)
        this.history = this.history.set(encoding(this.real.x, this.real.y), 1)
      }
      st.emit('valuemap', vm)
      this.target = {
        x: this.real.x + tgt![0],
        y: this.real.y + tgt![1],
      }
      if (tgt![0] < 0) {
        this.deg = -Math.PI / 2
      }
      if (tgt![0] > 0) {
        this.deg = Math.PI / 2
      }
      if (tgt![1] > 0) {
        this.deg = Math.PI
      }
      if (tgt![1] < 0) {
        this.deg = 0
      }
      this.progress = 0
    } else if (this.progress >= 1.0) {
      this.real = this.target
      this.progress = -1
      if (this.real.x === 0 && this.real.y === 0) {
        let vm = st.access('valuemap')
        this.history.forEach((v, k) => {
          const [x, y] = JSON.parse(k!)
          if (v! > 1) { return }
          vm = setXY(vm, x, y, 0.5 * Math.sqrt(x ** 2 + y ** 2 - 0.5) + 0.5 * getXY(vm, x, y))
        })
        st.emit('valuemap', vm)
        st.emit('enter', this)
      }
    } else {
      this.progress += 0.05
    }
  }
}
