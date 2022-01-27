import { Rect } from "../../../framework/shapes/rect"

class Player {
    hitbox: Rect
    image: Rect

    constructor() {
        this.hitbox = new Rect({ x: 100, y: 100 }, 50, 50)
        this.image = new Rect(this.hitbox.center, 50, 50, { style: "#FF0000", shadowBlur: 5, shadowColor: "#000000" })
    }

    draw() {
        this.image.draw()
    }
}

export {
    Player
}

