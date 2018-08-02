import { IEMap, IEnemy, IEnemyStore } from './Enemy'
import { drawRotate, drawRotateCenter, FrameName } from './SpriteLoader'
import ST from './ST'

export interface IBullet {
  readonly pos: { x: number; y: number; }
  tick(tick: number, enes: Set<IEnemy>, st: ST<IEnemyStore & IBulletStore>)
  render(calc: (pos: {x: number, y: number}) => { x: number; y: number; scale: number })
}

export interface IBulletStore {
  killBullet: IBullet | undefined
}

class BaseBullet implements IBullet {
  public    pos  : { x: number; y: number; }
  public    deg  : number
  public    frame: FrameName
  protected life : number
  protected speed: number
  protected dmg  : number
  constructor(frame: FrameName, pos: { x: number; y: number; }, deg: number, speed: number, life: number, dmg: number) {
    this.frame = frame
    this.pos   = pos
    this.deg   = deg
    this.speed = speed
    this.life  = life
    this.dmg   = dmg
  }
  public tick(tick: number, enes: Set<IEnemy>, st: ST<IEnemyStore & IBulletStore>) {
    for (const ene of enes) {
      if ((ene.pos.x - this.pos.x) ** 2 + (ene.pos.y - this.pos.y) ** 2 <= 0.5 ** 2) {
        ene.hit(this.dmg)
        st.emit('killBullet', this)
        return
      }
    }
    if (this.life <= 0)  {
      st.emit('killBullet', this)
      return
    }
    this.life--
    this.pos.x += this.speed * Math.cos(this.deg)
    this.pos.y += this.speed * Math.sin(this.deg)
  }
  public render(calc: (pos: {x: number, y: number}) => { x: number; y: number; scale: number }) {
    drawRotate(this.frame, calc(this.pos), this.deg, {x: 4, y: 4})
  }
}

export class SimpleBullet extends BaseBullet {
  private start: number
  constructor(pos: { x: number; y: number; }, deg: number) {
    super('bullet', pos, deg, 0.1, 80, 1)
  }
}
