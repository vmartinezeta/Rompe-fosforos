import { Signo } from "./Signo.js"
import { SuperSigno } from "./SuperSigno.js"
import { TerminoDecimal } from "./TerminoDecimal.js"
import { TypeSigno } from "./main.js"

export function ExpresionAritmetica({game, origen, miembroIzquierdo, miembroDerecho, requerimiento, transmision}) {
    Phaser.Group.call(this, game)
    this.game = game
    this.origen = origen
    this.izquierdo = miembroIzquierdo
    this.derecho = miembroDerecho
    this.requerimiento = requerimiento
    this.transmision = transmision
    this.ESCALA_EN_PORCENTAJE = 60
    this.draw()
}

ExpresionAritmetica.prototype = Object.create(Phaser.Group.prototype)
ExpresionAritmetica.prototype.constructor = ExpresionAritmetica

ExpresionAritmetica.prototype.draw = function () {
    let origen = this.origen.newInstance()
    for (const item of this.izquierdo.getExpresion()) {
        if (typeof item === "string") {
            const punto = origen.newInstance()
            punto.setY(punto.y + 100)
            if (item === TypeSigno.SUMAR || item === TypeSigno.MULTIPLICAR) {
                const superSigno = new SuperSigno(this.game, item, punto, this.agregarTransmite, this.quitarTransmite, this)
                superSigno.scale.set(this.ESCALA_EN_PORCENTAJE / 100)
                this.add(superSigno)
            } else {
                const signo = new Signo(this.game, item, punto)
                signo.scale.set(this.ESCALA_EN_PORCENTAJE /100)            
                this.add(signo)
            }
            origen.setX(origen.x + 60)  
        } else {
            const termino = new TerminoDecimal(this.game, this, this.agregarPoligono, this.quitarPoligono, item, origen)
            termino.scale.set(this.ESCALA_EN_PORCENTAJE / 100)
            this.add(termino)
            origen.setX(origen.x + (100/this.ESCALA_EN_PORCENTAJE)*termino.width + 60)  
        }
    }


    const punto = origen.newInstance()
    punto.setY(punto.y + 100)
    const signo = new Signo(this.game, TypeSigno.IGUAL, punto)
    signo.scale.set(this.ESCALA_EN_PORCENTAJE / 100)
    this.add(signo)

    origen = origen.newInstance()
    origen.setX(origen.x + 140)

    for (const item of this.derecho.getExpresion()) {
        if (typeof item === "string") {
            const punto = origen.newInstance()
            punto.setY(punto.y + 100)
            if (item === TypeSigno.SUMAR || item === TypeSigno.MULTIPLICAR) {
                const superSigno = new SuperSigno(this.game, item, punto, this.agregarTransmite, this.quitarTransmite, this)
                superSigno.scale.set(this.ESCALA_EN_PORCENTAJE / 100)
                this.add(superSigno)
            } else {
                const signo = new Signo(this.game, item, punto)
                signo.scale.set(this.ESCALA_EN_PORCENTAJE / 100)
                this.add(signo)
            }
            origen.setX(origen.x + 60)
        } else {
            const termino = new TerminoDecimal(this.game, this, this.agregarPoligono, this.quitarPoligono, item, origen)
            termino.scale.set(this.ESCALA_EN_PORCENTAJE / 100)
            this.add(termino)
            origen.setX(origen.x + (100 / this.ESCALA_EN_PORCENTAJE)*termino.width + 60)  
        }
    }
}

ExpresionAritmetica.prototype.agregarTransmite = function() {
    console.log("OK")
}

ExpresionAritmetica.prototype.quitarTransmite = function () {

}

ExpresionAritmetica.prototype.agregarPoligono = function () {

}

ExpresionAritmetica.prototype.quitarPoligono = function () {
}

ExpresionAritmetica.prototype.updateRender = function() {
    this.removeAll()
    this.draw()
}