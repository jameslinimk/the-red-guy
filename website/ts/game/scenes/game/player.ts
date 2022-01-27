import { Rect } from "../../../framework/shapes/rect"
import { GameScene } from "./game"

class Player {
    hitbox: Rect
    image: Rect

    hspd: number
    vspd: number

    /* --------------------------------- Gravity -------------------------------- */
    private touchingGroundRect: Rect
    touchingGround: boolean
    gravitySpeed: number
    gravityAcceleration: number
    gravityTopSpeed: number

    constructor(public game: GameScene) {
        this.hspd = 0
        this.vspd = 0

        this.touchingGround = false
        this.gravitySpeed = 0
        this.gravityAcceleration = 0.1
        this.gravityTopSpeed = 5

        this.hitbox = new Rect({ x: game.CGame.ctx.canvas.width / 2, y: game.CGame.ctx.canvas.height / 2 }, 50, 50)
        this.image = new Rect(this.hitbox.center, 50, 50, { style: "#FF0000", shadowBlur: 5, shadowColor: "#000000" })

        this.touchingGroundRect = new Rect({ x: this.hitbox.center.x, y: this.hitbox.topLeft.y + this.hitbox.height - 5 / 2 }, 25, 5)
    }

    update(dt: number) {
        this.image.center = this.hitbox.center
        this.touchingGroundRect.center = { x: this.hitbox.center.x, y: this.hitbox.topLeft.y + this.hitbox.height - 5 / 2 }

        this.touchingGround = false
        for (const wall of this.game.walls) {
            if (Rect.touches(wall.hitbox, this.touchingGroundRect)) {
                this.touchingGround = true
                break
            }
        }
        if (this.touchingGround) {
            this.gravitySpeed = 0
        }

        this.vspd = 0
        this.hspd = 0

        if (!this.touchingGround) {
            this.gravitySpeed = Math.min(this.gravityTopSpeed, this.gravityAcceleration * dt)
            console.log(this.gravityAcceleration * dt)
            this.vspd += this.gravitySpeed
        }

        this.hitbox.center.y += this.vspd
        this.hitbox.center.x += this.hspd
    }

    draw() {
        this.game.CGame.drawRect(this.image)

        for (const wall of this.game.walls) {
            this.game.CGame.drawRect(wall.hitbox)
        }

        this.game.CGame.drawRect(this.touchingGroundRect)
    }
}

export {
    Player
}

