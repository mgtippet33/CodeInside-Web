import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user';
import { HttpService } from 'src/app/api/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonValidators } from "../../validators/common-validators";
import { CookieService } from 'src/app/services/cookieService';
import { ApiConstants } from 'src/app/api/ApiConstants';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    providers: [HttpService]
})

export class ProfilePageComponent {
    title = 'Profile';
    form: FormGroup;
    email: FormControl;
    username: FormControl;
    birthday: FormControl;
    password: FormControl;
    user: User;
    token: string;

    constructor(private httpService: HttpService, private router: Router) { }

    ngOnInit(): void {
        //AuthorizationService.checkUserAuthorization(this.router);
        this.token = CookieService.getCookie('JWT_token')
        if (this.token == null) { return }
        var user = new User();
        this.httpService.getUserProfile(this.token).subscribe((data: any) => {
            data = data['body']['data'];
            user.user_id = data['id'];
            user.token = this.token;
            user.email = data['email']
            user.username = data['name'];
            user.birthdayDate = new Date(data['birthday']);
            this.user = user;
            this.email = new FormControl(data['email'], [Validators.required, CommonValidators.noWhiteSpace, CommonValidators.emailPattern]);
            this.username = new FormControl(data['name'], [Validators.required, CommonValidators.noWhiteSpace, Validators.minLength(3)]);
            this.birthday = new FormControl(data['birthday'].split("/").reverse().join("-"), [Validators.required, CommonValidators.datePattern]);
            this.password = new FormControl('', [Validators.required, CommonValidators.noWhiteSpace, CommonValidators.passwordPattern]);
        }, error => { })
        this.form = new FormGroup({
            Email: this.email,
            Username: this.username,
            Birthday: this.birthday,
            Password: this.password,
        });
    }

    onLogoutClick() {
        document.cookie = `JWT_token=null; secure`
        this.router.navigateByUrl('/login');
    }

    onSendFormClick() {
        // this.validateForm();
        // if (!this.form?.valid) { return; }
        this.httpService.updateUserProfile(this.token, this.user).subscribe(
            (data:any) => {
                // console.log(data);
            });

    }

    onBuyPremium() {
        console.log(ApiConstants.main_url + ApiConstants.payment_url + this.user.user_id.toString())
        window.location.href = ApiConstants.main_url + ApiConstants.payment_url + this.user.user_id.toString();
    }
}
