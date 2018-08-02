System.register(["immutable", "./global", "./ST"], function (exports_1, context_1) {
    "use strict";
    var immutable_1, global_1, ST_1, IPointerEventOffset, XPointerEvent, XPointEventType, XKeyboardEventType, BaseEntity, Scene;
    var __moduleName = context_1 && context_1.id;
    function makeOffset(ev) {
        return {
            x: ev.globalX - ev.x,
            y: ev.globalY - ev.y,
        };
    }
    exports_1("makeOffset", makeOffset);
    function send(type, { x, y }, item) {
        item.entity.mouse(new XPointerEvent({ x, y, type }).offset(item.offset));
    }
    return {
        setters: [
            function (immutable_1_1) {
                immutable_1 = immutable_1_1;
            },
            function (global_1_1) {
                global_1 = global_1_1;
            },
            function (ST_1_1) {
                ST_1 = ST_1_1;
            }
        ],
        execute: function () {
            IPointerEventOffset = class IPointerEventOffset {
                constructor(source, offset) {
                    this.source = source;
                    this.off = offset;
                }
                get x() {
                    return this.source.x - this.off.x;
                }
                get y() {
                    return this.source.y - this.off.y;
                }
                get globalX() {
                    return this.source.globalX;
                }
                get globalY() {
                    return this.source.globalY;
                }
                get wheelX() {
                    return this.source.wheelX;
                }
                get wheelY() {
                    return this.source.wheelY;
                }
                get type() {
                    return this.source.type;
                }
                get done() {
                    return this.source.done;
                }
                setHandled() {
                    this.source.setHandled();
                }
                offset({ x, y }) {
                    return new IPointerEventOffset(this.source, {
                        x: x + this.off.x,
                        y: y + this.off.y,
                    });
                }
                toString() {
                    return `(${this.x}, ${this.y})@(${this.globalX}, ${this.globalY})#${XPointEventType[this.type]}!(${this.off.x}, ${this.off.y})`;
                }
            };
            XPointerEvent = class XPointerEvent {
                constructor(temp) {
                    this.globalX = temp.x;
                    this.globalY = temp.y;
                    this.wheelX = temp.wheelX;
                    this.wheelY = temp.wheelY;
                    this.type = temp.type;
                    this.handled = false;
                }
                get x() {
                    return this.globalX;
                }
                get y() {
                    return this.globalY;
                }
                setHandled() {
                    this.handled = true;
                }
                offset(offset) {
                    return new IPointerEventOffset(this, offset);
                }
                get done() {
                    return this.handled;
                }
                toString() {
                    return `(${this.x}, ${this.y})@(${this.globalX}, ${this.globalY})#${XPointEventType[this.type]}`;
                }
            };
            (function (XPointEventType) {
                XPointEventType[XPointEventType["pointermove"] = 0] = "pointermove";
                XPointEventType[XPointEventType["pointerdown"] = 1] = "pointerdown";
                XPointEventType[XPointEventType["pointerup"] = 2] = "pointerup";
                XPointEventType[XPointEventType["pointerenter"] = 3] = "pointerenter";
                XPointEventType[XPointEventType["pointerleave"] = 4] = "pointerleave";
                XPointEventType[XPointEventType["wheel"] = 5] = "wheel";
            })(XPointEventType || (XPointEventType = {}));
            exports_1("XPointEventType", XPointEventType);
            (function (XKeyboardEventType) {
                XKeyboardEventType[XKeyboardEventType["keydown"] = 0] = "keydown";
                XKeyboardEventType[XKeyboardEventType["keyup"] = 1] = "keyup";
            })(XKeyboardEventType || (XKeyboardEventType = {}));
            exports_1("XKeyboardEventType", XKeyboardEventType);
            BaseEntity = class BaseEntity {
                tick(tick) {
                    //
                }
                constructor(done = false) {
                    this.done = done;
                }
                mouse(ev) {
                    if (this.done) {
                        ev.setHandled();
                    }
                    return [{
                            entity: this,
                            offset: makeOffset(ev),
                        }];
                }
                keyboard(ev) {
                    console.log(ev);
                }
                register(st) {
                    this.st = st;
                }
                add(child) {
                    //
                }
            };
            exports_1("BaseEntity", BaseEntity);
            Scene = class Scene {
                constructor() {
                    this.lastChain = [];
                    this.st = new ST_1.default({
                        focused: null,
                        hotkeys: immutable_1.Map(),
                    });
                }
                add(child) {
                    if (typeof child !== 'string') {
                        this.entity = child;
                        this.entity.register(this.st);
                    }
                }
                measure(size) {
                    return this.entity.measure(size);
                }
                render() {
                    this.entity.render({ x: 0, y: 0 });
                }
                tick(tick) {
                    this.entity.tick(tick);
                }
                mouse(ev) {
                    const globalScale = global_1.gst.access('scale');
                    const [x, y] = [
                        ev.offsetX / globalScale * window.devicePixelRatio | 0,
                        ev.offsetY / globalScale * window.devicePixelRatio | 0,
                    ];
                    // console.log(ev)
                    const chain = this.entity.mouse(new XPointerEvent({
                        x,
                        y,
                        wheelX: ev.deltaX,
                        wheelY: ev.deltaY,
                        type: XPointEventType[ev.type],
                    }));
                    const minlen = Math.min(this.lastChain.length, chain.length);
                    let done = false;
                    for (let i = 0; i < minlen; i++) {
                        if (chain[i].entity !== this.lastChain[i].entity) {
                            done = true;
                            for (let j = i; j < this.lastChain.length; j++) {
                                send(XPointEventType.pointerleave, { x, y }, this.lastChain[j]);
                            }
                            send(XPointEventType.pointerenter, { x, y }, chain[i]);
                        }
                    }
                    if (!done) {
                        if (minlen !== this.lastChain.length) {
                            for (let j = minlen; j < this.lastChain.length; j++) {
                                send(XPointEventType.pointerleave, { x, y }, this.lastChain[j]);
                            }
                        }
                        else if (minlen !== chain.length) {
                            send(XPointEventType.pointerenter, { x, y }, chain[minlen]);
                        }
                    }
                    this.lastChain = chain;
                }
                keyboard(ev) {
                    const focused = this.st.access('focused');
                    const hotkeys = this.st.access('hotkeys');
                    if (focused) {
                        focused.keyboard({
                            key: ev.keyCode,
                            code: ev.code,
                            type: XKeyboardEventType[ev.type],
                            boardcast: false,
                        });
                    }
                    if (hotkeys.has(ev.code)) {
                        hotkeys.get(ev.code)();
                    }
                }
            };
            exports_1("Scene", Scene);
        }
    };
});
//# sourceMappingURL=Scene.js.map