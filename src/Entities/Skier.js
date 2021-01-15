import * as Constants from '../Constants';
import { Entity } from './Entity';
import { AnimationManager } from '../Core/AnimationManager';
import { intersectTwoRects, Rect } from '../Core/Utils';

export class Skier extends Entity {
    assetName = Constants.SKIER_DOWN;
    direction = Constants.SKIER_DIRECTIONS.DOWN;
    speed = Constants.SKIER_STARTING_SPEED;
    animationDuration;
    isAnimating = false;
    timeStart = 0;
    isLoopAnimation = false;
    currentAnimation = null;
    animationManager = new AnimationManager();

    constructor(x, y) {
        super(x, y);
    }

    setDirection(direction) {
        this.direction = direction;
        this.updateAsset();
    }

    updateAsset() {
        this.assetName = Constants.SKIER_DIRECTION_ASSET[this.direction];
    }

    move() {
        switch (this.direction) {
            case Constants.SKIER_DIRECTIONS.LEFT_DOWN:
                this.moveSkierLeftDown();
                break;
            case Constants.SKIER_DIRECTIONS.DOWN:
                this.moveSkierDown();
                break;
            case Constants.SKIER_DIRECTIONS.RIGHT_DOWN:
                this.moveSkierRightDown();
                break;
        }
    }

    moveSkierLeft() {
        this.x -= Constants.SKIER_STARTING_SPEED;
    }

    moveSkierLeftDown() {
        this.x -= this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    }

    moveSkierDown() {
        this.y += this.speed;
    }

    moveSkierRightDown() {
        this.x += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    }

    moveSkierRight() {
        this.x += Constants.SKIER_STARTING_SPEED;
    }

    moveSkierUp() {
        this.y -= Constants.SKIER_STARTING_SPEED;
    }

    turnLeft() {
        if (this.direction === Constants.SKIER_DIRECTIONS.CRASH) {
            this.moveSkierDown();
            this.setDirection(Constants.SKIER_DIRECTIONS.LEFT);
        } else if (this.direction === Constants.SKIER_DIRECTIONS.LEFT) {
            this.moveSkierLeft();
        } else {
            this.setDirection(this.direction - 1);
        }
    }

    turnRight() {
        if (this.direction === Constants.SKIER_DIRECTIONS.CRASH) {
            this.moveSkierDown();
            this.setDirection(Constants.SKIER_DIRECTIONS.RIGHT);
        } else if (this.direction === Constants.SKIER_DIRECTIONS.RIGHT) {
            this.moveSkierRight();
        } else {
            this.setDirection(this.direction + 1);
        }
    }

    turnUp() {
        if (
            this.direction === Constants.SKIER_DIRECTIONS.LEFT ||
            this.direction === Constants.SKIER_DIRECTIONS.RIGHT
        ) {
            this.moveSkierUp();
        }
    }

    checkAnimating() {
        if (this.isAnimating) {
            this.animationManager.animate(
                this,
                this.currentAnimation,
                this.timeStart,
                this.animationDuration,
                this.isLoopAnimation
            );
        } else {
            this.updateAsset();
        }
    }

    jump() {
        if (!this.isAnimating) {
            this.timeStart = performance.now();
            this.isAnimating = true;
            this.isLoopAnimation = false;
            this.animationDuration = Constants.SKIER_JUMP_DURATION;
            this.currentAnimation = Constants.SKIER_JUMP_ANIMATION;
        }
    }

    turnDown() {
        this.setDirection(Constants.SKIER_DIRECTIONS.DOWN);
    }

    checkIfSkierHitObstacle(obstacleManager, assetManager) {
        const asset = assetManager.getAsset(this.assetName);
        const skierBounds = new Rect(
            this.x - asset.width / 2,
            this.y - asset.height / 2,
            this.x + asset.width / 2,
            this.y - asset.height / 4
        );

        let currentObstacleName;
        const collision = obstacleManager.getObstacles().find((obstacle) => {
            if (this.isAnimating && Constants.LOW_OBSTACLES.includes(obstacle.assetName)) {
                return false;
            }
            const obstacleAsset = assetManager.getAsset(obstacle.getAssetName());
            currentObstacleName = obstacle.assetName;
            const obstaclePosition = obstacle.getPosition();
            const obstacleBounds = new Rect(
                obstaclePosition.x - obstacleAsset.width / 2,
                obstaclePosition.y - obstacleAsset.height / 2,
                obstaclePosition.x + obstacleAsset.width / 2,
                obstaclePosition.y
            );

            return intersectTwoRects(skierBounds, obstacleBounds);
        });

        if (collision) {
            if (currentObstacleName === 'jumpRamp') {
                this.jump();
            } else {
                this.setDirection(Constants.SKIER_DIRECTIONS.CRASH);
            }
        }
    }
}
