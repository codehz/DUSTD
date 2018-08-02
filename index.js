System.register(["./assets/maps/caves.png!image", "./BasicUI", "./GameEngine", "./GL", "./global", "./Machine", "./prepare", "./Scene", "./UI"], function (exports_1, context_1) {
    "use strict";
    var test_png_image_1, BasicUI_1, GameEngine_1, GL_1, global_1, Machine_1, prepare_1, Scene_1, UI_1, mouseHandler, keyHandler;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (test_png_image_1_1) {
                test_png_image_1 = test_png_image_1_1;
            },
            function (BasicUI_1_1) {
                BasicUI_1 = BasicUI_1_1;
            },
            function (GameEngine_1_1) {
                GameEngine_1 = GameEngine_1_1;
            },
            function (GL_1_1) {
                GL_1 = GL_1_1;
            },
            function (global_1_1) {
                global_1 = global_1_1;
            },
            function (Machine_1_1) {
                Machine_1 = Machine_1_1;
            },
            function (prepare_1_1) {
                prepare_1 = prepare_1_1;
            },
            function (Scene_1_1) {
                Scene_1 = Scene_1_1;
            },
            function (UI_1_1) {
                UI_1 = UI_1_1;
            }
        ],
        execute: function () {
            navigator.serviceWorker.register('service-worker.js');
            global_1.gst.on('resize', () => {
                const globalScale = global_1.gst.access('scale');
                const ratio = window.devicePixelRatio;
                const [w, h] = [window.innerWidth, window.innerHeight];
                prepare_1.root.width = w * ratio;
                prepare_1.root.height = h * ratio;
                prepare_1.gl.viewport(0, 0, w * ratio, h * ratio);
                console.log(global_1.gst.access('scene'));
                global_1.gst.access('scene').measure({ w: prepare_1.root.width / globalScale | 0, h: prepare_1.root.height / globalScale | 0 });
                global_1.gst.emit('validate', false);
            });
            global_1.gst.on('tick', (tick) => {
                global_1.gst.access('scene').tick(tick);
                if (!global_1.gst.access('validate')) {
                    global_1.gst.emitFn('fcount', (c) => c + 1);
                    prepare_1.gl.clearColor(0, 0, 0, 1);
                    prepare_1.gl.clear(prepare_1.gl.COLOR_BUFFER_BIT);
                    global_1.gst.access('scene').render();
                    GL_1.drawQueue();
                    global_1.gst.emit('validate', true);
                }
            });
            global_1.gst.on('scene', () => global_1.gst.refresh('resize'));
            global_1.gst.on('state', (state) => {
                switch (state) {
                    case global_1.State.loading:
                        return global_1.gst.emit('scene', UI_1.UI(Scene_1.Scene, null,
                            UI_1.UI(BasicUI_1.CenterBox, null,
                                UI_1.UI(BasicUI_1.LinearLayout, { direction: BasicUI_1.LinearLayout.Direction.column },
                                    UI_1.UI(BasicUI_1.TitleText, null, "Game Engine Loaded"),
                                    UI_1.UI(BasicUI_1.TitleText, null, "Loading Resourece")))));
                    case global_1.State.start:
                        return global_1.gst.emit('scene', UI_1.UI(Scene_1.Scene, null,
                            UI_1.UI(BasicUI_1.LayerBox, null,
                                UI_1.UI(BasicUI_1.PaddingBox, { size: { w: 150, h: 0 }, padding: 5 },
                                    UI_1.UI(BasicUI_1.LinearLayout, { direction: BasicUI_1.LinearLayout.Direction.column, padding: 5 },
                                        UI_1.UI(BasicUI_1.Logo, null),
                                        UI_1.UI(BasicUI_1.TitleButton, { action: () => global_1.gst.emit('state', global_1.State.demo) }, "Game"),
                                        UI_1.UI(BasicUI_1.TitleButton, { action: () => global_1.gst.emit('state', global_1.State.setting) }, "Setting>"),
                                        UI_1.UI(BasicUI_1.TitleButton, { action: () => global_1.gst.emit('state', global_1.State.info) }, "Info>"),
                                        UI_1.UI(BasicUI_1.SimplePadding, { w: 0, h: 84 }))),
                                UI_1.UI(BasicUI_1.LayerBox.Stub, { layer: BasicUI_1.LayerBox.Layer.LT },
                                    UI_1.UI(BasicUI_1.FPSIndicator, null)))));
                    case global_1.State.info:
                        return global_1.gst.emit('scene', UI_1.UI(Scene_1.Scene, null,
                            UI_1.UI(BasicUI_1.LayerBox, null,
                                UI_1.UI(BasicUI_1.PaddingBox, { size: { w: 150, h: 0 }, padding: 5 },
                                    UI_1.UI(BasicUI_1.LinearLayout, { padding: 5 },
                                        UI_1.UI(BasicUI_1.Logo, null),
                                        UI_1.UI(BasicUI_1.PlainText, null, "Made by CodeHz"),
                                        UI_1.UI(BasicUI_1.PlainText, null, "License: GPLv3"),
                                        UI_1.UI(BasicUI_1.SimplePadding, { w: 0, h: 10 }),
                                        UI_1.UI(BasicUI_1.TitleButton, { action: () => global_1.gst.emit('state', global_1.State.start) }, "<Back"),
                                        UI_1.UI(BasicUI_1.SimplePadding, { w: 0, h: 84 }))))));
                    case global_1.State.setting:
                        return global_1.gst.emit('scene', UI_1.UI(Scene_1.Scene, null,
                            UI_1.UI(BasicUI_1.LayerBox, null,
                                UI_1.UI(BasicUI_1.PaddingBox, { size: { w: 150, h: 0 }, padding: 5 },
                                    UI_1.UI(BasicUI_1.LinearLayout, { padding: 5 },
                                        UI_1.UI(BasicUI_1.Logo, null),
                                        UI_1.UI(BasicUI_1.TitleButton, { action: () => {
                                                if (global_1.gst.access('scale') < 4) {
                                                    global_1.gst.emitFn('scale', (x) => x + 1);
                                                    global_1.gst.refresh('resize');
                                                }
                                            } }, "Scale UP"),
                                        UI_1.UI(BasicUI_1.TitleButton, { action: () => {
                                                if (global_1.gst.access('scale') > 1) {
                                                    global_1.gst.emitFn('scale', (x) => x - 1);
                                                    global_1.gst.refresh('resize');
                                                }
                                            } }, "Scale DOWN"),
                                        UI_1.UI(BasicUI_1.TitleButton, { action: () => global_1.gst.emit('state', global_1.State.start) }, "<Back"),
                                        UI_1.UI(BasicUI_1.SimplePadding, { w: 0, h: 84 }))))));
                    case global_1.State.demo: {
                        const engine = new GameEngine_1.GameEngine(new GameEngine_1.CachedMap(new GameEngine_1.ActualMap(test_png_image_1.default)));
                        const ms = new GameEngine_1.MachineSelector([new Machine_1.Turret, new Machine_1.FastTurret], (mac) => fi.setFloat(mac));
                        const fi = new GameEngine_1.FloatItem((mac) => engine.mayPlace(mac));
                        return global_1.gst.emit('scene', UI_1.UI(Scene_1.Scene, null,
                            UI_1.UI(BasicUI_1.FrameLayout, null,
                                UI_1.UI(BasicUI_1.LayerBox, null,
                                    engine,
                                    UI_1.UI(BasicUI_1.LayerBox.Stub, { layer: BasicUI_1.LayerBox.Layer.LT },
                                        UI_1.UI(BasicUI_1.FPSIndicator, null)),
                                    UI_1.UI(BasicUI_1.LayerBox.Stub, { layer: BasicUI_1.LayerBox.Layer.LB }, ms),
                                    UI_1.UI(BasicUI_1.LayerBox.Stub, { layer: BasicUI_1.LayerBox.Layer.RT }, new GameEngine_1.InfoBoard(engine)),
                                    UI_1.UI(BasicUI_1.LayerBox.Stub, { layer: BasicUI_1.LayerBox.Layer.RB },
                                        UI_1.UI(BasicUI_1.PaddingBox, { size: { w: 80, h: 0 }, padding: 0 },
                                            UI_1.UI(BasicUI_1.LinearLayout, { padding: 5, reverse: true },
                                                UI_1.UI(BasicUI_1.TitleButton, { action: () => global_1.gst.emit('state', global_1.State.start) }, "<Back"),
                                                UI_1.UI(BasicUI_1.TitleButton, { action: () => console.log('menu') }, "Menu"))))),
                                fi)));
                    }
                }
            });
            document.body.replaceChild(prepare_1.root, document.body.firstChild);
            // root.addEventListener('click', () => {
            //   root.requestFullscreen()
            // })
            global_1.gst.emit('state', global_1.State.start);
            mouseHandler = (e) => global_1.gst.access('scene').mouse(e);
            keyHandler = (e) => global_1.gst.access('scene').keyboard(e);
            window.addEventListener('wheel', mouseHandler, { passive: true });
            window.addEventListener('pointerdown', mouseHandler, { passive: true });
            window.addEventListener('pointermove', mouseHandler, { passive: true });
            window.addEventListener('pointerup', mouseHandler, { passive: true });
            window.addEventListener('keydown', keyHandler, { passive: true });
            window.addEventListener('keyup', keyHandler, { passive: true });
            global_1.gst.refresh('tick');
            window.onresize = () => global_1.gst.refresh('resize');
            requestAnimationFrame(function frame() {
                requestAnimationFrame(frame);
                global_1.gst.emitFn('tick', (x) => x < 5999 ? x + 1 : 0);
            });
        }
    };
});
//# sourceMappingURL=index.js.map
