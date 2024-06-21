import { Punto } from "./Punto.js"
import { Segmento } from "./main.js"

export function Digito(game, transmision, cbColocarFosforo, cbDevolverFosforo, origen, poligono) {
    Phaser.Group.call(this, game)
    this.poligono = poligono
    this.transmision = transmision
    this.cbColocarFosforo = cbColocarFosforo
    this.cbDevolverFosforo = cbDevolverFosforo
    this.origen = origen
    const escala = 0.80
    const LARGO_FOSFORO = 115 * escala
    const ANCHO_FOSFORO = 25 * escala
    const {x, y} = origen
    const coordenadas = [
        new Punto(x + ANCHO_FOSFORO, y + LARGO_FOSFORO),
        new Punto(x, y),
        new Punto(x + ANCHO_FOSFORO, y - ANCHO_FOSFORO),
        new Punto(x + LARGO_FOSFORO + ANCHO_FOSFORO, y),
        new Punto(x + LARGO_FOSFORO + ANCHO_FOSFORO, y + LARGO_FOSFORO + ANCHO_FOSFORO),
        new Punto(x + ANCHO_FOSFORO, y + 2*LARGO_FOSFORO + ANCHO_FOSFORO),
        new Punto(x, y + LARGO_FOSFORO + ANCHO_FOSFORO)
    ]


    for(let i=0;i<Segmento.toArray().length;i++) {
        const key = Segmento.toArray()[i]
        const {x, y} = coordenadas[i]
        const nombre = this.getEstadoSegmento(poligono, key)
        const lado = this.create(x, y, nombre)
        lado.key = key
        lado.anchor.set(0)
        lado.scale.set(escala)
        if (poligono[`isOn${key}`]()) {
            lado.events.onInputUp.add(this.devolverFosforo, this)
        } else {
            lado.events.onInputUp.add(this.colocarFosforo, this)
        }
    }
}

Digito.prototype = Object.create(Phaser.Group.prototype)
Digito.prototype.constructor = Digito

Digito.prototype.getEstadoSegmento = function (poligono, key) {
    if (Segmento.getHorizontales().includes(key)) {
        return poligono[`isOn${key}`]() ? 'fosforo-horizontal' : 'fosforo-inactivo-horizontal'
    } else if (Segmento.getVerticales().includes(key)) {
        return poligono[`isOn${key}`]() ? 'fosforo-vertical' : 'fosforo-inactivo-vertical'
    }
    throw new TypeError
}

Digito.prototype.getOrigen = function () {
    return this.origen
}

Digito.prototype.deshabilitarTodos = function () {
    this.setAll('inputEnabled', false)
}

Digito.prototype.colocarFosforo = function (segmento) {
    if (this.cbColocarFosforo === null) return
    const fosforo = this.transmision.getAt(this.transmision.countLiving()-1)
    this.cbColocarFosforo.call(this.transmision, fosforo)
    for (let key of Segmento.toArray()) {
        if (segmento.key === key) {
            this.poligono[`set${key}`](true)
            break
        }
    }
}

Digito.prototype.habilitar = function (poligono) {
    for (let key of Segmento.toArray()) {
        if (poligono[`isOn${key}`]()) {
            const lado = this.iterate('key', key, Phaser.Group.RETURN_CHILD)
            lado.inputEnabled = true
        }
    }
}

Digito.prototype.devolverFosforo = function (segmento) {
    if (this.cbDevolverFosforo === null) return
    for (let key of Segmento.toArray()) {
        if (segmento.key === key) {
            this.poligono[`set${key}`](false)
            break
        }
    }
    this.cbDevolverFosforo.call(this.transmision)
}