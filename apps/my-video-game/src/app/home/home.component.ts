import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { selectAllGamesData } from '../+state/game/game.selectors';
import { GameActions } from '../+state/game/game.actions';
import { FascadePatternService } from '../services/fascade-pattern.service';

@Component({
  selector: 'video-game-db-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public sort = 'metacrit';
  allGamesData$!: Observable<any>;

  constructor(
    private router: Router,
    private store: Store,
    private gameFacade: FascadePatternService
  ) {}

  // ngOnInit(): void {
  //   this.allGamesData$ = this.store.pipe(select(selectAllGamesData));
  //   // this.allGamesData$.subscribe((games) => {
  //   //   console.log('page current:', games);
  //   // });
  // }

  // pageChanged(event: any): void {
  //   this.store.dispatch(GameActions.nextPage());
  // }

  // sortGames(sort: string): void {
  //   this.store.dispatch(GameActions.sortGames({ sort }));
  // }
  ngOnInit(): void {
    this.allGamesData$ = this.gameFacade.getAllGamesData();
  }

  pageChanged(event: any): void {
    this.gameFacade.nextPage();
  }

  sortGames(sort: string): void {
    this.gameFacade.sortGames(sort);
  }

  openGameDetails(id: string): void {
    this.router.navigate(['details', id]);
  }
}
