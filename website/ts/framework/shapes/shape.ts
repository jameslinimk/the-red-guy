import { CGame } from "../.."
import { Vector2 } from "../pointsAngles"

interface FillOptions {
    style?: string | CanvasGradient | CanvasPattern
    shadowBlur?: number
    shadowColor?: string
    shadowOffset?: Vector2
}

function applyFillOptions(fillOptions?: FillOptions) {
    CGame.ctx.fillStyle = (fillOptions?.style) ? fillOptions.style : "#000000"
    CGame.ctx.shadowBlur = (fillOptions?.shadowBlur) ? fillOptions.shadowBlur : 0
    CGame.ctx.shadowColor = (fillOptions?.shadowColor) ? fillOptions.shadowColor : "#000000"
    CGame.ctx.shadowOffsetX = (fillOptions?.shadowOffset?.x) ? fillOptions.shadowOffset.x : 0
    CGame.ctx.shadowOffsetY = (fillOptions?.shadowOffset?.y) ? fillOptions.shadowOffset.y : 0
}

export {
    FillOptions,
    applyFillOptions
}

