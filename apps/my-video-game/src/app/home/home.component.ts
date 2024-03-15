import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import {
  selectGames,
  selectLoading,
  selectTotalItems,
} from '../+state/game/game.selectors';
import { GameActions } from '../+state/game/game.actions';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'video-game-db-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public pageSize = 10;
  public currentPage = 0;
  public sort = 'name';
  private routeSub: Subscription | undefined;

  games$!: Observable<any>;
  loading$!: Observable<boolean>;
  totalItems$!: Observable<number>;

  games: any[] = [];
  loading = false;
  totalItems = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.games$ = this.store.select(selectGames);
    this.loading$ = this.store.pipe(select(selectLoading));
    this.totalItems$ = this.store.pipe(select(selectTotalItems));

    // this.totalItems$.subscribe((cat) => {
    //   console.log('All count:', cat);
    // });
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      const page = params['page'];
      this.currentPage = page ? +page : 1;
      if (params['game-search']) {
        this.searchGames('metacrit', params['game-search']);
      } else {
        this.store.dispatch(GameActions.loadGames());
      }
    });
    // this.routeSub = this.activatedRoute.queryParams
    //   .pipe(
    //     switchMap((params: Params) => {
    //       const page = params['page'];
    //       const search = params['game-search'];
    //       this.currentPage = page ? +page : 1;

    //       // Fetch games based on the current query parameters
    //       return this.httpService.getGameList(
    //         this.sort,
    //         this.currentPage,
    //         undefined,
    //         search
    //       );
    //     })
    //   )
    //   .subscribe((response) => {
    //     this.loading = false;
    //     this.games = response.results;
    //     this.totalItems = response.count;
    //     console.log('res is', response);
    //   });
  }

  pageChanged(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
    });
    this.store.dispatch(
      GameActions.getGames({ sort: this.sort, currentPage: this.currentPage })
    );
  }

  // getGames(): void {
  //   this.loading = true;
  //   this.httpService
  //     .getGameList(this.sort, this.currentPage)
  //     .subscribe((response) => {
  //       this.loading = false;
  //       this.games = response.results;
  //       this.totalItems = response.count;
  //       console.log('res is', response);
  //     });
  // }

  searchGames(sort: string, search?: string, page?: number): void {
    this.store.dispatch(GameActions.searchGames({ sort, search }));
  }

  sortGames(sort: string): void {
    this.store.dispatch(GameActions.sortGames({ sort }));
  }

  openGameDetails(id: string): void {
    this.router.navigate(['details', id]);
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
