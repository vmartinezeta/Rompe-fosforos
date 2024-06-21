export function SignoIgual(game, origen) {
    Phaser.Group.call(this, game)
    const SEPARACION_EN_PX = 30
    this.origen = origen
    const arriba = this.create(origen.getX(), origen.getY(), 'fosforo-horizontal')
    arriba.scale.set(80 / 100)
    const abajo = this.create(origen.getX(), origen.getY() + SEPARACION_EN_PX, 'fosforo-horizontal')
    abajo.scale.set(80 / 100)
}

SignoIgual.prototype = Object.create(Phaser.Group.prototype)
SignoIgual.prototype.constructor = SignoIgual

SignoIgual.prototype.getOrigen = function () {
    return this.origen
}