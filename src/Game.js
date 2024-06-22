/*Autor: Ing. Víctor Martínez*/


export function Game(gameOptions) {
    this.gameOptions = gameOptions
    this.finalizacion = false
    this.nivelActual =null
}

Game.prototype.create = function () {    
    this.game.stage.backgroundColor = 0xffffff
    this.nivelActual = this.gameOptions.newNivelInstance(this.game)

    this.crearTituloPrincipal(286, 40, `Nivel ${this.gameOptions.getNivel()} / ${this.gameOptions.getTotalNiveles()}`)
}

Game.prototype.crearTituloPrincipal = function (x, y, texto) {
    const titulo = this.game.add.text(x, y, texto)
    titulo.font = "Arial Black"
    titulo.fontSize = 28
    titulo.fill = "#000"
    titulo.anchor.set(50 / 100)
    titulo.setShadow(0, 1.5, "rgba(0,0,0,0.9)", 2)
}

Game.prototype.update = function () {
    if (!this.finalizacion) {
        if (this.nivelActual.isAtEnd()) {
            this.finalizacion = true
            this.time.events.add(2e3, this.finalizar, this)
        }
    }
}

Game.prototype.finalizar = function () {
    this.nivelActual = null
    this.finalizacion = false
    this.game.state.start('Desafios')
}