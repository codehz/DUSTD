System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function UI(el, attr, ...children) {
        const ret = new el(attr);
        if (children.length) {
            children.forEach((x) => ret.add(x));
        }
        return ret;
    }
    exports_1("UI", UI);
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=UI.js.map