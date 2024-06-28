import { Termino } from "./Termino.js"
import { TypeSigno } from "./main.js"

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

    for (const item of this.expresion) {
        if (anterior && typeof anterior !== "string") {
            if (typeof item !== "string" && anterior instanceof item.constructor) {
                return false
            }
        } else if (anterior && typeof anterior === "string") {
            if (typeof item === "string") {
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

MiembroExpresion.prototype.toNumber = function () {
    const subtotales = []
    let resultado = {}
    resultado.signo = TypeSigno.SUMAR
    for (const item of this.expresion) {
        if (typeof item === "string" && (item === TypeSigno.SUMAR || item === TypeSigno.RESTAR)) {
            subtotales.push(resultado)
            resultado = {}
            resultado.signo = item === TypeSigno.SUMAR ? TypeSigno.SUMAR : TypeSigno.RESTAR
        } else if (typeof item === "string") {
            resultado.actual = item
        } else if (item instanceof item.constructor && resultado.actual === TypeSigno.MULTIPLICAR) {
            resultado.total = resultado.total * item.toNumber()
        } else if (item instanceof item.constructor && resultado.actual === TypeSigno.DIVIDIR) {
            resultado.total = resultado.total / item.toNumber()
        } else {
            resultado.total = item.toNumber()
        }
    }

    subtotales.push(resultado)
    return subtotales.reduce((subtotal, actual) => {
        const total = actual.signo === TypeSigno.RESTAR ? -1 * actual.total : actual.total
        return subtotal + total
    }, 0)
}