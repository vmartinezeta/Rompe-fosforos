export function Termino(poligonos, base) {
    this.base = base ?? 10
    this.poligonos = poligonos
}

Termino.prototype = Object.create(Termino.prototype)
Termino.prototype.constructor = Termino

Termino.prototype.toNumber = function () {
    let numero = 0
    for (let i = this.poligonos.length-1, exponente=0;i>=0;i--,exponente++) {
        numero += this.poligonos[i].toNumber() * Math.pow(this.base, exponente)
    }
    return numero
}

Termino.prototype.toString = function () {
    return `[${this.poligonos.toString()}]`
}

Termino.prototype.getPoligonos = function () {
    return this.poligonos
}

Termino.prototype.newInstance =  function () {
    return new Termino(this.poligonos.map(p => p.newInstance()), this.base)
}