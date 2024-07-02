import { Punto } from "./Punto.js"
import { Segmento } from "./main.js"

export function Digito(game, context, cbColocarFosforo, cbDevolverFosforo, origen, poligono) {
    Phaser.Group.call(this, game)
    this.game = game
    this.context = context
    this.poligono = poligono
    this.actual = poligono.newInstance()
    this.cbColocarFosforo = cbColocarFosforo
    this.cbDevolverFosforo = cbDevolverFosforo
    this.origen = origen

    this.draw()
}

Digito.prototype = Object.create(Phaser.Group.prototype)
Digito.prototype.constructor = Digito


Digito.prototype.draw = function () {
    const escala = 0.80
    const LARGO_FOSFORO = 115 * escala
    const ANCHO_FOSFORO = 25 * escala
    const { x, y } = this.origen
    const coordenadas = [
        new Punto(x + ANCHO_FOSFORO, y + LARGO_FOSFORO),
        new Punto(x, y),
        new Punto(x + ANCHO_FOSFORO, y - ANCHO_FOSFORO),
        new Punto(x + LARGO_FOSFORO + ANCHO_FOSFORO, y),
        new Punto(x + LARGO_FOSFORO + ANCHO_FOSFORO, y + LARGO_FOSFORO + ANCHO_FOSFORO),
        new Punto(x + ANCHO_FOSFORO, y + 2 * LARGO_FOSFORO + ANCHO_FOSFORO),
        new Punto(x, y + LARGO_FOSFORO + ANCHO_FOSFORO)
    ]
    for (let i = 0; i < Segmento.toArray().length; i++) {
        const key = Segmento.toArray()[i]
        const { x, y } = coordenadas[i]
        const nombre = this.getEstadoSegmento(this.poligono, key)
        const lado = this.create(x, y, nombre)
        lado.key = key
        lado.anchor.set(0)
        lado.scale.set(escala)
        lado.inputEnabled = false
        if (this.poligono[`isOn${key}`]()&&this.cbDevolverFosforo) {
            lado.events.onInputUp.add(this.devolverFosforo, this)
        } else if (!this.poligono[`isOn${key}`]()&&this.cbColocarFosforo){
            lado.events.onInputUp.add(this.colocarFosforo, this)
        }
    }
    
}

Digito.prototype.getEstadoSegmento = function (poligono, key) {
    if (Segmento.getHorizontales().includes(key)) {
        return poligono[`isOn${key}`]() ? 'fosforo-horizontal' : 'fosforo-inactivo-horizontal'
    } else if (Segmento.getVerticales().includes(key)) {
        return poligono[`isOn${key}`]() ? 'fosforo-vertical' : 'fosforo-inactivo-vertical'
    }
    throw new TypeError()
}

Digito.prototype.setForma = function (poligono) {
    this.poligono = poligono
}

Digito.prototype.powerOff = function() {
    for(let i=0;i<Segmento.toArray().length;i++) {
        const key = Segmento.toArray()[i]
        this.poligono[`set${key}`](false)
    }
}

Digito.prototype.getOrigen = function () {
    return this.origen
}

Digito.prototype.deshabilitarTodo = function () {
    for (const key of Segmento.toArray()) {
        const lado = this.iterate('key', key, Phaser.Group.RETURN_CHILD)
        lado.inputEnabled = false        
    }
}

Digito.prototype.habilitarOn = function () {
    for (let key of Segmento.toArray()) {
        if (this.poligono[`isOn${key}`]()) {
            const lado = this.iterate('key', key, Phaser.Group.RETURN_CHILD)
            lado.inputEnabled = true
        }
    }
}

Digito.prototype.habilitarOff = function () {
    for (let key of Segmento.toArray()) {
        if (!this.poligono[`isOn${key}`]()) {
            const lado = this.iterate('key', key, Phaser.Group.RETURN_CHILD)
            lado.inputEnabled = true
        }
    }
}

Digito.prototype.getOnAll = function () {
    const segmentos = []
    for (let key of Segmento.toArray()) {
        if (this.poligono[`isOn${key}`]()) {
            const lado = this.iterate('key', key, Phaser.Group.RETURN_CHILD)
            segmentos.push(lado)
        }
    }
    return segmentos
}

Digito.prototype.habilitarTodo = function() {
    for (const key of Segmento.toArray()) {
        const lado = this.iterate('key', key, Phaser.Group.RETURN_CHILD)
        lado.inputEnabled = true       
    }     
}

Digito.prototype.colocarFosforo = function (segmento) {
    for (let key of Segmento.toArray()) {
        if (segmento.key === key) {
            this.poligono[`set${key}`](true)
            break
        }
    }
    this.cbColocarFosforo.call(this.context)
}

Digito.prototype.devolverFosforo = function (segmento) {
    for (let key of Segmento.toArray()) {
        if (segmento.key === key) {
            this.poligono[`set${key}`](false)
            break
        }
    }
    this.cbDevolverFosforo.call(this.context)
}

Digito.prototype.update = function () {
    if (this.poligono.toString() !== this.actual.toString()) {                
        this.actual = this.poligono.newInstance()
        this.removeAll()
        this.draw()
    }
}