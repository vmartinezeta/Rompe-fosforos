import { Digito } from "./Digito.js"
import { Poligono } from "./Poligono.js"

export function Animation(game, origen) {
    Phaser.Group.call(this, game)
    this.game = game


    const caracterP = new Poligono(true, true, true, true, false, false, true)
    const letraP = new Digito(game, null, null, null, origen, caracterP)
    letraP.scale.set(60 / 100)

    origen = origen.newInstance()
    origen.setX(origen.x + letraP.width + 100)
    const caracterL = new Poligono(false, true, false, false, false, true, true)
    const letraL = new Digito(game, null, null, null, origen, caracterL)
    letraL.scale.set(60 / 100)


    origen = origen.newInstance()
    origen.setX(origen.x + letraL.width + 100)
    const caracterA = new Poligono(true, true, true, true, true, false, true)
    const letraA = new Digito(game, null, null, null, origen, caracterA)
    letraA.scale.set(60 / 100)


    origen = origen.newInstance()
    origen.setX(origen.x + letraA.width + 100)
    const caracterY = new Poligono(true, true, false, true, true, true, false)
    const letraY = new Digito(game, null, null, null, origen, caracterY)
    letraY.scale.set(60 / 100)
}

Animation.prototype = Object.create(Phaser.Group.prototype)
Animation.prototype.constructor = Animation
