import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HttpService } from '../services/http.service';
import { APIResponse, Game } from '../models';
import { Store } from '@ngrx/store';
import { selectGames } from '../+state/game/game.selectors';
import { GameActions } from '../+state/game/game.actions';

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
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.games$ = this.store.select(selectGames);
    // this.games$.subscribe((cat) => {
    //   console.log('All games:', cat);
    // });
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['game-search']) {
        this.searchGames('metacrit', params['game-search']);
      } else {
        this.searchGames('metacrit');
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
