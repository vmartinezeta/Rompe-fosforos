export function Requerimiento(nombre, cantidad) {
    this.nombre = nombre
    this.cantidad = cantidad
}

Requerimiento.prototype = Object.create(Requerimiento.prototype)
Requerimiento.prototype.constructor = Requerimiento


Requerimiento.prototype.reset = function() {
    this.cantidad = 0
    return this
}

Requerimiento.prototype.newInstance = function ()  {
    return new Requerimiento(this.nombre, this.cantidad)
}

Requerimiento.prototype.toString = function() {
    return `${this.nombre}-${this.cantidad}`
}

Requerimiento.prototype.completado = function (requerimiento) {
    return this.toString() === requerimiento.toString()
}