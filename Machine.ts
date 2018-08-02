import { Block, BlockPair, Blocks } from './Blocks'
import { IBullet, IBulletStore, SimpleBullet } from './Bullet'
import { IEnemy, IEnemyStore } from './Enemy'
import { draw, drawRotate } from './SpriteLoader'
import ST from './ST'

export interface IMachine {
  readonly size      : number
  readonly range     : number
  readonly firstline : string
  readonly secondline: string
  readonly price     : number
  tick(tick: number, enes: Array<[IEnemy, number, [number, number]]>, st: ST<IMachineStore>, pos: { x: number; y: number; })
  icon(base: { x: number, y: number, scale: number })
  render(base: { x: number, y: number, scale: number })
  canplace(bp: BlockPair): boolean
  clone(): IMachine
}

export interface IMachineStore {
  spawnBullet: IBullet | undefined
}

export abstract class BaseMachine implements IMachine {
  get size() { return 1 }
  public readonly range           : number
  public abstract get firstline() : string
  public abstract get secondline(): string
  public abstract get price()     : number
  public abstract tick(tick: number, enes: Array<[IEnemy, number, [number, number]]>, st: ST<IMachineStore>, pos: { x: number; y: number; })
  public abstract icon(base: { x: number, y: number, scale: number })
  public abstract render(base: { x: number, y: number, scale: number })
  public abstract canplace(bp: BlockPair): boolean
  public abstract clone(): IMachine
}

export class StaticMachine extends BaseMachine {
  public readonly firstline : string
  public readonly secondline: string
  public readonly block     : Block
  public readonly range     : number
  public readonly price     : number
  constructor(firstline: string, secondline: string, block: Block, price: number) {
    super()
    this.firstline  = firstline
    this.secondline = secondline
    this.block      = block
    this.range      = 0
    this.price      = price
  }
  public tick(tick: number, enes: Array<[IEnemy, number, [number, number]]>, st: ST<IMachineStore>, pos: { x: number; y: number; }) {
    //
  }
  public icon(base: { x: number; y: number; scale: number; }) {
    //
  }
  public render(base: { x: number; y: number; scale: number; }) {
    //
  }
  public canplace(bp: BlockPair): boolean {
    return bp.top instanceof Blocks.air
  }
  public clone(): IMachine {
    return new StaticMachine(this.firstline, this.secondline, this.block, this.price)
  }
}

export class CoreMachine extends StaticMachine {
  get size() { return 3 }
  constructor() {
    super('core', '', new Blocks.core, 0)
  }
}

export class Turret extends BaseMachine {
  private deg: number
  constructor() {
    super()
    this.deg = 0
  }
  public get range() {
    return 5
  }
  public get firstline() {
    return 'basic'
  }
  public get secondline() {
    return 'turret'
  }
  public get price() {
    return 10
  }
  public tick(tick: number, enes: Array<[IEnemy, number, [number, number]]>, st: ST<IMachineStore>, pos: { x: number; y: number; }) {
    enes.sort(([, a], [, b]) => a - b)
    const [ene, , [ex, ey]] = enes[0]
    this.deg = Math.atan2(ey, ex) + Math.PI / 2
    if (tick % 10 === 0) {
      st.emit('spawnBullet', new SimpleBullet(pos, this.deg - Math.PI / 2))
    }
  }
  public icon(base: { x: number, y: number, scale: number }) {
    draw('turret', base)
  }
  public render(base: { x: number, y: number, scale: number }) {
    drawRotate('turret', {
      ...base,
      x: base.x - base.scale,
    }, this.deg, { x: 5, y: 4 })
  }
  public canplace(bp: BlockPair): boolean {
    return bp.top instanceof Blocks.air &&
      !(bp.base instanceof Blocks.deepwater) &&
      !(bp.base instanceof Blocks.lava) &&
      !(bp.base instanceof Blocks.oil)
  }
  public clone(): IMachine {
    return new Turret
  }
}

export class FastTurret extends BaseMachine {
  private deg: number
  constructor() {
    super()
    this.deg = 0
  }
  public get range() {
    return 4
  }
  public get firstline() {
    return 'fast'
  }
  public get secondline() {
    return 'turret'
  }
  public get price() {
    return 50
  }
  public tick(tick: number, enes: Array<[IEnemy, number, [number, number]]>, st: ST<IMachineStore>, pos: { x: number; y: number; }) {
    enes.sort(([, a], [, b]) => a - b)
    const [ene, , [ex, ey]] = enes[0]
    this.deg = Math.atan2(ey, ex) + Math.PI / 2
    if (tick % 5 === 0) {
      st.emit('spawnBullet', new SimpleBullet(pos, this.deg - Math.PI / 2))
    }
  }
  public icon(base: { x: number, y: number, scale: number }) {
    draw('chainturret', {
      ...base,
      x: base.x + base.scale,
      scale: base.scale / 2,
    })
  }
  public render(base: { x: number, y: number, scale: number }) {
    drawRotate('chainturret', {
      ...base,
      x: base.x,
      scale: base.scale / 2,
    }, this.deg, { x: 8, y: 8 })
  }
  public canplace(bp: BlockPair): boolean {
    return bp.top instanceof Blocks.air &&
      !(bp.base instanceof Blocks.deepwater) &&
      !(bp.base instanceof Blocks.lava) &&
      !(bp.base instanceof Blocks.oil)
  }
  public clone(): IMachine {
    return new FastTurret
  }
}
