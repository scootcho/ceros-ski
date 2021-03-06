import * as Constants from '../Constants';
import { Entity } from './Entity';
import { AnimationManager } from '../Core/AnimationManager';
import { intersectTwoRects, Rect } from '../Core/Utils';

export class Rhino extends Entity {
    assetName = Constants.RHINO_DEFAULT;
    speed = Constants.RHINO_STARTING_SPEED;
    rhinoTimeStart = Constants.RHINO_TIME_START;
    rhinoSkierDistanceThreshold = Constants.RHINO_SKIER_DISTANCE_THRESHOLD;
    isAnimating = false;
    isLoopAnimation = false;
    timeStart = 0;
    isEating = false;
    currentAnimation = null;
    animationManager = new AnimationManager();
    skierPosition;

    constructor(x, y) {
        super(x, y);
        this.timeStart = performance.now();
    }

    updateAsset() {
        this.assetName = Constants.RHINO_DEFAULT;
    }

    findSkier(skier) {
        this.skierPosition = skier.getPosition();
    }

    move() {
        let timeNow = performance.now();
        if (timeNow > this.timeStart + this.rhinoTimeStart) {
            if (!this.isEating) {
                this.run();

                let xDistance = this.x - this.skierPosition.x;
                let yDistance = this.y - this.skierPosition.y;
                let skierOnLeft =
                    xDistance > 0 && Math.abs(xDistance) > this.rhinoSkierDistanceThreshold;
                let skierOnRight =
                    xDistance < 0 && Math.abs(xDistance) > this.rhinoSkierDistanceThreshold;
                let skierBelow =
                    yDistance < 0 && Math.abs(yDistance) > this.rhinoSkierDistanceThreshold;
                let skierAbove =
                    yDistance > 0 && Math.abs(yDistance) > this.rhinoSkierDistanceThreshold;

                if (skierBelow && !skierOnLeft && !skierOnRight) {
                    this.moveRhinoDown();
                } else if (skierOnLeft && skierBelow && !skierOnRight) {
                    this.moveRhinoLeftDown();
                } else if (skierOnRight && skierBelow && !skierOnLeft) {
                    this.moveRhinoRightDown();
                } else if (skierAbove) {
                    this.moveRhinoUp();
                } else if (skierOnLeft) {
                    this.moveRhinoLeft();
                } else if (skierOnRight) {
                    this.moveRhinoRight();
                }
            }
        }
    }

    moveRhinoLeft() {
        this.x -= Constants.RHINO_STARTING_SPEED;
    }

    moveRhinoLeftDown() {
        this.x -= this.speed / Constants.RHINO_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.RHINO_DIAGONAL_SPEED_REDUCER;
    }

    moveRhinoDown() {
        this.y += this.speed;
    }

    moveRhinoRightDown() {
        this.x += this.speed / Constants.RHINO_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.RHINO_DIAGONAL_SPEED_REDUCER;
    }

    moveRhinoRight() {
        this.x += Constants.RHINO_STARTING_SPEED;
    }

    moveRhinoUp() {
        this.y -= Constants.RHINO_STARTING_SPEED;
    }

    run() {
        this.isAnimating = true;
        this.isLoopAnimation = true;
        this.animationDuration = Constants.RHINO_RUN_DURATION;
        this.currentAnimation = Constants.RHINO_RUN_ANIMATION;
    }

    eat() {
        if (!this.isEating) {
            this.isEating = true;
            this.timeStart = performance.now();
            this.isAnimating = true;
            this.isLoopAnimation = false;
            this.animationDuration = Constants.RHINO_EAT_SKIER_DURATION;
            this.currentAnimation = Constants.RHINO_EAT_SKIER_ANIMATION;
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

    checkIfRhinoCatchSkier(skier, assetManager) {
        const skierPosition = skier.getPosition();
        const skierAsset = assetManager.getAsset(skier.assetName);
        const skierBounds = new Rect(
            skierPosition.x - skierAsset.width / 2,
            skierPosition.y - skierAsset.height / 2,
            skierPosition.x + skierAsset.width / 2,
            skierPosition.y - skierAsset.height / 4
        );

        const rhinoAsset = assetManager.getAsset(this.assetName);
        const rhinoPosition = this.getPosition();
        const rhinoBounds = new Rect(
            rhinoPosition.x - rhinoAsset.width / 2,
            rhinoPosition.y - rhinoAsset.height / 2,
            rhinoPosition.x + rhinoAsset.width / 2,
            rhinoPosition.y
        );

        const caughtSkier = intersectTwoRects(skierBounds, rhinoBounds);

        if (caughtSkier) {
            this.eat();
        }
    }
}
