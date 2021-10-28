import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/api/http.service';
import { Task } from 'src/app/Models/task';

@Component({
    selector: 'main',
    templateUrl: './mainPage.component.html',
    styleUrls: ['./mainPage.component.scss'],
    providers: [HttpService]
})
export class MainPageComponent {
    tasks: Array<Task> =[
        { name: 'Task 1', description: 'Description 1', complexity: 4, solved: true} as Task,        
        { name: 'Task 2', description: 'Description 2', complexity: 2, solved: true} as Task,
        { name: 'Task 3', description: 'Description 3', complexity: 3, solved: false} as Task
    ];

    solved: boolean = false; 
    constructor(private httpService: HttpService, private router: Router) {

    }

    ngOnInit(): void {
        this.httpService.getTasks().subscribe({
            next: (data: any) => {
                console.log(data)
                data = data['data']
                var tasks = new Array<Task>(data.length)
                for(var i = 0; i < data.length; ++i) {
                    var task = new Task()
                    task.task_id = data[i]['id'] as number
                    task.name = data[i]['name']
                    task.description = data[i]['desc']
                    task.complexity = data[i]['complexity']
                    task.topic_name = data[i]['topic__name']
                    task.input = data[i]['input']
                    task.output = data[i]['output']
                    task.solution = data[i]['solution']
                    task.solved = false
                    tasks[i] = task
                }
                this.tasks = tasks
            },
            error: (error: any) => {
                
                console.error('There was an error!', error);
            }
        });
    }
}
