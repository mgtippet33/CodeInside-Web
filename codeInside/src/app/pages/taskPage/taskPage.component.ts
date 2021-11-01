import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user';
import { HttpService } from 'src/app/api/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { CommonValidators } from 'src/app/validators/common-validators';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { Comment } from "src/app/Models/comment"
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'src/app/services/cookieService';
import { AuthorizationService } from 'src/app/services/authorizationService';

@Component({
    selector: 'taskPage',
    templateUrl: './taskPage.component.html',
    styleUrls: ['./taskPage.component.scss'],
    providers: [HttpService]
})

export class TaskPageComponent {
    faLocationArrow = faLocationArrow;

    title: string
    form: FormGroup
    messageValueControl: FormControl
    token: string
    username: string
    comments: Array<Comment>
    message: string
    taskName: string
    backUrl: string = 'task'

    constructor(private httpService: HttpService, private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.messageValueControl = new FormControl(this.message)
        this.form = new FormGroup(
            {
                MessageValueControl: this.messageValueControl
            })

        AuthorizationService.checkUserAuthorization(this.router)
        this.token = CookieService.getCookie('JWT_token')
        if (this.token == null) { return }
        this.httpService.getUserProfile(this.token).subscribe((data: any) => {
            this.username = data['body']['data']['name']
        }, error => {})
        this.route.params.subscribe((params: { [x: string]: string; }) => {
            const taskID = Number.parseInt(params['taskID']);
            this.httpService.getTasks(taskID).subscribe(
                (data: any) => {
                    this.taskName = data['data']['name']
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
}
