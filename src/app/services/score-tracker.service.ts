import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AllTeamsList, SelectedTeamInfo } from '../models/score-tracker';

@Injectable()
export class ScoreTrackerService {
  _apiBaseUrl: string = 'https://free-nba.p.rapidapi.com/';

  constructor(private readonly http: HttpClient) {}

  getTeamsList(): Observable<AllTeamsList> {
    return this.http.get<AllTeamsList>(`${this._apiBaseUrl}teams`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getSelectedTeamInformation(teamId: number): Observable<SelectedTeamInfo> {
    const dates: string[] = [];
    for (
      let dateObj = new Date(new Date().setDate(new Date().getDate() - 12));
      dateObj <= new Date();
      dateObj.setDate(dateObj.getDate() + 1)
    ) {
      dates.push(new Date(dateObj).toISOString().slice(0, 10));
    }
    let httpParams: HttpParams = new HttpParams();
    dates.forEach((date) => {
      httpParams = httpParams.append('dates[]', date);
    });
    httpParams = httpParams.append('team_ids[]', teamId);
    return this.http.get<SelectedTeamInfo>(`${this._apiBaseUrl}games`, {
      headers: this.createAuthorizationHeader(),
      params: httpParams,
    });
  }

  createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders({
      'X-RapidAPI-Key': '2QMXSehDLSmshDmRQcKUIAiQjIZAp1UvKUrjsnewgqSP6F5oBX',
      'X-RapidAPI-Host': 'free-nba.p.rapidapi.com',
    });
  }
}
