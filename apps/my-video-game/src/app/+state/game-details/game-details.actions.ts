import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Game } from '../../models';

export const GameDetailsActions = createActionGroup({
  source: 'Game Page',
  events: {
    Enter: emptyProps(),
    'Load Game Details': props<{ id: string }>(),
  },
});

export const GameDetailsApiActions = createActionGroup({
  source: 'Game/API',
  events: {
    'Load Game Details Success': props<{ game: Game }>(),
    'Load Game Details Failure': props<{ error: any }>(),
  },
});
