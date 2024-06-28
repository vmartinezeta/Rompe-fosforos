import { Signo } from "./Signo.js"
import { SuperSigno } from "./SuperSigno.js"
import { TerminoDecimal } from "./TerminoDecimal.js"
import { TypeSigno } from "./main.js"

export function ExpresionAritmetica(game, origen, izquierdo, derecho) {
    Phaser.Group.call(this, game)
    this.game = game
    this.origen = origen
    this.izquierdo = izquierdo
    this.derecho = derecho
    this.ESCALA_EN_PORCENTAJE = 100
    this.draw()
}

ExpresionAritmetica.prototype = Object.create(Phaser.Group.prototype)
ExpresionAritmetica.prototype.constructor = ExpresionAritmetica

ExpresionAritmetica.prototype.draw = function () {
    const origen = this.origen.newInstance()
    for (const item of this.izquierdo.getExpresion()) {
        if (typeof item === "string") {
            const punto = origen.newInstance()
            punto.setX(punto.x + 60)
            punto.setY(punto.y + 100)
            if (item === TypeSigno.SUMAR || item === TypeSigno.MULTIPLICAR) {
                new SuperSigno(this.game, item, punto, null, null, null)
            } else {
                new Signo(this.game, item, punto)
            }
        } else {
            new TerminoDecimal(this.game, this, null, null, item, origen)
        }
        origen.setX(origen.x + 180)
    }

    const punto = origen.newInstance()
    punto.setY(punto.y + 100)
    new Signo(this.game, TypeSigno.IGUAL, punto)
}