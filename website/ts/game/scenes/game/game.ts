import { BaseScene, Events, PressedKeys, _CGame } from "../../../framework/framework"
import { Rect } from "../../../framework/shapes/rect"
import { Player } from "./player"
import { Wall } from "./wall"

class GameScene extends BaseScene {
    /* ---------------------------- Objects / sprites --------------------------- */
    player: Player
    walls: Wall[]

    constructor(CGame: _CGame) {
        super(CGame)

        /* ---------------------------- Objects / sprites --------------------------- */
        this.player = new Player(this)
        this.walls = [
            new Wall(this, { x: this.CGame.width / 2, y: this.CGame.height - 100 }, 100, 50),
            new Wall(this, { x: this.CGame.width / 2 - 100, y: this.CGame.height - 150 }, 50, 100)
        ]
    }

    processInput(events: Events, pressedKeys: PressedKeys, dt: number) {
        this.player.processInput(events, pressedKeys, dt)
    }

    update(dt: number) {
        this.player.update(dt)
        this.walls.forEach(wall => wall.update())
    }

    draw() {
        this.CGame.drawRect(Rect.topLeftConstructor({ x: 0, y: 0 }, this.CGame.width, this.CGame.height, { style: "#f5f5f5" }))

        this.player.draw()
        this.walls.forEach(wall => wall.draw())
    }
}

export {
    GameScene
}

