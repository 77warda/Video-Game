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
    console.log(state.details);
    return state.details.game;
  }
);

export const selectPageSize = createSelector(
  selectGameDetailsState,
  (state) => {
    console.log('page size', state.pageSize);
    return state.pageSize;
  }
);
export const selectCurrentPage = createSelector(
  selectGameDetailsState,
  (state) => {
    console.log('selector currentPage', state.currentPage);
    return state.currentPage;
  }
);
