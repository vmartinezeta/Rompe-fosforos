import { Digito } from "./Digito.js"
import { Poligono } from "./Poligono.js"

export function Animation(scene, origen) {
    Phaser.Group.call(this, scene)
    this.scene = scene
    this.origen = origen
    this.powerOn = false
    this.formas = [
        new Poligono(true, true, true, true, false, false, true),
        new Poligono(false, true, false, false, false, true, true),
        new Poligono(true, true, true, true, true, false, true),
        new Poligono(true, true, false, true, true, true, false)
    ]
    this.todos = []

    this.draw()

    this.timer = scene.time.create(false)
    this.timer.loop(600, this.togglePower, this)
    this.timer.start()
}

Animation.prototype = Object.create(Phaser.Group.prototype)
Animation.prototype.constructor = Animation


Animation.prototype.draw = function () {
    let origen = this.origen.newInstance()
    const letras = ["p", "l", "a", "y"]
    const formas = this.formas.map(f => f.newInstance())
    for (let i = 0; i < formas.length; i++) {
        const key = letras[i]
        const forma = formas[i]
        const letra = this.drawOne(key, forma, origen)
        this.todos.push(letra)
        origen = origen.newInstance()
        origen.setX(origen.x + letra.width + 100)
    }
}

Animation.prototype.drawOne = function (key, forma, origen) {
    const ESCALA_PORCENTAJE = 60
    const letra = new Digito(this.scene, null, null, null, origen, forma)
    letra.key = key
    letra.scale.set(ESCALA_PORCENTAJE / 100)
    this.add(letra)
    return letra
}

Animation.prototype.togglePower = function () {

    this.powerOn = !this.powerOn

    if (this.powerOn) {        
        for (let i = 0; i < this.todos.length; i++) {
            this.todos[i].setForma(this.formas[i].newInstance())
        }
    } else {
        this.todos.forEach(e => {
            e.powerOff()
        })
    }
}