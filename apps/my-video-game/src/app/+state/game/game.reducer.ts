import { createReducer, on } from '@ngrx/store';
import { GameActions, GameApiActions } from './game.actions';
import { Game } from '../../models';

export const GAME_FEATURE_KEY = 'video-game';

export interface GameState {
  games: Game[];
  loading: boolean;
  error: any;
  sortCriteria: string;
  details: DetailsState;
}
export interface DetailsState {
  game: Game | null;
  loading: boolean;
  error: any;
}

const initialState: GameState = {
  games: [],
  loading: false,
  error: null,
  sortCriteria: '',
  details: {
    game: null,
    loading: false,
    error: null,
  },
};

export const gameReducer = createReducer(
  initialState,
  on(GameActions.loadGames, (state) => ({
    ...state,
    loading: true,
  })),
  on(GameApiActions.loadGameSuccess, (state, { games }) => ({
    ...state,
    games,
    loading: false,
    error: null,
  })),
  on(GameApiActions.loadGameFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(GameActions.searchGames, (state) => ({ ...state, loading: true })),
  on(GameApiActions.searchGamesSuccess, (state, { games }) => ({
    ...state,
    games,
    loading: false,
    error: null,
  })),
  on(GameApiActions.searchGamesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(GameActions.sortGames, (state, { sort }) => ({
    ...state,
    sortCriteria: sort,
  })),
  on(GameActions.loadGameDetails, (state) => ({
    ...state,
    details: {
      ...state.details,
      loading: true,
      error: null,
    },
  })),
  on(GameApiActions.loadGameDetailsSuccess, (state, { game }) => ({
    ...state,
    details: {
      ...state.details,
      game,
      loading: false,
    },
  })),
  on(GameApiActions.loadGameDetailsFailure, (state, { error }) => ({
    ...state,
    details: {
      ...state.details,
      error,
      loading: false,
    },
  }))
);
