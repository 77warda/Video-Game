import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Game } from '../models';
import { HttpService } from '../services/http.service';
import { Store, select } from '@ngrx/store';
import { GameActions } from '../+state/game/game.actions';
import {
  selectGameDetails,
  selectLoading,
} from '../+state/game/game.selectors';

@Component({
  selector: 'video-game-db-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  gameRating = 0;
  gameId!: string;
  // game!: Game;
  routeSub!: Subscription;
  gameSub!: Subscription;
  gameDetails$!: Observable<any>;
  loading$!: Observable<boolean>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      this.gameId = params['id'];
      this.store.dispatch(GameActions.loadGameDetails({ id: this.gameId }));
    });
    this.gameDetails$ = this.store.select(selectGameDetails);
    this.loading$ = this.store.pipe(select(selectLoading));
    // this.gameDetails$.subscribe((cat) => {
    //   console.log('All games:', cat?.game);
    // });
  }
  getColor(value: number): string {
    if (value > 75) {
      return '#5ee432';
    } else if (value > 50) {
      return '#fffa50';
    } else if (value > 30) {
      return '#f7aa38';
    } else {
      return '#ef4655';
    }
  }

  ngOnDestroy(): void {
    if (this.gameSub) {
      this.gameSub.unsubscribe();
    }

    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
