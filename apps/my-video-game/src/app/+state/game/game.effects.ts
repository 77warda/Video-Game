import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import {
  mergeMap,
  map,
  catchError,
  tap,
  filter,
  distinctUntilChanged,
  withLatestFrom,
  take,
  concatMap,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { GameActions, GameApiActions } from './game.actions';
import { HttpService } from '../../services/http.service';
import { APIResponse, Game } from '../../models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store, select } from '@ngrx/store';
import { selectRouteParams } from '../router/router.selectors';
import {
  ROUTER_NAVIGATED,
  ROUTER_NAVIGATION,
  RouterNavigatedAction,
} from '@ngrx/router-store';
import { selectCurrentPage, selectPageSize } from './game.selectors';

@Injectable()
export class GameEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService,
    private snackbar: MatSnackBar,
    private store: Store
  ) {}
  //Routing effects for Load Games

  loadGamesRouter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (action: RouterNavigatedAction) =>
          action.payload.routerState.url.startsWith('/') &&
          !action.payload.routerState.url.startsWith('/search')
      ),
      mergeMap(() => of(GameActions.loadGames()))
    )
  );
  //Routing effects for Search Games

  searchGamesRouter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      filter((action: RouterNavigatedAction) =>
        action.payload.routerState.url.startsWith('/search')
      ),
      concatLatestFrom(() => this.store.select(selectRouteParams)),
      distinctUntilChanged((prev, curr) => {
        return prev[1]['game-search'] === curr[1]['game-search'];
      }),
      mergeMap(([_, routeParams]) =>
        of(
          GameActions.searchGames({
            sort: 'metacrit',
            search: routeParams['game-search'],
          })
        )
      )
    )
  );
  //Routing effects for page changing

  changePageRouter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      concatLatestFrom(() => this.store.pipe(select(selectRouteParams))),
      filter(([action, routeParams]) => {
        return !!routeParams['page'];
      }),
      distinctUntilChanged(([, prevRouteParams], [, currRouteParams]) => {
        return prevRouteParams['page'] === currRouteParams['page'];
      }),
      map(([action, routeParams]) => {
        const currentPage = routeParams['page'] ? +routeParams['page'] : 1;
        const searchParam = routeParams['game-search'];
        const sort = 'metacrit';

        if (searchParam) {
          return GameActions.getGames({
            sort,
            currentPage,
            search: searchParam,
          });
        } else {
          return GameActions.getGames({ sort, currentPage });
        }
      })
    )
  );
  //load and get games
  loadGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.loadGames),
      mergeMap(() =>
        this.httpService.getGameList('metacrit').pipe(
          map((response: APIResponse<Game>) =>
            GameApiActions.loadGameSuccess({
              games: response.results,
              count: response.count,
            })
          ),
          catchError((error) => of(GameApiActions.loadGameFailure({ error })))
        )
      )
    )
  );

  getGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.getGames),
      mergeMap(({ sort, currentPage, search }) =>
        this.httpService.getGameList(sort, currentPage, undefined, search).pipe(
          map((response: APIResponse<Game>) =>
            GameApiActions.loadGameSuccess({
              games: response.results,
              count: response.count,
            })
          ),
          catchError((error) => of(GameApiActions.loadGameFailure({ error })))
        )
      )
    )
  );
  //Effect for sorting
  sortGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.sortGames),
      mergeMap(({ sort }) =>
        this.httpService.getGameList(sort).pipe(
          map((response: APIResponse<Game>) =>
            GameApiActions.sortGamesSuccess({
              games: response.results,
              count: response.count,
            })
          ),
          catchError((error) => of(GameApiActions.sortGamesFailure({ error })))
        )
      )
    )
  );

  searchGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.searchGames),
      concatLatestFrom(() => [
        this.store.pipe(select(selectCurrentPage)),
        this.store.pipe(select(selectPageSize)),
      ]),
      concatMap(([action, currentPage, pageSize]) =>
        this.httpService
          .getGameList(action.sort, currentPage + 1, pageSize, action.search)
          .pipe(
            map((response: APIResponse<Game>) =>
              GameApiActions.searchGamesSuccess({
                games: response.results,
                count: response.count,
              })
            ),
            catchError((error) =>
              of(GameApiActions.searchGamesFailure({ error }))
            )
          )
      )
    )
  );

  //Effects for pagination
  nextPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.nextPage),
      concatLatestFrom(() => [
        this.store.select(selectCurrentPage),
        this.store.select(selectRouteParams),
      ]),
      tap(console.log),
      map(([action, currentPageIdx, routeParams]) => ({
        currentPage: currentPageIdx + 1,
        search: routeParams['game-search'],
      })),
      tap(console.log),
      concatMap(({ currentPage, search }) => {
        return [
          GameActions.getGames({
            sort: 'metacrit',
            currentPage,
            search,
          }),
        ];
      })
    )
  );

  //Effects for Handling Errors
  handleError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GameApiActions.loadGameFailure),
        tap((action) => {
          const errorMessages: { [key: string]: string } = {
            [GameApiActions.loadGameFailure.type]: 'Games Loaded Failure',
          };
          const errormessage =
            errorMessages[action.type] ||
            'Something went wrong please try later';
          this.snackbar.open(errormessage, 'Close');
        })
      ),
    { dispatch: false }
  );
}
