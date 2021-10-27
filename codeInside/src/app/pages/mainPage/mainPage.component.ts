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
        { name: '1', description: '1', complexity: 4, solved: true} as Task,        
        { name: '2', description: '2', complexity: 2, solved: true} as Task,
        { name: '3', description: '3', complexity: 3, solved: false} as Task
    ];

    solved: boolean = false; 
    constructor(private router: Router) {

    }
}
