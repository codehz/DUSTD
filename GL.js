System.register(["./prepare", "./shaders/default.frag!text", "./shaders/default.vert!text"], function (exports_1, context_1) {
    "use strict";
    var prepare_1, default_frag_text_1, default_vert_text_1, program, debugShaders, resolutionLocation, SIZE, rectbuffer, textbuffer, selebuffer, rectarray, textarray, selearray, rectcache, textcache, idxcache, ptr, minpos;
    var __moduleName = context_1 && context_1.id;
    function loadShader(type, source) {
        const shader = prepare_1.gl.createShader(type);
        prepare_1.gl.shaderSource(shader, source);
        prepare_1.gl.compileShader(shader);
        if (!prepare_1.gl.getShaderParameter(shader, prepare_1.gl.COMPILE_STATUS)) {
            throw new Error(`Shader failed to compile: ${prepare_1.gl.getShaderInfoLog(shader)}`);
        }
        return shader;
    }
    function loadProgram(vertSource, fragSource) {
        const vert = loadShader(prepare_1.gl.VERTEX_SHADER, vertSource);
        const frag = loadShader(prepare_1.gl.FRAGMENT_SHADER, fragSource);
        console.log(debugShaders.getTranslatedShaderSource(vert));
        console.log(debugShaders.getTranslatedShaderSource(frag));
        program = prepare_1.gl.createProgram();
        prepare_1.gl.attachShader(program, vert);
        prepare_1.gl.attachShader(program, frag);
        prepare_1.gl.linkProgram(program);
        if (!prepare_1.gl.getProgramParameter(program, prepare_1.gl.LINK_STATUS)) {
            throw new Error(`Program failed to link: ${prepare_1.gl.getShaderInfoLog(program)}`);
        }
    }
    function initGL() {
        debugShaders = prepare_1.gl.getExtension('WEBGL_debug_shaders');
        const debug = prepare_1.gl.getExtension('WEBGL_debug');
        if (debug) {
            console.log('exi');
            debug.addEventListener('message', console.log);
        }
        loadProgram(default_vert_text_1.default, default_frag_text_1.default);
        prepare_1.gl.colorMask(true, true, true, false);
        prepare_1.gl.enable(prepare_1.gl.BLEND);
        prepare_1.gl.blendFunc(prepare_1.gl.SRC_ALPHA, prepare_1.gl.ONE_MINUS_SRC_ALPHA);
        prepare_1.gl.pixelStorei(prepare_1.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        prepare_1.gl.useProgram(program);
        rectbuffer = prepare_1.gl.createBuffer();
        textbuffer = prepare_1.gl.createBuffer();
        selebuffer = prepare_1.gl.createBuffer();
        const positionLocation = 0; // gl.getAttribLocation (program, 'a_position')
        const texcoordLocation = 1; // gl.getAttribLocation (program, 'a_texcoord')
        const textseleLocation = 2; // gl.getAttribLocation (program, 'a_textsele')
        prepare_1.gl.bindBuffer(prepare_1.gl.ARRAY_BUFFER, rectbuffer);
        prepare_1.gl.enableVertexAttribArray(positionLocation);
        prepare_1.gl.vertexAttribIPointer(positionLocation, 2, prepare_1.gl.SHORT, 0, 0);
        prepare_1.gl.bindBuffer(prepare_1.gl.ARRAY_BUFFER, textbuffer);
        prepare_1.gl.enableVertexAttribArray(texcoordLocation);
        prepare_1.gl.vertexAttribPointer(texcoordLocation, 2, prepare_1.gl.FLOAT, false, 0, 0);
        prepare_1.gl.bindBuffer(prepare_1.gl.ARRAY_BUFFER, selebuffer);
        prepare_1.gl.enableVertexAttribArray(textseleLocation);
        prepare_1.gl.vertexAttribIPointer(textseleLocation, 1, prepare_1.gl.BYTE, 0, 0);
        resolutionLocation = prepare_1.gl.getUniformLocation(program, 'u_resolution');
    }
    function loadTexture(img) {
        const tex = prepare_1.gl.createTexture();
        prepare_1.gl.activeTexture(prepare_1.gl.TEXTURE0 + minpos);
        prepare_1.gl.bindTexture(prepare_1.gl.TEXTURE_2D, tex);
        prepare_1.gl.texParameteri(prepare_1.gl.TEXTURE_2D, prepare_1.gl.TEXTURE_WRAP_S, prepare_1.gl.CLAMP_TO_EDGE);
        prepare_1.gl.texParameteri(prepare_1.gl.TEXTURE_2D, prepare_1.gl.TEXTURE_WRAP_T, prepare_1.gl.CLAMP_TO_EDGE);
        prepare_1.gl.texParameteri(prepare_1.gl.TEXTURE_2D, prepare_1.gl.TEXTURE_MIN_FILTER, prepare_1.gl.NEAREST);
        prepare_1.gl.texParameteri(prepare_1.gl.TEXTURE_2D, prepare_1.gl.TEXTURE_MAG_FILTER, prepare_1.gl.NEAREST);
        prepare_1.gl.texImage2D(prepare_1.gl.TEXTURE_2D, 0, prepare_1.gl.RGBA, prepare_1.gl.RGBA, prepare_1.gl.UNSIGNED_BYTE, img);
        const uniform = prepare_1.gl.getUniformLocation(program, `u_texture${minpos}`);
        prepare_1.gl.uniform1i(uniform, minpos);
        return {
            width: img.naturalWidth,
            height: img.naturalHeight,
            source: tex,
            idx: minpos++,
        };
    }
    exports_1("loadTexture", loadTexture);
    function pushRectBuffer({ x, y, w, h }) {
        const x1 = x;
        const x2 = x + w;
        const y1 = y;
        const y2 = y + h;
        rectcache[0] = x1;
        rectcache[1] = y1;
        rectcache[2] = x2;
        rectcache[3] = y1;
        rectcache[4] = x1;
        rectcache[5] = y2;
        rectcache[6] = x1;
        rectcache[7] = y2;
        rectcache[8] = x2;
        rectcache[9] = y1;
        rectcache[10] = x2;
        rectcache[11] = y2;
        rectarray.set(rectcache, 12 * ptr);
    }
    function rotate(x, y, cx, cy, deg) {
        const [ox, oy] = [x - cx, y - cy];
        const [c, s] = [Math.cos(deg), Math.sin(deg)];
        return [c * ox - s * oy + cx, s * ox + c * oy + cy];
    }
    function pushRectBufferR({ x, y, w, h }, deg, { x: rcx, y: rcy }) {
        const sx1 = x;
        const sx2 = x + w;
        const sy1 = y;
        const sy2 = y + h;
        const cx = x + rcx;
        const cy = y + rcy;
        const [x1, y1] = rotate(sx1, sy1, cx, cy, deg);
        const [x2, y2] = rotate(sx2, sy1, cx, cy, deg);
        const [x3, y3] = rotate(sx1, sy2, cx, cy, deg);
        const [x4, y4] = rotate(sx2, sy2, cx, cy, deg);
        rectcache[0] = x1;
        rectcache[1] = y1;
        rectcache[2] = x2;
        rectcache[3] = y2;
        rectcache[4] = x3;
        rectcache[5] = y3;
        rectcache[6] = x3;
        rectcache[7] = y3;
        rectcache[8] = x2;
        rectcache[9] = y2;
        rectcache[10] = x4;
        rectcache[11] = y4;
        rectarray.set(rectcache, 12 * ptr);
    }
    function pushTextBuffer({ x, y, w, h }, size) {
        const x1 = x / size.width;
        const x2 = (x + w) / size.width;
        const y1 = y / size.height;
        const y2 = (y + h) / size.height;
        textcache[0] = x1;
        textcache[1] = y1;
        textcache[2] = x2;
        textcache[3] = y1;
        textcache[4] = x1;
        textcache[5] = y2;
        textcache[6] = x1;
        textcache[7] = y2;
        textcache[8] = x2;
        textcache[9] = y1;
        textcache[10] = x2;
        textcache[11] = y2;
        textarray.set(textcache, 12 * ptr);
    }
    function pushSelectArray(idx) {
        idxcache[0] = idx;
        idxcache[1] = idx;
        idxcache[2] = idx;
        idxcache[3] = idx;
        idxcache[4] = idx;
        idxcache[5] = idx;
        selearray.set(idxcache, 6 * ptr);
    }
    function drawTexture(tex, src, dst) {
        pushRectBuffer(dst);
        pushTextBuffer(src, tex);
        pushSelectArray(tex.idx);
        ptr++;
    }
    exports_1("drawTexture", drawTexture);
    function drawTextureWithRotate(tex, src, dst, deg, center) {
        pushRectBufferR(dst, deg, center);
        pushTextBuffer(src, tex);
        pushSelectArray(tex.idx);
        ptr++;
    }
    exports_1("drawTextureWithRotate", drawTextureWithRotate);
    function drawQueue() {
        prepare_1.gl.uniform2i(resolutionLocation, prepare_1.gl.canvas.width, prepare_1.gl.canvas.height);
        prepare_1.gl.bindBuffer(prepare_1.gl.ARRAY_BUFFER, rectbuffer);
        prepare_1.gl.bufferData(prepare_1.gl.ARRAY_BUFFER, rectarray.subarray(0, ptr * 12), prepare_1.gl.STREAM_DRAW);
        prepare_1.gl.bindBuffer(prepare_1.gl.ARRAY_BUFFER, textbuffer);
        prepare_1.gl.bufferData(prepare_1.gl.ARRAY_BUFFER, textarray.subarray(0, ptr * 12), prepare_1.gl.STREAM_DRAW);
        prepare_1.gl.bindBuffer(prepare_1.gl.ARRAY_BUFFER, selebuffer);
        prepare_1.gl.bufferData(prepare_1.gl.ARRAY_BUFFER, selearray.subarray(0, ptr * 6), prepare_1.gl.STREAM_DRAW);
        prepare_1.gl.drawArrays(prepare_1.gl.TRIANGLES, 0, ptr * 6);
        ptr = 0;
    }
    exports_1("drawQueue", drawQueue);
    function drawImage(tex, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH) {
        return drawTexture(tex, { x: srcX, y: srcY, w: srcW, h: srcH }, { x: dstX, y: dstY, w: dstW, h: dstH });
    }
    exports_1("drawImage", drawImage);
    function drawImageRotate(tex, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH, deg, center) {
        return drawTextureWithRotate(tex, { x: srcX, y: srcY, w: srcW, h: srcH }, { x: dstX, y: dstY, w: dstW, h: dstH }, deg, center);
    }
    exports_1("drawImageRotate", drawImageRotate);
    return {
        setters: [
            function (prepare_1_1) {
                prepare_1 = prepare_1_1;
            },
            function (default_frag_text_1_1) {
                default_frag_text_1 = default_frag_text_1_1;
            },
            function (default_vert_text_1_1) {
                default_vert_text_1 = default_vert_text_1_1;
            }
        ],
        execute: function () {
            SIZE = 1048576;
            rectarray = new Int16Array(SIZE * 12);
            textarray = new Float32Array(SIZE * 12);
            selearray = new Int8Array(SIZE * 6);
            rectcache = new Int16Array(12);
            textcache = new Float32Array(12);
            idxcache = new Int8Array(6);
            ptr = 0;
            minpos = 0;
            initGL();
        }
    };
});
//# sourceMappingURL=GL.js.map