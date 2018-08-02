System.register(["./FontLoader", "./global", "./Scene", "./SpriteLoader"], function (exports_1, context_1) {
    "use strict";
    var FontLoader_1, global_1, Scene_1, SpriteLoader_1, MouseHoverState, FrameLayout, FPSIndicator, LayerBox, CenterBox, PaddingBox, Logo, SimplePadding, TitleText, PlainText, TitleButton, LinearLayout;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (FontLoader_1_1) {
                FontLoader_1 = FontLoader_1_1;
            },
            function (global_1_1) {
                global_1 = global_1_1;
            },
            function (Scene_1_1) {
                Scene_1 = Scene_1_1;
            },
            function (SpriteLoader_1_1) {
                SpriteLoader_1 = SpriteLoader_1_1;
            }
        ],
        execute: function () {
            (function (MouseHoverState) {
                MouseHoverState[MouseHoverState["normal"] = 0] = "normal";
                MouseHoverState[MouseHoverState["hover"] = 1] = "hover";
                MouseHoverState[MouseHoverState["press"] = 2] = "press";
            })(MouseHoverState || (MouseHoverState = {}));
            FrameLayout = class FrameLayout extends Scene_1.BaseEntity {
                constructor() {
                    super();
                    this.entities = [];
                }
                add(ent) {
                    this.entities.push(ent);
                    return this;
                }
                measure(limit) {
                    this.entities.forEach((x) => x.measure(limit));
                    return this.cache = limit;
                }
                tick(tick) {
                    this.entities.forEach((x) => x.tick(tick));
                }
                render(base) {
                    this.entities.forEach((x) => x.render(base));
                }
                register(st) {
                    this.entities.forEach((x) => x.register(st));
                }
                mouse(evt) {
                    const ret = super.mouse(evt);
                    for (let i = this.entities.length - 1; i >= 0; i--) {
                        const entity = this.entities[i];
                        const res = entity.mouse(evt);
                        if (evt.done) {
                            ret.push(...res);
                            break;
                        }
                    }
                    return ret;
                }
            };
            exports_1("FrameLayout", FrameLayout);
            FPSIndicator = class FPSIndicator extends Scene_1.BaseEntity {
                constructor() {
                    super();
                    this.lastTime = performance.now();
                    this.fps = '0';
                }
                measure(limit) {
                    return { w: 90, h: 10 };
                }
                tick(tick) {
                    if (tick % FPSIndicator.count === 0) {
                        const now = performance.now();
                        const fps = (global_1.gst.access('fcount') / (now - this.lastTime) * 1000).toFixed(1);
                        this.lastTime = now;
                        global_1.gst.emit('fcount', 0);
                        if (this.fps !== fps && fps !== '6.0') {
                            global_1.gst.emit('validate', false);
                        }
                        this.fps = fps;
                    }
                }
                render({ x, y }) {
                    FontLoader_1.textLoader.drawLine(`fps:${this.fps}`, { x, y: y + 10, scale: 0.5 });
                }
            };
            FPSIndicator.count = 10;
            exports_1("FPSIndicator", FPSIndicator);
            LayerBox = class LayerBox extends Scene_1.BaseEntity {
                constructor() {
                    super();
                    this.entities = {};
                }
                set(key, entity) {
                    this.entities[key] = { entity };
                    if (this.st) {
                        entity.register(this.st);
                    }
                    return this;
                }
                add(child) {
                    if (child instanceof LayerBox.Stub) {
                        this.set(child.layer, child.child);
                    }
                    else if (typeof child !== 'string') {
                        this.set(LayerBox.Layer.C, child);
                    }
                }
                measure(limit) {
                    this.cache = limit;
                    Object.values(this.entities).forEach((v) => {
                        v.size = v.entity.measure(limit);
                    });
                    return limit;
                }
                tick(tick) {
                    Object.values(this.entities).forEach((value) => value.entity.tick(tick));
                }
                render(base) {
                    Object.entries(this.entities).forEach(([key, value]) => {
                        const { entity, size: { w = 0, h = 0 } = {} } = value;
                        const k = +key;
                        let [x, y] = [base.x, base.y];
                        switch (k) {
                            case LayerBox.Layer.LT: break;
                            case LayerBox.Layer.RT:
                                x += this.cache.w - w;
                                break;
                            case LayerBox.Layer.LB:
                                y += this.cache.h - h;
                                break;
                            case LayerBox.Layer.RB:
                                x += this.cache.w - w;
                                y += this.cache.h - h;
                                break;
                            case LayerBox.Layer.C:
                                x += (this.cache.w - w) / 2;
                                y += (this.cache.h - h) / 2;
                                break;
                        }
                        entity.render({ x, y });
                    });
                }
                mouse(ev) {
                    const { x: ex, y: ey } = ev;
                    for (const [key, value] of Object.entries(this.entities).reverse()) {
                        const { entity, size: { w = 0, h = 0 } = {} } = value;
                        const k = +key;
                        let [x, y] = [0, 0];
                        switch (k) {
                            case LayerBox.Layer.LT: break;
                            case LayerBox.Layer.RT:
                                x += this.cache.w - w;
                                break;
                            case LayerBox.Layer.LB:
                                y += this.cache.h - h;
                                break;
                            case LayerBox.Layer.RB:
                                x += this.cache.w - w;
                                y += this.cache.h - h;
                                break;
                            case LayerBox.Layer.C:
                                x += (this.cache.w - w) / 2;
                                y += (this.cache.h - h) / 2;
                                break;
                        }
                        if (ex >= x && ex < x + w && ey >= y && ey < y + h) {
                            const res = entity.mouse(ev.offset({ x, y }));
                            if (!ev.done) {
                                continue;
                            }
                            return [
                                ...super.mouse(ev),
                                ...res,
                            ];
                        }
                    }
                    return super.mouse(ev);
                }
                register(st) {
                    super.register(st);
                    Object.values(this.entities).forEach((value) => value.entity.register(st));
                }
            };
            exports_1("LayerBox", LayerBox);
            (function (LayerBox) {
                let Layer;
                (function (Layer) {
                    Layer[Layer["C"] = 0] = "C";
                    Layer[Layer["LT"] = 1] = "LT";
                    Layer[Layer["RT"] = 2] = "RT";
                    Layer[Layer["LB"] = 3] = "LB";
                    Layer[Layer["RB"] = 4] = "RB";
                })(Layer = LayerBox.Layer || (LayerBox.Layer = {}));
                class Stub extends Scene_1.BaseEntity {
                    constructor({ layer = LayerBox.Layer.C }) {
                        super();
                        this.layer = layer;
                    }
                    add(child) {
                        if (typeof child !== 'string') {
                            this.child = child;
                        }
                    }
                    measure(limit) {
                        throw new Error('Method not implemented.');
                    }
                    render(base) {
                        throw new Error('Method not implemented.');
                    }
                }
                LayerBox.Stub = Stub;
            })(LayerBox || (LayerBox = {}));
            exports_1("LayerBox", LayerBox);
            CenterBox = class CenterBox extends Scene_1.BaseEntity {
                constructor() {
                    super();
                }
                add(child) {
                    if (typeof child !== 'string') {
                        this.entity = child;
                    }
                }
                measure(limit) {
                    this.cache = limit;
                    this.innerSize = this.entity.measure(limit);
                    return limit;
                }
                tick(tick) {
                    this.entity.tick(tick);
                }
                render(base) {
                    this.entity.render({
                        x: base.x + (this.cache.w - this.innerSize.w) / 2,
                        y: base.y + (this.cache.h - this.innerSize.h) / 2,
                    });
                }
                mouse(ev) {
                    const { x, y } = ev;
                    if (x >= (this.cache.w - this.innerSize.w) / 2 && x < (this.cache.w + this.innerSize.w) / 2 &&
                        y >= (this.cache.h - this.innerSize.h) / 2 && y < (this.cache.h + this.innerSize.h) / 2) {
                        return [
                            ...super.mouse(ev),
                            ...this.entity.mouse(ev.offset({
                                x: (this.cache.w - this.innerSize.w) / 2,
                                y: (this.cache.h - this.innerSize.h) / 2,
                            })),
                        ];
                    }
                    return super.mouse(ev);
                }
                register(st) {
                    super.register(st);
                    this.entity.register(st);
                }
            };
            exports_1("CenterBox", CenterBox);
            PaddingBox = class PaddingBox extends Scene_1.BaseEntity {
                constructor({ size, padding, autoaxis = PaddingBox.Axis.Y }) {
                    super();
                    this.size = size;
                    this.padding = padding;
                    this.autoaxis = autoaxis;
                }
                add(child) {
                    if (typeof child !== 'string') {
                        this.entity = child;
                    }
                }
                measure(limit) {
                    const inner = this.entity.measure({
                        w: (this.autoaxis === PaddingBox.Axis.X ? limit.w : this.size.w) - this.padding * 2,
                        h: (this.autoaxis === PaddingBox.Axis.Y ? limit.h : this.size.h) - this.padding * 2,
                    });
                    return this.size = {
                        w: this.autoaxis === PaddingBox.Axis.X ? inner.w : this.size.w,
                        h: this.autoaxis === PaddingBox.Axis.Y ? inner.h : this.size.h,
                    };
                }
                tick(tick) {
                    this.entity.tick(tick);
                }
                render(base) {
                    this.entity.render({
                        x: base.x + this.padding,
                        y: base.y + this.padding,
                    });
                }
                mouse(ev) {
                    const { x, y } = ev;
                    if (x >= this.padding && x < this.size.w - this.padding && y >= this.padding && y < this.size.h - this.padding) {
                        return [...super.mouse(ev), ...this.entity.mouse(ev.offset({ x: this.padding, y: this.padding }))];
                    }
                    return super.mouse(ev);
                }
                register(st) {
                    super.register(st);
                    this.entity.register(st);
                }
            };
            exports_1("PaddingBox", PaddingBox);
            (function (PaddingBox) {
                let Axis;
                (function (Axis) {
                    Axis[Axis["X"] = 0] = "X";
                    Axis[Axis["Y"] = 1] = "Y";
                })(Axis = PaddingBox.Axis || (PaddingBox.Axis = {}));
            })(PaddingBox || (PaddingBox = {}));
            exports_1("PaddingBox", PaddingBox);
            Logo = class Logo extends Scene_1.BaseEntity {
                constructor() {
                    super(true);
                }
                measure() {
                    return Logo.size;
                }
                render({ x, y }) {
                    SpriteLoader_1.draw('logotext', { x, y, scale: 4 });
                }
            };
            Logo.size = {
                w: 62 * 4,
                h: 21 * 4,
            };
            exports_1("Logo", Logo);
            SimplePadding = class SimplePadding extends Scene_1.BaseEntity {
                constructor(size) {
                    super();
                    this.size = size;
                }
                measure() {
                    return this.size;
                }
                render() {
                    //
                }
            };
            exports_1("SimplePadding", SimplePadding);
            TitleText = class TitleText extends Scene_1.BaseEntity {
                constructor() {
                    super(true);
                }
                add(child) {
                    if (typeof child === 'string') {
                        this.text = child;
                        this.width = FontLoader_1.titleLoader.textWidth(child);
                    }
                }
                measure(limit) {
                    return { w: this.width, h: 18 };
                }
                render(base) {
                    FontLoader_1.titleLoader.drawLine(this.text, { x: base.x, y: base.y + 18 });
                }
            };
            exports_1("TitleText", TitleText);
            PlainText = class PlainText extends Scene_1.BaseEntity {
                constructor() {
                    super(true);
                }
                add(child) {
                    if (typeof child === 'string') {
                        this.text = child;
                        this.width = FontLoader_1.textLoader.textWidth(child) / 2;
                    }
                }
                measure(limit) {
                    return { w: this.width, h: 10 };
                }
                render(base) {
                    FontLoader_1.textLoader.drawLine(this.text, { x: base.x, y: base.y + 10, scale: 0.5 });
                }
            };
            exports_1("PlainText", PlainText);
            TitleButton = class TitleButton extends Scene_1.BaseEntity {
                constructor({ action }) {
                    super(true);
                    this.action = action;
                    this.state = MouseHoverState.normal;
                }
                add(child) {
                    if (typeof child === 'string') {
                        this.text = child;
                        this.width = FontLoader_1.titleLoader.textWidth(child);
                    }
                }
                mouse(ev) {
                    const { type } = ev;
                    if (type === Scene_1.XPointEventType.pointerenter) {
                        this.state = MouseHoverState.hover;
                        global_1.gst.emit('validate', false);
                    }
                    else if (type === Scene_1.XPointEventType.pointerleave) {
                        this.state = MouseHoverState.normal;
                        global_1.gst.emit('validate', false);
                    }
                    else if (type === Scene_1.XPointEventType.pointerdown) {
                        this.state = MouseHoverState.press;
                        global_1.gst.emit('validate', false);
                    }
                    else if (type === Scene_1.XPointEventType.pointerup) {
                        this.action();
                    }
                    return super.mouse(ev);
                }
                measure(limit) {
                    this.cache = limit.w;
                    return { w: limit.w, h: 40 };
                }
                render(base) {
                    SpriteLoader_1.drawNinepatch(this.state === MouseHoverState.normal ? 'button' :
                        this.state === MouseHoverState.hover ? 'button-over' :
                            'button-down', { x: base.x, y: base.y, w: this.cache, h: 40 });
                    FontLoader_1.titleLoader.drawLine(this.text, { x: base.x + (this.cache - this.width) / 2, y: base.y + 24 });
                }
            };
            exports_1("TitleButton", TitleButton);
            LinearLayout = class LinearLayout extends Scene_1.BaseEntity {
                constructor(pack = {}) {
                    super();
                    const { direction = LinearLayout.Direction.column, padding = 0, reverse = false } = pack || {};
                    this.direction = direction;
                    this.padding = padding;
                    this.reverse = reverse;
                    this.children = [];
                }
                add(entity, align = LinearLayout.Align.center) {
                    this.children.push({
                        align,
                        entity,
                    });
                    if (this.st) {
                        entity.register(this.st);
                    }
                    return this;
                }
                measure(limit) {
                    let [ox, oy] = [0, 0];
                    let { w: lw, h: lh } = limit;
                    const list = this.reverse ? [...this.children].reverse() : this.children;
                    if (this.direction === LinearLayout.Direction.column) {
                        for (const item of list) {
                            const { w: nw, h: nh } = item.entity.measure({ w: lw, h: lh });
                            item.cache = {
                                x: item.align === LinearLayout.Align.start ? ox : item.align === LinearLayout.Align.center ? ox + (lw - nw) / 2 : ox + lw - nw,
                                y: oy,
                                w: nw,
                                h: nh,
                            };
                            oy += nh + this.padding;
                            lh -= nh + this.padding;
                        }
                        return { w: limit.w, h: limit.h - lh - this.padding };
                    }
                    else {
                        for (const item of list) {
                            const { w: nw, h: nh } = item.entity.measure({ w: lw, h: lh });
                            item.cache = {
                                x: this.reverse ? limit.w - ox - nw : ox,
                                y: item.align === LinearLayout.Align.start ? oy : item.align === LinearLayout.Align.center ? oy + (lh - nh) / 2 : oy + lh - nh,
                                w: nw,
                                h: nh,
                            };
                            ox += nw + this.padding;
                            lw -= nw + this.padding;
                        }
                        return { w: limit.w - lw - this.padding, h: limit.h };
                    }
                }
                tick(tick) {
                    for (const item of this.children) {
                        item.entity.tick(tick);
                    }
                }
                render(base) {
                    for (const item of this.children) {
                        item.entity.render({
                            x: item.cache.x + base.x,
                            y: item.cache.y + base.y,
                        });
                    }
                }
                mouse(ev) {
                    const { x, y } = ev;
                    for (const item of this.children) {
                        if (item.cache.x <= x && x < item.cache.x + item.cache.w &&
                            item.cache.y <= y && y < item.cache.y + item.cache.h) {
                            return [
                                ...super.mouse(ev),
                                ...item.entity.mouse(ev.offset(item.cache)),
                            ];
                        }
                    }
                    return super.mouse(ev);
                }
                register(st) {
                    super.register(st);
                    this.children.forEach(({ entity }) => entity.register(st));
                }
            };
            exports_1("LinearLayout", LinearLayout);
            (function (LinearLayout) {
                let Align;
                (function (Align) {
                    Align[Align["center"] = 0] = "center";
                    Align[Align["start"] = 1] = "start";
                    Align[Align["end"] = 2] = "end";
                })(Align = LinearLayout.Align || (LinearLayout.Align = {}));
                let Direction;
                (function (Direction) {
                    Direction[Direction["column"] = 0] = "column";
                    Direction[Direction["row"] = 1] = "row";
                })(Direction = LinearLayout.Direction || (LinearLayout.Direction = {}));
            })(LinearLayout || (LinearLayout = {}));
            exports_1("LinearLayout", LinearLayout);
        }
    };
});
//# sourceMappingURL=BasicUI.js.map