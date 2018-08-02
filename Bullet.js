System.register(["./SpriteLoader"], function (exports_1, context_1) {
    "use strict";
    var SpriteLoader_1, BaseBullet, SimpleBullet;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (SpriteLoader_1_1) {
                SpriteLoader_1 = SpriteLoader_1_1;
            }
        ],
        execute: function () {
            BaseBullet = class BaseBullet {
                constructor(frame, pos, deg, speed, life, dmg) {
                    this.frame = frame;
                    this.pos = pos;
                    this.deg = deg;
                    this.speed = speed;
                    this.life = life;
                    this.dmg = dmg;
                }
                tick(tick, enes, st) {
                    for (const ene of enes) {
                        if ((ene.pos.x - this.pos.x) ** 2 + (ene.pos.y - this.pos.y) ** 2 <= 0.5 ** 2) {
                            ene.hit(this.dmg);
                            st.emit('killBullet', this);
                            return;
                        }
                    }
                    if (this.life <= 0) {
                        st.emit('killBullet', this);
                        return;
                    }
                    this.life--;
                    this.pos.x += this.speed * Math.cos(this.deg);
                    this.pos.y += this.speed * Math.sin(this.deg);
                }
                render(calc) {
                    SpriteLoader_1.drawRotate(this.frame, calc(this.pos), this.deg, { x: 4, y: 4 });
                }
            };
            SimpleBullet = class SimpleBullet extends BaseBullet {
                constructor(pos, deg) {
                    super('bullet', pos, deg, 0.1, 80, 1);
                }
            };
            exports_1("SimpleBullet", SimpleBullet);
        }
    };
});
//# sourceMappingURL=Bullet.js.map