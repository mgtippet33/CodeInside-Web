import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/api/http.service';
import { Topic } from 'src/app/Models/topic';

@Component({
  selector: 'app-topic-page',
  templateUrl: './topic-page.component.html',
  styleUrls: ['./topic-page.component.scss'],
  providers: [HttpService]
})
export class TopicPageComponent implements OnInit {

  topic: Topic

  constructor(private httpService: HttpService, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number.parseInt(params['id']);
      console.log(id)
      this.httpService.getTopics(id).subscribe(
        {
          next: (data: any) => {   
            console.log(data)
            data = data["data"]    
            this.topic = {
              id: id,
              name: data["name"],
              description: data["desc"]
            }
        },
        error: (error: any) => {
            
            console.error('There was an error!', error);
        }
        }
      )
    })
  }
}
