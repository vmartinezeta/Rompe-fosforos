export function TransmisionFosforos(game, origen) {
    Phaser.Group.call(this, game)
    this.origen = origen
}

TransmisionFosforos.prototype = Object.create(Phaser.Group.prototype)
TransmisionFosforos.prototype.constructor = TransmisionFosforos

TransmisionFosforos.prototype.agregarFosforo = function () {
    const separacion = this.countLiving() * 35
    const item = this.create(this.origen.getX() + separacion, this.origen.getY(), 'fosforo-vertical')
    item.scale.set(.8)
}

TransmisionFosforos.prototype.quitarFosforo = function () {
    this.remove(this.getFirstAlive())
}