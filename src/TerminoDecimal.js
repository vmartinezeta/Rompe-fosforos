import { Digito } from "./Digito.js"

export function TerminoDecimal(game, context, cbColocarFosforo, cbDevolverFosforo, termino, origen) {
    Phaser.Group.call(this, game)
    this.game = game
    this.context = context
    this.cbColocarFosforo = cbColocarFosforo
    this.cbDevolverFosforo = cbDevolverFosforo
    this.origen = origen
    this.termino = termino
    this.actual = termino.newInstance()
    this.digitos = []

    this.pintar()
}

TerminoDecimal.prototype = Object.create(Phaser.Group.prototype)
TerminoDecimal.prototype.constructor = TerminoDecimal

TerminoDecimal.prototype.pintar = function () {
    this.digitos = []
    const PIXELES_SEPARACION = 130
    const origen = this.origen.newInstance()
    for (let poligono of this.termino.getPoligonos()) {
        const digito = new Digito(this.game, this.context, this.cbColocarFosforo, this.cbDevolverFosforo, origen, poligono)
        origen.setX(origen.getX() + PIXELES_SEPARACION)
        this.digitos.push(digito)
        this.add(digito)
    }
}

TerminoDecimal.prototype.getOrigen = function () {
    let separacion = 0
    for (let i=1;i<=this.digitos.length;i++) {
        separacion += this.PIXELES_SEPARACION
    }
    const origen = this.digitos[0].getOrigen().newInstance()
    origen.setX(origen.getX() - separacion)
    return origen
}

TerminoDecimal.prototype.habilitarOff = function () {
    for (const d of this.digitos) {
        d.habilitarOff()
    }
}

TerminoDecimal.prototype.habilitarOn = function () {
    for (const d of this.digitos) {
        d.habilitarOn()
    }
}

TerminoDecimal.prototype.update = function () {
    if (this.actual.toString() !== this.termino.toString()) {
        this.actual = this.termino.newInstance()
        this.removeAll()
        this.pintar()
    }
}

TerminoDecimal.prototype.deshabilitarTodo = function () {
    for(const d of this.digitos) {
        d.deshabilitarTodo()
    }
}