# Ceros Ski Code Challenge

## Game Features

-   Skier can get back up after crashing into obstacles and face whichever arrow key direction.
-   Skier can jump over rocks by pressing the space bar.
-   Skier can jump by hitting jump ramps.
-   Display in-game Frames Per Second.
-   Display score based on elapsed time and distance down the slope
-   Rhino will start chasing the skier after 3 seconds.
-   Rhino will eat skier when caught.
-   Press Enter key to restart the game when game is over.

## Know Bugs

-   [x] ~~game crash when press left arrow after skier crash~~
-   [x] ~~`ObstacleManager.js:66 Uncaught (in promise) TypeError: Cannot read property 'left' of null`~~
-   [ ] Skier can jump upwards when hitting the ramp while going up

## Challenge Implementation Notes

### Feature Implementing Detail

#### Repo setup

-   Installed commitizen for consistent commit messages.
-   Added prettier for standardized formatting of the code base.

#### Game - test: canvas

I added tests for `Game.test.js` to ensure Game is properly initialized with 'skier', 'canvas', 'obstacleManager', 'assetManager' properties. I had to add the `jest-canvas-mock` package and configure the `jest.config.js` and `jest.setup.js` to ensure the `canvas` object can be mocked using `JSDOM`.

#### Game - feature: FPS

Frames Per Second (FPS) to the game. I tried to implement the skier's jump behavior and ran into a few issues. When I first implemented the skier jump method, the skier appears to jump really quickly as it was only draw once per frame over each of the `skier_jump_#.png` image animation sequence. The game is drawing each frame using the `requestAnimationFrame` method.

After some digging, I realized that I need to display each image for multiple frames in order to control the duration of the animation. The FPS was the by-product of trying to figure out how many frames was being drawn (usually around 60FPS). And it adds a nice touch as many games display FPS on screen.

#### Game - feature: scoring

I implemented a simple scoring mechanism based on the Y axis on how far the Skier has gone down the slope and the elapsed time since start of the game.

#### Game - feature: restart

A game can be restarted by pressing the "Enter" key. This only works after the game is over and disabled during the game.

#### Game - bug fix: ObstacleManager crashes game

Though inconsistent, there are times when the game will crash and prints `ObstacleManager.js:66 Uncaught (in promise) TypeError: Cannot read property 'left' of null`. This was caused by `previousGameWindow` sometimes being `null`, during the first render. This was mitigated by checking `previousGameWindow` exist in the `placeNewObstacle` method.

#### Skier - bug fix: game crashes when left arrow is pressed while skier is crashed into an obstacle.

I manually tested the game by crashing into an obstacle and press the left arrow key. The game would crash and prints:

```
Skier.js:138 Uncaught TypeError: Cannot read property 'width' of undefined at Skier.checkIfSkierHitObstacle (Skier.js:138)
```

When investigating the cause of error, I realized because the skiers uses numbers from 0-5 to determine the direction skier is facing and increment(-1)/decrement(+1) this number to go left/right respectfully to control the directions. The game crashed because this number becomes 0 when skier crashes and when I press left arrow key, it becomes -1. And there isn't a direction and assetName associated with -1, hence the assetManager returns an undefined asset which causes the error.

To fix this bug, I set a condition in skier's `turnLeft` method to check when skier has crashed, the skier will move down and face the left direction instead of decrementing (-1) the directions number, so it will never become -1 again.

I added a file named `Skier.test.js` for unit tests. This covered tests for initializing the Skier class and turning skier to different directions after crash.

#### Skier - feature: jump

I implemented a naive version of the skier's jump. Usually I wouldn't include this as part of the commit but wanted to include this commit(94f9d87) in the history so I can demonstrate the thought process of getting from proof of concept to code refactor.

After knowing the canvas needs to draw multiple frames per images, I need a function that takes a duration, starting time, and animation frames/images so the function can calculate how many frames it needs to draw for each image. I implemented a `jump` method for the Skier class that starts the jumping animation.

At first, I was tempted to implement the animation sequence logic in the `move` method. But remembering and respecting the Open/Close principles I decided to leave the `move` method alone and implemented another method called `checkJumping`, that is used to calculate duration per frame and loop through each frame while the skier "isJumping". Then make sure that this method is in the Game's `updateGameWindow` method so that `skier.checkJumping()` is called each time to see if skier is still jumping before drawing a new frame.

I then included `rock1` and `rock2` as `LOW_OBSTACLES` and made sure skier will not crash when colliding with these obstacles while the skier "isJumping". I also added the jump ramp asset and ensure that when skier and obstacle collided, it will jump instead of crash.

The naive jump implementation isn't really reusable and in violation of the Single Responsibility Principle since the Skie class is now responsible for animation in addition to jumping. I refactored out the animation capabilities to a `AnimationManager` class that takes `entity`, `currentAnimation`, `startTime`, and `duration` as the arguments and is responsible to animating the entity that's passed to it.

##### Rhino - feature: run & eat animation

Rhino class extends the Entity class, the rhino instance is initialized off screen above the skier and will start to chase after 3 seconds.

