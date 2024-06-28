/*Autor: Ing. Víctor Martínez*/
export function Preloader(gameOptions) {
    this.gameOptions = gameOptions
    this.texto = null
    this.arco = null
}

Preloader.prototype.preload = function () {
    this.stage.backgroundColor = "#eee"
    this.barra = this.add.sprite(0, (this.gameOptions.ALTURA + 100) * 0.5, 'barra')
    this.load.setPreloadSprite(this.barra)

    this.load.onFileComplete.add(this.cargandoArchivos, this)

    const circulo = this.game.add.graphics(900, 500)
    circulo.lineStyle(5, 0x484848, 0.9)
    circulo.arc(0, 0, 45, 0, this.game.math.degToRad(360), false)
    this.arco = this.game.add.graphics(900, 500)

    const cargando = this.add.sprite(this.gameOptions.ANCHO / 2, this.gameOptions.ALTURA / 2, 'cargando')
    this.physics.enable(cargando, Phaser.Physics.ARCADE)
    cargando.anchor.set(0.5)

    this.load.image('aprobado', 'images/listo.png')
    this.load.image('fosforo-vertical', 'images/fosforo-vertical.png')
    this.load.image('fosforo-inactivo-vertical', 'images/fosforo-inactivo-vertical.png')
    this.load.image('fosforo-horizontal', 'images/fosforo-horizontal.png')
    this.load.image('fosforo-inactivo-horizontal', 'images/fosforo-inactivo-horizontal.png')
    this.load.image('1-seg', 'images/1-seg.png')
    this.load.image('2-seg', 'images/2-seg.png')
    this.load.image('3-seg', 'images/3-seg.png')
    this.load.image('listo', 'images/listo.png')
    this.load.image('mainMenu', 'images/fondo.png')
    this.load.image('ayuda', 'images/fondo.png')
    this.load.image('screen-bg', 'images/fondo3.png')
    this.load.image('mensajeFinal', 'images/mensajeFinal.png')
    this.load.image('button-play', 'images/jugar.png')
    this.load.image('boton-ayuda', 'images/ong.png')
    this.load.image('boton-replay', 'images/caja.png')

    this.load.audio('sonido-fondo', ['audio/stranger-things.mp3'])    
}

Preloader.prototype.cargandoArchivos = function (progress, cacheKey, success, totalLoaded, totalFiles) {
    if (!success) throw new Error('Error en la precarga de activos')
    const progreso = Math.ceil((totalLoaded * 100) / totalFiles)
    this.setProgresoAlCirculo(progreso)
    let anguloFinal = Math.ceil(360 / totalFiles)
    anguloFinal *= totalLoaded
    this.dibujarArco(anguloFinal)
}

Preloader.prototype.dibujarArco = function (anguloFinal) {
    this.arco.destroy()
    this.arco = this.game.add.graphics(900, 500)
    this.arco.lineStyle(4, 0x000000, 0.9)
    this.arco.arc(0, 0, 45, 0, this.game.math.degToRad(anguloFinal), false)
}

Preloader.prototype.setProgresoAlCirculo = function (progreso) {
    if (this.texto !== null) this.texto.destroy()
    this.texto = this.game.add.text(900, 500, `${progreso}%`)
    this.texto.font = 'Arial Black'
    this.texto.fontSize = 20
    this.texto.fill = '#000000'
    this.texto.setShadow(2, 2, 'rgba(0, 0, 0, 0.9)', 2)
    this.texto.anchor.set(0.5)
}

Preloader.prototype.create = function () {
    this.game.state.start('MainMenu')
}