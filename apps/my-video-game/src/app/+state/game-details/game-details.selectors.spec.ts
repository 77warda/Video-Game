import { Game } from '../../models';
import {
  GAME_DETAILS_FEATURE_KEY,
  GameDetailsState,
} from './game-details.reducer';
import {
  selectAllGameDetailsData,
  selectGameDetails,
  selectLoading,
} from './game-details.selectors';

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

  const mockState: GameDetailsState = {
    loading: false,
    error: null,
    gameRating: 30,
    gameDetails: mockGame,
  };

  const mockRootState = {
    [GAME_DETAILS_FEATURE_KEY]: mockState as GameDetailsState,
  };

  it('should select the game Details', () => {
    const result = selectGameDetails(mockRootState);
    expect(result).toEqual(mockGame);
  });
  it('should select the loading state', () => {
    const loadingResult = selectLoading(mockRootState);
    expect(loadingResult).toEqual(false);
  });

  it('should select all game details data', () => {
    const allGameData = selectAllGameDetailsData(mockRootState);
    expect(allGameData.gameDetail).toEqual(mockGame);
    expect(allGameData.loading).toEqual(false);
  });
});
