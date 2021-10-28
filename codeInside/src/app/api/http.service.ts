import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from '../models/user';
import { ApiConstants } from './ApiConstants';
import { Task } from '../models/task';
import { Topic } from '../models/topic';


@Injectable()
export class HttpService {

    testToken: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InJvb3RAcm9vdC5jb20iLCJleHAiOjE2MzUzNDAxOTIsImVtYWlsIjoicm9vdEByb290LmNvbSJ9.-5bg1FVf9v7E-NSV44igwlzTqnPLBvYCjXxoU6yyCLc";
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

    createTopic(token: string, topic: Topic) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            name: topic.name,
            desc: topic.description,
        };
        return this.http.post(ApiConstants.topic_url, body, { 'headers': headers, observe: 'response' });
    }

    getTopics(topicID: number=null) {
        var url = ApiConstants.task_url
        if(topicID != null) {
            url += topicID.toString() + "/"
        }
        return this.http.get(url);
    }

    updateTopic(token: string, topic: Topic) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            name: topic.name,
            desc: topic.description,
        };
        var url = ApiConstants.topic_url + topic.id.toString() + "/"
        return this.http.put(url, body, { 'headers': headers, observe: 'response' });
    }

    deleteTopic(token: string, topicID: number) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var url = ApiConstants.topic_url + topicID.toString() + "/"
        return this.http.delete(url, { 'headers': headers, observe: 'response' });
    }
}