System.register(["./ST"], function (exports_1, context_1) {
    "use strict";
    var ST_1, State, gst;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (ST_1_1) {
                ST_1 = ST_1_1;
            }
        ],
        execute: function () {
            (function (State) {
                State[State["loading"] = 0] = "loading";
                State[State["start"] = 1] = "start";
                State[State["setting"] = 2] = "setting";
                State[State["info"] = 3] = "info";
                State[State["demo"] = 4] = "demo";
            })(State || (State = {}));
            exports_1("State", State);
            exports_1("gst", gst = new ST_1.default({
                scale: +(localStorage.getItem('globalScale') || 2),
                scene: undefined,
                state: State.loading,
                tick: 0,
                fcount: 0,
                validate: false,
                resize: undefined,
            }));
            gst.on('scale', (nscale) => localStorage.setItem('globalScale', nscale + ''));
        }
    };
});
//# sourceMappingURL=global.js.map