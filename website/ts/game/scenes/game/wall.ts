import { Vector2 } from "../../../framework/pointsAngles"
import { Rect } from "../../../framework/shapes/rect"
import { GameScene } from "./game"

class Wall {
    hitbox: Rect
    image: Rect

    constructor(public game: GameScene, public location: Vector2, public width: number, public height: number) {
        this.hitbox = new Rect(location, width, height)
        this.image = new Rect(location, width, height, { style: "#00FFFF", shadowBlur: 5, shadowColor: "#000000" })
    }

    update() {
        this.image.center = this.hitbox.center
    }

    draw() {
        this.game.CGame.drawRect(this.image)
    }
}

export {
    Wall
}

