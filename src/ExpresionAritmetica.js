function ExpresionAritmetica (game, origen, miembroIzq, miembroDer) {
    Phaser.Group.call(this, game)
    this.game = game
    this.origen = origen
    this.miembroIzq = miembroIzq
    this.miembroDer = miembroDer
}

ExpresionAritmetica.prototype = Object.create(ExpresionAritmetica.prototype)
ExpresionAritmetica.prototype.constructor = ExpresionAritmetica

