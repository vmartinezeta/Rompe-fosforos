/*Autor: Ing. Víctor Martínez*/

import { Nivel1 } from "./Niveles.js"


export function GameOptions() {}

GameOptions.prototype.ANCHO = 1024
GameOptions.prototype.ALTURA = 580
GameOptions.prototype.index = 0
GameOptions.prototype.niveles = [
    Nivel1,
]

GameOptions.prototype = Object.create(GameOptions.prototype)
GameOptions.prototype.constructor = GameOptions


GameOptions.prototype.existeNivel = function(index) {
    return this.niveles[index]
}

GameOptions.prototype.getNivel = function() {
    return this.index + 1
}

GameOptions.prototype.getTotalNiveles = function() {
    return this.niveles.length
}

GameOptions.prototype.newNivelInstance = function(game) {
    return new this.niveles[this.index](game, this)
}