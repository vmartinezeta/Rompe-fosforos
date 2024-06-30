import { createButton } from "./Buttons.js"

export function Desafios(gameOptions) {
    this.gameOptions = gameOptions
    this.botones = []
}

Desafios.prototype.create = function () {
    this.game.stage.backgroundColor = 0xffffff
    this.crearTituloPrincipal(this.gameOptions.ANCHO * .5, 40, "DESAFIOS")
    this.crearCuadricula()
}

Desafios.prototype.crearCuadricula = function () {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 5; j++) {
            const opacity = this.gameOptions.existeNivel(5*i + j) ? 1: .5
            const boton = createButton(this, 110 + j * 200, 120 + i * 120, "boton-replay", this.iniciarJuego)
            boton.alpha =  opacity
            this.botones.push(boton)       
            this.crearTituloPrincipal(130 + j * 200, 88 + i * 120, 5*i + j + 1)
        }
    }
}

Desafios.prototype.crearTituloPrincipal = function (x, y, texto) {
    const titulo = this.game.add.text(x, y, texto)
    titulo.font = "Arial Black"
    titulo.fontSize = 28
    titulo.fill = "#000"
    titulo.anchor.set(50 / 100)
}

Desafios.prototype.iniciarJuego = function (boton) {
    const index = this.botones.findIndex(b => b.cameraOffset.x === boton.cameraOffset.x && b.cameraOffset.y === boton.cameraOffset.y)
    if (index >= 0 && this.gameOptions.existeNivel(index)) {
        this.gameOptions.index = index
        this.game.state.start("Game")
    }
}