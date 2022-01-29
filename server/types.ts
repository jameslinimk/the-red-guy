import { Vector2 } from "../website/ts/framework/pointsAngles"

interface position {
    location: Vector2
}
interface ServerToClientEvents {
    updatePositions: (positions: { [key: string]: position }) => void
    playerJoin: (username: string) => void
    playerLeave: (username: string) => void
}
interface ClientToServerEvents {
    create: (callback: (error: boolean, id: string) => void) => void
    join: (gameId: string, callback: (error: boolean, positions?: { [key: string]: position }) => void) => void
    move: (location: Vector2) => void
    checkUsername: (username: string, callback: (valid: boolean) => void) => void
    setUsername: (username: string, callback: (valid: boolean) => void) => void
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

