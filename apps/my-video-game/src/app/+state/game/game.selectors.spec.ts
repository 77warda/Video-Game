import { Game } from '../../models';
import { GAME_FEATURE_KEY, GameState, initialState } from './game.reducer';
import {
  selectAllGamesData,
  selectCurrentPage,
  selectError,
  selectGameState,
  selectGames,
  selectLoading,
  selectPageSize,
  selectTotalItems,
} from './game.selectors';

describe('Game Selectors', () => {
  const mockGame: Game = {
    id: '1',
    background_image: 'image_url_1',
    name: 'Mock Game 1',
    released: '2023-01-01',
    metacritic_url: 'metacritic_url_1',
    website: 'website_url_1',
    description: 'This is a mock game description.',
    metacritic: 80,
    genres: [{ name: 'Action' }, { name: 'Adventure' }],
    parent_platforms: [
      { platform: { name: 'PC', slug: 'pc' } },
      { platform: { name: 'PlayStation', slug: 'playstation' } },
    ],
    publishers: [{ name: 'Publisher A' }, { name: 'Publisher B' }],
    ratings: [
      { id: 1, count: 100, title: 'Excellent' },
      { id: 2, count: 50, title: 'Good' },
    ],
    screenshots: [{ image: 'screenshot_url_1' }, { image: 'screenshot_url_2' }],
    trailers: [
      { data: { max: 'trailer_url_1' } },
      { data: { max: 'trailer_url_2' } },
    ],
  };

  const mockState: GameState = {
    games: [mockGame],
    loading: true,
    error: 'Error message',
    sortCriteria: 'metacrit',
    totalGames: 10,
    pageSize: 20,
    currentPage: 1,
  };

  const mockRootState = {
    [GAME_FEATURE_KEY]: mockState as GameState,
  };

  it('should select the game state', () => {
    const result = selectGameState(mockRootState);
    expect(result).toEqual(mockState);
  });

  it('should select the games', () => {
    const result = selectGames(mockRootState);
    expect(result).toEqual([mockGame]);
  });

  it('should select the loading state', () => {
    const result = selectLoading(mockRootState);
    expect(result).toEqual(true);
  });

  it('should select the error state', () => {
    const result = selectError(mockRootState);
    expect(result).toEqual('Error message');
  });

  it('should select the total items', () => {
    const result = selectTotalItems(mockRootState);
    expect(result).toEqual(10);
  });

  it('should select the page size', () => {
    const result = selectPageSize(mockRootState);
    expect(result).toEqual(20);
  });

  it('should select the current page', () => {
    const result = selectCurrentPage(mockRootState);
    expect(result).toEqual(1);
  });

  it('should select all games data', () => {
    const result = selectAllGamesData(mockRootState);
    expect(result).toEqual({
      games: [mockGame],
      loading: true,
      total: 10,
      pageSize: 20,
      currentPage: 1,
    });
  });
});
