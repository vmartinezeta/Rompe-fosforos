import { Poligono } from "./Poligono.js"
import { Punto } from "./Punto.js"
import { Requerimiento } from "./Requerimiento.js"
import { SignoIgual } from "./Signo.js"
import { SignoOperacion } from "./SuperSigno.js"
import { Termino } from "./Termino.js"
import { TerminoDecimal } from "./TerminoDecimal.js"
import { TransmisionFosforos } from "./Transmision.js"
import { Accion, OperacionMatematica } from "./main.js"

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

            this.deshabilitarExpresion()            
        }
    }
}

Nivel.prototype.verificarSolucion = function () {
    const signo = this.signoOperacion.getSigno()
    const [primero, segundo, tercero] = this.terminos
    switch (signo) {
        case OperacionMatematica.MAS:
            this.nivelAprobado = primero.toNumber() + segundo.toNumber() === tercero.toNumber() && tercero.toNumber() !== Infinity
            break
        case OperacionMatematica.MENOS:
            this.nivelAprobado = primero.toNumber() - segundo.toNumber() === tercero.toNumber() && tercero.toNumber() !== Infinity
            break
        case OperacionMatematica.ASTERISCO:
            this.nivelAprobado = primero.toNumber() * segundo.toNumber() === tercero.toNumber() && tercero.toNumber() !== Infinity
            break
        case OperacionMatematica.PLECA:
            this.nivelAprobado = primero.toNumber() / segundo.toNumber() === tercero.toNumber() && tercero.toNumber() !== Infinity
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
    this.termino1.habilitarOn()
    this.termino2.habilitarOn()
    this.termino3.habilitarOn()
}

Nivel.prototype.deshabilitarExpresion = function () {
    this.termino1.deshabilitarTodo()
    this.termino2.deshabilitarTodo()    
    this.termino3.deshabilitarTodo()
}





export function Nivel1(game, gameOptions) {
    Nivel.call(this, game)
    this.game = game
    this.gameOptions = gameOptions

    this.reqActual = new Requerimiento(Accion.QUITAR, 1)

    this.terminos.push(new Termino([
        new Poligono(true, true, true, true, true, true, false)
    ]))

    this.terminos.push(new Termino([
        new Poligono(true, true, true, true, true, true, false)
    ]))

    this.terminos.push(new Termino([
        new Poligono(false, false, false, true, true, false, false),
        new Poligono(true, true, false, true, true, false, false)
    ]))


    this.rotuloTemporizador = this.game.add.text(50, 25, `00:00:00`)
    this.rotuloTemporizador.font = "Arial Black"
    this.rotuloTemporizador.fontSize = 24
    this.rotuloTemporizador.fill = "#000"
    this.rotuloTemporizador.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 2)

    this.rotuloDesafio = this.game.add.text(0.5 * this.gameOptions.ANCHO, 75, "Elimina 1 fósforo para corregir la ecuación.")
    this.rotuloDesafio.anchor.set(.5)
    this.rotuloDesafio.font = "sans-serif"
    this.rotuloDesafio.fontSize = 32
    this.rotuloDesafio.fill = "#000"
    this.rotuloDesafio.fontWeight = "italic"
    this.rotuloDesafio.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 3)


    this.termino1 = new TerminoDecimal(game, this, null, this.devolverFosforo, this.terminos[0], new Punto(50, 200))
    this.termino1.habilitarOn()

    this.signoOperacion = new SignoOperacion(game, OperacionMatematica.MAS, new Punto(270, 300))

    this.termino2 = new TerminoDecimal(game, this, null, this.devolverFosforo, this.terminos[1], new Punto(350, 200))
    this.termino2.habilitarOn()

    this.signoIgual = new SignoIgual(game, new Punto(540, 270))

    this.termino3 = new TerminoDecimal(game, this, null, this.devolverFosforo, this.terminos[2], new Punto(730, 200))
    this.termino3.habilitarOn()
}

Nivel1.prototype = Object.create(Nivel.prototype)
Nivel1.prototype.constructor = Nivel1

Nivel1.prototype.devolverFosforo = function () {
    if (!this.transmision)return
    this.transmision.agregarFosforo()
}





export function Nivel2(game, gameOptions) {
    Nivel.call(this, game)
    this.gameOptions = gameOptions

    this.reqActual = new Requerimiento(Accion.AGREGAR, 2)

    this.terminos.push(new Termino([
        new Poligono(true, true, true, true, true, true, false)
    ]))

    this.terminos.push(new Termino([
        new Poligono(true, false, true, true, false, true, true)
    ]))

    this.terminos.push(new Termino([
        new Poligono(true, true, true, false, true, true, false)
    ]))


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


    this.termino1 = new TerminoDecimal(game, this, this.colocarFosforo, null, this.terminos[0], new Punto(50, 200))
    this.termino1.habilitarOff()

    this.signoOperacion = new SignoOperacion(game, OperacionMatematica.MENOS, new Punto(270, 300))

    this.termino2 = new TerminoDecimal(game, this, this.colocarFosforo, null, this.terminos[1], new Punto(450, 200))
    this.termino2.habilitarOff()

    this.signoIgual = new SignoIgual(game, new Punto(650, 270))

    this.termino3 = new TerminoDecimal(game, this, this.colocarFosforo, null, this.terminos[2], new Punto(850, 200))
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

    this.terminos.push(new Termino([
        new Poligono(false, false, false, true, true, false, false)
    ]))

    this.terminos.push(new Termino([
        new Poligono(false, false, false, true, true, false, false)
    ]))

    this.terminos.push(new Termino([
        new Poligono(true, true, true, true, true, true, true)
    ]))


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

    this.termino1 = new TerminoDecimal(game, this, null, this.devolverFosforo, this.terminos[0], new Punto(50, 200))
    this.termino1.habilitarOn()

    this.signoOperacion = new SignoOperacion(game, OperacionMatematica.MAS, new Punto(310, 300))

    this.termino2 = new TerminoDecimal(game, this, null, this.devolverFosforo, this.terminos[1], new Punto(450, 200))
    this.termino2.habilitarOn()

    this.signoIgual = new SignoIgual(game, new Punto(650, 270))

    this.termino3 = new TerminoDecimal(game, this, null, this.devolverFosforo, this.terminos[2], new Punto(850, 200))
    this.termino3.habilitarOn()
}

Nivel3.prototype = Object.create(Nivel.prototype)
Nivel3.prototype.constructor = Nivel3


Nivel3.prototype.devolverFosforo = function () {
    this.transmision.agregarFosforo()
 }