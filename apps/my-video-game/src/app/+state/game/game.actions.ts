import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Game } from '../../models';

export const GameActions = createActionGroup({
  source: 'Game Page',
  events: {
    Enter: emptyProps(),

    'Load Games': emptyProps(),
    'Search Games': props<{ sort: string; search?: string }>(),
    'Sort Games': props<{ sort: string }>(),
    'Previous Page': emptyProps(),
    'Get Games': props<{
      sort: string;
      currentPage: number;
      search?: string;
    }>(),
    'Set Page Size': props<{ pageSize: number }>(),
    'Next page': emptyProps(),
  },
});

export const GameApiActions = createActionGroup({
  source: 'Game/API',
  events: {
    'Load Game Success': props<{ games: Game[]; count: number }>(),
    'Load Game Failure': props<{ error: any }>(),
    'search games Success': props<{ games: Game[]; count: number }>(),
    'search games Failure': props<{ error: any }>(),
    'sort games Success': props<{ games: Game[]; count: number }>(),
    'sort games Failure': props<{ error: any }>(),
  },
});
