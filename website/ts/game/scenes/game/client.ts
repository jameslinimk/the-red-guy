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
            console.log("Other player joined", username)
            game.otherPlayers[username] = new OtherPlayer(game, game.spawnLocation)
        })

        this.io.on("playerLeave", (username) => {
            console.log("Player left ", username)
            delete game.otherPlayers[username]
        })

        this.io.on("updatePositions", (positions) => {
            console.log("Updated positions", positions, " username:", this.game.username)
            for (const username in positions) {
                if (username === this.game.username) this.game.player.hitbox.center = positions[username].location
                if (!game.otherPlayers[username]) game.otherPlayers[username] = new OtherPlayer(game, game.spawnLocation)
                game.otherPlayers[username].image.center = positions[username].location
            }
        })
    }

    setUsername() {
        const username = prompt("username?")
        this.io.emit("setUsername", username, (valid) => {
            if (valid) {
                this.game.username = username
                console.log("Set username to", username)
            }
        })
    }

    createGame() {
        this.io.emit("create", this.game.spawnLocation, (error, id) => {
            if (error) return
            this.game.gameId = id
            console.log("Created and joined game with id", id)
            this.game.player.hitbox.center = this.game.spawnLocation
        })
    }

    update(location: Vector2) {
        this.io.emit("move", location)
        console.log("Emitted move to server", location)
    }

    join(id: string) {
        this.io.emit("join", id, this.game.spawnLocation, (error, positions) => {
            console.log("Joining game with id", id, " error:", error, " positions:", positions)
            if (error) return
            this.game.gameId = id
            for (const username in positions) {
                if (username === this.game.username) this.game.player.hitbox.center = positions[username].location
                if (!this.game.otherPlayers[username]) this.game.otherPlayers[username] = new OtherPlayer(this.game, this.game.spawnLocation)
                this.game.otherPlayers[username].image.center = positions[username].location
            }
        })
    }
}

export {
    Client
}

