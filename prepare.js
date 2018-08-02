System.register([], function (exports_1, context_1) {
    "use strict";
    var root, gl;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("root", root = document.createElement('canvas'));
            exports_1("gl", gl = root.getContext('webgl2'));
        }
    };
});
//# sourceMappingURL=prepare.js.map