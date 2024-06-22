

export function Desafios(gameOptions) {
    this.gameOptions = gameOptions
    this.botones = []
}

Desafios.prototype.create = function () {
    this.game.stage.backgroundColor = 0xffffff
    this.crearTituloPrincipal(this.gameOptions.ANCHO * .5, 50, "DESAFIOS")
    const NUMERO_MAX = 5
    for (let i = 0; i < NUMERO_MAX; i++) {        
        this.crearButton(110 + i * 200, 100, "boton-replay", this.iniciarJuego, this)
        this.crearTituloPrincipal(110 + i * 200, 100, i + 1)
    }
}

Desafios.prototype.crearTituloPrincipal = function (x, y, texto) {
    const titulo = this.game.add.text(x, y, texto)
    titulo.font = "Arial Black"
    titulo.fontSize = 28
    titulo.fill = "#000"
    titulo.anchor.set(50 / 100)
}

Desafios.prototype.crearButton = function (x, y, name, callback, context) {
    const boton = this.add.button(x, y, name, callback, context)
    boton.anchor.set(50 / 100)
    boton.input.useHandCursor = true
    this.botones.push(boton)
}

Desafios.prototype.iniciarJuego = function (boton) {
    const index = this.botones.findIndex(b => b.cameraOffset.x===boton.cameraOffset.x && b.cameraOffset.y===boton.cameraOffset.y)
    if (index>=0&& this.gameOptions.existeNivel(index)) {
        this.gameOptions.index = index
        this.game.state.start("Game")
    }
}