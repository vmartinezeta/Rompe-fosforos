import { Poligono } from "./Poligono.js"
import { Punto } from "./Punto.js"
import { Requerimiento } from "./Requerimiento.js"
import { SignoIgual } from "./Signo.js"
import { SignoOperacion } from "./SuperSigno.js"
import { Termino } from "./Termino.js"
import { TerminoDecimal } from "./TerminoDecimal.js"
import { TransmisionFosforos } from "./Transmision.js"
import { OperacionMatematica } from "./main.js"

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
        this.finCuentaRegresiva = this instanceof Nivel1 && this.finalizoCuentaRegresiva
        if (this.finCuentaRegresiva) {
            this.termino1.habilitarTodo()
            this.termino2.habilitarTodo()
            this.termino3.habilitarTodo()

            const origen = this.signoOperacion.getOrigen()
            this.signoOperacion.destroy()
            this.signoOperacion = new SignoOperacion(this.game, this.transmision, OperacionMatematica.MAS, origen)

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
            this.reqEnJuego.cantidad++
            if (this.reqActual.completado(this.reqEnJuego)) {
                this.finalizacion = true
                this.desabilitarExpresion()
            }
        }


        if (this.nivelAprobado) {
            this.finalizacion = true
            this.cartelAprobacion = this.game.add.sprite(0.5 * this.gameOptions.ANCHO, 500, 'aprobado')
            this.cartelAprobacion.anchor.set(0.5)

            this.desabilitarExpresion()
            this.signoOperacion.desabilitar()
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

Nivel.prototype.updateCuentaRegresiva = function () {
    const nombre = this.cuentaRegresiva.pop()
    if (this.cartelCuentaRegresiva) {
        this.cartelCuentaRegresiva.destroy()
    }
    if (!nombre) {
        this.finalizoCuentaRegresiva = true
        return
    }
    this.cartelCuentaRegresiva = this.game.add.sprite(0, 0.5 * this.gameOptions.ALTURA, nombre)
    this.cartelCuentaRegresiva.x = 0.5 * (this.gameOptions.ANCHO - this.cartelCuentaRegresiva.width)
    this.cartelCuentaRegresiva.anchor.set(0, 0.5)
    this.game.time.events.add(1e3, this.updateCuentaRegresiva, this)
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
    this.termino1.destruir()
    this.termino1 = new TerminoDecimal(this.game, this.transmision, null, this.transmision.agregarFosforo, this.terminos[0], new Punto(50, 200))
    this.termino1.habilitarTodo()

    this.termino2.destruir()
    this.termino2 = new TerminoDecimal(this.game, this.transmision, null, this.transmision.agregarFosforo, this.terminos[1], new Punto(350, 200))
    this.termino2.habilitarTodo()

    this.termino3.destruir()
    this.termino3 = new TerminoDecimal(this.game, this.transmision, null, this.transmision.agregarFosforo, this.terminos[2], new Punto(730, 200))
    this.termino3.habilitarTodo()
}

Nivel.prototype.desabilitarExpresion = function() {
    this.termino1.deshabilitarTodos()
    this.termino2.deshabilitarTodos()
    this.termino3.deshabilitarTodos()
}




export function Nivel1(game, gameOptions) {
    Nivel.call(this, game)
    this.gameOptions = gameOptions
    this.finalizoCuentaRegresiva = false
    this.cuentaRegresiva = [
        'listo',
        '1-seg',
        '2-seg',
        '3-seg'
    ]

    this.reqActual = new Requerimiento("Eliminar", 1)

    this.updateCuentaRegresiva()


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


    this.termino1 = new TerminoDecimal(game, this.transmision, null, this.transmision.agregarFosforo, this.terminos[0], new Punto(50, 200))

    this.signoOperacion = new SignoOperacion(game, null, OperacionMatematica.MAS, new Punto(270, 300))

    this.termino2 = new TerminoDecimal(game, this.transmision, null, this.transmision.agregarFosforo, this.terminos[1], new Punto(350, 200))

    this.signoIgual = new SignoIgual(game, new Punto(540, 270))

    this.termino3 = new TerminoDecimal(game, this.transmision, null, this.transmision.agregarFosforo, this.terminos[2], new Punto(730, 200))
}

Nivel1.prototype = Object.create(Nivel.prototype)
Nivel1.prototype.constructor = Nivel1





export function Nivel2(game) {
    Nivel.call(this, game)

    this.reqActual = new Requerimiento("Agregar", 2)

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
    this.rotuloTemporizador.fill = "#ffffff"
    this.rotuloTemporizador.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 2)

    this.rotuloDesafio = this.game.add.text(0.5 * this.gameOptions.ANCHO, 75, "Agregar 2 fósforos para corregir la ecuación.")
    this.rotuloDesafio.anchor.set(.5)
    this.rotuloDesafio.font = "sans-serif"
    this.rotuloDesafio.fontSize = 32
    this.rotuloDesafio.fill = "#ffffff"
    this.rotuloDesafio.fontWeight = "italic"
    this.rotuloDesafio.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 3)

    this.transmision.agregarFosforo()
    this.transmision.agregarFosforo()

    const poligonos1 = this.findEspaciosDisponible(this.estadoActual[0].getPoligonos())
    this.termino1 = new TerminoDecimal(game, this.transmision, this.transmision.quitarFosforo, null, this.terminos[0], new Punto(50, 200))
    this.termino1.habilitarPoligonos(poligonos1)

    this.signoOperacion = new SignoOperacion(game, this.transmision, OperacionMatematica.MENOS, new Punto(270, 300))

    const poligonos2 = this.findEspaciosDisponible(this.estadoActual[1].getPoligonos())
    this.termino2 = new TerminoDecimal(game, this.transmision, this.transmision.quitarFosforo, null, this.terminos[1], new Punto(450, 200))
    this.termino2.habilitarPoligonos(poligonos2)

    this.signoIgual = new SignoIgual(game, new Punto(650, 270))

    const poligonos3 = this.findEspaciosDisponible(this.estadoActual[2].getPoligonos())
    this.termino3 = new TerminoDecimal(game, this.transmision, this.transmision.quitarFosforo, null, this.terminos[2], new Punto(850, 200))
    this.termino3.habilitarPoligonos(poligonos3)
}

