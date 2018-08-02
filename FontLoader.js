System.register(["./assets/ui/square.fnt.json!json", "./assets/ui/square.png!image", "./assets/ui/title.fnt.json!json", "./assets/ui/title.png!image", "./GL", "./global"], function (exports_1, context_1) {
    "use strict";
    var font, square_png_image_1, title, title_png_image_1, GL_1, global_1, FontLoader, textLoader, titleLoader;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (font_1) {
                font = font_1;
            },
            function (square_png_image_1_1) {
                square_png_image_1 = square_png_image_1_1;
            },
            function (title_1) {
                title = title_1;
            },
            function (title_png_image_1_1) {
                title_png_image_1 = title_png_image_1_1;
            },
            function (GL_1_1) {
                GL_1 = GL_1_1;
            },
            function (global_1_1) {
                global_1 = global_1_1;
            }
        ],
        execute: function () {
            FontLoader = class FontLoader {
                constructor(res, def) {
                    this.def = def;
                    this.tex = GL_1.loadTexture(res);
                }
                charWidth(char) {
                    if (char === ' '.charCodeAt(0)) {
                        return this.def.info.size / 4;
                    }
                    const info = this.def.chars.find(({ id }) => id === char);
                    if (!info) {
                        return 0;
                    }
                    return info.width;
                }
                textWidth(text) {
                    return text.split('').map((x) => x.charCodeAt(0)).map((x) => this.charWidth(x)).reduce((p, c) => p + c, 0);
                }
                draw(char, { x, y, scale = 1 }) {
                    const globalScale = global_1.gst.access('scale');
                    if (char === ' '.charCodeAt(0)) {
                        return this.def.info.size / 4;
                    }
                    const info = this.def.chars.find(({ id }) => id === char);
                    if (!info) {
                        return 0;
                    }
                    GL_1.drawTexture(this.tex, {
                        x: info.x,
                        y: info.y,
                        w: info.width,
                        h: info.height,
                    }, {
                        x: x * globalScale,
                        y: (y + (info.yoffset - this.def.common.base) * scale) * globalScale,
                        w: info.width * scale * globalScale,
                        h: info.height * scale * globalScale,
                    });
                    return info.width * scale;
                }
                drawLine(text, { x, y, scale = 1 }) {
                    let mx = x;
                    for (const char of text.split('').map((ch) => ch.charCodeAt(0))) {
                        mx += this.draw(char, { x: mx, y, scale });
                    }
                }
            };
            exports_1("textLoader", textLoader = new FontLoader(square_png_image_1.default, font));
            exports_1("titleLoader", titleLoader = new FontLoader(title_png_image_1.default, title));
        }
    };
});
//# sourceMappingURL=FontLoader.js.map