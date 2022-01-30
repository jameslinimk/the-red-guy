import { Server, Socket } from "socket.io"
import { Vector2 } from "../website/ts/framework/pointsAngles"
import { ClientToServerEvents, InterServerEvents, position, ServerToClientEvents, SocketData } from "./types"

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(3000, { cors: { origin: "*" } })

/* ---------------------------------- Game ---------------------------------- */
class Game {
    get clients() {
        return (io.sockets.adapter.rooms.get(this.id)) ? io.sockets.adapter.rooms.get(this.id) : new Set<string>()
    }
    positions: { [key: string]: position }

    constructor(public id: string) {
        this.positions = {}
    }

    add(socket: Socket<ServerToClientEvents, ClientToServerEvents>, location: Vector2) {
        const username = socketUsernames.get(socket.id)
        if (!username) return
        console.log(this.clients, "clients")
        if (this.clients?.has(socket.id)) return

        socket.join(this.id)
        io.to(this.id).emit("playerJoin", username)
        this.positions[username] = {
            location: location
        }
    }

    updatePos(id: string, location: Vector2) {
        const username = socketUsernames.get(id)
        if (!username) return
        if (!this.clients.has(id)) return

        this.positions[username] = {
            location: location
        }
    }

    updateAllPositions() {
        io.in(this.id).emit("updatePositions", this.positions)
    }

    updatePosition(socket: Socket<ServerToClientEvents, ClientToServerEvents>) {
        const username = socketUsernames.get(socket.id)
        if (!username) return
        if (!this.positions[username]) return

        io.in(this.id).emit("playerMove", username, this.positions[username])
    }

    getPositions() {
        return
    }

    static getPlayersGame(id: string) {
        if (!socketUsernames.get(id)) return
        return Object.values(games).filter(game => game.clients.has(id))
    }
}
const games: { [key: string]: Game } = {}

/* ----------------------------- Username check ----------------------------- */
const usernames = new Set<string>()
const socketUsernames = new Map<string, string>()
function usernameCheck(username: string) {
    if (usernames.has(username)) return false
    if (username.length > 20) return false
    if (/\s/g.test(username)) return false
    usernames.add(username)
    return true
}

/* -------------------------------- Game IDs -------------------------------- */
const adjectives = ["silly", "strong", "big", "small", "tiny", "weak", "white", "black", "brown", "yellow", "green", "blue", "red", "dull", "sharp", "pink", "purple"]
const nouns = ["car", "bus", "monkey", "keyboard", "laptop", "mouse", "sword", "cable", "phone", "bowl", "fork", "spoon", "knife", "bike", "pencil", "apple", "orange", "banana"]
const gameIds = new Set<string>()
function generateId() {
    let id = `${adjectives[Math.floor(Math.random() * adjectives.length)]}-${nouns[Math.floor(Math.random() * nouns.length)]}`
    while (gameIds.has(id)) {
        id = `${adjectives[Math.floor(Math.random() * adjectives.length)]}-${nouns[Math.floor(Math.random() * nouns.length)]}`
    }
    gameIds.add(id)
    return id
}

/* ----------------------------------- UI ----------------------------------- */
function printUI() {
    console.clear()
    console.log("Games:")
    console.table(Object.values(games).map(game => {
        return {
            "ID": game.id,
            "Clients": Array.from(game.clients.values()).map(client => socketUsernames.get(client)),
            "Positions": Object.keys(game.positions).map(key => `${key}: ${game.positions[key].location.x}, ${game.positions[key].location.y}`)
        }
    }))

    console.log("Socket username map:")
    console.table(socketUsernames)
}
printUI()

/* ----------------------------- Username check ----------------------------- */

io.on("connection", (socket) => {
    console.log("A user connected")

    socket.on("create", (location, callback) => {
        const username = socketUsernames.get(socket.id)
        if (!username) return callback("No username")
        if (Game.getPlayersGame(socket.id)?.[0]) return callback("Already in game")

        const id = generateId()
        games[id] = new Game(id)
        games[id].add(socket, location)
        callback(false, id)

        console.log("Created")
        printUI()
    })

    socket.on("checkUsername", (username, callback) => {
        callback(usernameCheck(username))

        printUI()
    })

    socket.on("setUsername", (username, callback) => {
        const valid = usernameCheck(username)
        if (valid) socketUsernames.set(socket.id, username)
        callback(valid)

        printUI()
    })

    socket.on("join", (id, location, callback) => {
        console.log("join ", id, location)

        const username = socketUsernames.get(socket.id)
        if (!username) return callback("No username")
        if (Game.getPlayersGame(socket.id)?.[0]) return callback("Already in game")
        const game = games[id]
        if (!game) return callback("Invalid game")
        if (game.clients.has(socket.id)) return callback("Already in this game")

        game.add(socket, location)
        callback(false, game.positions)

        printUI()
    })

    socket.on("move", (location) => {
        if (!socketUsernames.get(socket.id)) return
        const game = Game.getPlayersGame(socket.id)?.[0]
        if (!game) return

        game.updatePos(socket.id, location)
        game.updateAllPositions()

        printUI()
    })

    socket.on("disconnect", () => {
        socketUsernames.delete(socket.id)

        // Remove player form game
        const game = Game.getPlayersGame(socket.id)?.[0]
        if (!game) return
        const username = socketUsernames.get(socket.id)
        if (!username) return
        usernames.delete(username)
        io.to(game.id).emit("playerLeave", username)
        socket.leave(game.id)
        delete game.positions[socket.id]

        console.log("Deleted everything")

        printUI()
    })
})