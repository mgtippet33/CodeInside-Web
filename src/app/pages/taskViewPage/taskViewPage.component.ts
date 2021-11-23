import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faLightbulb, faTimes, faPlusSquare, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import * as bootstrap from 'bootstrap';
import { isArray } from 'jquery';
import { HttpService } from 'src/app/api/http.service';
import { RangeSliderOptions } from 'src/app/components/slider/range-slider.component';
import { Task } from 'src/app/Models/task';
import { Theory } from 'src/app/Models/theory.model';
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
    faTimes = faTimes;
    faPlusSquare = faPlusSquare;
    faArrowDown = faArrowDown;
    faArrowUp = faArrowUp;
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
    isUserAdmin: boolean;
    token: string;
    taskForm = new FormGroup(
        {
            taskName: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            complexity: new FormControl('', [Validators.required]),
            theoryName: new FormControl('', [Validators.required]),
            input: new FormControl('', [Validators.required]),
            output: new FormControl('', [Validators.required]),
            solution: new FormControl('', [Validators.required])
        });

    theoretics: Array<Theory>;
    constructor(private httpService: HttpService, private router: Router) {

    }

    ngOnInit(): void {
        AuthorizationService.checkUserAuthorization(this.router)
        this.token = CookieService.getCookie('JWT_token')
        this.searchValueControl = new FormControl(this.searchValue);
        this.sliderValueControl = new FormControl(this.difficulty);
        this.form = new FormGroup({
            SliderValue: this.sliderValueControl,
            SearchValueControl: this.searchValueControl
        });
        if (this.token == null) { return }
        this.httpService.getUserProfile(this.token).subscribe((data: any) => {
            this.isUserAdmin = data['body']['data']['role'] == 'User' ? false : true
        }, error => { })
        this.httpService.getTasks().subscribe({
            next: (data: any) => {
                data = data['data']
                var tasks = new Array<Task>(data.length)
                for(var i = 0; i < data.length; ++i) {
                    var task = new Task()
                    task.task_id = data[i]['id'] as number
                    task.name = data[i]['name']
                    task.description = data[i]['desc'].substring(12, data[i]['desc'].indexOf('[Input]'))
                    task.complexity = data[i]['complexity']
                    task.topic_name = data[i]['topic__name']
                    task.input = data[i]['input']
                    task.output = data[i]['output']
                    task.solution = data[i]['solution']
                    this.httpService.getSubmission(this.token, task.task_id).subscribe(
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

        this.httpService.getTheory().subscribe({
            next: (data: any) => {
                data = data['data'];
                this.theoretics = new Array<Theory>(data.length)
                for(var i = 0; i < data.length; ++i) {
                    var theory = new Theory()
                    theory.theory_id = data[i]['id']
                    theory.name = data[i]['name']
                    this.theoretics[i] = theory;
                }
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
        this.sortedTasks = this.tasks.sort((one, two) => (one.name < two.name ? 1 : -1));
    }

    nameSortDesc(){        
        this.sortedTasks = this.tasks.sort((one, two) => (one.name < two.name ? -1 : 1));
    }
    
    filterPanel() {
        let filter = document.getElementById('filter');
        filter.style.display = (filter.style.display == 'none') ? 'flex' : 'none';
    }

    openNotificationModal() {
        var notificationModal = new bootstrap.Modal(document.getElementById("notificationModal"), {
            keyboard: false
        });
        notificationModal?.show();
    }

    onCreateTask() {
        if(isArray(this.taskForm.get('theoryName').value)) {
            var theory = this.taskForm.get('theoryName').value[0]
            this.taskForm.controls['theoryName'].setValue(theory.name);
        }
        if (!this.taskForm?.valid) { 
            this.openNotificationModal();
            return; 
        }
        var task = new Task();
        task.name = this.taskForm.get('taskName').value;
        task.description = this.taskForm.get('description').value;
        task.complexity = this.taskForm.get('complexity').value;
        task.topic_name = this.taskForm.get('theoryName').value;
        task.input = this.taskForm.get('input').value;
        task.output = this.taskForm.get('output').value;
        task.solution = this.taskForm.get('solution').value;

        this.httpService.createTask(this.token, task).subscribe(
            (data:any) => {
                if(data.status == 201) {
                    this.ngOnInit();
                }
            },
            (error:any) => {
                this.openNotificationModal();
            }
        )
    }
}
