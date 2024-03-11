import { GameGameEntity } from './game/game.models';
import {
  gameGameAdapter,
  GameGamePartialState,
  initialGameGameState,
} from './game/game.reducer';
import * as GameGameSelectors from './game/game.selectors';

describe('GameGame Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getGameGameId = (it: GameGameEntity) => it.id;
  const createGameGameEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as GameGameEntity);

  let state: GameGamePartialState;

  beforeEach(() => {
    state = {
      gameGame: gameGameAdapter.setAll(
        [
          createGameGameEntity('PRODUCT-AAA'),
          createGameGameEntity('PRODUCT-BBB'),
          createGameGameEntity('PRODUCT-CCC'),
        ],
        {
          ...initialGameGameState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('GameGame Selectors', () => {
    it('getAllGameGame() should return the list of GameGame', () => {
      const results = GameGameSelectors.getAllGameGame(state);
      const selId = getGameGameId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = GameGameSelectors.getSelected(state) as GameGameEntity;
      const selId = getGameGameId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getGameGameLoaded() should return the current "loaded" status', () => {
      const result = GameGameSelectors.getGameGameLoaded(state);

      expect(result).toBe(true);
    });

    it('getGameGameError() should return the current "error" state', () => {
      const result = GameGameSelectors.getGameGameError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
