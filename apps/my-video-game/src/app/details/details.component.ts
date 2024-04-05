import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAllGameDetailsData } from '../+state/game-details/game-details.selectors';
import { FascadePatternService } from '../services/fascade-pattern.service';

@Component({
  selector: 'video-game-db-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  allGameDetails$!: Observable<any>;
  constructor(
    private store: Store,
    private gameFacade: FascadePatternService
  ) {}

  ngOnInit(): void {
    // this.allGameDetails$ = this.store.select(selectAllGameDetailsData);
    this.allGameDetails$ = this.gameFacade.getGameDetails();
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
}
