import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { Lyrics } from '../models/lyrics.interface';
import { Song } from '../models/song.interface';

@Injectable({
  providedIn: 'root'
})
export class LyriqsService {

  private isLoading$$ = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading$$.asObservable();

  counterUrl = '/counter';
  songsUrl = '/songs/search'
  lyricsUrl = '/songs/lyrics'

  constructor(private http: HttpClient) { }

  setLoading(isLoading: boolean) {
    this.isLoading$$.next(isLoading);
  }

  getCounter(): Observable<string> {
    return this.http.get(this.counterUrl, { responseType: 'text' });
  }

  searchForSongByQuery(query: string) {
    let params = new HttpParams().set("song", query);
    return this.http.get(this.songsUrl, { responseType: 'text', params });
  }

  fetchAndAnalyzeSongLyricsById(song: Song): Observable<Lyrics> {
    let params = new HttpParams().set("id", song.id);
    return this.http.get<Lyrics>(this.lyricsUrl, { responseType: 'json', params });
  }
}
