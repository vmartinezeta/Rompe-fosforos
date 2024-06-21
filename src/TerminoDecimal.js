import { Digito } from "./Digito.js"

export function TerminoDecimal(game, transmision, cbColocarFosforo, cbDevolverFosforo, termino, coordenada) {
    Phaser.Group.call(this, game)
    this.digitos = []
    this.PIXELES_SEPARACION = 130
    const origen = coordenada.newInstance()
    this.poligonos = termino.getPoligonos()
    for (let poligono of this.poligonos) {
        const digito = new Digito(game, transmision, cbColocarFosforo, cbDevolverFosforo, origen, poligono)
        origen.setX(origen.getX() + this.PIXELES_SEPARACION)
        this.digitos.push(digito)
    }
}

TerminoDecimal.prototype = Object.create(Phaser.Group.prototype)
TerminoDecimal.prototype.constructor = TerminoDecimal

TerminoDecimal.prototype.destruir = function () {
    for (let digito of this.digitos) {
        digito.destroy()
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

TerminoDecimal.prototype.deshabilitarTodos = function () {
    for (let c of this.digitos) {
        c.deshabilitarTodos()
    }
}

TerminoDecimal.prototype.habilitar = function (cifra, poligono) {
    const d = this.digitos[cifra]
    d.habilitar(poligono)
}

TerminoDecimal.prototype.habilitarTodo = function () {
    for(let i=0;i<this.poligonos.length;i++) {
        const p = this.poligonos[i]
        this.habilitar(i, p)
    }
}

TerminoDecimal.prototype.habilitarPoligonos = function (poligonos) {
    for(let i=0;i<poligonos.length;i++) {
        const p = poligonos[i]
        this.habilitar(i, p)
    }
}