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
import { ROUTER_NAVIGATION, RouterNavigatedAction } from '@ngrx/router-store';
import { selectCurrentPage } from './game.selectors';

@Injectable()
export class GameEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService,
    private snackbar: MatSnackBar,
    private store: Store
  ) {}

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

  nextPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.nextPage),
      tap(() => this.store.dispatch(GameActions.nextPageLoading())),
      mergeMap(() => of(GameActions.nextPageLoadingComplete())),
      concatMap(() => {
        // Get the current state to determine the next page to fetch
        return this.store.pipe(
          select(selectCurrentPage),
          take(1), // Take only one value from the observable
          withLatestFrom(this.store.pipe(select(selectRouteParams))),
          map(([currentPage, routeParams]) => {
            const nextPage = currentPage + 1;
            const searchParam = routeParams['game-search'];
            return GameActions.getGames({
              sort: 'metacrit',
              currentPage: nextPage,
              search: searchParam,
            });
          })
        );
      })
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

  searchGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.searchGames),
      mergeMap(({ sort, search }) =>
        this.httpService
          .getGameList(sort, 1, 40, search ? search.toString() : undefined)
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
  searchGamesRouter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((action: RouterNavigatedAction) =>
        action.payload.routerState.url.startsWith('/search')
      ),
      concatLatestFrom(() => this.store.select(selectRouteParams)),
      distinctUntilChanged((prev, curr) => {
        console.log('prev', prev[1]);
        console.log('current', curr[1]);
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

  nextpageRouter$ = createEffect(() =>
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
}
