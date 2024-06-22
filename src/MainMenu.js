export function MainMenu(gameOptions) {
    this.gameOptions = gameOptions
}

MainMenu.prototype.create = function () {
    this.add.sprite(0, 0, 'mainMenu')
    this.botonPlay = this.add.button(this.gameOptions.ANCHO * 0.5 - 55, 365, 'button-play', this.iniciarJuego, this)
    this.botonPlay.anchor.set(0.5)
    this.botonPlay.input.useHandCursor = true

    this.botonAyuda = this.add.button(this.gameOptions.ANCHO * 0.5 + 55, 365, 'boton-ayuda', this.howTo, this)
    this.botonAyuda.anchor.set(0.5)
    this.botonAyuda.input.useHandCursor = true


    const emitter = this.game.add.emitter(this.game.world.centerX, 0, 200);
    emitter.makeParticles( [ 'fosforo-horizontal', 'fosforo-vertical' ] );

    emitter.gravity = 200;
    emitter.setAlpha(1, 0, 5000);
    //emitter.setScale(0.9, 0, 0.9, 0, 3000);
    emitter.start(false, 1800, 50);
}

MainMenu.prototype.howTo = function () {
    this.game.state.start('Howto')
}

MainMenu.prototype.iniciarJuego = function () {
    this.game.state.start('Desafios')
}