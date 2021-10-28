import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from 'src/app/Models/task';

@Component({
    selector: 'main',
    templateUrl: './mainPage.component.html',
    styleUrls: ['./mainPage.component.scss']
})
export class MainPageComponent {
    tasks: Array<Task> =[
        { name: 'Task 1', description: 'Description 1', complexity: 4, solved: true} as Task,        
        { name: 'Task 2', description: 'Description 2', complexity: 2, solved: true} as Task,
        { name: 'Task 3', description: 'Description 3', complexity: 3, solved: false} as Task
    ];

    solved: boolean = false; 
    constructor(private router: Router) {

    }
}
