import { Action } from '@ngrx/store';

import * as GameGameActions from './game/game.actions';
import { GameGameEntity } from './game/game.models';
import {
  GameGameState,
  initialGameGameState,
  gameGameReducer,
} from './game/game.reducer';

describe('GameGame Reducer', () => {
  const createGameGameEntity = (id: string, name = ''): GameGameEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid GameGame actions', () => {
    it('loadGameGameSuccess should return the list of known GameGame', () => {
      const gameGame = [
        createGameGameEntity('PRODUCT-AAA'),
        createGameGameEntity('PRODUCT-zzz'),
      ];
      const action = GameGameActions.loadGameGameSuccess({ gameGame });

      const result: GameGameState = gameGameReducer(
        initialGameGameState,
        action
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = gameGameReducer(initialGameGameState, action);

      expect(result).toBe(initialGameGameState);
    });
  });
});
