import * as Constants from '../Constants';

export class AnimationManager {
    index = 0;
    currentFrame;
    lastLoopFrameStartTime;

    constructor() {}

    animate(entity, currentAnimation, startTime, duration, loop = false) {
        console.log('currentAnimation', currentAnimation);
        let animationSeq = Constants.ANIMATION_TYPES[currentAnimation];
        let frames = animationSeq.length;
        let durationPerFrame = duration / frames;
        let timeNow = performance.now();
        this.currentFrame = this.index + 1;

        if (loop) {
            this.lastLoopFrameStartTime
                ? this.lastLoopFrameStartTime
                : (this.lastLoopFrameStartTime = startTime);
            if (timeNow > this.lastLoopFrameStartTime + durationPerFrame * this.currentFrame) {
                this.lastLoopFrameStartTime = timeNow;
                this.index += 1;
            }
            if (this.currentFrame === frames) {
                this.lastLoopFrameStartTime = timeNow;
                this.index = 0;
                entity.isAnimating = true;
            }
        } else {
            if (timeNow > startTime + durationPerFrame * this.currentFrame) {
                this.index += 1;
            }
            if (this.currentFrame === frames) {
                entity.isAnimating = false;
                entity.currentAnimation = null;
                this.index = 0;
            }
        }

        entity.assetName = animationSeq[this.index];
    }
}
