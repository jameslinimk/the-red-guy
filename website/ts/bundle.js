(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseScene = exports.wait = exports._CGame = void 0;
/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */
function wait(time) {
    return new Promise((resolve, _) => setTimeout(resolve, time));
}
exports.wait = wait;
class _CGame {
    _startingScene;
    ctx;
    fps;
    width;
    height;
    static detectMobile() {
        const a = (navigator.userAgent || navigator.vendor || window.opera);
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            return true;
        }
        return false;
    }
    getMousePos(event) {
        const rect = this.ctx.canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (this.ctx.canvas.width / rect.width);
        const y = (event.clientY - rect.top) * (this.ctx.canvas.height / rect.height);
        if (x < 0 || x > this.ctx.canvas.width || y < 0 || y > this.ctx.canvas.height)
            return;
        return { x: x, y: y };
    }
    eventQueue;
    pressedKeys;
    alreadyFired;
    mouse;
    constructor(_startingScene, ctx, fps, width, height) {
        this._startingScene = _startingScene;
        this.ctx = ctx;
        this.fps = fps;
        this.width = width;
        this.height = height;
        this.mouse = { x: 0, y: 0 };
        /* -------------------------- Adjusting the canvas -------------------------- */
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        const resizeWindow = () => {
            const scale = Math.min(innerWidth / this.width, innerHeight / this.height);
            ctx.canvas.style.width = `${this.width * scale}px`;
            ctx.canvas.style.height = `${this.height * scale}px`;
        };
        resizeWindow();
        window.onresize = resizeWindow;
        this.eventQueue = [];
        this.pressedKeys = new Map();
        this.alreadyFired = new Map();
        /* ------------------------------- Key events ------------------------------- */
        document.onkeydown = (event) => {
            if (this.alreadyFired.get(event.code))
                return;
            this.alreadyFired.set(event.code, true);
            this.pressedKeys.set(event.code, true);
            this.eventQueue.push({ eventType: "KeyDown", key: event.key, code: event.code, raw: event });
        };
        document.onkeyup = (event) => {
            this.alreadyFired.set(event.code, false);
            this.pressedKeys.set(event.code, false);
            this.eventQueue.push({ eventType: "KeyUp", key: event.key, code: event.code, raw: event });
        };
        /* ------------------------------ Mouse events ------------------------------ */
        document.onmousemove = (event) => {
            if (!this.getMousePos(event))
                return;
            this.mouse = this.getMousePos(event);
            this.eventQueue.push({ eventType: "MouseMove", raw: event });
        };
        document.onmousedown = (event) => {
            if (!this.getMousePos(event))
                return;
            this.pressedKeys.set((event.button === 0) ? "MouseLeft" : (event.button === 1) ? "MouseMiddle" : (event.button === 2) ? "MouseRight" : "MouseUnknown", true);
            this.eventQueue.push({ eventType: "MouseDown", raw: event });
        };
        document.onmouseup = (event) => {
            if (!this.getMousePos(event))
                return;
            this.pressedKeys.set((event.button === 0) ? "MouseLeft" : (event.button === 1) ? "MouseMiddle" : (event.button === 2) ? "MouseRight" : "MouseUnknown", false);
            this.eventQueue.push({ eventType: "MouseUp", raw: event });
        };
    }
    async run() {
        this.ctx.imageSmoothingEnabled = false;
        let t = performance.now();
        let timeLastFrame = t;
        let scene = new this._startingScene(this);
        while (scene !== null) {
            // Delta time
            t = performance.now();
            const deltaTime = t - timeLastFrame;
            timeLastFrame = t;
            // Processing new events
            const events = this.eventQueue;
            this.eventQueue = []; // Clear event queue
            // Send data to the scene
            scene.processInput(events, this.pressedKeys, deltaTime);
            scene.update(deltaTime);
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // Clear screen
            scene.draw();
            scene = scene.next; // Set next scene
            await wait(1000 / this.fps);
        }
    }
    applyFillOptions(fillOptions) {
        this.ctx.fillStyle = (fillOptions?.style) ? fillOptions.style : "#000000";
        this.ctx.shadowBlur = (fillOptions?.shadowBlur) ? fillOptions.shadowBlur : 0;
        this.ctx.shadowColor = (fillOptions?.shadowColor) ? fillOptions.shadowColor : "#000000";
        this.ctx.shadowOffsetX = (fillOptions?.shadowOffset?.x) ? fillOptions.shadowOffset.x : 0;
        this.ctx.shadowOffsetY = (fillOptions?.shadowOffset?.y) ? fillOptions.shadowOffset.y : 0;
    }
    drawRect(rect) {
        this.applyFillOptions(rect.style);
        this.ctx.fillRect(Math.round(rect.topLeft.x), Math.round(rect.topLeft.y), Math.round(rect.width), Math.round(rect.height));
    }
}
exports._CGame = _CGame;
class BaseScene {
    CGame;
    next;
    mouse;
    constructor(CGame) {
        this.CGame = CGame;
        this.next = this;
        this.mouse = { x: 0, y: 0 };
    }
    /**
     * Will switch to `nextScene` next frame
     * @param nextScene Scene to switch to
     */
    switchToScene(nextScene) {
        this.next = nextScene;
    }
    /**
     * Will terminate the entire game, ending it
     */
    terminateGame() {
        this.next == null;
    }
    /**
     * Called first every frame
     * @param events {@link Events} this frame
     * @param pressedKeys {@link PressedKeys} this frame
     */
    processInput(events, pressedKeys, dt) {
        throw new Error("processInput wasn't overridden");
    }
    /**
     * Will be called second after {@link BaseScene.processInput}
     * @param dt Deltatime (time in between each frame) Used to create consistency between difference frame rates
     */
    update(dt) {
        throw new Error("update wasn't overridden");
    }
    /**
     * Will be called last after {@link BaseScene.processInput} and {@link BaseScene.update}
     */
    draw() {
        throw new Error("draw wasn't overridden");
    }
}
exports.BaseScene = BaseScene;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = void 0;
class Rect {
    center;
    width;
    height;
    style;
    get top() { return this.center.y - this.height / 2; }
    set top(top) { this.center.y = top + this.height / 2; }
    get bottom() { return this.center.y + this.height / 2; }
    set bottom(bottom) { this.center.y = bottom - this.height / 2; }
    get left() { return this.center.x - this.width / 2; }
    set left(left) { this.center.x = left + this.width / 2; }
    get right() { return this.center.x + this.width / 2; }
    set right(right) { this.center.x = right - this.width / 2; }
    get topLeft() { return { x: this.center.x - this.width / 2, y: this.center.y - this.height / 2 }; }
    get bottomRight() { return { x: this.center.x + this.width / 2, y: this.center.y + this.height / 2 }; }
    /* ------------------------------ Constructors ------------------------------ */
    constructor(center, width, height, style) {
        this.center = center;
        this.width = width;
        this.height = height;
        this.style = style;
        this.center = center;
    }
    static topLeftConstructor(topLeft, width, height, style) {
        return new Rect({ x: topLeft.x + width / 2, y: topLeft.y + height / 2 }, width, height, style);
    }
    static bottomRightConstructor(bottomRight, width, height, style) {
        return new Rect({ x: bottomRight.x - width / 2, y: bottomRight.y - height / 2 }, width, height, style);
    }
    /* -------------------------------------------------------------------------- */
    /*                              Static functions                              */
    /* -------------------------------------------------------------------------- */
    static contains(a, b) {
        return !(b.topLeft.x < a.topLeft.x ||
            b.topLeft.y < a.topLeft.y ||
            b.topLeft.x + b.width > a.topLeft.x + a.width ||
            b.topLeft.y + b.height > a.topLeft.y + a.height);
    }
    static touches(a, b) {
        if (a.topLeft.x > b.topLeft.x + b.width || b.topLeft.x > a.topLeft.x + a.width)
            return false;
        if (a.topLeft.y > b.topLeft.y + b.height || b.topLeft.y > a.topLeft.y + a.height)
            return false;
        return true;
    }
}
exports.Rect = Rect;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameScene = void 0;
const framework_1 = require("../../../framework/framework");
const rect_1 = require("../../../framework/shapes/rect");
const player_1 = require("./player");
const wall_1 = require("./wall");
class GameScene extends framework_1.BaseScene {
    /* ---------------------------- Objects / sprites --------------------------- */
    player;
    walls;
    constructor(CGame) {
        super(CGame);
        /* ---------------------------- Objects / sprites --------------------------- */
        this.player = new player_1.Player(this);
        this.walls = [
            new wall_1.Wall(this, { x: this.CGame.width / 2, y: this.CGame.height - 100 }, 100, 50),
            new wall_1.Wall(this, { x: this.CGame.width / 2 - 100, y: this.CGame.height - 150 }, 50, 100)
        ];
    }
    processInput(events, pressedKeys, dt) {
        this.player.processInput(events, pressedKeys, dt);
    }
    update(dt) {
        this.player.update(dt);
        this.walls.forEach(wall => wall.update());
    }
    draw() {
        this.CGame.drawRect(rect_1.Rect.topLeftConstructor({ x: 0, y: 0 }, this.CGame.width, this.CGame.height, { style: "#f5f5f5" }));
        this.player.draw();
        this.walls.forEach(wall => wall.draw());
    }
}
exports.GameScene = GameScene;

},{"../../../framework/framework":1,"../../../framework/shapes/rect":2,"./player":4,"./wall":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const rect_1 = require("../../../framework/shapes/rect");
class Player {
    game;
    hitbox;
    image;
    hspd;
    vspd;
    speed;
    /* --------------------------------- Gravity -------------------------------- */
    _touchingGroundRect;
    touchingGround;
    gravitySpeed;
    _gravityAcceleration;
    _gravityTopSpeed;
    /* --------------------------------- Jumping -------------------------------- */
    jumping;
    _jumpSpeed;
    _jumpDuration;
    _jumpedWhen;
    constructor(game) {
        this.game = game;
        this.hspd = 0;
        this.vspd = 0;
        this.hitbox = new rect_1.Rect({ x: game.CGame.ctx.canvas.width / 2, y: 0 }, 25, 25);
        this.image = new rect_1.Rect(this.hitbox.center, this.hitbox.width, this.hitbox.height, { style: "#FF0000", shadowBlur: 5, shadowColor: "#000000" });
        this._touchingGroundRect = new rect_1.Rect({ x: this.hitbox.center.x, y: this.hitbox.topLeft.y + this.hitbox.height + 5 / 2 }, this.hitbox.width, 5);
        this.speed = 0.5;
        this.touchingGround = false;
        this.gravitySpeed = 0;
        this._gravityAcceleration = 0.05;
        this._gravityTopSpeed = 100;
        this.jumping = false;
        this._jumpSpeed = 1.2;
        this._jumpDuration = 100;
        this._jumpedWhen = 0;
    }
    processInput(events, pressedKeys, dt) {
        /* --------------------------------- Sprites -------------------------------- */
        this.image.center = this.hitbox.center;
        this._touchingGroundRect.center = { x: this.hitbox.center.x, y: this.hitbox.topLeft.y + this.hitbox.height + 5 / 2 };
        /* -------------------------------- Velocity -------------------------------- */
        this.vspd = 0;
        this.hspd = 0;
        /* -------------------------------- Movement -------------------------------- */
        if (pressedKeys.get("KeyA"))
            this.hspd -= this.speed * dt;
        if (pressedKeys.get("KeyD"))
            this.hspd += this.speed * dt;
        /* --------------------------------- Gravity -------------------------------- */
        this.touchingGround = false;
        for (const wall of this.game.walls) {
            if (rect_1.Rect.touches(wall.hitbox, this._touchingGroundRect)) {
                this.touchingGround = true;
                break;
            }
        }
        /* --------------------------------- Jumping -------------------------------- */
        if (events.filter(event => event.eventType === "KeyDown" && event.code === "Space").length > 0 && this.touchingGround) {
            this.jumping = true;
            this._jumpedWhen = performance.now();
        }
        if (this.jumping) {
            console.log("jumping");
            this.vspd -= this._jumpSpeed * dt;
            if (performance.now() >= this._jumpedWhen + this._jumpDuration) {
                this.jumping = false;
            }
        }
    }
    update(dt) {
        /* --------------------------------- Gravity -------------------------------- */
        if (this.touchingGround || this.jumping) {
            this.gravitySpeed = 0;
        }
        else {
            this.gravitySpeed = Math.min(this._gravityTopSpeed, this.gravitySpeed + this._gravityAcceleration * dt);
            this.vspd += this.gravitySpeed;
        }
        /* -------------------------------- Collision ------------------------------- */
        const vFutureHitbox = new rect_1.Rect({ ...this.hitbox.center, y: this.hitbox.center.y + this.vspd }, this.hitbox.width, this.hitbox.height);
        const hFutureHitbox = new rect_1.Rect({ ...this.hitbox.center, x: this.hitbox.center.x + this.hspd }, this.hitbox.width, this.hitbox.height);
        let hTouches = false;
        let vTouches = false;
        for (const wall of this.game.walls) {
            if (rect_1.Rect.touches(wall.hitbox, vFutureHitbox)) {
                if (this.vspd > 0) {
                    console.log("Bottom");
                    this.hitbox.bottom = wall.hitbox.top - 5 / 2;
                }
                else {
                    console.log("Top");
                    this.hitbox.top = wall.hitbox.bottom + 5 / 2;
                }
                vTouches = true;
            }
            if (rect_1.Rect.touches(wall.hitbox, hFutureHitbox)) {
                if (this.hspd > 0) {
                    this.hitbox.right = wall.hitbox.left - 5 / 2;
                }
                else {
                    this.hitbox.left = wall.hitbox.right + 5 / 2;
                }
                hTouches = true;
            }
        }
        /* ---------------------------- Applying velocity --------------------------- */
        if (!hTouches)
            this.hitbox.center.x += this.hspd;
        if (!vTouches)
            this.hitbox.center.y += this.vspd;
    }
    draw() {
        this.game.CGame.drawRect(this.image);
    }
}
exports.Player = Player;

},{"../../../framework/shapes/rect":2}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wall = void 0;
const rect_1 = require("../../../framework/shapes/rect");
class Wall {
    game;
    location;
    width;
    height;
    hitbox;
    image;
    constructor(game, location, width, height) {
        this.game = game;
        this.location = location;
        this.width = width;
        this.height = height;
        this.hitbox = new rect_1.Rect(location, width, height);
        this.image = new rect_1.Rect(location, width, height, { style: "#00FFFF", shadowBlur: 5, shadowColor: "#000000" });
    }
    update() {
        this.image.center = this.hitbox.center;
    }
    draw() {
        this.game.CGame.drawRect(this.image);
    }
}
exports.Wall = Wall;

},{"../../../framework/shapes/rect":2}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("./framework/framework");
const game_1 = require("./game/scenes/game/game");
const canvas = document.getElementById("game");
if (!canvas)
    throw new Error("Canvas \"game\" not found!");
const CGame = new framework_1._CGame(game_1.GameScene, canvas.getContext("2d"), 60, 1280, 720);
// if (detectMobile()) alert("A mobile device has been (possibly) detected. This game requires a keyboard to move. Touch to shoot is available, but not recommended.")
CGame.run();

},{"./framework/framework":1,"./game/scenes/game/game":3}]},{},[6]);
