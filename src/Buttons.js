export function createButton(scene, x, y, name, callback) {
    const botonPlay = scene.add.button(x, y, name, callback, scene)
    botonPlay.anchor.set(50 / 100)
    botonPlay.input.useHandCursor = true
    return botonPlay
}