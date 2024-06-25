import { Digito } from "./Digito.js"
import { Poligono } from "./Poligono.js"
import { Punto } from "./Punto.js"
import { Requerimiento } from "./Requerimiento.js"
import { Signo } from "./Signo.js"
import { SuperSigno } from "./SuperSigno.js"
import { TransmisionFosforos } from "./Transmision.js"
import { Accion, TypeSigno } from "./main.js"

/* Autor: Ing. Víctor Martínez */
function Nivel(game, gameOptions) {
    Phaser.Group.call(this, game)
    this.game = game
    this.gameOptions = gameOptions
    this.reqActual = null
    this.reqEnJuego = null
    this.cartelCuentaRegresiva = null
    this.finalizoCuentaRegresiva = true
    this.cartelAprobacion = null
    this.transmision = new TransmisionFosforos(game, new Punto(50, 50))
    this.terminos = []

    this.termino1 = null
    this.termino2 = null
    this.termino3 = null
    this.signoOperacion = null
    this.nivelAprobado = false
    this.signoIgual = null
    this.rotuloDesafio = null
    this.finalizacion = false
    this.cantidadFosforos = 0
    this.finCuentaRegresiva = false
    this.FPMS = 100
    this.tiempo = 0
    this.tiempoInicio = null
    this.rotuloTemporizador = null
    this.estadoActual = []
    this.render = false
    this.cuentaRegresiva = [
        '1-seg',
        '2-seg',
        '3-seg'
    ]
}

Nivel.prototype = Object.create(Phaser.Group.prototype)
Nivel.prototype.constructor = Nivel

Nivel.prototype.destruir = function () {
    this.termino1.destruir()
    this.termino2.destruir()
    this.termino3.destruir()
    this.signoOperacion.destroy()
    this.signoIgual.destroy()
    this.transmision.destroy()
    this.rotuloDesafio.destroy()
    this.rotuloTemporizador.destroy()
    this.destroy()
    this.cartelAprobacion.destroy()
}

Nivel.prototype.isAtEnd = function () {
    return this.finalizacion
}

Nivel.prototype.aproboNivel = function () {
    return this.nivelAprobado
}

Nivel.prototype.incluirDecena = function (valor) {
    return valor < 10 ? `0${valor}` : valor
}

Nivel.prototype.formatear = function (date) {
    return `${this.incluirDecena(date.getUTCHours())}:${this.incluirDecena(date.getUTCMinutes())}:${this.incluirDecena(date.getUTCSeconds())}`
}

Nivel.prototype.updateTemporizador = function () {
    const hoy = new Date()
    hoy.setTime(hoy - this.tiempoInicio)
    this.rotuloTemporizador.setText(this.formatear(hoy))
}

Nivel.prototype.update = function () {
    this.tiempo += this.game.time.elapsed
    if (this.tiempo > this.FPMS) {
        this.tiempo = 0
        if (!this.finalizacion && (this.finCuentaRegresiva || !(this instanceof Nivel1))) {
            this.updateTemporizador()
        }
    }

    if (!this.finCuentaRegresiva) {
        if (this.finalizoCuentaRegresiva) {
            this.finCuentaRegresiva = true
            this.tiempoInicio = new Date()
        }
    }

    if (!this.reqEnJuego) {
        this.reqEnJuego = this.reqActual.newInstance().reset()
        this.estadoActual = this.terminos.map(t => t.newInstance())
    }

    if (!this.finalizacion && this.finCuentaRegresiva) {

        
        if (this.isRenderable()) {
            this.estadoActual = this.terminos.map(t => t.newInstance())
            this.verificarSolucion()
            this.loadExpresion()

            if (this.reqEnJuego.isNoMover()) {
                this.reqEnJuego.cantidad++
            }

            if (this.reqActual.completado(this.reqEnJuego)) {
                this.finalizacion = true
                this.deshabilitarExpresion()
                this.transmision = null
            }
        }


        if (this.nivelAprobado) {
            this.finalizacion = true
            this.cartelAprobacion = this.create(0.5 * this.gameOptions.ANCHO, 500, 'aprobado')
            this.cartelAprobacion.anchor.set(0.5)
        }
    }
}

Nivel.prototype.verificarSolucion = function () {
    const signo = this.signoOperacion.getSigno()
    const [primero, segundo, tercero] = this.terminos
    switch (signo) {
        case TypeSigno.SUMAR:
            this.nivelAprobado = primero.toNumber() + segundo.toNumber() === tercero.toNumber() && tercero.toNumber() !== Infinity
            break
        case TypeSigno.RESTAR:
            this.nivelAprobado = primero.toNumber() - segundo.toNumber() === tercero.toNumber() && tercero.toNumber() !== Infinity
            break
        case TypeSigno.MULTIPLICAR:
            this.nivelAprobado = primero.toNumber() * segundo.toNumber() === tercero.toNumber() && tercero.toNumber() !== Infinity
            break
        case TypeSigno.DIVIDIR:
            this.nivelAprobado = primero.toNumber() / segundo.toNumber() === tercero.toNumber() && tercero.toNumber() !== Infinity
            console.log(primero.toNumber(), segundo.toNumber(), tercero.toNumber())
            break
    }
}

