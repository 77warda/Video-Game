import { gameDetailsReducer, initialState } from './game-details.reducer';
import {
  GameDetailsActions,
  GameDetailsApiActions,
} from './game-details.actions';
import { Game } from '../../models';

describe('GameDetailsReducer', () => {
  let mockGameDetails: any;
  let mockError: any;
  beforeEach(() => {
    (mockGameDetails = {
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
      screenshots: [
        { image: 'screenshot_url_1' },
        { image: 'screenshot_url_2' },
      ],
      trailers: [
        { data: { max: 'trailer_url_1' } },
        { data: { max: 'trailer_url_2' } },
      ],
    }),
      (mockError = 'Failed to load game details');
  });

  it('should create the loadGameDetails action', () => {
    const action = GameDetailsActions.loadGameDetails({
      id: mockGameDetails.id,
    });

    expect(action.id).toBe('1');
  });
  it('should set loading to false and update gameDetails and gameRating on loadGameDetailsSuccess action', () => {
    const action = GameDetailsApiActions.loadGameDetailsSuccess({
      game: mockGameDetails,
    });
    const newState = gameDetailsReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.gameDetails).toEqual(mockGameDetails);
    expect(newState.gameRating).toBe(mockGameDetails.metacritic);
  });

  it('should set loading to false and update error on loadGameDetailsFailure action', () => {
    const action = GameDetailsApiActions.loadGameDetailsFailure({
      error: mockError,
    });
    const newState = gameDetailsReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(mockError);
  });
});
