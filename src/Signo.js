import { TypeSigno } from "./main.js"

export function Signo(game, signo, origen) {
    Phaser.Group.call(this, game)
    this.signo = signo
    this.origen = origen
    if (signo === TypeSigno.IGUAL) {
        this.crearIgual()
    } else if (signo === TypeSigno.RESTAR) {
        this.crearRestar()
    } else if (signo === TypeSigno.DIVIDIR) {
        this.crearDividir()
    }
}

Signo.prototype = Object.create(Phaser.Group.prototype)
Signo.prototype.constructor = Signo


Signo.prototype.getSigno = function() {
    return this.signo
}


Signo.prototype.crearIgual = function() {
    const SEPARACION_EN_PX = 30
    const arriba = this.create(this.origen.getX(), this.origen.getY(), 'fosforo-horizontal')
    arriba.scale.set(80 / 100)
    const abajo = this.create(this.origen.getX(), this.origen.getY() + SEPARACION_EN_PX, 'fosforo-horizontal')
    abajo.scale.set(80 / 100)
}

Signo.prototype.crearRestar = function() {
    const menos = this.create(this.origen.getX(), this.origen.getY(), 'fosforo-horizontal')
    menos.scale.set(80/100)
}

Signo.prototype.crearDividir = function () {
    const segmento = this.create(this.origen.getX(), this.origen.getY(), 'fosforo-vertical')
    segmento.anchor.set(50/100)
    segmento.angle = 45
    segmento.scale.set(80/100)
}