Nivel.prototype.startCuentaRegresiva = function () {
    this.finCuentaRegresiva = false
    this.updateCuentaRegresiva()
}

Nivel.prototype.updateCuentaRegresiva = function () {
    const nombre = this.cuentaRegresiva.pop()
    if (this.cartelCuentaRegresiva) {
        this.cartelCuentaRegresiva.kill()
    }
    if (!nombre) {
        this.finalizoCuentaRegresiva = true
        return
    }
    this.cartelCuentaRegresiva = this.create(0, 0.5 * this.gameOptions.ALTURA, nombre)
    this.cartelCuentaRegresiva.x = 0.5 * (this.gameOptions.ANCHO - this.cartelCuentaRegresiva.width)
    this.cartelCuentaRegresiva.anchor.set(0, 0.5)
    this.game.time.events.add(1e3, this.startCuentaRegresiva, this)
}

Nivel.prototype.isRenderable = function () {
    for (let i = 0; i < this.terminos.length; i++) {
        if (this.terminos[i].toString() !== this.estadoActual[i].toString()) {
            return true
        }
    }
    return false
}

Nivel.prototype.loadExpresion = function () {
    this.termino1.update()
    this.termino2.update()
    this.termino3.update()
    if (this.reqActual.isAgregar()) {
        this.termino1.habilitarOff()
        this.termino2.habilitarOff()
        this.termino3.habilitarOff()
    } else if (this.reqActual.isQuitar()) {
        this.termino1.habilitarOn()
        this.termino2.habilitarOn()
        this.termino3.habilitarOn()
    } else if (this.reqEnJuego.isMover()) {
        this.termino1.habilitarTodo()
        this.termino2.habilitarTodo()
        this.termino3.habilitarTodo()
    }
}

Nivel.prototype.deshabilitarExpresion = function () {
    this.termino1.deshabilitarTodo()
    this.termino2.deshabilitarTodo()
    this.termino3.deshabilitarTodo()
}

Nivel.prototype.updateMove = function () {
    if (this.reqEnJuego.isMover()) {
        this.reqEnJuego.cantidad++
    }
}




export function Nivel1(game, gameOptions) {
    Nivel.call(this, game)
    this.game = game
    this.gameOptions = gameOptions

    this.reqActual = new Requerimiento(Accion.AGREGAR, 1)

    this.terminos.push(
        new Poligono(true, true, false, true, true, false, false)
    )

    this.terminos.push(
        new Poligono(true, true, false, true, true, false, false)
    )

    this.terminos.push(
        new Poligono(true, true, true, true, true, true, false),
    )


    this.rotuloTemporizador = this.game.add.text(50, 25, `00:00:00`)
    this.rotuloTemporizador.font = "Arial Black"
    this.rotuloTemporizador.fontSize = 24
    this.rotuloTemporizador.fill = "#000"
    this.rotuloTemporizador.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 2)

    this.rotuloDesafio = this.game.add.text(0.5 * this.gameOptions.ANCHO, 75, "Agregar un 1 fósforo para corregir la ecuación.")
    this.rotuloDesafio.anchor.set(.5)
    this.rotuloDesafio.font = "sans-serif"
    this.rotuloDesafio.fontSize = 32
    this.rotuloDesafio.fill = "#000"
    this.rotuloDesafio.fontWeight = "italic"
    this.rotuloDesafio.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 3)


    this.termino1 = new Digito(game, this, this.colocarFosforo, null, new Punto(50, 200), this.terminos[0])
    this.termino1.habilitarOff()

    this.signoOperacion = new SuperSigno(game, TypeSigno.SUMAR, new Punto(270, 300))

    this.termino2 = new Digito(game, this, this.colocarFosforo, null, new Punto(350, 200), this.terminos[1])
    this.termino2.habilitarOff()

    new Signo(game, TypeSigno.IGUAL, new Punto(540, 270))

    this.termino3 = new Digito(game, this, this.colocarFosforo, null, new Punto(730, 200), this.terminos[2])
    this.termino3.habilitarOff()
}

Nivel1.prototype = Object.create(Nivel.prototype)
Nivel1.prototype.constructor = Nivel1

