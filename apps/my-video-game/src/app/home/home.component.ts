import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HttpService } from '../services/http.service';
import { APIResponse, Game } from '../models';
import { Store, select } from '@ngrx/store';
import { selectGames, selectLoading } from '../+state/game/game.selectors';
import { GameActions, GameApiActions } from '../+state/game/game.actions';

@Component({
  selector: 'video-game-db-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public sort!: string;
  // public games!: Array<Game>;
  private routeSub!: Subscription;
  // private gameSub!: Subscription;
  games$!: Observable<any>;
  loading$!: Observable<boolean>;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.games$ = this.store.select(selectGames);
    this.loading$ = this.store.pipe(select(selectLoading));
    // this.store.pipe(select(selectGames)).subscribe((games) => {
    //   if (!games) {
    //     this.store.dispatch(GameActions.loadGames());
    //   }
    // });
    // this.games$.subscribe((cat) => {
    //   console.log('All games:', cat);
    // });
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['game-search']) {
        this.searchGames('metacrit', params['game-search']);
      } else {
        // this.searchGames('metacrit');
        this.store.dispatch(GameActions.loadGames());
      }
    });
  }

  searchGames(sort: string, search?: string): void {
    // this.gameSub = this.httpService
    //   .getGameList(sort, search)
    //   .subscribe((gameList: APIResponse<Game>) => {
    //     this.games = gameList.results;
    //     console.log(gameList.results);
    //   });
    this.store.dispatch(GameActions.searchGames({ sort, search }));
  }
  sortGames(sort: string): void {
    this.store.dispatch(GameActions.sortGames({ sort }));
  }

  openGameDetails(id: string): void {
    this.router.navigate(['details', id]);
  }

  ngOnDestroy(): void {
    // if (this.gameSub) {
    //   this.gameSub.unsubscribe();
    //   console.log('destroy');
    // }

    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
