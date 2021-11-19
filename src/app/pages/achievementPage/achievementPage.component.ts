import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from 'src/app/api/http.service';
import {Achievement} from 'src/app/Models/achievement';
import {CookieService} from 'src/app/services/cookieService';
import * as bootstrap from 'bootstrap';
import { isArray } from 'jquery';


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
      name: 'C# DEV',
      description: 'Description 1',
      link: "https://i.ibb.co/JnBnHS3/C-DEV.png",
      earned: true
    } as Achievement,
    {
      name: 'C++ DEV',
      description: 'Description 2',
      link: "https://i.ibb.co/zS9d10G/C-DEV.png",
      earned: false
    } as Achievement,
    {
      name: 'JAVA DEV',
      description: 'Description 2',
      link: "https://i.ibb.co/2Kcq9Mv/JAVA-DEV.png",
      earned: true
    } as Achievement,
    {
      name: 'PYTHON DEV',
      description: 'Description 2',
      link: "https://i.ibb.co/0ZrYcWQ/PYTHON-DEV.png",
      earned: true
    } as Achievement,
    {
      name: 'JAVASCRIPT DEV',
      description: 'Description 2',
      link: "https://i.ibb.co/j4FYSZ4/JAVASCRIPT-DEV.png",
      earned: false
    } as Achievement,
    {
      name: 'ERROR',
      description: 'Description 2',
      link: "https://i.ibb.co/G7bLF9r/ERROR.png",
      earned: false
    } as Achievement,
    {
      name: 'TIME LIMITED',
      description: 'Description 2',
      link: "https://i.ibb.co/yqQDCnf/TIME-LIMITED.png",
      earned: false
    } as Achievement,
  ];
  earned: boolean = false; 
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
  
  modalName = "";
  modalDesc = "";
  modalLink = "";
  openModal(name: string, description: string, link: string) {
    this.modalName = name;
    this.modalDesc = description;
    this.modalLink = link;
    
    var notificationModal = new bootstrap.Modal(document.getElementById("exampleModalCenter"), {
        keyboard: false
    });
    notificationModal?.show();
  }
}
