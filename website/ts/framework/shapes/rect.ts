import { CGame } from "../.."
import { Vector2 } from "../pointsAngles"
import { applyFillOptions, FillOptions } from "./shape"

class Rect {
    private _topLeft: Vector2
    get topLeft() { return this._topLeft }
    set topLeft(value: Vector2) {
        this._topLeft = value
        this._center = { x: value.x - this.width / 2, y: value.y - this.height / 2 }
    }

    private _center: Vector2
    get center() { return this._center }
    set center(value: Vector2) {
        this._center = value
        this._topLeft = { x: value.x - this.width / 2, y: value.y - this.height / 2 }
    }

    constructor(center: Vector2, public width: number, public height: number, public style?: FillOptions) {
        this.center = center
    }

    draw() {
        applyFillOptions(this.style)
        CGame.ctx.fillRect(this.topLeft.x, this.topLeft.y, this.width, this.height)
    }

    /* -------------------------------------------------------------------------- */
    /*                              Static functions                              */
    /* -------------------------------------------------------------------------- */
    static contains(a: Rect, b: Rect) {
        return !(
            b.topLeft.x < a.topLeft.x ||
            b.topLeft.y < a.topLeft.y ||
            b.topLeft.x + b.width > a.topLeft.x + a.width ||
            b.topLeft.y + b.height > a.topLeft.y + a.height
        )
    }

    static touches(a: Rect, b: Rect) {
        if (a.topLeft.x > b.topLeft.x + b.width || b.topLeft.x > a.topLeft.x + a.width) return false
        if (a.topLeft.y > b.topLeft.y + b.height || b.topLeft.y > a.topLeft.y + a.height) return false
        return true
    }
}

export {
    Rect
}

