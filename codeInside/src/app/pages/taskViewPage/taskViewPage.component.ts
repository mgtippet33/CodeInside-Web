import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { HttpService } from 'src/app/api/http.service';
import { RangeSliderOptions } from 'src/app/components/slider/range-slider.component';
import { Task } from 'src/app/Models/task';
import { AuthorizationService } from 'src/app/services/authorizationService';
import { CookieService } from 'src/app/services/cookieService';

@Component({
    selector: 'taskView',
    templateUrl: './taskViewPage.component.html',
    styleUrls: ['./taskViewPage.component.scss'],
    providers: [HttpService]
})
export class TaskViewPageComponent {
    faLightbulb = faLightbulb;
    title='Task List';
    form: FormGroup;
    sliderValueControl: FormControl;
    searchValueControl: FormControl;
    sliderOptions: RangeSliderOptions = {
        floor: 1,
        ceil: 5,
        showTicksValues: false,
        ticksArray: [1,2,3,4,5]
    };
    searchValue = '';
    difficulty = {
        value: 1,
        highValue: 5
    };
    tasks: Array<Task> =[
        { name: 'Task 1', description: 'Description 1', complexity: 4, solved: true} as Task,        
        { name: 'Task 2', description: 'Description 2', complexity: 2, solved: true} as Task,
        { name: 'Task 1', description: 'Description 1', complexity: 4, solved: false} as Task,        
        { name: 'Task 2', description: 'Description 2', complexity: 2, solved: true} as Task,
        { name: 'Task 1', description: 'Description 1', complexity: 4, solved: false} as Task,        
        { name: 'Task 2', description: 'Description 2', complexity: 2, solved: true} as Task,
        { name: 'Task 3', description: 'Description 3', complexity: 3, solved: false} as Task
    ];
    sortedTasks: Array<Task> = [
        { name: 'Task 1', description: 'Description 1', complexity: 4, solved: true} as Task,        
        { name: 'Task 2', description: 'Description 2', complexity: 2, solved: true} as Task,
        { name: 'Task 1', description: 'Description 1', complexity: 4, solved: false} as Task,        
        { name: 'Task 2', description: 'Description 2', complexity: 2, solved: true} as Task,
        { name: 'Task 1', description: 'Description 1', complexity: 4, solved: false} as Task,        
        { name: 'Task 2', description: 'Description 2', complexity: 2, solved: true} as Task,
        { name: 'Task 3', description: 'Description 3', complexity: 3, solved: false} as Task
    ];
    solved: boolean = false; 
    constructor(private httpService: HttpService, private router: Router) {

    }

    ngOnInit(): void {
        this.searchValueControl = new FormControl(this.searchValue);
        this.sliderValueControl = new FormControl(this.difficulty);
        this.form = new FormGroup({
            SliderValue: this.sliderValueControl,
            SearchValueControl: this.searchValueControl
        });
        //AuthorizationService.checkUserAuthorization(this.router)
        this.httpService.getTasks().subscribe({
            next: (data: any) => {
                data = data['data']
                var tasks = new Array<Task>(data.length)
                var token = CookieService.getCookie("JWT_token")
                for(var i = 0; i < data.length; ++i) {
                    var task = new Task()
                    task.task_id = data[i]['id'] as number
                    task.name = data[i]['name']
                    task.description = data[i]['desc'].substring(0, 100) + '...'
                    task.complexity = data[i]['complexity']
                    task.topic_name = data[i]['topic__name']
                    task.input = data[i]['input']
                    task.output = data[i]['output']
                    task.solution = data[i]['solution']
                    this.httpService.getSubmission(token, task.task_id).subscribe(
                        (data:any) => {
                            task.solved = false
                            data = data['body']['data']
                            for(var i = 0; i < data.length; ++i) {
                                if(data[i]['result'] == "Accepted") {
                                    task.solved = true;
                                    break;
                                }
                            }
                        }
                    )
                    tasks[i] = task
                }
                this.tasks = tasks;
                this.sortedTasks = tasks;  
            },
            error: (error: any) => {
                
                console.error('There was an error!', error);
            }
        });
    }

    onRangeSliderChange(value: any): void {
        this.difficulty = value;
        this.sortedTasks = this.tasks.filter(x=>x.complexity>=this.difficulty.value && x.complexity<=this.difficulty.highValue);
    }

    onSearchFieldChange(value: any){
        this.searchValue = value.toLowerCase();
        this.sortedTasks = this.tasks.filter(x=>x.name.toLowerCase().indexOf(this.searchValue)!=-1 || x.description.toLowerCase().indexOf(this.searchValue)!=-1);
    }
    solvedSort(){
        this.sortedTasks = this.tasks.filter(x=>x.solved);
    }
    unsolvedSort(){
        this.sortedTasks = this.tasks.filter(x=>!x.solved);
    }

    onSolveTask(task_id: number) {
        this.router.navigateByUrl(`/task/${task_id}`)
    }

    difficultySortAsc(){
        this.sortedTasks = this.tasks.sort((one, two) => (one.complexity > two.complexity ? 1 : -1));
    }

    difficultySortDesc(){        
        this.sortedTasks = this.tasks.sort((one, two) => (one.complexity > two.complexity ? -1 : 1));
    }

    nameSortAsc(){
        this.sortedTasks = this.tasks.sort((one, two) => (one.name > two.name ? 1 : -1));
    }

    nameSortDesc(){        
        this.sortedTasks = this.tasks.sort((one, two) => (one.name > two.name ? -1 : 1));
    }
}
