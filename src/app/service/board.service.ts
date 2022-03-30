import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const BOARD_API = 'http://localhost:8888/api/';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient) {
  }

  public scheduleUpdate(): Observable<any> {
    return this.http.get(BOARD_API + 'update');
  }

  getSearchStations(value: any):Observable<any>{
    return this.http.get('http://localhost:8888/api/stations?value='+value);

  }
}
