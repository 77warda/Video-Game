import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpErrorsInterceptor } from './interceptors/http-errors.interceptor';
import { HttpHeadersInterceptor } from './interceptors/http-headers.interceptor';
import { DetailsComponent } from './details/details.component';
import { GameTabsComponent } from './game-tabs/game-tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as videoGame from './+state/game/game.reducer';
import * as gameDetails from './+state/game-details/game-details.reducer';
import { GameEffects } from './+state/game/game.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { GaugeModule } from 'angular-gauge';
import { GameDetailsEffects } from './+state/game-details/game-details.effects';
import {
  RouterState,
  StoreRouterConnectingModule,
  routerReducer,
} from '@ngrx/router-store';

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    HomeComponent,
    DetailsComponent,
    GameTabsComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    GaugeModule.forRoot(),
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatPaginatorModule,
    StoreModule,
    StoreModule.forRoot({ router: routerReducer }),
    StoreModule.forFeature(videoGame.GAME_FEATURE_KEY, videoGame.gameReducer),
    StoreModule.forFeature(
      gameDetails.GAME_DETAILS_FEATURE_KEY,
      gameDetails.gameDetailsReducer
    ),
    EffectsModule.forFeature([GameEffects, GameDetailsEffects]),
    EffectsModule.forRoot([GameEffects, GameDetailsEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    StoreRouterConnectingModule.forRoot({ routerState: RouterState.Minimal }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeadersInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorsInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
