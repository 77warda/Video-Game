import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import {
  GameDetailsActions,
  GameDetailsApiActions,
} from './game-details.actions';
import { HttpService } from '../../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APIResponse, Game } from '../../models';
import { ofType } from '@ngrx/effects';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from '../../home/home.component';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { GameDetailsEffects } from './game-details.effects';

describe('GameEffects', () => {
  let actions$: Observable<any>;
  let effects: GameDetailsEffects;
  let httpService: HttpService;
  let snackbar: any;
  let store: MockStore;

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
        GameDetailsEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        HttpService,
        { provide: MatSnackBar, useValue: snackbar },
      ],
    });

    effects = TestBed.inject(GameDetailsEffects);
    store = TestBed.inject(MockStore);
    httpService = TestBed.inject(HttpService);
    snackbar = TestBed.inject(MatSnackBar);
  });

  describe('All Effects included here', () => {
    let mockGameDetail: any;
    let mockError: any;
    beforeEach(() => {
      (mockGameDetail = {
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
    it('should be created', () => {
      expect(effects).toBeTruthy();
    });
    describe('loadDetails$ Effect', () => {
      it('should load Categories successfully', fakeAsync(() => {
        const game = mockGameDetail;
        const action = GameDetailsActions.loadGameDetails({ id: '1' });
        jest.spyOn(httpService, 'getGameDetails').mockReturnValue(of(game));

        actions$ = of(action);
        const expected = GameDetailsApiActions.loadGameDetailsSuccess({ game });

        effects.loadGameDetails$.subscribe((result) => {
          expect(result).toEqual(expected);
        });
        flush();
      }));
      it('should handle errors when loading categories', fakeAsync(() => {
        const error = new Error('Failed to load categories');
        const action = GameDetailsActions.loadGameDetails({ id: '1' });
        const state = { quizApp: { categories: {} } };
        actions$ = of(action);
        store.setState(state);
        jest
          .spyOn(httpService, 'getGameDetails')
          .mockReturnValue(throwError(error));

        const expected = GameDetailsApiActions.loadGameDetailsFailure({
          error,
        });

        effects.loadGameDetails$.subscribe((result) => {
          expect(result).toEqual(expected);
        });
        flush();
      }));
    });

    describe('loadDetails$ Router (navigation) Effects', () => {
      it('should not dispatch loadGameDetails action for other routes', fakeAsync(() => {
        const mockParams = { id: '1' };
        const mockAction = {
          payload: {
            routerState: {
              url: '/search',
              params: mockParams,
            },
          },
        };

        actions$ = of(mockAction as any);

        effects.loadDetails$.subscribe((resultAction) => {
          expect(resultAction).toBeFalsy();
        });
        flush();
      }));

      it('should dispatch loadGameDetails action with correct id when navigating to /details/:id', fakeAsync(() => {
        const mockParams = { id: '2' };
        const mockAction = {
          payload: {
            routerState: {
              url: '/details/2',
              params: mockParams,
            },
          },
        };

        const expectedAction = GameDetailsActions.loadGameDetails({ id: '2' });

        actions$ = of(mockAction as any);

        effects.loadDetails$.subscribe((resultAction) => {
          expect(resultAction).toEqual(expectedAction);
        });
        flush();
      }));

      it('should dispatch loadGameDetails action when navigation to /details', fakeAsync(() => {
        const mockParams = { id: '1' };
        const mockAction = {
          payload: {
            routerState: {
              url: '/details',
              params: mockParams,
            },
          },
        };

        const expectedAction = GameDetailsActions.loadGameDetails({ id: '1' });

        actions$ = of(mockAction as any);
        jest.spyOn(store, 'select').mockReturnValue(of(mockParams));

        effects.loadDetails$.subscribe((resultAction) => {
          expect(resultAction).toEqual(expectedAction);
        });
        flush();
      }));
    });
  });
});
