import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user';
import { HttpService } from 'src/app/api/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { CommonValidators } from 'src/app/validators/common-validators';
import { faLightbulb, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { Comment } from "src/app/Models/comment"
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'src/app/services/cookieService';
import { AuthorizationService } from 'src/app/services/authorizationService';
import { Task } from 'src/app/Models/task';
import { Submission } from 'src/app/Models/submission';

@Component({
    selector: 'taskPage',
    templateUrl: './taskPage.component.html',
    styleUrls: ['./taskPage.component.scss'],
    providers: [HttpService]
})

export class TaskPageComponent {
    faLocationArrow = faLocationArrow;
    faLightbulb = faLightbulb;
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
            this.isUserAdmin = data['body']['data']['role'] == 'User'? false : true
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
                    this.task = task
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
                if(data['status'] == 201) {
                    this.result = data['body']['data']['status']
                    if(this.result == "Accepted") {
                        this.task.solved = true
                    }
                    else {
                        this.description = data['body']['data']['message']
                    }
                }
            },
            (error: any) => {
                this.result = "System failure"
                if(this.content.length == 0) {
                    this.description = "To send, you need to write a code"
                }
                else if(this.currentLanguage == null) {
                    this.description = "Specify the language in which the code is written"
                }
                else {
                    this.description = error['error']['message']
                }
            }
        )
    }

    onApplyChange() {
        if (!this.taskForm?.valid) { return; }
        this.task.name = this.taskForm.get('taskName').value;
        this.task.description = this.taskForm.get('description').value;
        this.task.complexity = this.taskForm.get('complexity').value;
        if(!isArray(this.taskForm.get('theoryName').value)) {
            this.task.topic_name = this.taskForm.get('theoryName').value;
        }
        this.task.input = this.taskForm.get('input').value;
        this.task.output = this.taskForm.get('output').value;
        this.task.solution = this.taskForm.get('solution').value;
        this.httpService.updateTask(this.token, this.task).subscribe(
            (data: any) => {
                if(data.status == 200) {
                    this.ngOnInit();
                }
            }
        )
    }

    onRemoveTask() {
        this.httpService.deleteTask(this.token, this.task.task_id).subscribe(
            (data: any) => {
                if(data.status == 200) {
                    this.router.navigateByUrl("/task")
                }
            }
        )
    }

    onCancelEdit() {
        this.editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'), {
            keyboard: false
        })
        this.editTaskModal?.hide();
    }

    onRemoveComment(comment_id: number) {
        this.httpService.deleteComment(this.token, comment_id).subscribe(
            (data: any) => {
                this.ngOnInit();
            }
        )
    }

    onOpenProfile(user_id: number, username: string) {
        if(username == this.username) {
            this.router.navigateByUrl(`profile/`)  
        }
        else {
            this.router.navigateByUrl(`profile/${user_id}`)  
        }
    }

    onTheoryChange(value: any) {
        this.taskForm.get('theoryName').setValue(value);
    }

    onReadLecture() {
        this.router.navigateByUrl(`theory/${this.theoryID}`)  
    }

    onBuyPremium() {
        window.location.href = ApiConstants.main_url + ApiConstants.payment_url + this.user_id.toString();
    }
}
