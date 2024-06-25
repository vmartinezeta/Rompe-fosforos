export function ExpresionAritmetica (game, origen, miembroIzq, miembroDer) {
    Phaser.Group.call(this, game)
    this.game = game
    this.origen = origen
    this.miembroIzq = miembroIzq
    this.miembroDer = miembroDer
    this.ESCALA = 1

    this.draw()
}

ExpresionAritmetica.prototype = Object.create(Phaser.Group.prototype)
ExpresionAritmetica.prototype.constructor = ExpresionAritmetica

ExpresionAritmetica.prototype.draw = function () {}