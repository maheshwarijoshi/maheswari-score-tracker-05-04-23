import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {
  SelctedTeam,
  SelectedTeamInfo,
  Team,
} from '../../models/score-tracker';
import { ScoreTrackerService } from '../../services/score-tracker.service';
import { map } from 'rxjs/operators';
import { AppConstants } from '../../constants/app-constants';

@Component({
  selector: 'app-team-results',
  templateUrl: './team-results.component.html',
  styleUrls: ['./team-results.component.css'],
})
export class TeamResultsComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  hasLoading: boolean = false;
  selectedTeamInfo: SelctedTeam[] = [];
  selectedTeam: Team;
  constructor(
    private readonly scoreTrackerService: ScoreTrackerService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getTeamInfo(this.activatedRoute.snapshot.params);
  }

  getTeamInfo(params: Params): void {
    const teamId: number = Number(Object.values(params)[0]);
    this.hasLoading = true;
    const getSelectedTeamInformation$: Observable<SelectedTeamInfo> =
      this.scoreTrackerService.getSelectedTeamInformation(teamId);
    getSelectedTeamInformation$
      .pipe(
        map((response: SelectedTeamInfo) => {
          const teamInfo: SelctedTeam[] = response.data.filter(
            (element: SelctedTeam) =>
              element.home_team.id === teamId ||
              element.visitor_team.id === teamId
          );
          this.selectedTeamInfo = response.data;
          this.hasLoading = false;
          this.selectedTeam = {
            team_name: this.setTeamData(
              teamInfo[0],
              AppConstants.FULL_NAME,
              teamId
            ),
            team_abbreviation: this.setTeamData(
              teamInfo[0],
              AppConstants.ABBREVIATION,
              teamId
            ),
            team_conference: this.setTeamData(
              teamInfo[0],
              AppConstants.CONFERENCE,
              teamId
            ),
          };
        })
      )
      .subscribe();
  }

  setTeamData(team: SelctedTeam, key: string, id: number): string {
    return team.home_team.id === id
      ? team.home_team[key]
      : team.visitor_team[key];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
