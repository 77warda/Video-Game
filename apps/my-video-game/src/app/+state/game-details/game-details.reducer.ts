import { createReducer, on } from '@ngrx/store';
import { Game } from '../../models';
import {
  GameDetailsActions,
  GameDetailsApiActions,
} from './game-details.actions';

export const GAME_DETAILS_FEATURE_KEY = 'gameDetails';

export interface GameDetailsState {
  loading: boolean;
  error: null;
  gameRating: number;
  gameDetails: Game | null;
}

export const initialState: GameDetailsState = {
  loading: false,
  error: null,
  gameRating: 0,
  gameDetails: null,
};

export const gameDetailsReducer = createReducer(
  initialState,

  on(GameDetailsActions.loadGameDetails, (state) => ({
    ...state,
    loading: true,
  })),
  on(GameDetailsApiActions.loadGameDetailsSuccess, (state, { game }) => ({
    ...state,
    loading: false,
    gameDetails: game,
    gameRating: game.metacritic,
  })),
  on(GameDetailsApiActions.loadGameDetailsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
