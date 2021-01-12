import 'babel-polyfill';
import { Skier } from './Skier.js';
import * as Constants from '../Constants';

describe('Skier', () => {
  test('initialize with x and y arguments as coordinates', () => {
    let skier = new Skier(0, 0);

    expect(skier.x).toBe(0);
    expect(skier.y).toBe(0);
  });

  test('initialize without x and y arguments will have have undefined coordinates', () => {
    let skier = new Skier();

    expect(skier.x).toBe(undefined);
    expect(skier.y).toBe(undefined);
  });

  test('initialize with default properties', () => {
    let skier = new Skier(0, 0);

    let initialProperties = {
      assetName: 'skierDown',
      direction: 3,
      speed: 10,
      x: 0,
      y: 0,
    };

    expect(skier).toEqual(initialProperties);
  });

  describe('when skier crashes', () => {
    let skier;

    beforeEach(() => {
      skier = new Skier(0, 0);
      skier.setDirection(Constants.SKIER_DIRECTIONS.CRASH);
    });

    test('skier direction property should equal to 0', () => {
      expect(skier.direction).toEqual(0);
    });

    test('press left arrow key after crash, direction property should equal to 1', () => {
      skier.turnLeft();

      expect(skier.direction).toEqual(1);
    });

    test('press right arrow key after crash, direction property should equal to 5', () => {
      skier.turnRight();

      expect(skier.direction).toEqual(5);
    });

    test('press down arrow key after crash, direction property should equal to 3', () => {
      skier.turnDown();

      expect(skier.direction).toEqual(3);
    });
  });
});
