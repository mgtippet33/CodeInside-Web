import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from 'src/app/Models/user';
import { Comment } from '../Models/comment';
import { ApiConstants } from './ApiConstants';
import { Task } from 'src/app/Models/task';
import { Theory } from 'src/app/Models/theory.model';

@Injectable()
export class HttpService {

    constructor(private http: HttpClient) { }

    registerUser(user: User) {
        const headers = { 'content-type': 'application/json' }
        const body = {
            email: user.email,
            name: user.username,
            birthday: user.birthday,
            password: user.password,
            time_zone: user.timezone
        };
        return this.http.post(ApiConstants.register_url, body, { 'headers': headers, observe: 'response' });
    }

    loginUser(email: string, password: string) {
        const headers = { 'content-type': 'application/json' }
        const body = {
            email: email,
            password: password
        };
        return this.http.post(ApiConstants.login_url, body, { 'headers': headers, observe: 'response' });
    }

    getUserProfile(token: string) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        return this.http.get(ApiConstants.profile_url, { 'headers': headers, observe: 'response' });
    }

    createTask(token: string, task: Task) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            name: task.name,
            desc: task.description,
            complexity: task.complexity,
            topic: task.topic_name,
            input: task.input,
            output: task.output,
            solution: task.solution
        };
        return this.http.post(ApiConstants.task_url, body, { 'headers': headers, observe: 'response' });
    }

    getTasks(taskID: number=null) {
        var url = ApiConstants.task_url
        if(taskID != null) {
            url += taskID.toString() + "/"
        }
        return this.http.get(url);
    }

    updateTask(token: string, task: Task) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            name: task.name,
            desc: task.description,
            complexity: task.complexity,
            topic: task.topic_name,
            input: task.input,
            output: task.output,
            solution: task.solution
        };
        var url = ApiConstants.task_url + task.task_id.toString() + "/"
        return this.http.put(url, body, { 'headers': headers, observe: 'response' });
    }

    deleteTask(token: string, taskID: number) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var url = ApiConstants.task_url + taskID.toString() + "/"
        return this.http.delete(url, { 'headers': headers, observe: 'response' });
    }

    createTheory(token: string, theory: Theory) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            name: theory.name,
            desc: theory.description,
        };
        return this.http.post(ApiConstants.theory_url, body, { 'headers': headers, observe: 'response' });
    }

    getTheory(theoryID: number=null) {
        var url = ApiConstants.theory_url
        if(theoryID != null) {
            url += theoryID.toString() + "/"
        }
        return this.http.get(url);
    }

    updateTheory(token: string, theory: Theory) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            name: theory.name,
            desc: theory.description,
        };
        var url = ApiConstants.theory_url + theory.theory_id.toString() + "/"
        return this.http.put(url, body, { 'headers': headers, observe: 'response' });
    }

    deleteTheory(token: string, theoryID: number) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var url = ApiConstants.theory_url + theoryID.toString() + "/"
    }

    createComment(token: string, task_name: string, message: string) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            task: task_name,
            message: message,
        };
        return this.http.post(ApiConstants.comment_url, body, { 'headers': headers, observe: 'response' });
    }

    getComments(token: string, taskID: number) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var url = ApiConstants.comment_url + taskID.toString() + "/"
        return this.http.get(url, { 'headers': headers, observe: 'response' });
    }

    deleteComment(token: string, commentID: number) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var url = ApiConstants.comment_url + commentID.toString() + "/"
        return this.http.delete(url, { 'headers': headers, observe: 'response' });
    }
}