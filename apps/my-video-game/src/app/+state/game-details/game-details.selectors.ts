import { createSelector, createFeatureSelector } from '@ngrx/store';
import {
  GAME_DETAILS_FEATURE_KEY,
  GameDetailsState,
} from './game-details.reducer';

export const selectGameDetailsState = createFeatureSelector<GameDetailsState>(
  GAME_DETAILS_FEATURE_KEY
);

export const selectGameDetails = createSelector(
  selectGameDetailsState,
  (state: GameDetailsState) => {
    console.log(state);
    return state.gameDetails;
  }
);

export const selectLoading = createSelector(
  selectGameDetailsState,
  (state: GameDetailsState) => state.loading
);

export const selectAllGameDetailsData = createSelector(
  selectGameDetails,
  selectLoading,
  (gameDetail, loading) => ({ gameDetail, loading })
);
