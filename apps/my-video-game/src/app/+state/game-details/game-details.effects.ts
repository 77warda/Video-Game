import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, tap, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  GameDetailsActions,
  GameDetailsApiActions,
} from './game-details.actions';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectRouteParams } from '../router/router.selectors';
import { ROUTER_NAVIGATION, RouterNavigatedAction } from '@ngrx/router-store';

@Injectable()
export class GameDetailsEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService,
    private store: Store
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
  loadDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((action: RouterNavigatedAction) =>
        action.payload.routerState.url.startsWith('/details')
      ),
      concatLatestFrom(() => this.store.select(selectRouteParams)),
      map(([action, routeParams]) => ({ action, gameId: routeParams['id'] })),
      mergeMap(({ action, gameId }) => {
        return of(GameDetailsActions.loadGameDetails({ id: gameId }));
      })
    )
  );
}
