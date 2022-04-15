import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

const BOARD_API = environment.apiUrl+'/api/';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient) {
  }

  public scheduleUpdate(nameStation: string): Observable<any> {
    return this.http.get(BOARD_API + 'update?nameStation='+nameStation);
  }

  getSearchStations(value: any):Observable<any>{
    return this.http.get(BOARD_API+'stations?value='+value);

  }
}
