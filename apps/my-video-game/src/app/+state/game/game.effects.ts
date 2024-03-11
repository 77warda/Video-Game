import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { GameActions, GameApiActions } from './game.actions';
import { HttpService } from '../../services/http.service';
import { APIResponse, Game } from '../../models';

@Injectable()
export class GameEffects {
  constructor(private actions$: Actions, private httpService: HttpService) {}

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
}
