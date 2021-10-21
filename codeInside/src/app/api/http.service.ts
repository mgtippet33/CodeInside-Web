import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { User } from '../Models/user';
import { ApiConstants } from './ApiConstants';
import { map } from "rxjs/operators"; 

@Injectable()
export class HttpService{
   
    constructor(private http: HttpClient){ }
 
    postData(user: User){
        const headers = { 'content-type': 'application/json'}  
        const body = JSON.stringify({email: user.email, name: user.username,
            birthday: user.birthday, password: user.password });
        return this.http.post(ApiConstants.register_url, body,{'headers':headers, observe: 'response'});
    }
}