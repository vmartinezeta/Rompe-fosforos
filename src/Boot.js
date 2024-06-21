/*Autor: Ing. Víctor Martínez*/
export function Boot() {}

Boot.prototype.preload = function () {
    this.load.image('cargando', 'images/cargando.png')
    this.load.image('barra', 'images/barra.png')
}

Boot.prototype.create = function () {
    const scale = this.game.scale
    scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    scale.pageAlignHorizontally = true
    scale.pageAlignVertically = true
    this.game.state.start('Preloader')
}