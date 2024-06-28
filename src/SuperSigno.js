import { TypeSigno } from "./main.js"

export function SuperSigno(game, signo, origen, cbColocar, cbDevolver, context) {
    Phaser.Group.call(this, game)
    this.signo = signo
    this.default = signo
    this.origen = origen.newInstance()
    this.cbColocar = cbColocar
    this.cbDevolver = cbDevolver
    this.context = context
    this.movible = null
    this.estatico = null
    this.render = false
    this.ESCALA_EN_PORCENTAJE = 80

    if (signo === TypeSigno.SUMAR) {
        this.drawSignoMas()
    } else if (signo === TypeSigno.MULTIPLICAR) {
        this.drawSignoPor()
    }
}

SuperSigno.prototype = Object.create(Phaser.Group.prototype)
SuperSigno.prototype.constructor = SuperSigno


SuperSigno.prototype.drawSignoPor = function () {
    if (this.estatico && this.signo === TypeSigno.MULTIPLICAR) {
        this.signo = TypeSigno.DIVIDIR
    } else {
        this.signo = TypeSigno.MULTIPLICAR
    }

    if (!this.estatico) {
        this.estatico = this.create(this.origen.getX(), this.origen.getY(), 'fosforo-vertical')
        this.estatico.anchor.set(50 / 100)
        this.estatico.angle = 45
        this.estatico.scale.set(this.ESCALA_EN_PORCENTAJE / 100)
    }

    if (this.movible) this.movible.destroy()
    const nombre = this.signo === TypeSigno.MULTIPLICAR ? "fosforo-vertical" : "fosforo-inactivo-vertical"
    this.movible = this.create(this.origen.getX(), this.origen.getY(), nombre)
    this.movible.anchor.set(50 / 100)
    this.movible.angle = -45
    this.movible.scale.set(this.ESCALA_EN_PORCENTAJE / 100)
    this.movible.inputEnabled = true

    if (this.signo === TypeSigno.MULTIPLICAR) {
        this.movible.events.onInputUp.add(this.devolverFosforo, this)
    } else {
        this.movible.events.onInputUp.add(this.colocarFosforo, this)
    }
}

SuperSigno.prototype.drawSignoMas = function () {
    if (this.estatico && this.signo === TypeSigno.SUMAR) {
        this.signo = TypeSigno.RESTAR
    } else {
        this.signo = TypeSigno.SUMAR
    }
    if (!this.estatico) {
        this.estatico = this.create(this.origen.getX(), this.origen.getY(), 'fosforo-horizontal')
        this.estatico.anchor.set(50 / 100)
        this.estatico.scale.set(this.ESCALA_EN_PORCENTAJE / 100)
    }

    if (this.movible) this.movible.destroy()
    const nombre = this.signo === TypeSigno.SUMAR ? "fosforo-vertical" : "fosforo-inactivo-vertical"
    this.movible = this.create(this.origen.getX(), this.origen.getY(), nombre)
    this.movible.anchor.set(50 / 100)
    this.movible.scale.set(this.ESCALA_EN_PORCENTAJE / 100)
    this.movible.inputEnabled = true
    if (this.signo === TypeSigno.SUMAR) {
        this.movible.events.onInputUp.add(this.devolverFosforo, this)
    } else {
        this.movible.events.onInputUp.add(this.colocarFosforo, this)
    }
}

SuperSigno.prototype.desabilitar = function () {
    this.movible.inputEnabled = false
}

SuperSigno.prototype.devolverFosforo = function () {
    if (this.cbDevolver) {
        this.cbDevolver.call(this.context)
        this.render = true
        if (this.default === TypeSigno.SUMAR) {
            this.drawSignoMas()
        } else {
            this.drawSignoPor()
        }
    }
}

SuperSigno.prototype.colocarFosforo = function () {
    if (this.cbColocar) {
        this.cbColocar.call(this.context)
        this.render = true
        if (this.default === TypeSigno.SUMAR) {
            this.drawSignoMas()
        } else {
            this.drawSignoPor()
        }
    }
}

SuperSigno.prototype.getSigno = function () {
    return this.signo
}

SuperSigno.prototype.isTransformado = function () {
    return this.render
}

SuperSigno.prototype.updateRender = function () {
    this.render = false
}