import 'babel-polyfill';
import { Game } from './Game.js';
import * as Constants from '../Constants';

describe('Game', () => {
  describe('initialize', () => {
    let skiGame;

    beforeAll(() => {
      skiGame = new Game();
    });

    it('with canvas property', () => {
      expect(skiGame).toHaveProperty('canvas');
    });

    it('with skier property', () => {
      expect(skiGame).toHaveProperty('skier');
    });

    it('with skier object', () => {
      let { skier } = skiGame;

      let initialProperties = {
        assetName: 'skierDown',
        direction: 3,
        speed: 10,
        x: 0,
        y: 0,
      };

      expect(skier).toMatchObject(initialProperties);
    });

    it('with obstacleManager property', () => {
      expect(skiGame).toHaveProperty('obstacleManager');
    });

    it('with assetManager property', () => {
      expect(skiGame).toHaveProperty('assetManager');
    });
  });
});
