import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as GameGameActions from './game/game.actions';
import { GameGameEffects } from './game/game.effects';

describe('GameGameEffects', () => {
  let actions: Observable<Action>;
  let effects: GameGameEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        GameGameEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(GameGameEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: GameGameActions.initGameGame() });

      const expected = hot('-a-|', {
        a: GameGameActions.loadGameGameSuccess({ gameGame: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
