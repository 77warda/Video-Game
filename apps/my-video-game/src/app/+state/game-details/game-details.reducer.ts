import { createReducer, on } from '@ngrx/store';
import { Game } from '../../models';
import {
  GameDetailsActions,
  GameDetailsApiActions,
} from './game-details.actions';

export const GAME_DETAILS_FEATURE_KEY = 'video-game';

export interface GameDetailsState {
  games: Game[];
  loading: boolean;
  error: any;
  sortCriteria: string;
  totalGames: number;
  details: DetailsState;
  pageSize: number;
  currentPage: number;
}
export interface DetailsState {
  game: Game | null;
}

const initialState: GameDetailsState = {
  games: [],
  loading: false,
  error: null,
  sortCriteria: '',
  totalGames: 0,
  details: {
    game: null,
  },
  pageSize: 10,
  currentPage: 0,
};

export const gameReducer = createReducer(
  initialState,

  on(GameDetailsActions.loadGameDetails, (state) => ({
    ...state,
    loading: true,
    details: {
      ...state.details,
    },
  })),
  on(GameDetailsApiActions.loadGameDetailsSuccess, (state, { game }) => ({
    ...state,
    loading: false,
    details: {
      ...state.details,
      game,
    },
  })),
  on(GameDetailsApiActions.loadGameDetailsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    details: {
      ...state.details,
      error,
    },
  }))
);
