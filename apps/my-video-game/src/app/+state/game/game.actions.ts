import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Game } from '../../models';

export const GameActions = createActionGroup({
  source: 'Games',
  events: {
    Enter: emptyProps(),
    'Load Games': emptyProps(),
    'Search Games': props<{ sort: string; search?: string }>(),
  },
});

export const GameApiActions = createActionGroup({
  source: 'Games/API',
  events: {
    'load Game Success': props<{ games: Game[] }>(),
    'load Game  Failure': props<{ error: any }>(),
    'search games Success': props<{ games: Game[] }>(),
    'search games Failure': props<{ error: any }>(),
  },
});
