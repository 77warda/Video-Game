import { createReducer, on } from '@ngrx/store';
import { GameActions, GameApiActions } from './game.actions';
import { Game } from '../../models';

export const GAME_FEATURE_KEY = 'video-game';

export interface GameState {
  games: Game[];
  loading: boolean;
  error: any;
}

const initialState: GameState = {
  games: [],
  loading: false,
  error: null,
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
  }))
);
