import { BaseScene, Events, KeyDownEvent, PressedKeys, _CGame } from "../../../framework/framework"
import { Vector2 } from "../../../framework/pointsAngles"
import { Rect } from "../../../framework/shapes/rect"
import { Client } from "./client"
import { OtherPlayer } from "./otherPlayer"
import { Player } from "./player"
import { Wall } from "./wall"

interface ChatMessage {
    sentAt: Date
    message: string
    author: string
}
class GameScene extends BaseScene {
    /* ---------------------------- Objects / sprites --------------------------- */
    player: Player
    otherPlayers: { [key: string]: OtherPlayer }
    walls: Wall[]

    chat: ChatMessage[]

    /* ---------------------------- Multiplayer stuff --------------------------- */
    client: Client
    username?: string
    gameId?: string

    /* -------------------------------- Constants ------------------------------- */
    spawnLocation: Vector2

    constructor(CGame: _CGame) {
        super(CGame)
        this.client = new Client(this)

        this.spawnLocation = { x: this.CGame.ctx.canvas.width / 2, y: 0 }

        /* ---------------------------- Objects / sprites --------------------------- */
        this.player = new Player(this)
        this.walls = [
            new Wall(this, { x: this.CGame.width / 2, y: this.CGame.height - 100 }, 100, 50),
            new Wall(this, { x: this.CGame.width / 2 - 100, y: this.CGame.height - 150 }, 50, 100)
        ]
        this.otherPlayers = {}
        this.chat = []
    }

    processInput(events: Events, pressedKeys: PressedKeys, dt: number) {
        this.player.processInput(events, pressedKeys, dt)

        events.forEach(event => {
            switch (event.eventType) {
                case "KeyDown":
                    event = <KeyDownEvent>event
                    switch (event.code) {
                        case "KeyJ":
                            this.client.setUsername()
                            break
                        case "KeyK":
                            this.client.join(prompt("server"))
                            break
                        case "KeyL":
                            this.client.createGame()
                            break
                    }
                    break
            }
        })
    }

    update(dt: number) {
        this.player.update(dt)
        this.walls.forEach(wall => wall.update())
    }

    draw() {
        this.CGame.drawRect(Rect.topLeftConstructor({ x: 0, y: 0 }, this.CGame.width, this.CGame.height, { style: "#f5f5f5" }))

        this.player.draw()
        Object.values(this.otherPlayers).forEach(otherPlayer => otherPlayer.draw())
        this.walls.forEach(wall => wall.draw())
    }
}

export {
    GameScene
}

