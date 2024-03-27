import { createSelector, createFeatureSelector } from '@ngrx/store';
import { GAME_FEATURE_KEY, GameState } from './game.reducer';

export const selectGameState =
  createFeatureSelector<GameState>(GAME_FEATURE_KEY);

export const selectGames = createSelector(
  selectGameState,
  (state: GameState) => state.games
);

export const selectLoading = createSelector(
  selectGameState,
  (state: GameState) => state.loading
);

export const selectError = createSelector(
  selectGameState,
  (state: GameState) => state.error
);

// export const selectGameDetails = createSelector(
//   selectGameState,
//   (state: GameState) => {
//     console.log(state.details);
//     return state.details.game;
//   }
// );
export const selectTotalItems = createSelector(selectGameState, (state) => {
  console.log('count', state?.totalGames);
  return state?.totalGames;
});

export const selectPageSize = createSelector(selectGameState, (state) => {
  console.log('page size', state.pageSize);
  return state.pageSize;
});
export const selectCurrentPage = createSelector(selectGameState, (state) => {
  console.log('selector currentPage', state.currentPage);
  return state.currentPage;
});
// view selectors
export const selectAllGamesData = createSelector(
  selectGames,
  selectLoading,
  selectTotalItems,
  selectPageSize,
  selectCurrentPage,
  (games, loading, total, pageSize, currentPage) => ({
    games,
    loading,
    total,
    pageSize,
    currentPage,
  })
);
