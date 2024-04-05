import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAllGamesData } from '../+state/game/game.selectors';
import { GameActions } from '../+state/game/game.actions';
import { selectAllGameDetailsData } from '../+state/game-details/game-details.selectors';

@Injectable({
  providedIn: 'root',
})
export class FascadePatternService {
  constructor(private store: Store) {}

  getAllGamesData(): Observable<any> {
    return this.store.select(selectAllGamesData);
  }
  getGameDetails(): Observable<any> {
    return this.store.select(selectAllGameDetailsData);
  }

  nextPage() {
    this.store.dispatch(GameActions.nextPage());
  }

  sortGames(sort: string) {
    this.store.dispatch(GameActions.sortGames({ sort }));
  }
}
