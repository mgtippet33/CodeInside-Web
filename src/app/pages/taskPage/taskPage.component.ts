import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user';
import { HttpService } from 'src/app/api/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { CommonValidators } from 'src/app/validators/common-validators';
import { faLightbulb, faLocationArrow, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Comment } from "src/app/Models/comment"
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'src/app/services/cookieService';
import { AuthorizationService } from 'src/app/services/authorizationService';
import { Task } from 'src/app/Models/task';
import { Submission } from 'src/app/Models/submission';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';


@Component({
    selector: 'taskPage',
    templateUrl: './taskPage.component.html',
    styleUrls: ['./taskPage.component.scss'],
    providers: [HttpService]
})

export class TaskPageComponent implements OnInit {
    faLocationArrow = faLocationArrow;
    faLightbulb = faLightbulb;
    faTimes = faTimes;
    content: string = ""
    title: string
    form: FormGroup
    messageValueControl: FormControl
    token: string
    username: string
    isUserAdmin: boolean
    comments: Array<Comment>
    task: Task = new Task()
    message: string
    taskName: string
    backUrl: string = 'task'
    options = {
        lineNumbers: true,
        theme: 'neat',
        mode: 'markdown'
    }
    currentLanguage: string
    languages = [
        { 'id': 0, 'name': 'Python', 'mode': 'text/x-python' },
        { 'id': 1, 'name': 'С++', 'mode': 'text/x-c++src' },
        { 'id': 2, 'name': 'С#', 'mode': 'text/x-csharp' },
        { 'id': 3, 'name': 'Java', 'mode': 'text/x-java' },
        { 'id': 4, 'name': 'JavaScript', 'mode': 'text/javascript' }
    ]
    result: string = ""
    description: string = ""
    sendSubmission: boolean = false;
    editTaskModal: Modal;

    taskForm: FormGroup;
    taskNameControl: FormControl;
    descriptionControl: FormControl;
    complexityControl: FormControl;
    inputControl: FormControl;
    outputControl: FormControl;

    constructor(private httpService: HttpService, private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.messageValueControl = new FormControl(this.message)
        this.form = new FormGroup(
            {
                MessageValueControl: this.messageValueControl
            })

        //AuthorizationService.checkUserAuthorization(this.router)
        this.token = CookieService.getCookie('JWT_token')
        if (this.token == null) { return }
        this.httpService.getUserProfile(this.token).subscribe((data: any) => {
            this.username = data['body']['data']['name']
            this.isUserAdmin = data['body']['data']['role'] == 'User' ? false : true
        }, error => { })
        this.route.params.subscribe((params: { [x: string]: string; }) => {
            const taskID = Number.parseInt(params['taskID']);
            this.httpService.getTasks(taskID).subscribe(
                (data: any) => {
                    this.taskName = data['data']['name']
                    var task = new Task()
                    task.task_id = taskID
                    task.name = data['data']['name']
                    task.description = data['data']['desc']
                    task.complexity = data['data']['complexity']
                    task.topic_name = data['data']['topic__name']
                    task.input = data['data']['input']
                    task.output = data['data']['output']
                    task.solution = data['data']['solution']
                    this.httpService.getSubmission(this.token, task.task_id).subscribe(
                        (data: any) => {
                            task.solved = false
                            data = data['body']['data']
                            for (var i = 0; i < data.length; ++i) {
                                if (data[i]['result'] == "Accepted") {
                                    task.solved = true;
                                    break;
                                }
                            }
                        }
                    )
                    this.task = task

                    this.taskNameControl = new FormControl(task.name);
                    this.descriptionControl = new FormControl(task.description);
                    this.complexityControl = new FormControl(task.complexity);
                    this.inputControl = new FormControl(task.input);
                    this.outputControl = new FormControl(task.output);
                    this.taskForm = new FormGroup(
                    {
                        TaskNameControl: this.taskNameControl,
                        DescriptionControl: this.descriptionControl,
                        ComplexityControl: this.complexityControl,
                        InputControl: this.inputControl,
                        OutputControl: this.outputControl
                    })

                    this.httpService.getComments(this.token, taskID).subscribe(
                        {
                            next: (data: any) => {
                                data = data['body']['data']
                                var comments = new Array<Comment>(data.length)
                                for (var i = 0; i < data.length; ++i) {
                                    var comment = new Comment()
                                    comment.id = data[i]['id'] as number
                                    comment.username = data[i]['user__name']
                                    comment.message = data[i]['message']
                                    comment.datetime = data[i]['datetime']
                                    comment.task_name = this.taskName
                                    comments[i] = comment
                                }
                                this.comments = comments
                            },
                            error: (error: any) => {
                            }
                        }
                    )
                }
            )
        })
    }

    onMessageFieldChange(value: any) {
        this.message = value
    }

    onAddComment() {
        this.httpService.createComment(this.token, this.taskName, this.message).subscribe(
            (data: any) => {
                if (data['status'] == 201) {
                    console.log("Comment create successfully")
                    this.message = ""
                    this.ngOnInit()
                }
            }
        )
    }

    onLanguageChange(value: any): void {
        this.options.mode = this.languages[value].mode
        this.currentLanguage = this.languages[value].name
    }

    onSendSubmission() {
        var submission = new Submission();
        submission.task_name = this.taskName;
        submission.language = this.currentLanguage;
        submission.code = this.content;
        this.sendSubmission = true
        this.httpService.sendSubmission(this.token, submission).subscribe(
            (data: any) => {
                if (data['status'] == 201) {
                    this.result = data['body']['data']['status']
                    if (this.result == "Accepted") {
                        this.task.solved = true
                    }
                    else {
                        this.description = data['body']['data']['message']
                    }
                }
            },
            (error: any) => {
                this.result = "System failure"
                if (this.content.length == 0) {
                    this.description = "To send, you need to write a code"
                }
                else if (this.currentLanguage == null) {
                    this.description = "Specify the language in which the code is written"
                }
                else {
                    this.description = error['error']['message']
                }
            }
        )
    }  
    
    onSaveEditModal() {
        this.editTaskModal?.toggle();
    }

    onOpenEditModal() {
        this.editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'), {
            keyboard: false
        })
        this.editTaskModal?.show();
    }

    onApplyChange() {
        this.task.name = this.taskForm.get('TaskNameControl').value;
        this.task.description = this.taskForm.get('DescriptionControl').value;
        this.task.complexity = this.taskForm.get('ComplexityControl').value;
        this.task.input = this.taskForm.get('InputControl').value;
        this.task.output = this.taskForm.get('OutputControl').value;
        this.httpService.updateTask(this.token, this.task).subscribe(
            (data: any) => {
            }
        )
    }

    onRemoveTask(){
        this.httpService.deleteTask(this.token, this.task.task_id).subscribe(
            (data: any) => {
            }
        )
    }
}
