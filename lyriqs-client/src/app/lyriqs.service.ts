import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LyriqsService {

  constructor(private http: HttpClient) { }

  rootUrl = '/api';

  getTest(): Observable<string> {
    let req = this.http.get(this.rootUrl, { responseType: 'text'});
    req.subscribe(data => {console.log(data)});
    return req;
  }
}
