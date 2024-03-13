import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { GameActions, GameApiActions } from './game.actions';
import { HttpService } from '../../services/http.service';
import { APIResponse, Game } from '../../models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class GameEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService,
    private snackbar: MatSnackBar
  ) {}

  loadGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.loadGames),
      mergeMap(() =>
        this.httpService.getGameList('metacrit').pipe(
          map((response: APIResponse<Game>) =>
            GameApiActions.loadGameSuccess({ games: response.results })
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
        this.httpService.getGameList(sort, search).pipe(
          map((response: APIResponse<Game>) =>
            GameApiActions.searchGamesSuccess({ games: response.results })
          ),
          catchError((error) =>
            of(GameApiActions.searchGamesFailure({ error }))
          )
        )
      )
    )
  );
  loadGameDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.loadGameDetails),
      mergeMap((action) =>
        this.httpService.getGameDetails(action.id).pipe(
          map((game) => GameApiActions.loadGameDetailsSuccess({ game })),
          catchError((error) =>
            of(GameApiActions.loadGameDetailsFailure({ error }))
          )
        )
      )
    )
  );
}
