import { Vector2 } from "../../../framework/pointsAngles"
import { Rect } from "../../../framework/shapes/rect"
import { GameScene } from "./game"

class OtherPlayer {
    image: Rect

    constructor(public game: GameScene, location: Vector2) {
        this.image = new Rect(location, 25, 25, { style: "#00FF00", shadowBlur: 5, shadowColor: "#000000" })
    }

    draw() {
        this.game.CGame.drawRect(this.image)
    }
}

export {
    OtherPlayer
}

