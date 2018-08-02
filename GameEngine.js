System.register(["immutable", "./Blocks", "./Enemy", "./FontLoader", "./global", "./Machine", "./Scene", "./SpriteLoader", "./ST"], function (exports_1, context_1) {
    "use strict";
    var immutable_1, Blocks_1, Enemy_1, FontLoader_1, global_1, Machine_1, Scene_1, SpriteLoader_1, ST_1, ActualMap, CachedMap, BaseMachineMap, InfoBoard, MachineSelector, FloatItem, GameEngine;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (immutable_1_1) {
                immutable_1 = immutable_1_1;
            },
            function (Blocks_1_1) {
                Blocks_1 = Blocks_1_1;
            },
            function (Enemy_1_1) {
                Enemy_1 = Enemy_1_1;
            },
            function (FontLoader_1_1) {
                FontLoader_1 = FontLoader_1_1;
            },
            function (global_1_1) {
                global_1 = global_1_1;
            },
            function (Machine_1_1) {
                Machine_1 = Machine_1_1;
            },
            function (Scene_1_1) {
                Scene_1 = Scene_1_1;
            },
            function (SpriteLoader_1_1) {
                SpriteLoader_1 = SpriteLoader_1_1;
            },
            function (ST_1_1) {
                ST_1 = ST_1_1;
            }
        ],
        execute: function () {
            ActualMap = class ActualMap {
                constructor(img) {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    this.width = canvas.width = img.naturalWidth;
                    this.height = canvas.height = img.naturalHeight;
                    this.redpoints = [];
                    ctx.drawImage(img, 0, 0);
                    const data = ctx.getImageData(0, 0, this.width, this.height);
                    this.data = new DataView(data.data.buffer);
                    this.findSpot();
                }
                findSpot() {
                    for (let i = 0; i < this.height; i++) {
                        for (let j = 0; j < this.width; j++) {
                            const color = this.data.getUint32((i * this.width + j) * 4, false) >>> 8;
                            if (color === 0x00ff00) {
                                this.start = {
                                    x: j,
                                    y: i,
                                };
                            }
                            else if (color === 0xff0000) {
                                this.redpoints.push({
                                    x: j,
                                    y: i,
                                });
                            }
                        }
                    }
                    if (undefined === this.start) {
                        throw new Error('Map is no start point');
                    }
                    this.redpoints.forEach((pt) => {
                        pt.x -= this.start.x;
                        pt.y -= this.start.y;
                    });
                }
                get({ x: ox, y: oy }) {
                    const [x, y] = [ox + this.start.x, oy + this.start.y];
                    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                        return Blocks_1.emptyPair;
                    }
                    const color = this.data.getUint32((y * this.width + x) * 4, false) >>> 8;
                    return Blocks_1.colorMap[color] || Blocks_1.emptyPair;
                }
                getSpot() {
                    return Object.assign({}, this.redpoints[this.redpoints.length * Math.random() | 0]);
                }
            };
            exports_1("ActualMap", ActualMap);
            CachedMap = class CachedMap {
                constructor(source) {
                    this.source = source;
                    this.cache = new Map;
                }
                get({ x, y }) {
                    const key = `${x}|${y}`;
                    if (this.cache.has(key)) {
                        return this.cache.get(key);
                    }
                    const v = this.source.get({ x, y });
                    if (v.base instanceof Blocks_1.Blocks.air) {
                        return v;
                    }
                    this.cache.set(key, v);
                    return v;
                }
                getSpot() {
                    return this.source.getSpot();
                }
            };
            exports_1("CachedMap", CachedMap);
            BaseMachineMap = class BaseMachineMap {
                constructor(source) {
                    this.source = source;
                    this.macs = new Map;
                    this.bullets = new Set;
                    this.enemies = new Set;
                    this.macs.set(`[0,0]`, new Machine_1.CoreMachine);
                }
                tryPlace({ x, y }, mac) {
                    const bp = this.source.get({ x, y });
                    if (this.checkPos(x, y) || bp === Blocks_1.emptyPair || !mac.canplace(bp)) {
                        return false;
                    }
                    this.macs.set(`[${x},${y}]`, mac.clone());
                    return true;
                }
                checkPos(x, y) {
                    const curr = this.macs.get(`[${x},${y}]`);
                    if (curr) {
                        return curr;
                    }
                    for (const [minsize, ox, oy] of BaseMachineMap.checks) {
                        const [rx, ry] = [x + ox, y + oy];
                        const temp = this.macs.get(`[${rx},${ry}]`);
                        if (temp && temp.size >= minsize) {
                            return true;
                        }
                    }
                    return false;
                }
                get({ x, y }) {
                    const res = this.checkPos(x, y);
                    if (BaseMachineMap.isMac(res)) {
                        if (res instanceof Machine_1.StaticMachine) {
                            return [Blocks_1.makePair(this.source.get({ x, y }), res.block), null];
                        }
                        return [this.source.get({ x, y }), res];
                    }
                    else if (res) {
                        return [Blocks_1.makePair(this.source.get({ x, y })), null];
                    }
                    return [this.source.get({ x, y }), null];
                }
                value({ x, y }) {
                    const [block, mac] = this.get({ x, y });
                    if (Math.abs(x) + Math.abs(y) === 1 || (x === 0 && y === 0)) {
                        return 0;
                    }
                    if (block === Blocks_1.emptyPair ||
                        block.base instanceof Blocks_1.Blocks.deepwater ||
                        block.base instanceof Blocks_1.Blocks.oil ||
                        block.base instanceof Blocks_1.Blocks.lava ||
                        !(block.top instanceof Blocks_1.Blocks.air)) {
                        return -1;
                    }
                    if (mac || block.top instanceof Machine_1.StaticMachine) {
                        return 1;
                    }
                    return 0;
                }
                trySpawnEnemy() {
                    const point = this.source.getSpot();
                    this.enemies.add(new Enemy_1.TargetEnemy(point));
                }
            };
            (function (BaseMachineMap) {
                BaseMachineMap.checks = [
                    [2, -1, -1],
                    [2, -1, 0],
                    [2, 0, -1],
                    [3, 1, -1],
                    [3, 1, 0],
                    [3, -1, 1],
                    [3, 0, 1],
                    [3, 1, 1],
                ];
                function isMac(res) {
                    return typeof res === 'object';
                }
                BaseMachineMap.isMac = isMac;
            })(BaseMachineMap || (BaseMachineMap = {}));
            InfoBoard = class InfoBoard extends Scene_1.BaseEntity {
                constructor(engine) {
                    super();
                    this.engine = engine;
                }
                measure(limit) {
                    return this.cache = {
                        w: 100,
                        h: 58,
                    };
                }
                render(pos) {
                    SpriteLoader_1.drawNinepatch('window', Object.assign({}, pos, this.cache));
                    FontLoader_1.titleLoader.drawLine('Info Board', {
                        x: pos.x + 14,
                        y: pos.y + 20,
                        scale: 1,
                    });
                    FontLoader_1.textLoader.drawLine(`score: ${this.engine.lst.access('score')}`, {
                        x: pos.x + 8,
                        y: pos.y + 28,
                        scale: 1 / 4,
                    });
                    FontLoader_1.textLoader.drawLine(`money: $${this.engine.lst.access('money')}`, {
                        x: pos.x + 8,
                        y: pos.y + 36,
                        scale: 1 / 4,
                    });
                    FontLoader_1.textLoader.drawLine(`life: ${this.engine.lst.access('core')}`, {
                        x: pos.x + 8,
                        y: pos.y + 44,
                        scale: 1 / 4,
                    });
                }
            };
            exports_1("InfoBoard", InfoBoard);
            MachineSelector = class MachineSelector extends Scene_1.BaseEntity {
                constructor(list, hook) {
                    super(true);
                    this.list = list;
                    this.hook = hook;
                }
                measure(limit) {
                    return this.cache = {
                        w: limit.w - 85,
                        h: 85,
                    };
                }
                mouse(evt) {
                    const { x, y } = evt;
                    if (evt.type === Scene_1.XPointEventType.pointerdown && x >= 8 && y >= 10 && y < 62) {
                        const id = Math.floor((x - 8) / 40);
                        if (id < this.list.length) {
                            this.hook(this.list[id]);
                        }
                    }
                    return super.mouse(evt);
                }
                render(pos) {
                    SpriteLoader_1.drawNinepatch('window', Object.assign({}, pos, this.cache));
                    const base = {
                        x: pos.x + 8,
                        y: pos.y + 15,
                        scale: 3,
                    };
                    for (const item of this.list) {
                        item.icon(Object.assign({}, base, { x: base.x + 4 }));
                        FontLoader_1.textLoader.drawLine(item.firstline, {
                            x: base.x + (20 - FontLoader_1.textLoader.textWidth(item.firstline) / 8),
                            y: base.y + 36,
                            scale: 1 / 4,
                        });
                        FontLoader_1.textLoader.drawLine(item.secondline, {
                            x: base.x + (20 - FontLoader_1.textLoader.textWidth(item.secondline) / 8),
                            y: base.y + 46,
                            scale: 1 / 4,
                        });
                        FontLoader_1.textLoader.drawLine(`$${item.price}`, {
                            x: base.x + (20 - FontLoader_1.textLoader.textWidth(`$${item.price}`) / 8),
                            y: base.y + 56,
                            scale: 1 / 4,
                        });
                        base.x += 40;
                    }
                }
            };
            exports_1("MachineSelector", MachineSelector);
            FloatItem = class FloatItem extends Scene_1.BaseEntity {
                constructor(hook) {
                    super(false);
                    this.hook = hook;
                }
                setFloat(mac) {
                    this.mac = mac;
                }
                measure(limit) {
                    return limit;
                }
                mouse(evt) {
                    this.position = {
                        x: evt.globalX - 16,
                        y: evt.globalY - 16,
                    };
                    if (this.mac) {
                        global_1.gst.emit('validate', false);
                        if (evt.type === Scene_1.XPointEventType.pointerup) {
                            this.hook(this.mac);
                            this.mac = undefined;
                        }
                    }
                    return super.mouse(evt);
                }
                render(base) {
                    if (this.mac) {
                        this.mac.icon(Object.assign({}, this.position, { scale: 3 }));
                    }
                }
            };
            exports_1("FloatItem", FloatItem);
            GameEngine = class GameEngine extends Scene_1.BaseEntity {
                constructor(map) {
                    super(true);
                    this.map = new BaseMachineMap(map);
                    this.lst = new ST_1.default({
                        offset: { x: 0, y: 0 },
                        move: { x: 0, y: 0 },
                        scale: 4,
                        map: this.map,
                        valuemap: immutable_1.Map(),
                        die: undefined,
                        enter: undefined,
                        killBullet: undefined,
                        spawnBullet: undefined,
                        score: 0,
                        money: 100,
                        core: 100,
                        gameover: false,
                    });
                    this.lst.on('scale', (scale, old) => this.lst.emitFn('offset', ({ x, y }) => ({ x: x / old * scale, y: y / old * scale })));
                    this.lst.on('offset', ({ x: nx, y: ny }, { x: ox, y: oy }) => {
                        if (nx !== ox || ny !== oy) {
                            global_1.gst.emit('validate', false);
                        }
                    });
                    this.lst.on('die', (ene) => {
                        this.lst.emitFn('score', (s) => s + ene.score);
                        this.lst.emitFn('money', (m) => m + ene.money);
                        this.map.enemies.delete(ene);
                    });
                    this.lst.on('enter', (ene) => {
                        this.lst.emitFn('core', (s) => s - 1);
                        this.map.enemies.delete(ene);
                    });
                    this.lst.on('killBullet', (bullet) => {
                        this.map.bullets.delete(bullet);
                    });
                    this.lst.on('spawnBullet', (bullet) => {
                        this.map.bullets.add(bullet);
                    });
                    this.lst.on('core', (core) => {
                        if (core < 0) {
                            console.log('gameover');
                            this.lst.emit('gameover', true);
                        }
                    });
                }
                mayPlace(mac) {
                    this.willPlace = mac;
                    setTimeout((x) => this.willPlace = undefined);
                }
                measure(limit) {
                    return this.cache = limit;
                }
                tick(tick) {
                    if (this.lst.access('gameover')) {
                        return;
                    }
                    const { x: mx, y: my } = this.lst.access('move');
                    if (mx !== 0 || my !== 0) {
                        this.lst.emitFn('offset', ({ x, y }) => ({ x: x + mx, y: y + my }));
                    }
                    if (tick % 100 === 0 && this.map.enemies.size < 20) {
                        this.map.trySpawnEnemy();
                    }
                    if (this.map.enemies.size) {
                        this.map.enemies.forEach((ene) => ene.tick(tick, this.lst));
                        global_1.gst.emit('validate', false);
                    }
                    if (this.map.bullets.size) {
                        this.map.bullets.forEach((bullet) => bullet.tick(tick, this.map.enemies, this.lst));
                        global_1.gst.emit('validate', false);
                    }
                    this.map.macs.forEach((mac, pos) => {
                        const [x, y] = JSON.parse(pos);
                        const queue = [];
                        for (const ene of this.map.enemies) {
                            const xpos = [ene.pos.x - x, ene.pos.y - y];
                            const d2 = xpos[0] ** 2 + xpos[1] ** 2;
                            if (d2 <= mac.range ** 2) {
                                queue.push([ene, Math.sqrt(d2), xpos]);
                            }
                        }
                        if (queue.length) {
                            mac.tick(tick, queue, this.lst, { x, y });
                        }
                    });
                }
                render(base) {
                    const scale = this.lst.access('scale');
                    const blocksize = 8 * scale;
                    const { w, h } = this.cache;
                    const { x: ox, y: oy } = this.lst.access('offset');
                    const [hb, wb] = [h / 8 / scale, w / 8 / scale];
                    const [px, py] = [ox / 8 / scale | 0, oy / 8 / scale | 0];
                    const queue = [];
                    for (let i = (-hb / 2 - 2) | 0; i < hb / 2 + 1; i++) {
                        for (let j = (-wb / 2 - 2) | 0; j < wb / 2 + 1; j++) {
                            const pos = {
                                x: base.x + w / 2 + j * blocksize - ox % blocksize,
                                y: base.y + h / 2 + i * blocksize - oy % blocksize,
                                scale,
                            };
                            const [pair, mac] = this.map.get({ x: j + px, y: i + py });
                            if (pair.top.block) {
                                continue;
                            }
                            if (!pair.top.fullBlock) {
                                pair.base.render(pos);
                            }
                            if (typeof pair.top.offset !== 'undefined') {
                                pos.x += pair.top.offset.x * blocksize;
                                pos.y += pair.top.offset.y * blocksize;
                            }
                            pair.top.render(pos);
                            if (mac) {
                                queue.push([mac, pos]);
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
                        }));
                    });
                    this.map.bullets.forEach((bullet) => {
                        bullet.render(({ x, y }) => ({
                            x: base.x + w / 2 + (x - px + 0.25) * blocksize - ox % blocksize,
                            y: base.y + h / 2 + (y - py + 0.25) * blocksize - oy % blocksize,
                            scale: scale / 2,
                        }));
                    });
                    for (const [mac, pos] of queue) {
                        mac.render(pos);
                    }
                }
                mouse(ev) {
                    const scale = this.lst.access('scale');
                    const blocksize = 8 * scale;
                    const { w, h } = this.cache;
                    const { x: ox, y: oy } = this.lst.access('offset');
                    const [hb, wb] = [h / 8 / scale, w / 8 / scale];
                    const [bx, by] = [Math.floor((ev.x + ox) / blocksize - wb / 2), Math.floor((ev.y + oy) / blocksize - hb / 2)];
                    switch (ev.type) {
                        case Scene_1.XPointEventType.pointerdown:
                            this.spos = {
                                x: ev.x,
                                y: ev.y,
                            };
                            break;
                        case Scene_1.XPointEventType.pointermove:
                            if (this.spos) {
                                this.lst.emitFn('offset', ({ x, y }) => ({
                                    x: x - ev.x + this.spos.x,
                                    y: y - ev.y + this.spos.y,
                                }));
                                this.spos = {
                                    x: ev.x,
                                    y: ev.y,
                                };
                            }
                            break;
                        case Scene_1.XPointEventType.pointerup:
                            if (this.willPlace && this.willPlace.price < this.lst.access('money')) {
                                this.lst.emitFn('money', (m) => m - this.willPlace.price);
                                this.map.tryPlace({ x: bx, y: by }, this.willPlace);
                            }
                            this.st.emit('focused', this);
                        case Scene_1.XPointEventType.pointerleave:
                            if (this.spos) {
                                this.lst.emitFn('offset', ({ x, y }) => ({
                                    x: x - ev.x + this.spos.x,
                                    y: y - ev.y + this.spos.y,
                                }));
                                this.spos = undefined;
                            }
                            break;
                        case Scene_1.XPointEventType.wheel:
                            this.lst.emitFn('offset', ({ x, y }) => ({ x: x + ev.wheelX, y: y + ev.wheelY }));
                            break;
                    }
                    return super.mouse(ev);
                }
                register(st) {
                    super.register(st);
                    this.st.emit('focused', this);
                }
                keyboard({ code, type }) {
                    if (type === Scene_1.XKeyboardEventType.keydown) {
                        switch (code) {
                            case 'ArrowLeft':
                                return this.lst.emitFn('move', ({ x, y }) => ({ x: -5, y }));
                            case 'ArrowRight':
                                return this.lst.emitFn('move', ({ x, y }) => ({ x: 5, y }));
                            case 'ArrowUp':
                                return this.lst.emitFn('move', ({ x, y }) => ({ x, y: -5 }));
                            case 'ArrowDown':
                                return this.lst.emitFn('move', ({ x, y }) => ({ x, y: 5 }));
                        }
                    }
                    if (type === Scene_1.XKeyboardEventType.keyup) {
                        switch (code) {
                            case 'ArrowLeft':
                                return this.lst.emitFn('move', ({ x, y }) => ({ x: x < 0 ? 0 : x, y }));
                            case 'ArrowRight':
                                return this.lst.emitFn('move', ({ x, y }) => ({ x: x > 0 ? 0 : x, y }));
                            case 'ArrowUp':
                                return this.lst.emitFn('move', ({ x, y }) => ({ x, y: y < 0 ? 0 : y }));
                            case 'ArrowDown':
                                return this.lst.emitFn('move', ({ x, y }) => ({ x, y: y > 0 ? 0 : y }));
                            case 'Minus':
                                return this.lst.emitFn('scale', (scale) => scale > 1 ? scale - 1 : scale);
                            case 'Equal':
                                return this.lst.emitFn('scale', (scale) => scale < 8 ? scale + 1 : scale);
                        }
                    }
                }
            };
            exports_1("GameEngine", GameEngine);
        }
    };
});
//# sourceMappingURL=GameEngine.js.map