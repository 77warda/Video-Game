import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Game } from '../models';
import { HttpService } from '../services/http.service';
import { Store, select } from '@ngrx/store';
import { GameDetailsActions } from '../+state/game-details/game-details.actions';
import {
  selectAllGameDetailsData,
  selectGameDetails,
  selectLoading,
} from '../+state/game-details/game-details.selectors';
import { selectRouteParams } from '../+state/router/router.selectors';

@Component({
  selector: 'video-game-db-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  // gameRating = 0;
  gameId!: string;
  routeSub!: Subscription;
  gameSub!: Subscription;
  allGameDetails$!: Observable<any>;
  loading$!: Observable<boolean>;
  params$!: Observable<any>;

  constructor(private activatedRoute: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    // this.params$ = this.store.select(selectRouteParams);
    // this.params$.subscribe((games) => {
    //   this.gameId = games.id;
    //   console.log('all:', games);
    // });
    // this.store.dispatch(
    //   GameDetailsActions.loadGameDetails({ id: this.gameId })
    // );

    // this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
    //   this.gameId = params['id'];
    // this.store.dispatch(
    //   GameDetailsActions.loadGameDetails({ id: this.gameId })
    // );
    // });
    // this.store.dispatch(
    //   GameDetailsActions.loadGameDetails({ id: this.gameId })
    // );
    this.allGameDetails$ = this.store.select(selectAllGameDetailsData);
    // this.allGameDetails$.subscribe((games) => {
    //   console.log('all details:', games);
    // });
    // this.loading$ = this.store.pipe(select(selectLoading));
  }
  // getColor(value: number): string {
  //   if (value > 75) {
  //     return '#5ee432';
  //   } else if (value > 50) {
  //     return '#fffa50';
  //   } else if (value > 30) {
  //     return '#f7aa38';
  //   } else {
  //     return '#ef4655';
  //   }
  // }

  ngOnDestroy(): void {
    // if (this.gameSub) {
    //   this.gameSub.unsubscribe();
    // }

    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
