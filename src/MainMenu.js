import { Animation } from "./Animation.js"
import { createButton } from "./Buttons.js"
import { Punto } from "./Punto.js"

export function MainMenu(gameOptions) {
    this.gameOptions = gameOptions
}

MainMenu.prototype.create = function () {
    this.add.sprite(0, 0, 'mainMenu')

    createButton(this, this.gameOptions.ANCHO * .5 - 55, 226, "button-play", this.iniciarJuego)

    createButton(this, this.gameOptions.ANCHO * .5 + 55, 226, "boton-ayuda", this.howTo)

    const emitter = this.game.add.emitter(this.game.world.centerX, 0, 200)
    emitter.makeParticles(['fosforo-horizontal', 'fosforo-vertical'])

    emitter.gravity = 200
    emitter.setAlpha(1, 0, 5000)
    emitter.start(false, 1800, 50)

    if (!this.gameOptions.musicaFondo) {
        this.gameOptions.musicaFondo = this.add.audio('sonido-fondo')
        this.sound.setDecodedCallback(this.gameOptions.musicaFondo, this.iniciarMusica, this)
    }


    new Animation(this, new Punto(510, 670))    
}

MainMenu.prototype.iniciarMusica = function () {
    this.gameOptions.musicaFondo.loopFull(this.gameOptions.volumen / 100)
}

MainMenu.prototype.howTo = function () {
    this.game.state.start('Howto')
}

MainMenu.prototype.iniciarJuego = function () {
    this.game.state.start('Desafios')
}