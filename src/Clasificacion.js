export function Clasificacion(id, nombre) {
    this.id = id
    this.nombre = nombre
}

Clasificacion.prototype = Object.create(Clasificacion.prototype)
Clasificacion.prototype.constructor = Clasificacion

Clasificacion.prototype.getId = function () {
    return this.id
}

Clasificacion.prototype.getNombre = function () {
    return this.nombre
}

Clasificacion.prototype.isResolver = function () {
    return this.nombre === 'Resolver'
}

Clasificacion.prototype.isRetornar = function () {
    return this.nombre === 'Retornar'
}

Clasificacion.prototype.toString = function () {
    return JSON.stringify(this)
}