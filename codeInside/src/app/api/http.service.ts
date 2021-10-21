import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from '../Models/user';
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
}