import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { User } from '../Models/user';
import { ApiConstants } from './ApiConstants';
import { formatDate } from '@angular/common';

@Injectable()
export class HttpService{
   
    constructor(private http: HttpClient){ }
 
    postData(user: User){
          console.log("post");
          console.log(user);
        //   console.log(formatDate(user.birthday, 'dd/MM/yyyy', "en-US"));
        // console.log(body);
        const headers = { 'content-type': 'application/json'}  
        // const body=JSON.stringify(user);
        const body = JSON.stringify({email: user.email, name: user.username,
            birthday: user.birthday, password: user.password });
        console.log(body)
        return this.http.post(ApiConstants.register_url, body,{'headers':headers})
        // return this.http.post(ApiConstants.register_url, body); 
    }
}