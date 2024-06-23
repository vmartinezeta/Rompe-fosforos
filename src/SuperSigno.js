import { OperacionMatematica } from "./main.js"

export function SignoOperacion(game, signo, origen) {
    Phaser.Group.call(this, game)
    this.signo = signo
    this.origen = origen.newInstance()
    this.segmentoMovible = null
    this.movioSegmentoMovible = false
    this.ESCALA = 0.80
    switch (signo) {
        case OperacionMatematica.MAS:
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
        case OperacionMatematica.MENOS:
            const menos = this.create(origen.getX(), origen.getY(), 'fosforo-horizontal')
            menos.scale.set(this.ESCALA)
            if (this.segmentoMovible !== null) {
                menos.anchor.set(.5)
            }
            break
        case OperacionMatematica.ASTERISCO:
            const segmento1 = this.create(origen.getX(), origen.getY(), 'fosforo-vertical')
            segmento1.anchor.set(.5)
            segmento1.angle = -45
            segmento1.scale.set(this.ESCALA)
            const segmento2 = this.create(origen.getX(), origen.getY(), 'fosforo-vertical')
            segmento2.anchor.set(.5)
            segmento2.angle = 45
            segmento2.scale.set(this.ESCALA)
            break
        case OperacionMatematica.PLECA:
            const segmento = this.create(origen.getX(), origen.getY(), 'fosforo-vertical')
            segmento.anchor.set(.5)
            segmento.angle = 45
            segmento.scale.set(this.ESCALA)
            break
    }
}

SignoOperacion.prototype = Object.create(Phaser.Group.prototype)
SignoOperacion.prototype.constructor = SignoOperacion

SignoOperacion.prototype.getOrigen = function () {
    return this.origen
}

SignoOperacion.prototype.desabilitar = function () {
    this.transmision = null
}

SignoOperacion.prototype.devolverFosforo = function () {
    this.movioSegmentoMovible = true
}

SignoOperacion.prototype.colocarFosforo = function () {
    this.movioSegmentoMovible = true
}

SignoOperacion.prototype.update = function () {
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

SignoOperacion.prototype.getSigno = function () {
    const segmentoMovibleActivo = this.segmentoMovible !== null && Boolean(this.segmentoMovible.key)
    if (this.signo === OperacionMatematica.MAS && segmentoMovibleActivo) {
        return OperacionMatematica.MAS
    } else if (this.signo === OperacionMatematica.MAS && !segmentoMovibleActivo) {
        return OperacionMatematica.MENOS
    } else {
        return this.signo
    }
}

SignoOperacion.prototype.isTransformado = function() {
    return this.signo !== this.getSigno()
}