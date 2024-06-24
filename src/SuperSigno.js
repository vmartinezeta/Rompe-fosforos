import { TypeSigno } from "./main.js"

export function SuperSigno(game, signo, origen, cbColocar, cbDevolver, context) {
    Phaser.Group.call(this, game)
    this.signo = signo
    this.origen = origen.newInstance()
    this.cbColocar = cbColocar
    this.cbDevolver = cbDevolver
    this.context = context
    this.segmentoMovible = null
    this.movioSegmentoMovible = false
    this.ESCALA = 80/100

    switch (signo) {
        case TypeSigno.SUMAR:
            const segmentoEstatico = this.create(origen.getX(), origen.getY(), 'fosforo-horizontal')
            segmentoEstatico.anchor.set(.5)
            segmentoEstatico.scale.set(this.ESCALA)

            this.segmentoMovible = this.create(origen.getX(), origen.getY(), 'fosforo-vertical')
            this.segmentoMovible.anchor.set(.5)
            this.segmentoMovible.key = 1
            this.segmentoMovible.scale.set(this.ESCALA)
            this.segmentoMovible.inputEnabled = true
            this.segmentoMovible.events.onInputUp.add(this.devolverFosforo, this)
            break
        case TypeSigno.MULTIPLICAR:
            const segmento1 = this.create(origen.getX(), origen.getY(), 'fosforo-vertical')
            segmento1.anchor.set(.5)
            segmento1.angle = -45
            segmento1.scale.set(this.ESCALA)
            const segmento2 = this.create(origen.getX(), origen.getY(), 'fosforo-vertical')
            segmento2.anchor.set(.5)
            segmento2.angle = 45
            segmento2.scale.set(this.ESCALA)
            break
    }
}

SuperSigno.prototype = Object.create(Phaser.Group.prototype)
SuperSigno.prototype.constructor = SuperSigno


SuperSigno.prototype.getOrigen = function () {
    return this.origen
}

SuperSigno.prototype.desabilitar = function () {
    this.transmision = null
}

SuperSigno.prototype.devolverFosforo = function () {
    if (this.cbDevolver) {
        this.cbDevolver.call(this.context)
        this.movioSegmentoMovible = true
    }
}

SuperSigno.prototype.colocarFosforo = function () {
    if (this.cbColocar) {
        this.cbColocar.call(this.context)
        this.movioSegmentoMovible = true
    }
}

SuperSigno.prototype.update = function () {
    if (this.movioSegmentoMovible) {
        this.movioSegmentoMovible = false
        if (Boolean(this.segmentoMovible.key)) {
            this.segmentoMovible.destroy()
            this.segmentoMovible = this.create(this.origen.getX(), this.origen.getY(), 'fosforo-inactivo-vertical')
            this.segmentoMovible.key = 0

            this.segmentoMovible.scale.set(this.ESCALA)
            this.segmentoMovible.events.onInputUp.add(this.colocarFosforo, this)
        } else {
            this.segmentoMovible.destroy()
            this.segmentoMovible = this.create(this.origen.getX(), this.origen.getY(), 'fosforo-vertical')
            this.segmentoMovible.key = 1
            this.segmentoMovible.scale.set(this.ESCALA)
            this.segmentoMovible.events.onInputUp.add(this.devolverFosforo, this)
        }

        this.segmentoMovible.anchor.set(.5)
        this.segmentoMovible.inputEnabled = true
    }
}

SuperSigno.prototype.getSigno = function () {
    const segmentoMovibleActivo = this.segmentoMovible && Boolean(this.segmentoMovible.key)
    if (this.signo === TypeSigno.SUMAR && segmentoMovibleActivo) {
        return TypeSigno.SUMAR
    } else if (this.signo === TypeSigno.SUMAR && !segmentoMovibleActivo) {
        return TypeSigno.RESTAR
    } else {
        return this.signo
    }
}

SuperSigno.prototype.isTransformado = function() {
    return this.signo !== this.getSigno()
}