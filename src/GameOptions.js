/*Autor: Ing. Víctor Martínez*/



export function GameOptions() {}

GameOptions.prototype.ANCHO = 1024
GameOptions.prototype.ALTURA = 580

GameOptions.prototype = Object.create(GameOptions.prototype)
GameOptions.prototype.constructor = GameOptions