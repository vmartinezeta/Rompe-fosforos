/*Autor: Ing. Víctor Martínez*/

import { Nivel1} from "./Niveles.js"

export function Game(gameOptions) {
    this.gameOptions = gameOptions
    this.niveles = []
    this.nivelActual = null
    this.nivelAprobado = 0
    this.finalizacion = false
    this.rotuloNivel = null
}

Game.prototype.create = function () {    
    this.game.stage.backgroundColor = 0xffffff

    this.niveles = [
        Nivel1
    ]

    this.nivelActual = new this.niveles[this.nivelAprobado](this.game, this.gameOptions)

    this.rotuloNivel = this.game.add.text(200, 25, `${this.nivelAprobado+1} / ${this.niveles.length}`)
    this.rotuloNivel.font = "Arial Black"
    this.rotuloNivel.fontSize = 28
    this.rotuloNivel.fill = "#000"
    this.rotuloNivel.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 2)
}

Game.prototype.update = function () {
    if (!this.finalizacion) {
        if (this.nivelActual.aproboNivel()) {
            this.finalizacion = true
            this.nivelAprobado ++
            if (this.nivelAprobado === this.niveles.length) {
                this.time.events.add(5e3, this.finalizar, this)
            } else {
                this.time.events.add(5e3, this.cargarSiguienteNivel, this)
            }            
        }
    }
}

Game.prototype.finalizar = function () {
    this.niveles = []
    this.nivelActual = null
    this.nivelAprobado = 0
    this.finalizacion = false
    this.rotuloNivel.destroy()
    this.game.state.start('MainMenu')
}

Game.prototype.cargarSiguienteNivel = function () {
    this.finalizacion = false
    this.nivelActual.destruir()
    this.nivelActual = new this.niveles[this.nivelAprobado](this.game, this.gameOptions)
    this.rotuloNivel.setText(`${this.nivelAprobado+1} / ${this.niveles.length}`)
}