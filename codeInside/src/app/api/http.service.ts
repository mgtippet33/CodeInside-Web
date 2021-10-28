import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from '../Models/user';
import { Comment } from '../Models/comment';
import { ApiConstants } from './ApiConstants';


@Injectable()
export class HttpService {

    constructor(private http: HttpClient) { }

    registerUser(user: User) {
        const headers = { 'content-type': 'application/json' }
        const body = {
            email: user.email,
            name: user.username,
            birthday: user.birthday,
            password: user.password
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

    getTasks(taskID: number=null) {
        var url = ApiConstants.task_url
        if(taskID != null) {
            url += taskID.toString() + "/"
        }
        return this.http.get(url);
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