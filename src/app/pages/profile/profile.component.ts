import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user';
import { HttpService } from 'src/app/api/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonValidators } from "../../validators/common-validators";
import { CookieService } from 'src/app/services/cookieService';
import { ApiConstants } from 'src/app/api/ApiConstants';
import { UserPermissions } from "../../Models/userPermissions";
import { formatDate } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { AuthorizationService } from 'src/app/services/authorizationService';
import { data } from 'jquery';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    providers: [HttpService]
})

export class ProfilePageComponent {
    title = 'Profile';
    faTimes = faTimes;
    form: FormGroup;
    email: FormControl;
    username: FormControl;
    birthday: FormControl;
    password: FormControl;
    user: User = new User();
    secondUser: User = new User();
    token: string;
    isUserAdmin: boolean;
    isCurrentUserAdmin: boolean;
    isCurrentUserBanned: boolean;
    isOwnPage = false;
    notification: string;
    backUrl: string = 'task';
    viewLogo: boolean = true;

    constructor(private httpService: HttpService, private router: Router) {
    }

    ngOnInit(): void {
        AuthorizationService.checkUserAuthorization(this.router)
        if(this.router.url === '/profile'){
            this.isOwnPage = true;
        }
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

        if(this.isOwnPage) {
            this.getOwnData();
        }

        if(!this.isOwnPage){
            this.httpService.getUserProfileById(this.token, this.router.url.replace('/profile/','')).subscribe((dataResponse: any) => {
                var data = dataResponse.body.data;
                if(this.user.user_id != data.id){
                    var user = new User();
                    user.user_id = data.id;
                    user.email = data.email
                    user.username = data.name;
                    user.birthday = new Date(data.birthday).toLocaleDateString().replace(/\./g, "/");
                    user.role = data.role;
                    user.image = data.image;
                    this.isCurrentUserAdmin = data.role != 'User'
                    this.isCurrentUserBanned = data.banned
                    this.user = user;
                    this.initializeForm();
                    this.viewLogo = false;
                }
                else{
                    this.isOwnPage = true;
                    this.getOwnData();
                    this.router.navigateByUrl('/profile');
                }
            });
        }
    }

    private getOwnData(): void {
        this.httpService.getUserProfile(this.token).subscribe((dataResponse: any) => {
            var user = new User();
            var data = dataResponse.body.data;
            user.user_id = data.id;
            user.token = this.token;
            user.email = data.email
            user.username = data.name;
            user.premium = data.premium;
            user.birthday = new Date(data.birthday).toLocaleDateString().replace(/\./g, "/");
            user.image = data.image;
            this.isUserAdmin = data.role != 'User'
            this.user = user;
            this.initializeForm();
        }, error => {
        });
    }

    onLogoutClick() {
        CookieService.removeCookie();
        this.router.navigateByUrl('/login');
    }

    onSendFormClick() {
        // this.validateForm();
        // if (!this.form?.valid) { return; }
        this.user.username = this.form.get("Username").value;
        this.user.email = this.form.get("Email").value;
        this.user.birthday = formatDate(this.form.value['Birthday'], 'MM/dd/yyyy', 'en-US');
        if(this.form.get("Password").value.length != 0) {
            this.user.password = this.form.get("Password").value;
        }
        this.httpService.updateUserProfile(this.token, this.user).subscribe(
            (data: any) => {
                this.notification = 'Your data has been successfully changed.'
                this.openNotificationModal()
            });

    }

    private openNotificationModal() {
        var notificationModal = new bootstrap.Modal(document.getElementById("notificationModal"), {
            keyboard: false
        });
        notificationModal?.show();
    }

    onBuyPremium() {
        window.location.href = ApiConstants.main_url + ApiConstants.payment_url + this.user.user_id.toString();
    }

    onBanClick() {
        var permissions = new UserPermissions();
        permissions.is_active = false;
        this.httpService.updatePermissions(this.token, permissions)
            .subscribe((data: any) => {
                if (data['status'] as number == 201) {
                    console.log("User successfuly baned")
                }
                else {

                }
            });
    }

    onUnBanClick() {
        var permissions = new UserPermissions();
        permissions.is_active = true;
        this.httpService.updatePermissions(this.token, permissions)
            .subscribe((data: any) => {
                if (data['status'] as number == 201) {
                    console.log("User successfuly baned")
                }
                else {

                }
            });
    }

    onSetModeratorClick() {
        var permissions = new UserPermissions();
        permissions.is_staff = true;
        this.httpService.updatePermissions(this.token, permissions)
            .subscribe((data: any) => {
                if (data['status'] as number == 201) {
                    console.log("User successfuly set as moderator")
                }
                else {

                }
            });
    }


    onUnSetModeratorClick() {
        var permissions = new UserPermissions();
        permissions.is_staff = false;
        this.httpService.updatePermissions(this.token, permissions)
            .subscribe((data: any) => {
                if (data['status'] as number == 201) {
                    console.log("User successfuly set as moderator")
                }
                else {

                }
            });
    }

    private initializeForm() {
        this.form = new FormGroup({
            Email: new FormControl(this.user.email, [Validators.required, CommonValidators.noWhiteSpace, CommonValidators.emailPattern]),
            Username: new FormControl(this.user.username, [Validators.required, CommonValidators.noWhiteSpace, Validators.minLength(3)]),
            Birthday: new FormControl(this.user.birthday.split("/").reverse().join("-"), [Validators.required, CommonValidators.datePattern]),
            Password: new FormControl('', [Validators.required, CommonValidators.noWhiteSpace, CommonValidators.passwordPattern])
        });
    }

    onFileChanged(event: any) {
        var image = event.target.files[0]
        if(image.type.indexOf("image/") == -1) {
            this.notification = 'You can only add photos to your profile.';
            this.openNotificationModal();
            return;
        }
        this.httpService.uploadImage(image).subscribe(
            (data: any) => {
                var image_url = data['data']['display_url'];
                this.httpService.updateUserImage(this.token, image_url).subscribe(
                    (data: any) => {
                        this.ngOnInit();
                    }
                )
            }
        );
    }
}
