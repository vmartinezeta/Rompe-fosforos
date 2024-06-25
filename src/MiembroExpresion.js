import { Termino } from "./Termino.js"

export function MiembroExpresion() {
    this.expresion = []
}

MiembroExpresion.prototype = Object.create(MiembroExpresion.prototype)
MiembroExpresion.prototype.constructor = MiembroExpresion

MiembroExpresion.prototype.addTermino = function (termino) {
    this.expresion.push(termino)
    return this
}

MiembroExpresion.prototype.addSigno = function (signo) {
    this.expresion.push(signo)
    return this
}

MiembroExpresion.prototype.isValido = function () {
    let anterior = null

    if (this.expresion.length === 0) {
        return false
    }

    if (!(this.expresion[0] instanceof Termino) && !(this.expresion[this.expresion.length - 1] instanceof Termino)) {
        return false
    }

    for(const item of this.expresion) {
        if (anterior && typeof anterior !=="string") {
            if (typeof item !=="string" && anterior instanceof item.constructor) {
                return false
            }
        } else if (anterior && typeof anterior === "string") {
            if (typeof item ==="string") {
                return false
            }
        }
        anterior = item
    }

    return true
}

MiembroExpresion.prototype.getExpresion = function () {
    if (!this.isValido()) {
        throw new TypeError("No es valida la expresion")
    }
    return this.expresion
}