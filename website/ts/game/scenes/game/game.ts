import { BaseScene, Events, PressedKeys } from "../../../framework/framework"
import { Player } from "./player"

class GameScene extends BaseScene {
    player: Player

    constructor() {
        super()
        this.player = new Player()
    }

    processInput(events: Events, pressedKeys: PressedKeys, dt: number) {

    }

    update(dt: number) {
    }

    draw() {
        this.player.draw()
        // new Rect({ x: 100, y: 100 }, 100, 100)
    }
}

export {
    GameScene
}

