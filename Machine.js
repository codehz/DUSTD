System.register(["./Blocks", "./Bullet", "./SpriteLoader"], function (exports_1, context_1) {
    "use strict";
    var Blocks_1, Bullet_1, SpriteLoader_1, BaseMachine, StaticMachine, CoreMachine, Turret, FastTurret;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Blocks_1_1) {
                Blocks_1 = Blocks_1_1;
            },
            function (Bullet_1_1) {
                Bullet_1 = Bullet_1_1;
            },
            function (SpriteLoader_1_1) {
                SpriteLoader_1 = SpriteLoader_1_1;
            }
        ],
        execute: function () {
            BaseMachine = class BaseMachine {
                get size() { return 1; }
            };
            exports_1("BaseMachine", BaseMachine);
            StaticMachine = class StaticMachine extends BaseMachine {
                constructor(firstline, secondline, block, price) {
                    super();
                    this.firstline = firstline;
                    this.secondline = secondline;
                    this.block = block;
                    this.range = 0;
                    this.price = price;
                }
                tick(tick, enes, st, pos) {
                    //
                }
                icon(base) {
                    //
                }
                render(base) {
                    //
                }
                canplace(bp) {
                    return bp.top instanceof Blocks_1.Blocks.air;
                }
                clone() {
                    return new StaticMachine(this.firstline, this.secondline, this.block, this.price);
                }
            };
            exports_1("StaticMachine", StaticMachine);
            CoreMachine = class CoreMachine extends StaticMachine {
                get size() { return 3; }
                constructor() {
                    super('core', '', new Blocks_1.Blocks.core, 0);
                }
            };
            exports_1("CoreMachine", CoreMachine);
            Turret = class Turret extends BaseMachine {
                constructor() {
                    super();
                    this.deg = 0;
                }
                get range() {
                    return 5;
                }
                get firstline() {
                    return 'basic';
                }
                get secondline() {
                    return 'turret';
                }
                get price() {
                    return 10;
                }
                tick(tick, enes, st, pos) {
                    enes.sort(([, a], [, b]) => a - b);
                    const [ene, , [ex, ey]] = enes[0];
                    this.deg = Math.atan2(ey, ex) + Math.PI / 2;
                    if (tick % 10 === 0) {
                        st.emit('spawnBullet', new Bullet_1.SimpleBullet(pos, this.deg - Math.PI / 2));
                    }
                }
                icon(base) {
                    SpriteLoader_1.draw('turret', base);
                }
                render(base) {
                    SpriteLoader_1.drawRotate('turret', Object.assign({}, base, { x: base.x - base.scale }), this.deg, { x: 5, y: 4 });
                }
                canplace(bp) {
                    return bp.top instanceof Blocks_1.Blocks.air &&
                        !(bp.base instanceof Blocks_1.Blocks.deepwater) &&
                        !(bp.base instanceof Blocks_1.Blocks.lava) &&
                        !(bp.base instanceof Blocks_1.Blocks.oil);
                }
                clone() {
                    return new Turret;
                }
            };
            exports_1("Turret", Turret);
            FastTurret = class FastTurret extends BaseMachine {
                constructor() {
                    super();
                    this.deg = 0;
                }
                get range() {
                    return 4;
                }
                get firstline() {
                    return 'fast';
                }
                get secondline() {
                    return 'turret';
                }
                get price() {
                    return 50;
                }
                tick(tick, enes, st, pos) {
                    enes.sort(([, a], [, b]) => a - b);
                    const [ene, , [ex, ey]] = enes[0];
                    this.deg = Math.atan2(ey, ex) + Math.PI / 2;
                    if (tick % 5 === 0) {
                        st.emit('spawnBullet', new Bullet_1.SimpleBullet(pos, this.deg - Math.PI / 2));
                    }
                }
                icon(base) {
                    SpriteLoader_1.draw('chainturret', Object.assign({}, base, { x: base.x + base.scale, scale: base.scale / 2 }));
                }
                render(base) {
                    SpriteLoader_1.drawRotate('chainturret', Object.assign({}, base, { x: base.x, scale: base.scale / 2 }), this.deg, { x: 8, y: 8 });
                }
                canplace(bp) {
                    return bp.top instanceof Blocks_1.Blocks.air &&
                        !(bp.base instanceof Blocks_1.Blocks.deepwater) &&
                        !(bp.base instanceof Blocks_1.Blocks.lava) &&
                        !(bp.base instanceof Blocks_1.Blocks.oil);
                }
                clone() {
                    return new FastTurret;
                }
            };
            exports_1("FastTurret", FastTurret);
        }
    };
});
//# sourceMappingURL=Machine.js.map