Nivel1.prototype.colocarFosforo = function () {
    if (!this.transmision) return
    this.transmision.agregarFosforo()
}





export function Nivel2(game, gameOptions) {
    Nivel.call(this, game)
    this.gameOptions = gameOptions

    this.reqActual = new Requerimiento(Accion.AGREGAR, 2)

    this.terminos.push(
        new Poligono(true, true, true, true, true, true, false)
    )

    this.terminos.push(
        new Poligono(true, false, true, true, false, true, true)
    )

    this.terminos.push(
        new Poligono(true, true, true, false, true, true, false)
    )


    this.tiempoInicio = new Date()
    this.rotuloTemporizador = this.game.add.text(50, 25, `00:00:00`)
    this.rotuloTemporizador.font = "Arial Black"
    this.rotuloTemporizador.fontSize = 24
    this.rotuloTemporizador.fill = "#000"
    this.rotuloTemporizador.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 2)

    this.rotuloDesafio = this.game.add.text(0.5 * this.gameOptions.ANCHO, 75, "Agregar 2 fósforos para corregir la ecuación.")
    this.rotuloDesafio.anchor.set(.5)
    this.rotuloDesafio.font = "sans-serif"
    this.rotuloDesafio.fontSize = 32
    this.rotuloDesafio.fill = "#000"
    this.rotuloDesafio.fontWeight = "italic"
    this.rotuloDesafio.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 3)

    this.transmision.agregarFosforo()
    this.transmision.agregarFosforo()


    this.termino1 = new Digito(game, this, this.colocarFosforo, null, new Punto(50, 200), this.terminos[0])
    this.termino1.habilitarOff()

    this.signoOperacion = new Signo(game, TypeSigno.RESTAR, new Punto(270, 300))

    this.termino2 = new Digito(game, this, this.colocarFosforo, null, new Punto(450, 200), this.terminos[1])
    this.termino2.habilitarOff()

    new Signo(game, TypeSigno.IGUAL, new Punto(650, 270))

    this.termino3 = new Digito(game, this, this.colocarFosforo, null, new Punto(850, 200), this.terminos[2])
    this.termino3.habilitarOff()
}

Nivel2.prototype = Object.create(Nivel.prototype)
Nivel2.prototype.constructor = Nivel2


Nivel2.prototype.colocarFosforo = function () {
    this.transmision.quitarFosforo()
}





export function Nivel3(game, gameOptions) {
    Nivel.call(this, game)
    this.gameOptions = gameOptions

    this.reqActual = new Requerimiento(Accion.QUITAR, 2)

    this.terminos.push(
        new Poligono(false, false, false, true, true, false, false)
    )

    this.terminos.push(
        new Poligono(false, false, false, true, true, false, false)
    )

    this.terminos.push(
        new Poligono(true, true, true, true, true, true, true)
    )


    this.tiempoInicio = new Date()
    this.rotuloTemporizador = this.game.add.text(50, 25, `00:00:00`)
    this.rotuloTemporizador.font = "Arial Black"
    this.rotuloTemporizador.fontSize = 24
    this.rotuloTemporizador.fill = "#000"
    this.rotuloTemporizador.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 2)

    this.rotuloDesafio = this.game.add.text(0.5 * this.gameOptions.ANCHO, 75, "Elimina 2 fósforos para corregir la ecuación.")
    this.rotuloDesafio.anchor.set(.5)
    this.rotuloDesafio.font = "sans-serif"
    this.rotuloDesafio.fontSize = 32
    this.rotuloDesafio.fill = "#000"
    this.rotuloDesafio.fontWeight = "italic"
    this.rotuloDesafio.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 3)

    this.termino1 = new Digito(game, this, null, this.colocarFosforo, new Punto(50, 200), this.terminos[0])
    this.termino1.habilitarOn()

    this.signoOperacion = new SuperSigno(game, TypeSigno.SUMAR, new Punto(310, 300), this.colocarEnSigno, this.quitarDelSigno, this)

    this.termino2 = new Digito(game, this, null, this.colocarFosforo, new Punto(450, 200), this.terminos[1])
    this.termino2.habilitarOn()

    new Signo(game, TypeSigno.IGUAL, new Punto(650, 270))

    this.termino3 = new Digito(game, this, null, this.colocarFosforo, new Punto(850, 200), this.terminos[2])
    this.termino3.habilitarOn()
}

Nivel3.prototype = Object.create(Nivel.prototype)
Nivel3.prototype.constructor = Nivel3

Nivel3.prototype.colocarEnSigno = function () {
    this.transmision.quitarFosforo()
}

Nivel3.prototype.quitarDelSigno = function () {
    this.transmision.agregarFosforo()
}

Nivel3.prototype.colocarFosforo = function () {
    this.transmision.agregarFosforo()
}





