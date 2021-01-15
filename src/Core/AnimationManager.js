import * as Constants from '../Constants';

export class AnimationManager {
    lastLoopStartTime;

    constructor() {}

    animate(entity, currentAnimation, timeStart, duration, loop = false) {
        let animationSeq = Constants.ANIMATION_TYPES[currentAnimation];
        let frames = animationSeq.length;
        let durationPerFrame = duration / frames;
        let timeNow = performance.now();
        let timeLapsed;
        let currentFrameIndex;

        if (loop) {
            this.lastLoopStartTime ? this.lastLoopStartTime : (this.lastLoopStartTime = timeStart);
            timeLapsed = timeNow - this.lastLoopStartTime;
            timeLapsed = timeLapsed % duration;

            if (timeNow < this.lastLoopStartTime + duration) {
                currentFrameIndex = Math.ceil(timeLapsed / durationPerFrame) - 1;
            } else {
                this.lastLoopStartTime = timeNow;
                currentFrameIndex = frames - 1; // last frame
                entity.isAnimating = true;
                entity.currentAnimation = null;
            }
        } else {
            timeLapsed = timeNow - timeStart;
            if (timeNow < timeStart + duration) {
                currentFrameIndex = Math.ceil(timeLapsed / durationPerFrame) - 1;
            } else {
                currentFrameIndex = frames - 1; // last frame
                entity.isAnimating = false;
                entity.currentAnimation = null;
            }
        }

        entity.assetName = animationSeq[currentFrameIndex];
    }
}
