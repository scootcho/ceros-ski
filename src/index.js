import '../css/game.css';
import { Game } from './Core/Game.js';
import * as Constants from './Constants';

let skiGame;

document.addEventListener('DOMContentLoaded', () => {
    skiGame = new Game();
    skiGame.load().then(() => {
        skiGame.init();
        skiGame.run();
    });
});

document.addEventListener('keydown', handleRestart);

function handleRestart(event) {
    if (event.which === Constants.KEYS.ENTER && skiGame.gameOver) {
        skiGame = new Game();
        skiGame.load().then(() => {
            skiGame.init();
            skiGame.run();
        });
        event.preventDefault();
    }
}
