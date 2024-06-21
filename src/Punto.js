export function Punto(x, y) {
    this.x = x
    this.y = y
}

Punto.prototype = Object.create(Punto.prototype)
Punto.prototype.constructor = Punto

Punto.prototype.setX = function (x) {
    this.x = x
}

Punto.prototype.getX = function () {
    return this.x
}

Punto.prototype.setY = function (y) {
    this.y = y
}

Punto.prototype.getY = function () {
    return this.y
}

Punto.prototype.newInstance = function () {
    return new Punto(this.x, this.y)
}