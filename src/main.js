import { Boot } from "./Boot.js"
import { Desafios } from "./Desafios.js"
import { Game } from "./Game.js"
import { GameOptions } from "./GameOptions.js"
import { Howto } from "./Howto.js"
import { MainMenu } from "./MainMenu.js"
import { Preloader } from "./Preloader.js"


export const Segmento = {
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    E: 'E',
    F: 'F',
    G: 'G',
    toArray: function () {
        return Object.values(this).filter(value => typeof value !== 'function')
    },
    getHorizontales: function () {
        return ['A', 'C', 'F']
    },
    getVerticales : function () {
        return this.toArray().filter( v => !this.getHorizontales().includes(v))
    }
}


export const OperacionMatematica = {
    MAS: 'SUMAR',
    MENOS: 'RESTAR',
    ASTERISCO: 'MULTIPLICAR',
    PLECA: 'DIVIDIR'
}



const gameOptions = new GameOptions()
const preloader = new Preloader(gameOptions)
const mainMenu =  new MainMenu(gameOptions)
const game = new Game(gameOptions)
const desafios = new Desafios(gameOptions)


const phaser = new Phaser.Game(gameOptions.ANCHO, gameOptions.ALTURA, Phaser.CANVAS, 'game')
phaser.state.add('Boot', Boot)
phaser.state.add('Preloader', preloader)
phaser.state.add('MainMenu', mainMenu)
phaser.state.add('Howto', Howto)
phaser.state.add('Game', game)
phaser.state.add("Desafios", desafios)
phaser.state.start('Boot')