import * as Constants from '../Constants';

export class AnimationManager {
    index = 0;
    currentFrame;

    constructor() {}

    animate(entity, currentAnimation, startTime, duration) {
        let animationSeq = Constants.ANIMATION_TYPES[currentAnimation];
        let frames = animationSeq.length;
        let durationPerFrame = duration / frames;
        let timeNow = performance.now();

        this.currentFrame = this.index + 1;

        if (timeNow > startTime + durationPerFrame * this.currentFrame) {
            this.index += 1;
        }
        if (this.currentFrame === frames) {
            entity.isAnimating = false;
            entity.currentAnimation = null;
            this.index = 0;
        }

        entity.assetName = animationSeq[this.index];
    }
}
