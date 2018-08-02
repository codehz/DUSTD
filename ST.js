System.register([], function (exports_1, context_1) {
    "use strict";
    var ST;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            ST = class ST {
                constructor(defaults) {
                    this.xmap = Object.entries(defaults).reduce((p, [k, v]) => (Object.assign({}, p, { [k]: {
                            state: v,
                            list: new Set,
                        } })), {});
                }
                on(name, fn) {
                    this.xmap[name].list.add(fn);
                }
                off(name, fn) {
                    this.xmap[name].list.delete(fn);
                }
                refresh(name) {
                    this.xmap[name].list.forEach((x) => x(this.xmap[name].state));
                }
                emit(name, newstate) {
                    const old = this.xmap[name].state;
                    this.xmap[name].state = newstate;
                    this.xmap[name].list.forEach((x) => x(newstate, old));
                }
                emitFn(name, fstate) {
                    return this.emit(name, fstate(this.xmap[name].state));
                }
                access(name) {
                    return this.xmap[name].state;
                }
                fetch() {
                    return Object.entries(this.xmap).reduce((p, [k, v]) => (Object.assign({}, p, { [k]: v.state })), {});
                }
            };
            exports_1("default", ST);
        }
    };
});
//# sourceMappingURL=ST.js.map