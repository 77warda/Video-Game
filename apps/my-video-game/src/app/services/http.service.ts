import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment as env } from '../environments/environment';
import { APIResponse, Game } from '../models';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getGameList(
    ordering: string,
    pageNumber: number = 1,
    pageSize: number = 20,
    search?: string
  ): Observable<APIResponse<Game>> {
    let params = new HttpParams()
      .set('ordering', ordering)
      .set('page', pageNumber.toString())
      .set('page_size', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<APIResponse<Game>>(`${env.BASE_URL}/games`, {
      params: params,
    });
  }

  getGameDetails(id: string): Observable<Game> {
    const gameInfoRequest = this.http.get(`${env.BASE_URL}/games/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching game info:', error);
        return of(null);
      })
    );

    const gameTrailersRequest = this.http
      .get(`${env.BASE_URL}/games/${id}/movies`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching game trailers:', error);
          return of(null);
        })
      );

    const gameScreenshotsRequest = this.http
      .get(`${env.BASE_URL}/games/${id}/screenshots`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching game screenshots:', error);
          return of(null);
        })
      );

    return forkJoin({
      gameInfoRequest,
      gameScreenshotsRequest,
      gameTrailersRequest,
    }).pipe(
      map((resp: any) => {
        return {
          ...resp['gameInfoRequest'],
          screenshots: resp['gameScreenshotsRequest']?.results,
          trailers: resp['gameTrailersRequest']?.results,
        };
      }),
      catchError((error) => {
        // Handle error if needed
        console.error('Error in forkJoin:', error);
        throw error;
      })
    );
  }
}
