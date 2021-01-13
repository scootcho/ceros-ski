import * as Constants from "../Constants";
import { Entity } from "./Entity";
import { intersectTwoRects, Rect } from "../Core/Utils";

export class Skier extends Entity {
  assetName = Constants.SKIER_DOWN;
  direction = Constants.SKIER_DIRECTIONS.DOWN;
  speed = Constants.SKIER_STARTING_SPEED;
  jumpDuration = 1500;
  jumpFrame = Constants.SKIER_JUMP.JUMP1;
  isJumping = false;
  timeStart = 0;

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
    if (this.direction === Constants.SKIER_DIRECTIONS.LEFT || this.direction === Constants.SKIER_DIRECTIONS.RIGHT) {
      this.moveSkierUp();
    }
  }

  checkJumping() {
    if (this.isJumping) {
      let jumpFrames = Object.keys(Constants.SKIER_JUMP).length;
      let jumpDurationPerFrame = this.jumpDuration / jumpFrames;
      let timeNow = performance.now();
      switch (this.jumpFrame) {
        case Constants.SKIER_JUMP.JUMP1:
          if (timeNow < this.timeStart + jumpDurationPerFrame * 1) {
            this.jumpFrame = Constants.SKIER_JUMP.JUMP1;
          } else {
            this.jumpFrame = Constants.SKIER_JUMP.JUMP2;
          }
          this.assetName = Constants.SKIER_JUMP_ASSET[this.jumpFrame];
          break;
        case Constants.SKIER_JUMP.JUMP2:
          if (timeNow < this.timeStart + jumpDurationPerFrame * 2) {
            this.jumpFrame = Constants.SKIER_JUMP.JUMP2;
          } else {
            this.jumpFrame = Constants.SKIER_JUMP.JUMP3;
          }
          this.assetName = Constants.SKIER_JUMP_ASSET[this.jumpFrame];
          break;
        case Constants.SKIER_JUMP.JUMP3:
          if (timeNow < this.timeStart + jumpDurationPerFrame * 3) {
            this.jumpFrame = Constants.SKIER_JUMP.JUMP3;
          } else {
            this.jumpFrame = Constants.SKIER_JUMP.JUMP4;
          }
          this.assetName = Constants.SKIER_JUMP_ASSET[this.jumpFrame];
          break;
        case Constants.SKIER_JUMP.JUMP4:
          if (timeNow < this.timeStart + jumpDurationPerFrame * 4) {
            this.jumpFrame = Constants.SKIER_JUMP.JUMP4;
          } else {
            this.jumpFrame = Constants.SKIER_JUMP.JUMP5;
          }
          this.assetName = Constants.SKIER_JUMP_ASSET[this.jumpFrame];
          break;
        case Constants.SKIER_JUMP.JUMP5:
          if (timeNow < this.timeStart + jumpDurationPerFrame * 5) {
            this.jumpFrame = Constants.SKIER_JUMP.JUMP5;
            this.assetName = Constants.SKIER_DIRECTION_ASSET[this.direction];
          } else {
            this.jumpFrame = Constants.SKIER_JUMP.JUMP1;
            this.isJumping = false;
          }
          break;
      }
    }
  }

  jump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.timeStart = performance.now();
      this.assetName = Constants.SKIER_JUMP_ASSET[this.jumpFrame];
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

    const collision = obstacleManager.getObstacles().find((obstacle) => {
      if (this.isJumping && Constants.LOW_OBSTACLES.includes(obstacle.assetName)) {
        return false;
      }
      const obstacleAsset = assetManager.getAsset(obstacle.getAssetName());
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
      this.setDirection(Constants.SKIER_DIRECTIONS.CRASH);
    }
  }
}
