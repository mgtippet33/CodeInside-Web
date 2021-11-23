import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from 'src/app/Models/user';
import { Comment } from '../Models/comment';
import { Task } from 'src/app/Models/task';
import { Theory } from 'src/app/Models/theory.model';
import { Submission } from '../Models/submission';
import { ApiConstants } from './ApiConstants';
import { UserPermissions } from '../Models/userPermissions';

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
        var register_url = ApiConstants.main_url.toString() + ApiConstants.register_url.toString()
        return this.http.post(register_url, body, { 'headers': headers, observe: 'response' });
    }

    loginUser(email: string, password: string) {
        const headers = { 'content-type': 'application/json' }
        const body = {
            email: email,
            password: password
        };
        var login_url = ApiConstants.main_url.toString() + ApiConstants.login_url.toString()
        return this.http.post(login_url, body, { 'headers': headers, observe: 'response' });
    }

    getUserProfile(token: string) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var profile_url = ApiConstants.main_url.toString() + ApiConstants.profile_url.toString()
        return this.http.get(profile_url, { 'headers': headers, observe: 'response' });
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
        var task_url = ApiConstants.main_url.toString() + ApiConstants.task_url.toString()
        return this.http.post(task_url, body, { 'headers': headers, observe: 'response' });
    }

    getTasks(taskID: number = null) {
        var task_url = ApiConstants.main_url.toString() + ApiConstants.task_url.toString()
        if (taskID != null) {
            task_url += taskID.toString() + "/"
        }
        return this.http.get(task_url);
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
        var task_url = ApiConstants.main_url.toString() + ApiConstants.task_url.toString() + task.task_id.toString() + "/"
        return this.http.put(task_url, body, { 'headers': headers, observe: 'response' });
    }

    deleteTask(token: string, taskID: number) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var task_url = ApiConstants.main_url.toString() + ApiConstants.task_url.toString() + taskID.toString() + "/"
        return this.http.delete(task_url, { 'headers': headers, observe: 'response' });
    }

    createTheory(token: string, theory: Theory) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            name: theory.name,
            desc: theory.description,
        };
        var theory_url = ApiConstants.main_url.toString() + ApiConstants.theory_url.toString()
        return this.http.post(theory_url, body, { 'headers': headers, observe: 'response' });
    }

    getTheory(theoryID: number = null) {
        var theory_url = ApiConstants.main_url.toString() + ApiConstants.theory_url.toString()
        if (theoryID != null) {
            theory_url += theoryID.toString() + "/"
        }
        return this.http.get(theory_url);
    }

    updateTheory(token: string, theory: Theory) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            name: theory.name,
            desc: theory.description,
        };
        var theory_url = ApiConstants.main_url.toString() + ApiConstants.theory_url.toString() + theory.theory_id.toString() + "/"
        return this.http.put(theory_url, body, { 'headers': headers, observe: 'response' });
    }

    deleteTheory(token: string, theoryID: number) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var theory_url = ApiConstants.main_url.toString() + ApiConstants.theory_url.toString() + theoryID.toString() + "/"
        return this.http.delete(theory_url, { 'headers': headers, observe: 'response' });
    }

    createComment(token: string, task_name: string, message: string) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            task: task_name,
            message: message,
        };
        var comment_url = ApiConstants.main_url.toString() + ApiConstants.comment_url.toString()
        return this.http.post(comment_url, body, { 'headers': headers, observe: 'response' });
    }

    getComments(token: string, taskID: number) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var comment_url = ApiConstants.main_url.toString() + ApiConstants.comment_url.toString() + taskID.toString() + "/"
        return this.http.get(comment_url, { 'headers': headers, observe: 'response' });
    }

    deleteComment(token: string, commentID: number) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var comment_url = ApiConstants.main_url.toString() + ApiConstants.comment_url.toString() + commentID.toString() + "/"
        return this.http.delete(comment_url, { 'headers': headers, observe: 'response' });
    }

    sendSubmission(token: string, submission: Submission) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            task: submission.task_name,
            language: submission.language,
            code: submission.code
        };
        var submission_url = ApiConstants.main_url.toString() + ApiConstants.submission_url.toString()
        return this.http.post(submission_url, body, { 'headers': headers, observe: 'response' });
    }

    getSubmission(token: string, task_id: number = null) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var submission_url = ApiConstants.main_url.toString() + ApiConstants.submission_url.toString()
        if (task_id != null) {
            submission_url += task_id.toString() + "/"
        }
        return this.http.get(submission_url, { 'headers': headers, observe: 'response' });
    }

    getAchievement(token: string) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var achievement_url = ApiConstants.main_url.toString() + ApiConstants.achievement_url.toString()
        return this.http.get(achievement_url, { 'headers': headers, observe: 'response' });
    }

    updatePermissions(token: string, permission: UserPermissions) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            is_staff: permission.is_staff,
            is_active: permission.is_active,
        };
        var permissions_url = ApiConstants.main_url.toString() + ApiConstants.permissions_url.toString()
        return this.http.put(permissions_url, body, { 'headers': headers, observe: 'response' });
    }

    getUserProfileById(token: string, id: string) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var profile_url = ApiConstants.main_url.toString() + ApiConstants.profile_url.toString() + id
        return this.http.get(profile_url, { 'headers': headers, observe: 'response' });
    }

    updateUserProfile(token: string, user: User) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var body;
        if (user.password != null) {
            body = {
                email: user.email,
                name: user.username,
                birthday: user.birthday,
                password: user.password,
            };
        } else {
            body = {
                email: user.email,
                name: user.username,
                birthday: user.birthday
            };
        }
        var profile_url = ApiConstants.main_url.toString() + ApiConstants.profile_url.toString()
        return this.http.put(profile_url, body, { 'headers': headers, observe: 'response' });
    }

    uploadImage(image: string) {
        var body = new FormData();
        body.append('image', image);
        return this.http.post(ApiConstants.img_upload_url, body);
    }

    
    updateUserImage(token: string, image_url: string) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var body = {
            image: image_url
        };
        var profile_url = ApiConstants.main_url.toString() + ApiConstants.profile_url.toString()
        return this.http.put(profile_url, body, { 'headers': headers, observe: 'response' });
    }
}