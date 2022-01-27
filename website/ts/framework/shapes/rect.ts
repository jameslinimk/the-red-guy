import { Vector2 } from "../pointsAngles"
import { FillOptions } from "./shape"

class Rect {
    get topLeft() {
        return { x: this.center.x - this.width / 2, y: this.center.y - this.height / 2 }
    }

    /* ------------------------------ Constructors ------------------------------ */
    constructor(public center: Vector2, public width: number, public height: number, public style?: FillOptions) {
        this.center = center
    }

    static topLeftConstructor(topLeft: Vector2, width: number, height: number, style?: FillOptions) {
        return new Rect({ x: topLeft.x + width / 2, y: topLeft.y + height / 2 }, width, height, style)
    }

    static bottomRightConstructor(bottomRight: Vector2, width: number, height: number, style?: FillOptions) {
        return new Rect({ x: bottomRight.x - width / 2, y: bottomRight.y - height / 2 }, width, height, style)
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

