///<reference path="libs/easeljs/easeljs.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
window.onload = function () {
    new project.Main();
};
var project;
(function (project) {
    /** 1フレーム間に発生させる Particle 数 */
    var NUM_PARTICLES = 6;
    /**
     * パーティクルデモのメインクラスです。
     * @class project.Main
     */
    var Main = (function () {
        /**
         * @constructor
         */
        function Main() {
            var _this = this;
            // 初期設定
            this.stage = new createjs.Stage(document.getElementById("myCanvas"));
            if (createjs.Touch.isSupported()) {
                createjs.Touch.enable(this.stage);
            }
            // パーティクルサンプルを作成
            var sample = new ParticleSample();
            this.stage.addChild(sample);
            // Tickerを作成
            createjs.Ticker.setFPS(60);
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.on("tick", this.handleTick, this);
            // リサイズイベント
            this.handleResize();
            window.addEventListener("resize", function () {
                _this.handleResize();
            });
        }
        /**
         * エンターフレームイベント
         */
        Main.prototype.handleTick = function () {
            // create residual image effect
            this.stage.update();
        };
        /**
         * リサイズイベント
         */
        Main.prototype.handleResize = function () {
            this.stage.canvas.width = window.innerWidth;
            this.stage.canvas.height = window.innerHeight;
        };
        return Main;
    })();
    project.Main = Main;
    /**
     * 大量のパーティクルを発生させてみた
     * マウスを押してる間でてくるよ
     * @see http://wonderfl.net/c/4WjT
     * @class demo.ParticleSample
     */
    var ParticleSample = (function (_super) {
        __extends(ParticleSample, _super);
        function ParticleSample() {
            var _this = this;
            _super.call(this);
            /** マウスがプレスされた状態であるかどうか。 */
            this._isDown = true;
            this._bg = new createjs.Shape();
            this.addChild(this._bg);
            // パーティクルエミッター
            this._emitter = new ParticleEmitter();
            this.addChild(this._emitter.container);
            // ライン描写
            this._lines = new createjs.Shape();
            this._lines.compositeOperation = "lighter";
            this.addChild(this._lines);
            this._linePoint = [];
            // 影
            this._shadow = new createjs.Bitmap("imgs/Shadow.png");
            this.addChild(this._shadow);
            this.on("tick", this.enterFrameHandler, this);
            this.on("mousedown", this.mouseDown, this);
            this.on("pressup", this.mouseUp, this);
            this.handleResize();
            window.addEventListener("resize", function () {
                _this.handleResize();
            });
            var sx = window.innerWidth / 2;
            var sy = window.innerHeight / 2;
            this._pointAutoMotion = new createjs.Point(sx, sy);
            this._isAutoAnimation = true;
            var points = GraphicUtil.createStartPoints(window.innerWidth / 3, sx, sy);
            this._emitter.x = points[0].x;
            this._emitter.y = points[0].y;
            var tw = createjs.Tween.get(this._pointAutoMotion);
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < points.length; j++) {
                    tw.to(points[j], 300, createjs.Ease.quartInOut);
                }
            }
            tw.call(function () {
                _this._isAutoAnimation = false;
                _this._isDown = false;
                document.getElementById("attention").classList.add("show");
            });
        }
        /**
         * エンターフレームイベント
         * @param event
         */
        ParticleSample.prototype.enterFrameHandler = function (event) {
            if (this._isAutoAnimation == true) {
                this._emitter.latestX = this._pointAutoMotion.x;
                this._emitter.latestY = this._pointAutoMotion.y;
            }
            else {
                this._emitter.latestX = this.getStage().mouseX;
                this._emitter.latestY = this.getStage().mouseY;
            }
            this._emitter.update();
            if (this._isDown == true) {
                this.createParticle();
            }
            // 背景
            var color1 = createjs.Graphics.getHSL(new Date().getTime() / 40, 80, 60);
            var color2 = createjs.Graphics.getHSL((new Date().getTime() + 40 * 60) / 40, 90, 80);
            this._bg.graphics.clear().beginLinearGradientFill([color1, color2], [0, 1], 0, 0, 0, window.innerHeight).drawRect(0, 0, window.innerWidth, window.innerHeight);
            this.updateLines();
        };
        /** ラインを描写更新します。 */
        ParticleSample.prototype.updateLines = function () {
            if (this._isDown) {
                this._linePoint.push({
                    x: this._emitter.x,
                    y: this._emitter.y,
                    vx: this._emitter.vx,
                    vy: this._emitter.vy
                });
            }
            else {
                this._linePoint.shift();
            }
            // Emitterの状態に応じて線を描く
            this._lines.graphics.clear();
            var max = this._linePoint.length - 1;
            var LW = 1;
            var LMAX = 6;
            for (var i = 0; i < max; i++) {
                var p1 = this._linePoint[i];
                var p2 = this._linePoint[i + 1];
                // Emitterの状態に応じて線を描く
                this._lines.graphics.setStrokeStyle(3).beginStroke(createjs.Graphics.getRGB(255, 255, 255, i / max * 0.2)).moveTo(p1.x, p1.y).lineTo(p2.x, p2.y);
                for (var j = 0; j < LMAX; j++) {
                    var sx = p1.x + p1.vx * LW * (j - LMAX / 2);
                    var sy = p1.y + p1.vy * LW * (j - LMAX / 2);
                    var ex = p2.x + p2.vx * LW * (j - LMAX / 2);
                    var ey = p2.y + p2.vy * LW * (j - LMAX / 2);
                    // Emitterの状態に応じて線を描く
                    this._lines.graphics.setStrokeStyle(Math.abs(LMAX - j + LMAX / 2) / 2).beginStroke(createjs.Graphics.getRGB(255, 255, 255, i / max * 0.1)).moveTo(sx, sy).lineTo(ex, ey);
                }
            }
            var deleteNum = (this._isAutoAnimation == true) ? 100 : 20;
            if (max > deleteNum) {
                // 一回削る
                this._linePoint.shift();
                // まだ多ければ2個目も削る
                if (this._linePoint.length > deleteNum) {
                    this._linePoint.shift();
                }
            }
        };
        ParticleSample.prototype.mouseDown = function (event) {
            this._isDown = true;
        };
        ParticleSample.prototype.mouseUp = function (event) {
            this._isDown = false;
        };
        ParticleSample.prototype.createParticle = function () {
            this._emitter.emit(this.getStage().mouseX, this.getStage().mouseY);
        };
        /** 画面サイズが更新されたときのハンドラーです。 */
        ParticleSample.prototype.handleResize = function () {
            this._shadow.scaleX = (window.innerWidth / 1024);
            this._shadow.scaleY = (window.innerHeight / 1024);
        };
        return ParticleSample;
    })(createjs.Container);
    project.ParticleSample = ParticleSample;
    /**
     * パーティクル発生装置。マウス座標から速度を計算する。
     * @class project.Emitter
     */
    var Emitter = (function () {
        /**
         * @constructor
         */
        function Emitter() {
            /** 速度(X方向) */
            this.vy = 0;
            /** 速度(Y方向) */
            this.x = 0;
            /** マウスのX座標 */
            this.latestY = 0;
            /** マウスのY座標 */
            this.latestX = 0;
            /** パーティクル発生のX座標 */
            this.y = 0;
            /** パーティクル発生のY座標 */
            this.vx = 0;
        }
        /**
         * パーティクルエミッターの計算を行います。この計算によりマウスの引力が計算されます。
         * @method
         */
        Emitter.prototype.update = function () {
            var dx = this.latestX - this.x;
            var dy = this.latestY - this.y;
            var d = Math.sqrt(dx * dx + dy * dy) * 0.2;
            var rad = Math.atan2(dy, dx);
            this.vx += Math.cos(rad) * d;
            this.vy += Math.sin(rad) * d;
            this.vx *= 0.4;
            this.vy *= 0.4;
            this.x += this.vx;
            this.y += this.vy;
        };
        return Emitter;
    })();
    /**
     * パーティクルエミッター
     * @class project.ParticleEmitter
     */
    var ParticleEmitter = (function (_super) {
        __extends(ParticleEmitter, _super);
        /**
         * @constructor
         */
        function ParticleEmitter() {
            _super.call(this);
            /** 1フレーム間に発生させる Particle 数 */
            this.numParticles = NUM_PARTICLES;
            this.PRE_CACHE_PARTICLES = 300;
            this.container = new createjs.Container();
            this._particleActive = [];
            this._particlePool = [];
            for (var i = 0; i < this.PRE_CACHE_PARTICLES; i++) {
                this._particlePool.push(new Particle());
            }
        }
        /**
         * パーティクルを発生させます。
         * @param {number} x パーティクルの発生座標
         * @param {number} y パーティクルの発生座標
         * @method
         */
        ParticleEmitter.prototype.emit = function (x, y) {
            for (var i = 0; i < this.numParticles; i++) {
                this.getNewParticle(x, y);
            }
        };
        /**
         * パーティクルを更新します。
         * @method
         */
        ParticleEmitter.prototype.update = function () {
            _super.prototype.update.call(this);
            for (var i = 0; i < this._particleActive.length; i++) {
                var p = this._particleActive[i];
                if (!p.getIsDead()) {
                    if (p.y >= window.innerHeight) {
                        p.vy *= -0.8;
                        p.y = window.innerHeight;
                    }
                    else if (p.y <= 0) {
                        p.vy *= -0.8;
                        p.y = 0;
                    }
                    if (p.x >= window.innerWidth) {
                        p.vx *= -0.8;
                        p.y = window.innerWidth;
                    }
                    else if (p.x <= 0) {
                        p.vx *= -0.8;
                        p.x = 0;
                    }
                    p.update();
                }
                else {
                    this.removeParticle(p);
                }
            }
        };
        /**
         * パーティクルを追加します。
         * @param {THREE.Vector3} emitPoint
         * @method
         */
        ParticleEmitter.prototype.getNewParticle = function (emitX, emitY) {
            var p = this.fromPool();
            p.resetParameters(this.x, this.y, this.vx, this.vy);
            this._particleActive.push(p);
            this.container.addChild(p);
            return p;
        };
        /**
         * パーティクルを削除します。
         * @param {Particle} particle
         * @method
         */
        ParticleEmitter.prototype.removeParticle = function (p) {
            this.container.removeChild(p);
            var index = this._particleActive.indexOf(p);
            if (index > -1) {
                this._particleActive.splice(index, 1);
            }
            this.toPool(p);
        };
        /**
         * アクティブなパーティクルを取り出します。
         * @returns {project.Particle[]}
         * @method
         */
        ParticleEmitter.prototype.getActiveParticles = function () {
            return this._particleActive;
        };
        /**
         * プールからインスタンスを取り出します。
         * プールになければ新しいインスタンスを作成します。
         * @returns {project.Particle}
         * @method
         */
        ParticleEmitter.prototype.fromPool = function () {
            if (this._particlePool.length > 0)
                return this._particlePool.shift();
            else
                return new Particle();
        };
        /**
         * プールにインスタンスを格納します。
         * @param {project.Particle}
         * @method
         */
        ParticleEmitter.prototype.toPool = function (particle) {
            this._particlePool.push(particle);
        };
        return ParticleEmitter;
    })(Emitter);
    /**
     * @class demo.Particle
     */
    var Particle = (function (_super) {
        __extends(Particle, _super);
        /**
         * コンストラクタ
         * @constructor
         */
        function Particle() {
            _super.call(this);
            var size = Math.random() * Math.random() * Math.random() * 120 + 3;
            this.size = size;
            var colorHsl = createjs.Graphics.getHSL(160 + 20 * Math.random(), 0 + Math.random() * 20, 50 + Math.random() * 50);
            this.graphics.clear();
            if (Math.random() < 0.5) {
                // もやっとした円
                this.graphics.beginRadialGradientFill([colorHsl, "#000000"], [0.0, 0.5], 0, 0, this.size / 10, 0, 0, this.size);
            }
            else if (Math.random() < 0.5) {
                // キリッとした円
                this.graphics.beginFill(colorHsl);
            }
            else {
                // 輪郭だけの円
                this.graphics.setStrokeStyle(2).beginStroke(createjs.Graphics.getRGB(255, 255, 255));
            }
            this.graphics.drawCircle(0, 0, this.size);
            this.graphics.endFill();
            // 大量のオブジェクトを重ねるとおかしくなる
            this.compositeOperation = "lighter";
            this.mouseEnabled = false;
            var padding = 2;
            this.cache(-this.size - padding, -this.size - padding, this.size * 2 + padding * 2, this.size * 2 + padding * 2);
            this._destroy = true;
        }
        /**
         * パーティクルをリセットします。
         * @param {createjs.Point} point
         * @param {number} vx
         * @param {number} vy
         */
        Particle.prototype.resetParameters = function (emitX, emitY, vx, vy) {
            this.x = emitX;
            this.y = emitY;
            this.vx = vx * 0.5 + (Math.random() - 0.5) * 10;
            this.vy = vy * 0.5 + (Math.random() - 0.5) * 10;
            this.life = Math.random() * Math.random() * 120 + 4;
            this._count = 0;
            this._destroy = false;
            this.alpha = 1.0;
            this.scaleX = this.scaleY = 1.0;
        };
        /**
         * パーティクル個別の内部計算を行います。
         * @method
         */
        Particle.prototype.update = function () {
            this.x += this.vx;
            this.y += this.vy;
            this._count++;
            var maxD = (1 - this._count / this.life * 1 / 3);
            this.alpha = Math.random() * 0.6 + 0.4;
            this.scaleX = this.scaleY = maxD;
            // 死亡フラグ
            if (this.life < this._count) {
                this._destroy = true;
                this.parent.removeChild(this);
            }
        };
        /**
         * パーティクルが死んでいるかどうかを確認します。
         * @returns {boolean}
         * @method
         */
        Particle.prototype.getIsDead = function () {
            return this._destroy;
        };
        return Particle;
    })(createjs.Shape);
    var GraphicUtil = (function () {
        function GraphicUtil() {
        }
        /**
         * 五芒星の頂点座標を計算します。
         * @param radius {number}    半径
         * @returns {{x:number; y:number;}[]}
         */
        GraphicUtil.createStartPoints = function (radius, offsetX, offsetY) {
            //五芒星の時の角度
            var c1 = GraphicUtil.createCordinate(radius, -90, offsetX, offsetY);
            var c2 = GraphicUtil.createCordinate(radius, -234, offsetX, offsetY);
            var c3 = GraphicUtil.createCordinate(radius, -18, offsetX, offsetY);
            var c4 = GraphicUtil.createCordinate(radius, -162, offsetX, offsetY);
            var c5 = GraphicUtil.createCordinate(radius, -306, offsetX, offsetY);
            return [c1, c2, c3, c4, c5];
        };
        GraphicUtil.createCordinate = function (radius, angle, offsetX, offsetY) {
            var x = radius * Math.cos(angle / 180 * Math.PI);
            var y = radius * Math.sin(angle / 180 * Math.PI);
            return {
                "x": x + offsetX,
                "y": y + offsetY
            };
        };
        return GraphicUtil;
    })();
})(project || (project = {}));