export function Nivel4(game, gameOptions) {
    Nivel.call(this, game)
    this.gameOptions = gameOptions

    this.reqActual = new Requerimiento(Accion.MOVER, 2)

    this.terminos.push(
        new Poligono(true, true, true, false, true, true, false),
    )

    this.terminos.push(
        new Poligono(true, true, true, false, true, true, false),
    )

    this.terminos.push(
        new Poligono(true, true, true, true, true, true, false),
    )


    this.tiempoInicio = new Date()
    this.rotuloTemporizador = this.game.add.text(50, 25, `00:00:00`)
    this.rotuloTemporizador.font = "Arial Black"
    this.rotuloTemporizador.fontSize = 24
    this.rotuloTemporizador.fill = "#000"
    this.rotuloTemporizador.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 2)

    this.rotuloDesafio = this.game.add.text(0.5 * this.gameOptions.ANCHO, 75, "Mover 2 fósforo para corregir la ecuación.")
    this.rotuloDesafio.anchor.set(.5)
    this.rotuloDesafio.font = "sans-serif"
    this.rotuloDesafio.fontSize = 32
    this.rotuloDesafio.fill = "#000"
    this.rotuloDesafio.fontWeight = "italic"
    this.rotuloDesafio.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 3)

    this.termino1 = new Digito(game, this, this.colocarFosforo, this.devolverFosforo, new Punto(50, 200), this.terminos[0])
    this.termino1.habilitarOn()

    this.signoOperacion = new Signo(game, TypeSigno.RESTAR, new Punto(310, 300))

    this.termino2 = new Digito(game, this, this.colocarFosforo, this.devolverFosforo, new Punto(450, 200), this.terminos[1])
    this.termino2.habilitarOn()

    new Signo(game, TypeSigno.IGUAL, new Punto(650, 270))

    this.termino3 = new Digito(game, this, this.colocarFosforo, this.devolverFosforo, new Punto(850, 200), this.terminos[2])
    this.termino3.habilitarOn()
}

Nivel4.prototype = Object.create(Nivel.prototype)
Nivel4.prototype.constructor = Nivel4

Nivel4.prototype.colocarFosforo = function () {
    this.updateMove()
    this.transmision.quitarFosforo()
}

Nivel4.prototype.devolverFosforo = function () {
    this.transmision.agregarFosforo()
}






export function Nivel5(game, gameOptions) {
    Nivel.call(this, game)
    this.gameOptions = gameOptions

    this.reqActual = new Requerimiento(Accion.MOVER, 1)

    this.terminos.push(
        new Poligono(true, true, true, false, true, true, false)        
    )

    this.terminos.push(
        new Poligono(false, false, false, true, true, false, false)
    )

    this.terminos.push(
        new Poligono(true, false, true, true, true, true, false)
    )


    this.tiempoInicio = new Date()
    this.rotuloTemporizador = this.game.add.text(50, 25, `00:00:00`)
    this.rotuloTemporizador.font = "Arial Black"
    this.rotuloTemporizador.fontSize = 24
    this.rotuloTemporizador.fill = "#000"
    this.rotuloTemporizador.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 2)

    this.rotuloDesafio = this.game.add.text(0.5 * this.gameOptions.ANCHO, 75, "Mover 1 fósforo para corregir la ecuación.")
    this.rotuloDesafio.anchor.set(.5)
    this.rotuloDesafio.font = "sans-serif"
    this.rotuloDesafio.fontSize = 32
    this.rotuloDesafio.fill = "#000"
    this.rotuloDesafio.fontWeight = "italic"
    this.rotuloDesafio.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 3)

    this.termino1 = new Digito(game, this, this.colocarFosforo, this.devolverFosforo, new Punto(50, 200), this.terminos[0])
    this.termino1.habilitarOn()

    this.signoOperacion = new Signo(game, TypeSigno.DIVIDIR, new Punto(310, 300))

    this.termino2 = new Digito(game, this, this.colocarFosforo, this.devolverFosforo, new Punto(450, 200), this.terminos[1])
    this.termino2.habilitarOn()

    new Signo(game, TypeSigno.IGUAL, new Punto(650, 270))

    this.termino3 = new Digito(game, this, this.colocarFosforo, this.devolverFosforo, new Punto(850, 200), this.terminos[2])
    this.termino3.habilitarOn()
}

Nivel5.prototype = Object.create(Nivel.prototype)
Nivel5.prototype.constructor = Nivel5

Nivel5.prototype.colocarFosforo = function () {
    this.updateMove()
    this.transmision.quitarFosforo()
}

Nivel5.prototype.devolverFosforo = function () {
    this.transmision.agregarFosforo()
}