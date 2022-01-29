import { io, Socket } from "socket.io-client"
import { ClientToServerEvents, ServerToClientEvents } from "../../../../../server/types"
import { Vector2 } from "../../../framework/pointsAngles"
import { GameScene } from "./game"
import { OtherPlayer } from "./otherPlayer"

class Client {
    io: Socket<ServerToClientEvents, ClientToServerEvents>

    constructor(public game: GameScene) {
        this.io = io("http://localhost:3000")

        this.io.on("playerJoin", (username) => {
            game.otherPlayers[username] = new OtherPlayer(game, game.spawnLocation)
        })

        this.io.on("playerLeave", (username) => {
            delete game.otherPlayers[username]
        })

        this.io.on("updatePositions", (positions) => {
            for (const username in positions) {
                if (username === game.username) continue
                if (!game.otherPlayers[username]) game.otherPlayers[username] = new OtherPlayer(game, game.spawnLocation)
                game.otherPlayers[username].image.center = positions[username].location
            }
        })
    }

    setUsername() {
        const username = prompt("username?")
        this.io.emit("setUsername", username, (valid) => {
            if (valid) this.game.username = username
        })
    }

    createGame() {
        this.io.emit("create", (error, id) => {
            if (error) return
            this.game.gameId = id
        })
    }

    update(location: Vector2) {
        this.io.emit("move", location)
    }

    join(id: string) {
        this.io.emit("join", id, (error, positions) => {
            console.log(id, error, positions)
            if (!error) return
            this.game.gameId = id
            for (const username in positions) {
                if (username === this.game.username) continue
                if (!this.game.otherPlayers[username]) this.game.otherPlayers[username] = new OtherPlayer(this.game, this.game.spawnLocation)
                this.game.otherPlayers[username].image.center = positions[username].location
            }
        })
    }
}

export {
    Client
}

