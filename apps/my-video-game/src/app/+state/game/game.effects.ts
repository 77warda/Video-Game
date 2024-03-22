import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { GameActions, GameApiActions } from './game.actions';
import { HttpService } from '../../services/http.service';
import { APIResponse, Game } from '../../models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { selectRouteParams } from '../router/router.selectors';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';

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
      mergeMap(() => of(GameActions.nextPageLoadingComplete()))
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
      concatLatestFrom(() => this.store.select(selectRouteParams)),
      tap(([action, routeParams]) => {
        console.log('Route Params:', routeParams);
      }),
      mergeMap(([action, routeParams]) => {
        const page = routeParams['page'] ? +routeParams['page'] : 1;
        this.store.dispatch(GameActions.setCurrentPage({ currentPage: page }));
        if (routeParams['game-search']) {
          return of(
            GameActions.searchGames({
              sort: 'metacrit',
              search: routeParams['game-search'],
            })
          );
        } else {
          return of(GameActions.loadGames());
        }
      })
    )
  );
}