When implementing rhino's run instance method, I realized that the `animate` method of the `AnimationManager` needed to know if an animation needs to run continuously in a loop. Hence, I added an optional argument `loop = true` for the `animate` method.

Implementing Rhino's eating animation sequence was easy since there’s already the `AnimationManager`. And it worked just by supplying the required arguments.

While the rhino moves and chase the skier. I noticed the rhino moves in a jitter/shaky manner. This is because there are 60 frames drawn every second. And because the moving mechanics is based on the distance between the rhino and skier. The tiny difference of positive/negative number will cause the rhino to be drawn between right/left sides on a straight line when chasing the skier down the slope. I mitigate this issue by introducing a distance threshold, `rhinoSkierDistanceThreshold`, and the rhino moves smoother between frames.

---

Welcome to the Ceros Code Challenge - Ski Edition!

For this challenge, we have included some base code for Ceros Ski, our version of the classic Windows game SkiFree. If
you've never heard of SkiFree, Google has plenty of examples. Better yet, you can play our version here:
http://ceros-ski.herokuapp.com/

Or deploy it locally by running:

```
npm install
npm run dev
```

There is no exact time limit on this challenge and we understand that everyone has varying levels of free time. We'd
rather you take the time and produce a solution up to your ability than rush and turn in a suboptimal challenge. Please
look through the requirements below and let us know when you will have something for us to look at. If anything is
unclear, don't hesitate to reach out.

**Requirements**

Throughout your completion of these requirements, be mindful of the design/architecture of your solutions and the
quality of your code. We've provided the base code as a sample of what we expect. That being said, there are ways the
design and architecture could be better. If you find a better way to do something, by all means, make it better! Your
solution can only gain from having a better foundation.

-   **Fix a bug:**

    There is a bug in the game. Well, at least one bug that we know of. Use the following bug report to debug the code
    and fix the root of the problem.

    -   Steps to Reproduce:
        1. Load the game
        1. Crash into an obstacle
        1. Press the left arrow key
    -   Expected Result: The skier gets up and is facing to the left
    -   Actual Result: Giant blizzard occurs causing the screen to turn completely white (or maybe the game just crashes!)

-   **Write unit tests:**

    The base code has Jest, a unit testing framework, installed. Write some unit tests to ensure that the above mentioned
    bug does not come back.

-   **Extend existing functionality:**

    We want to see your ability to extend upon a part of the game that already exists. Add in the ability for the skier to
    jump. The asset file for jumps is already included. All you gotta do is make the guy jump. We even included some jump
    trick assets if you wanted to get really fancy!

    -   Have the skier jump by pressing a key AND use the ramp asset to have the skier jump whenever he hits a ramp.
    -   The skier should be able to jump over some obstacles while in the air.
        -   Rocks can be jumped over
        -   Trees can NOT be jumped over
    -   Anything else you'd like to add to the skier's jumping ability, go for it!

-   **Build something new:**

    Now it's time to add something completely new. In the original Ski Free game, if you skied for too long,
    a yeti would chase you down and eat you. In Ceros Ski, we've provided assets for a Rhino to run after the skier,
    catch him and eat him.

    -   The Rhino should appear after a set amount of time or distance skied and chase the skier, using the running assets
        we've provided to animate the rhino.
    -   If the rhino catches the skier, it's game over and the rhino should eat the skier.

-   **Documentation:**

    -   Update this README file with your comments about your work; what was done, what wasn't, features added & known bugs.
    -   Provide a way for us to view the completed code and run it, either locally or through a cloud provider

-   **Be original:**
    -   This should go without saying but don’t copy someone else’s game implementation!

**Grading**

Your challenge will be graded based upon the following criteria. **Before spending time on any bonus items, make sure
you have fulfilled this criteria to the best of your ability, especially the quality of your code and the
design/architecture of your solutions. We cannot stress this enough!**

-   How well you've followed the instructions. Did you do everything we said you should do?
-   The quality of your code. We have a high standard for code quality and we expect all code to be up to production
    quality before it gets to code review. Is it clean, maintainable, unit-testable, and scalable?
-   The design of your solution and your ability to solve complex problems through simple and easy to read solutions.
-   The effectiveness of your unit tests. Your tests should properly cover the code and methods being tested.
-   How well you document your solution. We want to know what you did and why you did it.

**Bonus**

_Note: You won’t be marked down for excluding any of this, it’s purely bonus. If you’re really up against the clock,
make sure you complete all of the listed requirements and to focus on writing clean, well organized, well documented
code before taking on any of the bonus._

If you're having fun with this, feel free to add more to it. Here's some ideas or come up with your own. We love seeing
how creative candidates get with this.

-   Provide a way to reset the game once it's over
-   Provide a way to pause and resume the game
-   Add a score that increments as the skier skis further
-   Increase the difficulty the longer the skier skis (increase speed, increase obstacle frequency, etc.)
-   Deploy the game to a server so that we can play it without having to install it locally
-   Write more unit tests for your code

We are looking forward to see what you come up with!
