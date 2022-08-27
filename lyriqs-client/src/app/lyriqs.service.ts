import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LyriqsService {

  constructor(private http: HttpClient) { }

  rootUrl = '/api';

  getTest(): Observable<string> {
    return this.http.get(this.rootUrl, { responseType: 'text'});
  }
}
