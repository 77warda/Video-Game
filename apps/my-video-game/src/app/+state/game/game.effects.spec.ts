import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { GameActions, GameApiActions } from './game.actions';

import { GameEffects } from './game.effects';
import { HttpService } from '../../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APIResponse, Game } from '../../models';
import { ofType } from '@ngrx/effects';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from '../../home/home.component';
import {
  ROUTER_NAVIGATED,
  ROUTER_NAVIGATION,
  RouterNavigatedAction,
} from '@ngrx/router-store';
import { selectRouteParams } from '../router/router.selectors';

describe('GameEffects', () => {
  let actions$: Observable<any>;
  let effects: GameEffects;
  let httpService: HttpService;
  let snackbar: any;
  let store: MockStore;
  let mockGames: Game[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'search', component: HomeComponent },
        ]),
        StoreModule.forRoot({}),
        HttpClientTestingModule,
      ],
      providers: [
        GameEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        HttpService,
        { provide: MatSnackBar, useValue: snackbar },
      ],
    });

    effects = TestBed.inject(GameEffects);
    store = TestBed.inject(MockStore);
    httpService = TestBed.inject(HttpService);
    snackbar = TestBed.inject(MatSnackBar);

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

  describe('All Effects included here', () => {
    it('should be created', () => {
      expect(effects).toBeTruthy();
    });
    describe('load Games Effect$', () => {
      it('should dispatch loadGameSuccess action on successful API call', () => {
        const gameList: Game[] = mockGames;
        const count = 2;
        const response: APIResponse<Game> = { results: gameList, count };

        const action = GameActions.loadGames();
        const completion = GameApiActions.loadGameSuccess({
          games: gameList,
          count,
        });

        actions$ = of(action);
        const getGameListSpy = jest
          .spyOn(httpService, 'getGameList')
          .mockReturnValue(of(response));

        effects.loadGames$.subscribe((resultAction) => {
          expect(resultAction).toEqual(completion);
          expect(getGameListSpy).toHaveBeenCalled();
        });
      });
      it('should dispatch loadGameFailure action on API call error', () => {
        const error = new Error('Failed to load games');

        const action = GameActions.loadGames();
        const completion = GameApiActions.loadGameFailure({ error });

        actions$ = of(action);
        const getGameListSpy = jest
          .spyOn(httpService, 'getGameList')
          .mockReturnValue(throwError(error));

        effects.loadGames$.subscribe((resultAction) => {
          expect(resultAction).toEqual(completion);
          expect(getGameListSpy).toHaveBeenCalled();
        });
      });
    });
    describe('Get Games Effects', () => {
      it('should return a loadGameSuccess action on successful API call', () => {
        const mockSort = 'metacrit';
        const mockCurrentPage = 1;
        const mockSearch = 'keyword';
        const mockResponse: APIResponse<Game> = {
          results: mockGames,
          count: 1,
        };

        const mockAction = GameActions.getGames({
          sort: mockSort,
          currentPage: mockCurrentPage,
          search: mockSearch,
        });
        const expectedAction = GameApiActions.loadGameSuccess({
          games: mockResponse.results,
          count: mockResponse.count,
        });

        actions$ = of(mockAction);
        httpService.getGameList = jest.fn(() => of(mockResponse));

        effects.getGames$.subscribe((resultAction) => {
          expect(resultAction).toEqual(expectedAction);
        });
      });

      it('should return a loadGameFailure action on API call error', () => {
        const mockSort = 'metacrit';
        const mockCurrentPage = 1;
        const mockSearch = 'keyword';
        const mockError = new Error('Failed to load games');

        const mockAction = GameActions.getGames({
          sort: mockSort,
          currentPage: mockCurrentPage,
          search: mockSearch,
        });
        const expectedAction = GameApiActions.loadGameFailure({
          error: mockError,
        });

        actions$ = of(mockAction);
        httpService.getGameList = jest.fn(() => throwError(mockError));

        effects.getGames$.subscribe((resultAction) => {
          expect(resultAction).toEqual(expectedAction);
        });
      });
    });
    describe('Search games Effects', () => {
      it('should return a searchGamesSuccess action on successful API call', () => {
        const mockSort = 'metacrit';
        const mockSearch = 'keyword';
        const mockResponse: APIResponse<Game> = {
          results: mockGames,
          count: 1,
        };

        const mockAction = GameActions.searchGames({
          sort: mockSort,
          search: mockSearch,
        });
        const expectedAction = GameApiActions.searchGamesSuccess({
          games: mockResponse.results,
          count: mockResponse.count,
        });

        actions$ = of(mockAction);
        httpService.getGameList = jest.fn(() => of(mockResponse));

        effects.searchGames$.subscribe((resultAction) => {
          expect(resultAction).toEqual(expectedAction);
        });
      });

      it('should return a searchGamesFailure action on API call error', () => {
        const mockSort = 'metacrit';
        const mockSearch = 'keyword';
        const mockError = new Error('Failed to search games');

        const mockAction = GameActions.searchGames({
          sort: mockSort,
          search: mockSearch,
        });
        const expectedAction = GameApiActions.searchGamesFailure({
          error: mockError,
        });

        actions$ = of(mockAction);
        httpService.getGameList = jest.fn(() => throwError(mockError));

        effects.searchGames$.subscribe((resultAction) => {
          expect(resultAction).toEqual(expectedAction);
        });
      });
    });
    describe('Sort games Effects', () => {
      it('should return a sortGamesSuccess action on successful API call', () => {
        const mockSort = 'metacrit';
        const mockResponse: APIResponse<Game> = {
          results: mockGames,
          count: 1,
        };

        const mockAction = GameActions.sortGames({ sort: mockSort });
        const expectedAction = GameApiActions.sortGamesSuccess({
          games: mockResponse.results,
          count: mockResponse.count,
        });

        actions$ = of(mockAction);
        httpService.getGameList = jest.fn(() => of(mockResponse));

        effects.sortGames$.subscribe((resultAction) => {
          expect(resultAction).toEqual(expectedAction);
        });
      });

      it('should return a sortGamesFailure action on API call error', () => {
        const mockSort = 'metacrit';
        const mockError = new Error('Failed to sort games');

        const mockAction = GameActions.sortGames({ sort: mockSort });
        const expectedAction = GameApiActions.sortGamesFailure({
          error: mockError,
        });

        actions$ = of(mockAction);
        httpService.getGameList = jest.fn(() => throwError(mockError));

        effects.sortGames$.subscribe((resultAction) => {
          expect(resultAction).toEqual(expectedAction);
        });
      });
    });
    describe('handle error Effects', () => {
      it('should open a snackbar with the correct error message when a loadGameFailure action occurs', () => {
        const mockAction = GameApiActions.loadGameFailure({
          error: new Error('Failed to load games'),
        });

        actions$ = of(mockAction);

        effects.handleError$.subscribe(() => {
          expect(snackbar.open).toHaveBeenCalledWith(
            'Games Loaded Failure',
            'Close'
          );
        });
      });
    });
    describe('Load games router (navigation) Effects', () => {
      it('should dispatch loadGames action when ROUTER_NAVIGATION event occurs with a valid URL', () => {
        const mockRouterAction = {
          type: ROUTER_NAVIGATION,
          payload: {
            routerState: { url: '/games' },
          },
        };
        const mockAction = GameActions.loadGames();
        actions$ = of(mockRouterAction);
        effects.loadGamesRouter$.subscribe((resultAction) => {
          expect(resultAction).toEqual(mockAction);
        });
      });
    });
    describe('search game router (navugation)', () => {
      it('should dispatch search games using queryparams', fakeAsync(() => {
        const mockParams = { sort: 'metacrit' };
        store.overrideSelector(selectRouteParams, {
          url: '/search',
          params: mockParams,
        });

        actions$ = of({ type: ROUTER_NAVIGATED });
        effects.searchGamesRouter$.subscribe((action) => {
          expect(action).toEqual(GameActions.searchGames({ sort: 'metacrit' }));
        });
        flush();
      }));
      it('should dispatch search games using override selectors', () => {
        const mockParams = { sort: 'metacrit' };
        const routerAction = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: { url: '/search' },
          },
        } as RouterNavigatedAction<any>;

        actions$ = of(routerAction);

        store.overrideSelector(selectRouteParams, mockParams);

        const dispatchSpy = jest.spyOn(store, 'dispatch');

        effects.searchGamesRouter$.subscribe();

        expect(dispatchSpy).toHaveBeenCalledWith(
          GameActions.searchGames({ sort: 'metacrit' })
        );
      });

      it('should not dispatch search games if URL does not start with /search', () => {
        const routerAction = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: { url: '/' },
          },
        } as RouterNavigatedAction<any>;

        actions$ = of(routerAction);

        store.overrideSelector(selectRouteParams, { sort: 'metacrit' });

        const dispatchSpy = jest.spyOn(store, 'dispatch');

        effects.searchGamesRouter$.subscribe();

        expect(dispatchSpy).not.toHaveBeenCalled();
      });

      it('should dispatch search games only when route params change', () => {
        const mockParams1 = { sort: 'metacrit', 'game-search': 'test1' };
        const mockParams2 = { sort: 'metacrit', 'game-search': 'test2' };

        const routerAction1 = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: { url: '/search' },
          },
        } as RouterNavigatedAction<any>;

        const routerAction2 = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: { url: '/search' },
          },
        } as RouterNavigatedAction<any>;

        actions$ = of(routerAction1, routerAction2);

        store.overrideSelector(selectRouteParams, mockParams1);

        const dispatchSpy = jest.spyOn(store, 'dispatch');

        effects.searchGamesRouter$.subscribe();
        store.overrideSelector(selectRouteParams, mockParams2);
        effects.searchGamesRouter$.subscribe();

        expect(dispatchSpy).toHaveBeenCalledTimes(2);

        // Reset dispatch spy and selector value
        jest.clearAllMocks();
        store.overrideSelector(selectRouteParams, mockParams2);

        effects.searchGamesRouter$.subscribe();
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('Page Changing router (navugation)', () => {
      it('should dispatch getGames action with page when page route param exists', fakeAsync(() => {
        const mockParams = { page: '2', 'game-search': 'test' };
        const routerAction = {
          type: ROUTER_NAVIGATION,
          payload: {
            routerState: { url: '/games', root: { queryParams: mockParams } },
          },
        };

        actions$ = of(routerAction);

        store.overrideSelector(selectRouteParams, mockParams);

        const dispatchSpy = jest.spyOn(store, 'dispatch');

        effects.changePageRouter$.subscribe();

        expect(dispatchSpy).toHaveBeenCalledWith(
          GameActions.getGames({
            sort: 'metacrit',
            currentPage: 2,
            search: 'test',
          })
        );
      }));

      it('should dispatch getGames action without page when page route param is not present', fakeAsync(() => {
        const mockParams = { 'game-search': 'test' };
        const routerAction = {
          type: ROUTER_NAVIGATION,
          payload: {
            routerState: { url: '/games', root: { queryParams: mockParams } },
          },
        };

        actions$ = of(routerAction);

        store.overrideSelector(selectRouteParams, mockParams);

        const dispatchSpy = jest.spyOn(store, 'dispatch');

        effects.changePageRouter$.subscribe();

        expect(dispatchSpy).toHaveBeenCalledWith(
          GameActions.getGames({
            sort: 'metacrit',
            currentPage: 1,
            search: 'test',
          })
        );
      }));

      it('should not dispatch getGames action if page route param is not present', fakeAsync(() => {
        const mockParams = { 'game-search': 'test' };
        const routerAction = {
          type: ROUTER_NAVIGATION,
          payload: {
            routerState: { url: '/' },
          },
        };

        actions$ = of(routerAction);

        store.overrideSelector(selectRouteParams, mockParams);

        const dispatchSpy = jest.spyOn(store, 'dispatch');

        effects.changePageRouter$.subscribe();

        expect(dispatchSpy).not.toHaveBeenCalled();
      }));

      it('should not dispatch getGames action if page route param remains unchanged', fakeAsync(() => {
        const mockParams = { page: '2', 'game-search': 'test' };
        const routerAction1 = {
          type: ROUTER_NAVIGATION,
          payload: {
            routerState: { url: '/games', root: { queryParams: mockParams } },
          },
        };

        const routerAction2 = {
          type: ROUTER_NAVIGATION,
          payload: {
            routerState: { url: '/games', root: { queryParams: mockParams } },
          },
        };

        actions$ = of(routerAction1, routerAction2);

        store.overrideSelector(selectRouteParams, mockParams);

        const dispatchSpy = jest.spyOn(store, 'dispatch');

        effects.changePageRouter$.subscribe();

        expect(dispatchSpy).toHaveBeenCalledTimes(1); // Expect only one dispatch since page param remains unchanged
      }));
    });
  });
});
