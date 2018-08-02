System.register(["./SpriteLoader"], function (exports_1, context_1) {
    "use strict";
    var SpriteLoader_1, Block, BlockPair, RealBlock, RandomizeBlock, AirBlock, PartBlock, LargeBlock, HugeBlock, Blocks, colorMap, emptyPair;
    var __moduleName = context_1 && context_1.id;
    function makeRandomizeBlock(name, range = 3, full = true) {
        return class extends RandomizeBlock {
            constructor() {
                super(name, range);
            }
            get fullBlock() { return full; }
        };
    }
    function makeNormalBlock(name, full = true) {
        return class extends RealBlock {
            constructor() {
                super(name);
            }
            get fullBlock() { return full; }
        };
    }
    function makeLargeBlock(name) {
        return class extends LargeBlock {
            constructor() {
                super(name);
            }
        };
    }
    function makeHugeBlock(name) {
        return class extends HugeBlock {
            constructor() {
                super(name);
            }
        };
    }
    function makePair(src, part = new Blocks.part) {
        return new BlockPair({
            base: src.base,
            top: part,
        });
    }
    exports_1("makePair", makePair);
    return {
        setters: [
            function (SpriteLoader_1_1) {
                SpriteLoader_1 = SpriteLoader_1_1;
            }
        ],
        execute: function () {
            Block = class Block {
                get size() { return 1; }
            };
            exports_1("Block", Block);
            BlockPair = class BlockPair {
                constructor({ base = new Blocks.air, top = new Blocks.air }) {
                    this.base = base;
                    this.top = top;
                }
            };
            exports_1("BlockPair", BlockPair);
            RealBlock = class RealBlock extends Block {
                get block() { return false; }
                constructor(name) {
                    super();
                    this.name = name;
                }
                render(pos) {
                    SpriteLoader_1.draw(this.name, pos);
                }
            };
            RandomizeBlock = class RandomizeBlock extends RealBlock {
                constructor(base, range = 3) {
                    super(base + ((Math.random() * range | 0) + 1));
                }
                get fullBlock() {
                    return true;
                }
            };
            AirBlock = class AirBlock extends Block {
                get block() { return false; }
                get fullBlock() {
                    return false;
                }
                render() {
                    //
                }
            };
            PartBlock = class PartBlock extends Block {
                get block() { return true; }
                get fullBlock() {
                    return false;
                }
                render() {
                    //
                }
            };
            LargeBlock = class LargeBlock extends RealBlock {
                get size() { return 2; }
                get fullBlock() { return true; }
            };
            HugeBlock = class HugeBlock extends RealBlock {
                get offset() { return { x: -1, y: -1 }; }
                get size() { return 3; }
            };
            exports_1("Blocks", Blocks = {
                'air': AirBlock,
                'part': PartBlock,
                'core': makeHugeBlock('core'),
                'water': makeNormalBlock('water'),
                'deepwater': makeNormalBlock('deepwater'),
                'lava': makeNormalBlock('lava'),
                'oil': makeNormalBlock('oil'),
                'stone': makeRandomizeBlock('stone'),
                'blackstone': makeRandomizeBlock('blackstone'),
                'iron': makeRandomizeBlock('iron'),
                'coal': makeRandomizeBlock('coal'),
                'titanium': makeRandomizeBlock('titanium'),
                'uranium': makeRandomizeBlock('uranium'),
                'dirt': makeRandomizeBlock('dirt'),
                'sand': makeRandomizeBlock('sand'),
                'ice': makeRandomizeBlock('ice'),
                'snow': makeRandomizeBlock('snow'),
                'grass': makeRandomizeBlock('grass'),
                'sandblock': makeRandomizeBlock('sandblock'),
                'snowblock': makeRandomizeBlock('snowblock'),
                'stoneblock': makeRandomizeBlock('stoneblock'),
                'blackstoneblock': makeRandomizeBlock('blackstoneblock'),
                'grassblock': makeRandomizeBlock('grassblock', 2),
                'mossblock': makeNormalBlock('mossblock'),
                'shrub': makeNormalBlock('shrub', false),
                'rock': makeRandomizeBlock('rock', 2, false),
                'icerock': makeRandomizeBlock('icerock', 2, false),
                'blackrock': makeRandomizeBlock('blackrock', 1, false),
                'stonewall': makeNormalBlock('stonewall'),
                'ironwall': makeNormalBlock('ironwall'),
                'steelwall': makeNormalBlock('steelwall'),
                'titaniumwall': makeNormalBlock('titaniumwall'),
                'duriumwall': makeNormalBlock('duriumwall'),
                'compositewall': makeNormalBlock('compositewall'),
                'steelwall-large': makeLargeBlock('steelwall-large'),
            });
            exports_1("colorMap", colorMap = {
                get [0xff0000]() { return new BlockPair({ base: new Blocks.dirt }); },
                get [0x00ff00]() { return new BlockPair({ base: new Blocks.stone }); },
                get [0x323232]() { return new BlockPair({ base: new Blocks.stone }); },
                get [0x646464]() { return new BlockPair({ base: new Blocks.stone, top: new Blocks.stoneblock }); },
                get [0x50965a]() { return new BlockPair({ base: new Blocks.grass }); },
                get [0x5ab464]() { return new BlockPair({ base: new Blocks.grass, top: new Blocks.grassblock }); },
                get [0x506eb4]() { return new BlockPair({ base: new Blocks.water }); },
                get [0x465a96]() { return new BlockPair({ base: new Blocks.deepwater }); },
                get [0x252525]() { return new BlockPair({ base: new Blocks.blackstone }); },
                get [0x575757]() { return new BlockPair({ base: new Blocks.blackstone, top: new Blocks.blackstoneblock }); },
                get [0x988a67]() { return new BlockPair({ base: new Blocks.sand }); },
                get [0xe5d8bb]() { return new BlockPair({ base: new Blocks.sand, top: new Blocks.sandblock }); },
                get [0xc2d1d2]() { return new BlockPair({ base: new Blocks.snow }); },
                get [0xc4e3e7]() { return new BlockPair({ base: new Blocks.ice }); },
                get [0xf7feff]() { return new BlockPair({ base: new Blocks.snow, top: new Blocks.snowblock }); },
                get [0x6e501e]() { return new BlockPair({ base: new Blocks.dirt }); },
                get [0xed5334]() { return new BlockPair({ base: new Blocks.lava }); },
                get [0x292929]() { return new BlockPair({ base: new Blocks.oil }); },
                get [0xc3a490]() { return new BlockPair({ base: new Blocks.iron }); },
                get [0x161616]() { return new BlockPair({ base: new Blocks.coal }); },
                get [0x6277bc]() { return new BlockPair({ base: new Blocks.titanium }); },
                get [0x83bc58]() { return new BlockPair({ base: new Blocks.uranium }); },
            });
            exports_1("emptyPair", emptyPair = new BlockPair({
                base: new AirBlock(),
                top: new AirBlock(),
            }));
        }
    };
});
//# sourceMappingURL=Blocks.js.map