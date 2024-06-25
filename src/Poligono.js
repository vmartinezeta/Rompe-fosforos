
export function Poligono(a, b, c, d, e, f, g) {
    this.lados = []
    this.lados.push(a)
    this.lados.push(b)
    this.lados.push(c)
    this.lados.push(d)
    this.lados.push(e)
    this.lados.push(f)
    this.lados.push(g)
}

Poligono.prototype = Object.create(Poligono.prototype)
Poligono.prototype.constructor = Poligono

Poligono.prototype.setA = function (A) {
    this.lados[0] = A
}

Poligono.prototype.setB = function (B) {
    this.lados[1] = B
}

Poligono.prototype.setC = function (C) {
    this.lados[2] = C
}

Poligono.prototype.setD = function (D) {
    this.lados[3] = D
}

Poligono.prototype.setE= function (E) {
    this.lados[4] = E
}

Poligono.prototype.setF = function (F) {
    this.lados[5] = F
}

Poligono.prototype.setG = function (G) {
    this.lados[6] = G
}

Poligono.prototype.isOnA = function () {
    return this.lados[0]
}

Poligono.prototype.isOnB = function () {
    return this.lados[1]
}

Poligono.prototype.isOnC = function () {
    return this.lados[2]
}

Poligono.prototype.isOnD = function () {
    return this.lados[3]
}

Poligono.prototype.isOnE = function () {
    return this.lados[4]
}

Poligono.prototype.isOnF = function () {
    return this.lados[5]
}

Poligono.prototype.isOnG = function () {
    return this.lados[6]
}

Poligono.prototype.toString = function () {
    return JSON.stringify(this)
}

Poligono.prototype.toNumber = function () {
    const sistemaDecimal = [
        new Poligono(false, true, true, true, true, true, true),
        new Poligono(false, false, false, true, true, false, false),
        new Poligono(true, false, true, true, false, true, true),
        new Poligono(true, false, true, true, true, true, false),
        new Poligono(true, true, false, true, true, false, false),
        new Poligono(true, true, true, false, true, true, false),
        new Poligono(true, true, true, false, true, true, true),
        new Poligono(false, false, true, true, true, false, false),
        new Poligono(true, true, true, true, true, true, true),
        new Poligono(true, true, true, true, true, true, false)
    ]
    const numero = sistemaDecimal.findIndex(poligono => poligono.toString() === this.toString())
    return numero < 0 ? Infinity : numero
}

Poligono.prototype.newInstance = function () {
    return new Poligono(...this.lados)
}

Poligono.prototype.getLados = function () {
    return this.lados
}