Nivel2.prototype = Object.create(Nivel.prototype)
Nivel2.prototype.constructor = Nivel2





export function Nivel3(game) {
    Nivel.call(this, game)


    this.reqActual = new Requerimiento("Mover", 3)

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
    this.rotuloTemporizador.fill = "#ffffff"
    this.rotuloTemporizador.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 2)

    this.rotuloDesafio = this.game.add.text(0.5 * this.gameOptions.ANCHO, 75, "Elimina 2 fósforos para corregir la ecuación.")
    this.rotuloDesafio.anchor.set(.5)
    this.rotuloDesafio.font = "sans-serif"
    this.rotuloDesafio.fontSize = 32
    this.rotuloDesafio.fill = "#ffffff"
    this.rotuloDesafio.fontWeight = "italic"
    this.rotuloDesafio.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 3)

    this.termino1 = new TerminoDecimal(game, this.transmision, null, this.transmision.agregarFosforo, this.terminos[0], new Punto(50, 200))
    this.termino1.habilitarTodo()

    this.signoOperacion = new SignoOperacion(game, this.transmision, OperacionMatematica.MAS, new Punto(310, 300))

    this.termino2 = new TerminoDecimal(game, this.transmision, null, this.transmision.agregarFosforo, this.terminos[1], new Punto(450, 200))
    this.termino2.habilitarTodo()

    this.signoIgual = new SignoIgual(game, new Punto(650, 270))

    this.termino3 = new TerminoDecimal(game, this.transmision, null, this.transmision.agregarFosforo, this.terminos[2], new Punto(850, 200))
    this.termino3.habilitarTodo()
}

Nivel3.prototype = Object.create(Nivel.prototype)
Nivel3.prototype.constructor = Nivel3