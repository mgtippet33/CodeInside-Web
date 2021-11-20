import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user';
import { HttpService } from 'src/app/api/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonValidators } from "../../validators/common-validators";
import { CookieService } from 'src/app/services/cookieService';
import { ApiConstants } from 'src/app/api/ApiConstants';
import { UserPermissions } from "../../Models/userPermissions";

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
    user: User = new User();
    secondUser: User = new User();
    token: string;
    isUserAdmin: boolean;
    isOwnPage = false;

    constructor(private httpService: HttpService, private router: Router) {
    }

    ngOnInit(): void {
        if(this.router.url === '/profile'){
            this.isOwnPage = true;
        }
        //AuthorizationService.checkUserAuthorization(this.router);
        this.form = new FormGroup({
            Email: new FormControl('', [Validators.required, CommonValidators.noWhiteSpace, CommonValidators.emailPattern]),
            Username: new FormControl('', [Validators.required, CommonValidators.noWhiteSpace, Validators.minLength(3)]),
            Birthday: new FormControl('', [Validators.required, CommonValidators.datePattern]),
            Password: new FormControl('', [Validators.required, CommonValidators.noWhiteSpace, CommonValidators.passwordPattern])
        });
        this.token = CookieService.getCookie('JWT_token')
        if (this.token == null) {
            return
        }
        this.httpService.getUserProfile(this.token).subscribe((dataResponse: any) => {
            var user = new User();
            var data = dataResponse.body.data;
            console.log(data)
            user.user_id = data.id;
            user.token = this.token;
            user.email = data.email
            user.username = data.name;
            user.birthday = data.birthday;
            user.image = data.image;
            this.isUserAdmin = data.role != 'User'
            this.user = user;
            this.initializeForm();
        }, error => {
        });

        if(!this.isOwnPage){
            this.httpService.getUserProfileById(this.token, this.router.url.replace('/profile/','')).subscribe((dataResponse: any) => {
                var data = dataResponse.body.data;
                console.log(data)
                if(this.user.user_id != data.id){
                    var user = new User();
                    user.user_id = data.id;
                    user.email = data.email
                    user.username = data.name;
                    user.birthday = data.birthday;
                    user.role = data.role;
                    user.image = data.image;
                    this.user = user;
                    this.initializeForm();
                }
                else{
                    this.isOwnPage = true;
                    this.router.navigateByUrl('/profile');
                }
            });
        }
    }

    onLogoutClick() {
        document.cookie = `JWT_token=null; secure`
        this.router.navigateByUrl('/login');
    }

    onSendFormClick() {
        // this.validateForm();
        // if (!this.form?.valid) { return; }
        this.httpService.updateUserProfile(this.token, this.user).subscribe(
            (data: any) => {
                // console.log(data);
            });

    }

    onBuyPremium() {
        console.log(ApiConstants.main_url + ApiConstants.payment_url + this.user.user_id.toString())
        window.location.href = ApiConstants.main_url + ApiConstants.payment_url + this.user.user_id.toString();
    }

    onBanClick() {
        console.log("inside ban user")
        var permissions = new UserPermissions();
        permissions.is_active = false;
        permissions.is_staff = false;
        this.httpService.updatePermissions(this.token, permissions)
            .subscribe((data: any) => {
                if (data['status'] as number == 201) {
                    console.log("User successfuly baned")
                }
                else {

                }
            });
        console.log(1);
    }

    onChangeToModeratorClick() {
        console.log("change user to moderator role")
        var permissions = new UserPermissions();
        permissions.is_active = false;
        permissions.is_staff = true;
        this.httpService.updatePermissions(this.token, permissions)
            .subscribe((data: any) => {
                if (data['status'] as number == 201) {
                    console.log("User successfuly set as moderator")
                }
                else {

                }
            });
        console.log(1);
    }

    private initializeForm() {
        this.form = new FormGroup({
            Email: new FormControl(this.user.email, [Validators.required, CommonValidators.noWhiteSpace, CommonValidators.emailPattern]),
            Username: new FormControl(this.user.username, [Validators.required, CommonValidators.noWhiteSpace, Validators.minLength(3)]),
            Birthday: new FormControl(this.user.birthday.split("/").reverse().join("-"), [Validators.required, CommonValidators.datePattern]),
            Password: new FormControl('', [Validators.required, CommonValidators.noWhiteSpace, CommonValidators.passwordPattern])
        });
    }
}
