import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { map, Observable } from 'rxjs';
import { Song } from './song';

@Injectable({
  providedIn: 'root'
})
export class LyriqsService {

  constructor(private http: HttpClient) { }

  rootUrl = '/api';
  songsUrl = '/songs/search'

  getTest(): Observable<string> {
    return this.http.get(this.rootUrl, { responseType: 'text' });
  }

  searchForSongByQuery(query: string) {
    let params = new HttpParams().set("song", query);
    return this.http.get(this.songsUrl, { responseType: 'text', params });
  }

  fetchSongLyricsById(id: number): Observable<string> {
    return this.http.get<string>(this.rootUrl);
  }
}
