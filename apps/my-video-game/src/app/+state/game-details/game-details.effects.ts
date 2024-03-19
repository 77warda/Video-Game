import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  GameDetailsActions,
  GameDetailsApiActions,
} from './game-details.actions';

@Injectable()
export class GameEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService,
    private snackbar: MatSnackBar
  ) {}

  loadGameDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameDetailsActions.loadGameDetails),
      mergeMap((action) =>
        this.httpService.getGameDetails(action.id).pipe(
          map((game) => GameDetailsApiActions.loadGameDetailsSuccess({ game })),
          catchError((error) =>
            of(GameDetailsApiActions.loadGameDetailsFailure({ error }))
          )
        )
      )
    )
  );
}
