export function Howto() {}

Howto.prototype.create = function () {
    this.add.button(0, 0, 'ayuda', this.startGame, this)
}

Howto.prototype.startGame = function () {
    this.game.state.start('Desafios')
}