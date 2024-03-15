import { createReducer, on } from '@ngrx/store';
import { GameActions, GameApiActions } from './game.actions';
import { Game } from '../../models';

export const GAME_FEATURE_KEY = 'video-game';

export interface GameState {
  games: Game[];
  loading: boolean;
  error: any;
  sortCriteria: string;
  totalGames: number;
  details: DetailsState;
}
export interface DetailsState {
  game: Game | null;
}

const initialState: GameState = {
  games: [],
  loading: false,
  error: null,
  sortCriteria: '',
  totalGames: 0,
  details: {
    game: null,
  },
};

export const gameReducer = createReducer(
  initialState,
  on(GameActions.loadGames, GameActions.searchGames, (state) => ({
    ...state,
    loading: true,
  })),
  on(GameApiActions.loadGameSuccess, (state, { games, count }) => ({
    ...state,
    games,
    loading: false,
    totalGames: count,
    error: null,
  })),
  on(GameApiActions.loadGameFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  // on(GameActions.searchGames, (state) => ({ ...state, loading: true })),
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
  on(GameApiActions.sortGamesSuccess, (state, { games }) => ({
    ...state,
    games,
    loading: false,
    error: null,
  })),
  on(GameApiActions.sortGamesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(GameActions.loadGameDetails, (state) => ({
    ...state,
    loading: true,
    details: {
      ...state.details,
    },
  })),
  on(GameApiActions.loadGameDetailsSuccess, (state, { game }) => ({
    ...state,
    loading: false,
    details: {
      ...state.details,
      game,
    },
  })),
  on(GameApiActions.loadGameDetailsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    details: {
      ...state.details,
      error,
    },
  }))
);
