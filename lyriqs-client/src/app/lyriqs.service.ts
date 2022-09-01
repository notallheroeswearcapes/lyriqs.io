import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Lyrics } from './models/lyrics.interface';

@Injectable({
  providedIn: 'root'
})
export class LyriqsService {

  constructor(private http: HttpClient) { }

  rootUrl = '/api';
  songsUrl = '/songs/search'
  lyricsUrl = '/songs/lyrics'

  getTest(): Observable<string> {
    return this.http.get(this.rootUrl, { responseType: 'text' });
  }

  searchForSongByQuery(query: string) {
    let params = new HttpParams().set("song", query);
    return this.http.get(this.songsUrl, { responseType: 'text', params });
  }

  fetchAndAnalyzeSongLyricsById(id: number): Observable<Lyrics> {
    let params = new HttpParams().set("id", id);
    return this.http.get<Lyrics>(this.lyricsUrl, { responseType: 'json', params });
  }
}
