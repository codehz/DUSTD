System.register(["./assets/sprites/sprites.json!json", "./assets/sprites/sprites.png!image", "./GL", "./global"], function (exports_1, context_1) {
    "use strict";
    var sprites, sprites_png_image_1, GL_1, global_1, tex;
    var __moduleName = context_1 && context_1.id;
    function draw(name, { x: nx, y: ny, scale = 1 }) {
        const globalScale = global_1.gst.access('scale');
        const [x, y] = [nx * globalScale, ny * globalScale];
        const { frame } = sprites.frames[name];
        GL_1.drawImage(tex, frame.x, frame.y, frame.w, frame.h, x, y, frame.w * scale * globalScale, frame.h * scale * globalScale);
    }
    exports_1("draw", draw);
    function drawRotate(name, { x: nx, y: ny, scale = 1 }, rotate, center) {
        const globalScale = global_1.gst.access('scale');
        const [x, y] = [nx * globalScale, ny * globalScale];
        const { frame } = sprites.frames[name];
        GL_1.drawImageRotate(tex, frame.x, frame.y, frame.w, frame.h, x, y, frame.w * scale * globalScale, frame.h * scale * globalScale, rotate, { x: center.x * scale * globalScale, y: center.y * scale * globalScale });
    }
    exports_1("drawRotate", drawRotate);
    function drawRotateCenter(name, { x: nx, y: ny, scale = 1 }, rotate, center, center2) {
        const globalScale = global_1.gst.access('scale');
        const [x, y] = [nx * globalScale, ny * globalScale];
        const { frame } = sprites.frames[name];
        GL_1.drawImageRotate(tex, frame.x, frame.y, frame.w, frame.h, x - center.x * scale * globalScale, y - center.y * scale * globalScale, frame.w * scale * globalScale, frame.h * scale * globalScale, rotate, { x: center2.x * scale * globalScale, y: center2.y * scale * globalScale });
    }
    exports_1("drawRotateCenter", drawRotateCenter);
    function drawNinepatch(name, { x: nx, y: ny, w: nw, h: nh, scale = 1 }) {
        const globalScale = global_1.gst.access('scale');
        const [x, y, w, h] = [nx * globalScale, ny * globalScale, nw * globalScale, nh * globalScale];
        const { frame } = sprites.frames[name];
        const [fw, fh] = [frame.w * scale * globalScale, frame.h * scale * globalScale];
        GL_1.drawImage(tex, frame.x, frame.y, frame.w / 2, frame.h / 2, x, y, fw / 2, fh / 2); // left top
        GL_1.drawImage(tex, frame.x + frame.w / 2, frame.y, frame.w / 2, frame.h / 2, x + w - fw / 2, y, fw / 2, fh / 2); // right top
        GL_1.drawImage(tex, frame.x + frame.w / 2, frame.y + frame.h / 2 - 1, frame.w / 2, 2, x + w - fw / 2, y + fh / 2, fw / 2, h - fh); // right
        GL_1.drawImage(tex, frame.x + frame.w / 2 - 1, frame.y, 2, frame.h / 2, x + fw / 2, y, w - fw, fh / 2); // top
        GL_1.drawImage(tex, frame.x, frame.y + frame.h / 2, frame.w / 2, frame.h / 2, x, y + h - fh / 2, fw / 2, fh / 2); // left bottom
        GL_1.drawImage(tex, frame.x, frame.y + frame.h / 2 - 1, frame.w / 2, 2, x, y + fh / 2, fw / 2, h - fh); // left
        GL_1.drawImage(tex, frame.x + frame.w / 2 - 1, frame.y + frame.h / 2, 2, frame.h / 2, x + fw / 2, y + h - fh / 2, w - fw, fh / 2); // bottom
        GL_1.drawImage(tex, frame.x + frame.w / 2, frame.y + frame.h / 2, frame.w / 2, frame.h / 2, x + w - fw / 2, y + h - fh / 2, fw / 2, fh / 2); // right bottom
        GL_1.drawImage(tex, frame.x + frame.w / 2 - 1, frame.y + frame.h / 2 - 1, 2, 2, x + fw / 2, y + fh / 2, w - fw, h - fh); // center
    }
    exports_1("drawNinepatch", drawNinepatch);
    return {
        setters: [
            function (sprites_1) {
                sprites = sprites_1;
            },
            function (sprites_png_image_1_1) {
                sprites_png_image_1 = sprites_png_image_1_1;
            },
            function (GL_1_1) {
                GL_1 = GL_1_1;
            },
            function (global_1_1) {
                global_1 = global_1_1;
            }
        ],
        execute: function () {
            tex = GL_1.loadTexture(sprites_png_image_1.default);
        }
    };
});
//# sourceMappingURL=SpriteLoader.js.map