import * as Constants from '../Constants';
import { AssetManager } from './AssetManager';
import { Canvas } from './Canvas';
import { Skier } from '../Entities/Skier';
import { Rhino } from '../Entities/Rhino';
import { ObstacleManager } from '../Entities/Obstacles/ObstacleManager';
import { Rect } from './Utils';
import { Snow } from './snow';

export class Game {
    gameWindow = null;
    gameOver = false;
    secondsPassed;
    oldTimeStamp;
    gameStartTime;
    gameScore;
    gameKeyDownEvents;

    constructor() {
        this.assetManager = new AssetManager();
        this.canvas = new Canvas(Constants.GAME_WIDTH, Constants.GAME_HEIGHT);
        this.skier = new Skier(0, 0);
        this.rhino = new Rhino(0, -500);
        this.obstacleManager = new ObstacleManager();
        this.snow = new Snow(this.canvas);

        this.gameKeyDownEvents = this.handleKeyDown.bind(this);
        document.addEventListener('keydown', this.gameKeyDownEvents, true);
    }

    init() {
        this.obstacleManager.placeInitialObstacles();
    }

    async load() {
        await this.assetManager.loadAssets(Constants.ASSETS);
    }

    run(timeStamp) {
        this.canvas.clearCanvas();

        this.snow.draw(this.canvas);
        this.showCanvasStyle();
        this.showFps(timeStamp);
        this.showScore(timeStamp);

        this.updateGameWindow();
        this.drawGameWindow();
        this.checkGameOver();

        requestAnimationFrame(this.run.bind(this));
    }

    showCanvasStyle() {
        // Create a linear gradient
        // The start gradient point is at x=0, y=0
        // The end gradient point is at x=GAME_WIDTH, y=GAME_HEIGHT
        let gradient = this.canvas.ctx.createLinearGradient(
            0,
            0,
            Constants.GAME_WIDTH,
            Constants.GAME_HEIGHT
        );
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(1 / 6, 'orange');
        gradient.addColorStop(2 / 6, 'yellow');
        gradient.addColorStop(3 / 6, 'green');
        gradient.addColorStop(4 / 6, 'blue');
        gradient.addColorStop(5 / 6, 'indigo');
        gradient.addColorStop(1, 'violet');

        this.canvas.ctx.fillStyle = gradient;
        this.canvas.ctx.font = '30px Verdana';
        this.canvas.ctx.textAlign = 'start';
    }

    showFps(timeStamp) {
        // Calculate the number of seconds passed since the last frame
        this.secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
        this.oldTimeStamp = timeStamp;

        // Calculate fps
        let fps = Math.round(1 / this.secondsPassed);

        this.canvas.ctx.fillText(`FPS: ${fps}`, 10, 50);
    }

    showScore(timeStamp) {
        if (!this.gameStartTime) this.gameStartTime = timeStamp;
        let yDistance = this.skier.y;
        let elapsedTime = timeStamp - this.gameStartTime;

        this.gameScore = Math.round(yDistance / 100 + elapsedTime / 500);
        this.canvas.ctx.fillText(`SCORE: ${this.gameScore}`, Constants.GAME_WIDTH - 250, 50);
    }

    updateGameWindow() {
        this.skier.checkAnimating();
        this.skier.move();

        this.rhino.findSkier(this.skier);
        this.rhino.checkAnimating();
        this.rhino.move();

        const previousGameWindow = this.gameWindow;
        this.calculateGameWindow();

        this.obstacleManager.placeNewObstacle(this.gameWindow, previousGameWindow);

        this.skier.checkIfSkierHitObstacle(this.obstacleManager, this.assetManager);
        this.rhino.checkIfRhinoCatchSkier(this.skier, this.assetManager);
    }

    drawGameWindow() {
        this.canvas.setDrawOffset(this.gameWindow.left, this.gameWindow.top);

        this.skier.draw(this.canvas, this.assetManager);
        this.rhino.draw(this.canvas, this.assetManager);
        this.obstacleManager.drawObstacles(this.canvas, this.assetManager);
    }

    drawGameOverWindow() {
        this.canvas.clearCanvas();

        this.rhino.draw(this.canvas, this.assetManager);
        this.obstacleManager.drawObstacles(this.canvas, this.assetManager);

        this.canvas.ctx.font = '50px Verdana';
        this.canvas.ctx.textAlign = 'center';

        this.canvas.ctx.fillText(
            'Press ENTER to restart',
            Constants.GAME_WIDTH / 2,
            Constants.GAME_HEIGHT / 2 - 150
        );
    }

    calculateGameWindow() {
        const skierPosition = this.skier.getPosition();
        const left = skierPosition.x - Constants.GAME_WIDTH / 2;
        const top = skierPosition.y - Constants.GAME_HEIGHT / 2;

        this.gameWindow = new Rect(
            left,
            top,
            left + Constants.GAME_WIDTH,
            top + Constants.GAME_HEIGHT
        );
    }

    checkGameOver() {
        this.gameOver = this.rhino.isEating;
        if (this.gameOver) {
            this.drawGameOverWindow();
            this.disableArrowKeys();
        }
    }

    disableArrowKeys() {
        document.removeEventListener('keydown', this.gameKeyDownEvents, true);
    }

    handleKeyDown(event) {
        switch (event.which) {
            case Constants.KEYS.LEFT:
                this.skier.turnLeft();
                event.preventDefault();
                break;
            case Constants.KEYS.RIGHT:
                this.skier.turnRight();
                event.preventDefault();
                break;
            case Constants.KEYS.UP:
                this.skier.turnUp();
                event.preventDefault();
                break;
            case Constants.KEYS.DOWN:
                this.skier.turnDown();
                event.preventDefault();
                break;
            case Constants.KEYS.SPACE:
                this.skier.jump();
                event.preventDefault();
                break;
        }
    }
}
