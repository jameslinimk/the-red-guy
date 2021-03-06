import { _CGame } from "./framework/framework"
import { GameScene } from "./game/scenes/game/game"

const canvas = <HTMLCanvasElement>document.getElementById("game")
if (!canvas) throw new Error("Canvas \"game\" not found!")

const CGame = new _CGame(GameScene, canvas.getContext("2d"), 60, 1280, 720)

// if (detectMobile()) alert("A mobile device has been (possibly) detected. This game requires a keyboard to move. Touch to shoot is available, but not recommended.")

CGame.run()

