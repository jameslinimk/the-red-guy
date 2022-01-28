import { Events, KeyDownEvent, PressedKeys } from "../../../framework/framework"
import { Rect } from "../../../framework/shapes/rect"
import { GameScene } from "./game"

class Player {
    hitbox: Rect
    image: Rect

    hspd: number
    vspd: number

    speed: number

    /* --------------------------------- Gravity -------------------------------- */
    private _touchingGroundRect: Rect
    touchingGround: boolean
    gravitySpeed: number
    private _gravityAcceleration: number
    private _gravityTopSpeed: number

    /* --------------------------------- Jumping -------------------------------- */
    jumping: boolean
    private _jumpSpeed: number
    private _jumpDuration: number
    private _jumpedWhen: number

    constructor(public game: GameScene) {
        this.hspd = 0
        this.vspd = 0
        this.hitbox = new Rect({ x: game.CGame.ctx.canvas.width / 2, y: 0 }, 25, 25)
        this.image = new Rect(this.hitbox.center, this.hitbox.width, this.hitbox.height, { style: "#FF0000", shadowBlur: 5, shadowColor: "#000000" })
        this._touchingGroundRect = new Rect({ x: this.hitbox.center.x, y: this.hitbox.topLeft.y + this.hitbox.height + 5 / 2 }, this.hitbox.width, 5)

        this.speed = 0.5

        this.touchingGround = false
        this.gravitySpeed = 0
        this._gravityAcceleration = 0.05
        this._gravityTopSpeed = 100

        this.jumping = false
        this._jumpSpeed = 1.2
        this._jumpDuration = 100
        this._jumpedWhen = 0
    }

    processInput(events: Events, pressedKeys: PressedKeys, dt: number) {
        /* --------------------------------- Sprites -------------------------------- */
        this.image.center = this.hitbox.center
        this._touchingGroundRect.center = { x: this.hitbox.center.x, y: this.hitbox.topLeft.y + this.hitbox.height + 5 / 2 }

        /* -------------------------------- Velocity -------------------------------- */
        this.vspd = 0
        this.hspd = 0

        /* -------------------------------- Movement -------------------------------- */
        if (pressedKeys.get("KeyA")) this.hspd -= this.speed * dt
        if (pressedKeys.get("KeyD")) this.hspd += this.speed * dt

        /* --------------------------------- Gravity -------------------------------- */
        this.touchingGround = false
        for (const wall of this.game.walls) {
            if (Rect.touches(wall.hitbox, this._touchingGroundRect)) {
                this.touchingGround = true
                break
            }
        }

        /* --------------------------------- Jumping -------------------------------- */
        if (events.filter(event => event.eventType === "KeyDown" && (<KeyDownEvent>event).code === "Space").length > 0 && this.touchingGround) {
            this.jumping = true
            this._jumpedWhen = performance.now()
        }

        if (this.jumping) {
            console.log("jumping")

            this.vspd -= this._jumpSpeed * dt

            if (performance.now() >= this._jumpedWhen + this._jumpDuration) {
                this.jumping = false
            }
        }
    }

    update(dt: number) {
        /* --------------------------------- Gravity -------------------------------- */
        if (this.touchingGround || this.jumping) {
            this.gravitySpeed = 0
        } else {
            this.gravitySpeed = Math.min(this._gravityTopSpeed, this.gravitySpeed + this._gravityAcceleration * dt)
            this.vspd += this.gravitySpeed
        }

        /* -------------------------------- Collision ------------------------------- */
        const vFutureHitbox = new Rect({ ...this.hitbox.center, y: this.hitbox.center.y + this.vspd }, this.hitbox.width, this.hitbox.height)
        const hFutureHitbox = new Rect({ ...this.hitbox.center, x: this.hitbox.center.x + this.hspd }, this.hitbox.width, this.hitbox.height)
        let hTouches = false
        let vTouches = false

        for (const wall of this.game.walls) {
            if (Rect.touches(wall.hitbox, vFutureHitbox)) {
                if (this.vspd > 0) {
                    console.log("Bottom")
                    this.hitbox.bottom = wall.hitbox.top - 5 / 2
                } else {
                    console.log("Top")
                    this.hitbox.top = wall.hitbox.bottom + 5 / 2
                }
                vTouches = true
            }

            if (Rect.touches(wall.hitbox, hFutureHitbox)) {
                if (this.hspd > 0) {
                    this.hitbox.right = wall.hitbox.left - 5 / 2
                } else {
                    this.hitbox.left = wall.hitbox.right + 5 / 2
                }
                hTouches = true
            }
        }

        /* ---------------------------- Applying velocity --------------------------- */
        if (!hTouches) this.hitbox.center.x += this.hspd
        if (!vTouches) this.hitbox.center.y += this.vspd
    }

    draw() {
        this.game.CGame.drawRect(this.image)
    }
}

export {
    Player
}

