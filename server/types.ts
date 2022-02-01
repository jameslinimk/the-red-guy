import { Vector2 } from "../website/ts/framework/pointsAngles"

interface position {
    location: Vector2
}
interface ServerToClientEvents {
    updatePositions: (positions: { [key: string]: position }) => void
    playerMove: (username: string, position: position) => void
    playerJoin: (username: string) => void
    playerLeave: (username: string) => void
}
interface ClientToServerEvents {
    create: (location: Vector2, callback: (error: "No username" | "Already in game" | false, id?: string) => void) => void
    join: (gameId: string, location: Vector2, callback: (error: "No username" | "Invalid game" | "Already in game" | "Already in this game" | false, positions?: { [key: string]: position }) => void) => void
    move: (location: Vector2) => void
    checkUsername: (username: string, callback: (error: "Username taken" | "Username too long" | "Username contains spaces" | false) => void) => void
    setUsername: (username: string, callback: (error: "Username taken" | "Already have username" | "Username too long" | "Username contains spaces" | false) => void) => void
    ping: (callback: () => void) => void
}
interface InterServerEvents { ping: () => void }
interface SocketData { name: string, age: number }

export {
    ServerToClientEvents,
    ClientToServerEvents,
    position,
    InterServerEvents,
    SocketData
}

