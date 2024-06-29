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

    this.draw()
}

TerminoDecimal.prototype = Object.create(Phaser.Group.prototype)
TerminoDecimal.prototype.constructor = TerminoDecimal

TerminoDecimal.prototype.draw = function () {
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

TerminoDecimal.prototype.updateRender = function () {
    if (this.actual.toString() !== this.termino.toString()) {
        this.actual = this.termino.newInstance()
        this.removeAll()
        this.draw()
    }
}

TerminoDecimal.prototype.deshabilitarTodo = function () {
    for(const d of this.digitos) {
        d.deshabilitarTodo()
    }
}