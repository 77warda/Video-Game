import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { selectAllGamesData } from '../+state/game/game.selectors';
import { GameActions } from '../+state/game/game.actions';

@Component({
  selector: 'video-game-db-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public sort = 'metacrit';
  // private routeSub: Subscription | undefined;

  allGamesData$!: Observable<any>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.allGamesData$ = this.store.pipe(select(selectAllGamesData));
    this.allGamesData$.subscribe((games) => {
      console.log('page current:', games);
    });
    // ==========
    // this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
    //   // const page = params['page'];
    //   // this.currentPage = page ? +page : 1;
    //   if (params['game-search']) {
    //     this.searchGames('metacrit', params['game-search']);
    //   } else {
    //     this.store.dispatch(GameActions.loadGames());
    //   }
    // });
  }

  pageChanged(event: any): void {
    const currentPage = event.pageIndex + 1;
    this.store.dispatch(GameActions.nextPage());

    // this.activatedRoute.paramMap
    //   .pipe(map((params) => params.get('game-search')))
    //   .subscribe((searchParam) => {
    //     if (searchParam) {
    //       this.router.navigate([], {
    //         relativeTo: this.activatedRoute,
    //         queryParams: {
    //           page: currentPage,
    //           gameSearch: searchParam,
    //         },
    //         queryParamsHandling: 'merge',
    //       });

    //       this.store.dispatch(
    //         GameActions.getGames({
    //           sort: this.sort,
    //           currentPage: currentPage,
    //           search: searchParam,
    //         })
    //       );
    //     } else {
    //       this.store.dispatch(
    //         GameActions.getGames({
    //           sort: this.sort,
    //           currentPage: currentPage,
    //         })
    //       );
    //     }
    //   });
  }

  // searchGames(sort: string, search?: string): void {
  //   this.store.dispatch(GameActions.searchGames({ sort, search }));
  // }

  sortGames(sort: string): void {
    this.store.dispatch(GameActions.sortGames({ sort }));
  }

  openGameDetails(id: string): void {
    this.router.navigate(['details', id]);
  }

  // ngOnDestroy(): void {
  //   if (this.routeSub) {
  //     this.routeSub.unsubscribe();
  //   }
  // }
}
