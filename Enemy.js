System.register(["immutable", "./SpriteLoader"], function (exports_1, context_1) {
    "use strict";
    var immutable_1, SpriteLoader_1, BaseEnemy, dirs, TargetEnemy;
    var __moduleName = context_1 && context_1.id;
    function encoding(x, y) {
        return `[${x},${y}]`;
    }
    function getXY(vm, x, y) {
        return vm.get(`[${x},${y}]`, (x ** 2 + y ** 2) ** 0.8);
    }
    function setXY(vm, x, y, value) {
        return vm.set(`[${x},${y}]`, value);
    }
    return {
        setters: [
            function (immutable_1_1) {
                immutable_1 = immutable_1_1;
            },
            function (SpriteLoader_1_1) {
                SpriteLoader_1 = SpriteLoader_1_1;
            }
        ],
        execute: function () {
            BaseEnemy = class BaseEnemy {
                constructor(basename, level, maxhealth, startpos) {
                    this.basename = basename;
                    this.deg = 0;
                    this.level = level;
                    this.health = maxhealth;
                    this.real = startpos;
                    this.target = startpos;
                    this.progress = -1;
                }
                get pos() {
                    return {
                        x: (this.target.x - this.real.x) * this.progress + this.real.x,
                        y: (this.target.y - this.real.y) * this.progress + this.real.y,
                    };
                }
                render(calc) {
                    SpriteLoader_1.drawRotateCenter(`${this.basename}-t${this.level}`, calc(this.pos), this.deg, { x: 3, y: 3 }, { x: 7, y: 7 });
                }
                hit(dmg) {
                    this.health -= dmg;
                }
            };
            dirs = [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1],
            ];
            TargetEnemy = class TargetEnemy extends BaseEnemy {
                constructor(startpos) {
                    super('targetenemy', 1, 30, startpos);
                    this.history = immutable_1.OrderedMap();
                }
                get money() { return 2; }
                get score() { return 10; }
                tick(tick, st) {
                    if (this.health <= 0) {
                        const vm = st.access('valuemap');
                        st.emit('valuemap', setXY(vm, this.real.x, this.real.y, getXY(vm, this.real.x, this.real.y) + 1.0));
                        return st.emit('die', this);
                    }
                    if (this.progress === -1) {
                        let vm = st.access('valuemap');
                        let min = Number.MAX_SAFE_INTEGER;
                        let lasmin = Number.MAX_SAFE_INTEGER;
                        let tgt;
                        do {
                            for (const [ox, oy] of dirs) {
                                const temp = getXY(vm, this.real.x + ox, this.real.y + oy);
                                if (temp < min) {
                                    tgt = [ox, oy];
                                    lasmin = min;
                                    min = temp;
                                }
                            }
                            if (st.access('map').value({ x: this.real.x + tgt[0], y: this.real.y + tgt[1] }) !== 0) {
                                vm = setXY(vm, this.real.x, this.real.y, getXY(vm, this.real.x, this.real.y) + 0.1);
                                vm = setXY(vm, this.real.x + tgt[0], this.real.y + tgt[1], (lasmin !== Number.MAX_SAFE_INTEGER ? lasmin : min) + 1.0);
                                min = Number.MAX_SAFE_INTEGER;
                                continue;
                            }
                            break;
                        } while (true);
                        if (this.history.has(encoding(this.real.x, this.real.y))) {
                            vm = setXY(vm, this.real.x, this.real.y, getXY(vm, this.real.x, this.real.y) + this.history.get(encoding(this.real.x, this.real.y)) ** 2);
                            this.history = this.history.update(encoding(this.real.x, this.real.y), (x) => x + 1);
                        }
                        else {
                            vm = setXY(vm, this.real.x, this.real.y, getXY(vm, this.real.x, this.real.y) - 0.1);
                            this.history = this.history.set(encoding(this.real.x, this.real.y), 1);
                        }
                        st.emit('valuemap', vm);
                        this.target = {
                            x: this.real.x + tgt[0],
                            y: this.real.y + tgt[1],
                        };
                        if (tgt[0] < 0) {
                            this.deg = -Math.PI / 2;
                        }
                        if (tgt[0] > 0) {
                            this.deg = Math.PI / 2;
                        }
                        if (tgt[1] > 0) {
                            this.deg = Math.PI;
                        }
                        if (tgt[1] < 0) {
                            this.deg = 0;
                        }
                        this.progress = 0;
                    }
                    else if (this.progress >= 1.0) {
                        this.real = this.target;
                        this.progress = -1;
                        if (this.real.x === 0 && this.real.y === 0) {
                            let vm = st.access('valuemap');
                            this.history.forEach((v, k) => {
                                const [x, y] = JSON.parse(k);
                                if (v > 1) {
                                    return;
                                }
                                vm = setXY(vm, x, y, 0.5 * Math.sqrt(x ** 2 + y ** 2 - 0.5) + 0.5 * getXY(vm, x, y));
                            });
                            st.emit('valuemap', vm);
                            st.emit('enter', this);
                        }
                    }
                    else {
                        this.progress += 0.05;
                    }
                }
            };
            exports_1("TargetEnemy", TargetEnemy);
        }
    };
});
//# sourceMappingURL=Enemy.js.map