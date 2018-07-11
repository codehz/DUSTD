import { draw, FrameName } from './SpriteLoader'

export abstract class Block {
  public readonly fullBlock: boolean
  public readonly block    : boolean
  public readonly offset?  : { x: number, y: number }
  get    size()            : number { return 1 }
  public abstract render(pos: { x: number, y: number, scale: number })
}

export class BlockPair {
  public readonly base: Block
  public readonly top : Block
  constructor({ base = new Blocks.air, top = new Blocks.air }: { base?: Block, top?: Block }) {
    this.base = base
    this.top  = top
  }
}

class RealBlock extends Block {
  protected name: FrameName
  public get block() { return false }
  constructor(name: FrameName) {
    super()
    this.name = name
  }
  public render(pos: { x: number; y: number; scale: number; }) {
    draw(this.name, pos)
  }
}

class RandomizeBlock extends RealBlock {
  constructor(base: string, range: number = 3) {
    super(base + ((Math.random() * range | 0) + 1) as FrameName)
  }
  get fullBlock() {
    return true
  }
}

class AirBlock extends Block {
  public get block() { return false }
  get fullBlock() {
    return false
  }
  public render() {
    //
  }
}

class PartBlock extends Block {
  public get block() { return true }
  get fullBlock() {
    return false
  }
  public render() {
    //
  }
}

class LargeBlock extends RealBlock {
  get size() { return 2 }
  get fullBlock() { return true }
}
class HugeBlock extends RealBlock {
  public get offset() { return { x: -1, y: -1 } }
  get size() { return 3 }
}

function makeRandomizeBlock(name: string, range: number = 3, full: boolean = true) {
  return class extends RandomizeBlock {
    constructor() {
      super(name, range)
    }
    get fullBlock() { return full }
  }
}

function makeNormalBlock(name: FrameName, full: boolean = true) {
  return class extends RealBlock {
    constructor() {
      super(name)
    }
    get fullBlock() { return full }
  }
}

function makeLargeBlock(name: FrameName) {
  return class extends LargeBlock {
    constructor() {
      super(name)
    }
  }
}
function makeHugeBlock(name: FrameName) {
  return class extends HugeBlock {
    constructor() {
      super(name)
    }
  }
}

export const Blocks = {
  'air'            : AirBlock,
  'part'           : PartBlock,
  'core'           : makeHugeBlock('core'),
  'water'          : makeNormalBlock('water'),
  'deepwater'      : makeNormalBlock('deepwater'),
  'lava'           : makeNormalBlock('lava'),
  'oil'            : makeNormalBlock('oil'),
  'stone'          : makeRandomizeBlock('stone'),
  'blackstone'     : makeRandomizeBlock('blackstone'),
  'iron'           : makeRandomizeBlock('iron'),
  'coal'           : makeRandomizeBlock('coal'),
  'titanium'       : makeRandomizeBlock('titanium'),
  'uranium'        : makeRandomizeBlock('uranium'),
  'dirt'           : makeRandomizeBlock('dirt'),
  'sand'           : makeRandomizeBlock('sand'),
  'ice'            : makeRandomizeBlock('ice'),
  'snow'           : makeRandomizeBlock('snow'),
  'grass'          : makeRandomizeBlock('grass'),
  'sandblock'      : makeRandomizeBlock('sandblock'),
  'snowblock'      : makeRandomizeBlock('snowblock'),
  'stoneblock'     : makeRandomizeBlock('stoneblock'),
  'blackstoneblock': makeRandomizeBlock('blackstoneblock'),
  'grassblock'     : makeRandomizeBlock('grassblock', 2),
  'mossblock'      : makeNormalBlock('mossblock'),
  'shrub'          : makeNormalBlock('shrub', false),
  'rock'           : makeRandomizeBlock('rock', 2, false),
  'icerock'        : makeRandomizeBlock('icerock', 2, false),
  'blackrock'      : makeRandomizeBlock('blackrock', 1, false),
  'stonewall'      : makeNormalBlock('stonewall'),
  'ironwall'       : makeNormalBlock('ironwall'),
  'steelwall'      : makeNormalBlock('steelwall'),
  'titaniumwall'   : makeNormalBlock('titaniumwall'),
  'duriumwall'     : makeNormalBlock('duriumwall'),
  'compositewall'  : makeNormalBlock('compositewall'),
  'steelwall-large': makeLargeBlock('steelwall-large'),
}

export const colorMap = {
  get [0xff0000]() { return new BlockPair({ base: new Blocks.dirt }) },
  get [0x00ff00]() { return new BlockPair({ base: new Blocks.stone }) },
  get [0x323232]() { return new BlockPair({ base: new Blocks.stone }) },
  get [0x646464]() { return new BlockPair({ base: new Blocks.stone, top: new Blocks.stoneblock }) },
  get [0x50965a]() { return new BlockPair({ base: new Blocks.grass }) },
  get [0x5ab464]() { return new BlockPair({ base: new Blocks.grass, top: new Blocks.grassblock }) },
  get [0x506eb4]() { return new BlockPair({ base: new Blocks.water }) },
  get [0x465a96]() { return new BlockPair({ base: new Blocks.deepwater }) },
  get [0x252525]() { return new BlockPair({ base: new Blocks.blackstone }) },
  get [0x575757]() { return new BlockPair({ base: new Blocks.blackstone, top: new Blocks.blackstoneblock }) },
  get [0x988a67]() { return new BlockPair({ base: new Blocks.sand }) },
  get [0xe5d8bb]() { return new BlockPair({ base: new Blocks.sand, top: new Blocks.sandblock }) },
  get [0xc2d1d2]() { return new BlockPair({ base: new Blocks.snow }) },
  get [0xc4e3e7]() { return new BlockPair({ base: new Blocks.ice }) },
  get [0xf7feff]() { return new BlockPair({ base: new Blocks.snow, top: new Blocks.snowblock }) },
  get [0x6e501e]() { return new BlockPair({ base: new Blocks.dirt }) },
  get [0xed5334]() { return new BlockPair({ base: new Blocks.lava }) },
  get [0x292929]() { return new BlockPair({ base: new Blocks.oil }) },
  get [0xc3a490]() { return new BlockPair({ base: new Blocks.iron }) },
  get [0x161616]() { return new BlockPair({ base: new Blocks.coal }) },
  get [0x6277bc]() { return new BlockPair({ base: new Blocks.titanium }) },
  get [0x83bc58]() { return new BlockPair({ base: new Blocks.uranium }) },
}

export const emptyPair = new BlockPair({
  base: new AirBlock(),
  top: new AirBlock(),
})

export function makePair(src: BlockPair, part: Block = new Blocks.part): BlockPair {
  return new BlockPair({
    base: src.base,
    top: part,
  })
}
