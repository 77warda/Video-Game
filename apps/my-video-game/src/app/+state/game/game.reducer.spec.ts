import { Action } from '@ngrx/store';
import { gameReducer, initialState } from './game.reducer';
import { GameActions, GameApiActions } from './game.actions';
import { Game } from '../../models';

describe('Game Reducer', () => {
  let mockGames: Game[];

  beforeEach(() => {
    mockGames = [
      {
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
      },
    ];
  });

  afterEach(() => {
    mockGames = [];
  });
  it('should return the initial state', () => {
    const action = {} as any;
    const state = gameReducer(undefined, action);

    expect(state).toBe(initialState);
  });

  it('should handle loadGames and searchGames actions', () => {
    const action = GameActions.loadGames();
    const state = gameReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.currentPage).toBe(0);
  });

  it('should handle loadGameSuccess action', () => {
    const games: Game[] = mockGames;
    const count = 1;
    const action = GameApiActions.loadGameSuccess({ games, count });
    const state = gameReducer(initialState, action);

    expect(state.games).toEqual(games);
    expect(state.loading).toBe(false);
    expect(state.totalGames).toBe(count);
    expect(state.error).toBe(null);
  });

  it('should handle loadGameFailure action', () => {
    const error = 'Error message';
    const action = GameApiActions.loadGameFailure({ error });
    const state = gameReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });

  it('should handle nextPage action', () => {
    const action = GameActions.nextPage();
    const state = gameReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.currentPage).toBe(initialState.currentPage + 1);
  });

  it('should handle setPageSize action', () => {
    const pageSize = 10;
    const action = GameActions.setPageSize({ pageSize });
    const state = gameReducer(initialState, action);

    expect(state.pageSize).toBe(pageSize);
  });

  it('should handle searchGamesSuccess action', () => {
    const games: Game[] = mockGames;
    const count = 1;
    const action = GameApiActions.searchGamesSuccess({ games, count });
    const state = gameReducer(initialState, action);

    expect(state.games).toEqual(games);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.totalGames).toBe(count);
  });

  it('should handle searchGamesFailure action', () => {
    const error = 'Error message';
    const action = GameApiActions.searchGamesFailure({ error });
    const state = gameReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });

  it('should handle sortGames action', () => {
    const sortCriteria = 'name';
    const action = GameActions.sortGames({ sort: sortCriteria });
    const state = gameReducer(initialState, action);

    expect(state.sortCriteria).toBe(sortCriteria);
  });

  it('should handle sortGamesSuccess action', () => {
    const games: Game[] = mockGames;
    const count = 1;
    const action = GameApiActions.sortGamesSuccess({ games, count });
    const state = gameReducer(initialState, action);

    expect(state.games).toEqual(games);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.totalGames).toBe(count);
  });

  it('should handle sortGamesFailure action', () => {
    const error = 'Error message';
    const action = GameApiActions.sortGamesFailure({ error });
    const state = gameReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });
});
