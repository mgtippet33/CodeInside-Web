import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from 'src/app/api/http.service';
import {Achievement} from 'src/app/Models/achievement';
import {CookieService} from 'src/app/services/cookieService';


@Component({
  selector: 'achievementPage',
  templateUrl: './achievementPage.component.html',
  styleUrls: ['./achievementPage.component.scss'],
  providers: [HttpService]
})

export class AchievementPageComponent {

  title='Achievement'
  achievementName: string = "Achievements"
 achievements: Array<Achievement> = [
    {
      name: 'award 1',
      description: 'Description 1',
      link: "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fphotographer&psig=AOvVaw0VwsT_GKJ4qqbO1_UlLGoa&ust=1636746460025000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCMCmhu6JkfQCFQAAAAAdAAAAABAD",
      earned: true
    } as Achievement,
    {
      name: 'award 2',
      description: 'Description 2',
      link: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fdiscover%2F10-free-stock-images&psig=AOvVaw0VwsT_GKJ4qqbO1_UlLGoa&ust=1636746460025000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCMCmhu6JkfQCFQAAAAAdAAAAABAJ",
      earned: false
    } as Achievement,
  ];
  token: string

  constructor(private httpService: HttpService, private router: Router) {
  }

  ngOnInit(): void {
    //AuthorizationService.checkUserAuthorization(this.router)
    this.token = CookieService.getCookie("JWT_token");
    if (this.token == null) {
      return
    }
    this.httpService.getAchievement(this.token).subscribe(
      (data: any) => {
        if (data['status'] as number == 200) {
          data = data['body']['data'];
          var temp_achievements = new Array<Achievement>(data.length);
          for (var i = 0; i < data.length; ++i) {
            var achievement = new Achievement();
            achievement.achievement_id = data[i]['id'];
            achievement.name = data[i]['name'];
            achievement.description = data[i]['desc'];
            achievement.link = data[i]['link'];
            achievement.earned = data[i]['earned'];
            temp_achievements[i] = achievement;
          }
          this.achievements = temp_achievements;
        }
      }
    )
  }

}
