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
    private touchingGroundRect: Rect
    touchingGround: boolean
    gravitySpeed: number
    gravityAcceleration: number
    gravityTopSpeed: number

    constructor(public game: GameScene) {
        this.hspd = 0
        this.vspd = 0

        this.speed = 0.5

        this.touchingGround = false
        this.gravitySpeed = 0
        this.gravityAcceleration = 0.7
        this.gravityTopSpeed = 100

        this.hitbox = new Rect({ x: game.CGame.ctx.canvas.width / 2, y: game.CGame.ctx.canvas.height / 2 }, 50, 50)
        this.image = new Rect(this.hitbox.center, 50, 50, { style: "#FF0000", shadowBlur: 5, shadowColor: "#000000" })

        this.touchingGroundRect = new Rect({ x: this.hitbox.center.x, y: this.hitbox.topLeft.y + this.hitbox.height + 5 / 2 }, 50, 5)
    }

    processInput(events: Events, pressedKeys: PressedKeys, dt: number) {
        /* --------------------------------- Sprites -------------------------------- */
        this.image.center = this.hitbox.center
        this.touchingGroundRect.center = { x: this.hitbox.center.x, y: this.hitbox.topLeft.y + this.hitbox.height + 5 / 2 }

        /* -------------------------------- Velocity -------------------------------- */
        this.vspd = 0
        this.hspd = 0

        /* -------------------------------- Movement -------------------------------- */
        if (pressedKeys.get("KeyA")) this.hspd -= this.speed * dt
        if (pressedKeys.get("KeyD")) this.hspd += this.speed * dt

        /* --------------------------------- Gravity -------------------------------- */
        this.touchingGround = false
        for (const wall of this.game.walls) {
            if (Rect.touches(wall.hitbox, this.touchingGroundRect)) {
                this.touchingGround = true
                break
            }
        }

        /* --------------------------------- Jumping -------------------------------- */
        if (events.filter(event => event.eventType === "KeyDown" && (<KeyDownEvent>event).code === "Space").length > 0 && this.touchingGround) {
            this.vspd -= 150
        }
    }

    update(dt: number) {
        /* --------------------------------- Gravity -------------------------------- */
        if (this.touchingGround) {
            this.gravitySpeed = 0
        } else {
            this.gravitySpeed = Math.min(this.gravityTopSpeed, this.gravityAcceleration * dt)
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

