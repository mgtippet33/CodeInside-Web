import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user';
import { HttpService } from 'src/app/api/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { CommonValidators } from 'src/app/validators/common-validators';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    providers: [HttpService]
})

export class RegisterComponent {
    user: User;
    form: FormGroup;
    email: FormControl;
    username: FormControl;
    birthday: FormControl;
    password: FormControl;
    confirmPassword: FormControl;
    showPassword: boolean;
    showConfirmPassword: boolean;

    constructor(private httpService: HttpService, private router: Router) {
        this.showPassword = false;
        this.showConfirmPassword = false;
    }

    ngOnInit(): void {
        this.email = new FormControl('', [Validators.required, CommonValidators.noWhiteSpace, CommonValidators.emailPattern]);
        this.username = new FormControl('', [Validators.required, CommonValidators.noWhiteSpace, Validators.minLength(3)]);
        this.birthday = new FormControl('', [ Validators.required, CommonValidators.datePattern]);
        this.password = new FormControl('', [Validators.required, CommonValidators.noWhiteSpace, CommonValidators.passwordPattern]);
        this.confirmPassword = new FormControl('', [Validators.required, CommonValidators.noWhiteSpace]);

        this.form = new FormGroup({
            Email: this.email,
            Username: this.username,
            Birthday: this.birthday,
            Password: this.password,
            ConfirmPassword: this.confirmPassword,
        });
    }

    onRegisterClick(): void {
        this.validateForm();
        if (!this.form?.valid) { return; }
        this.user = {
            token: null,
            email: this.form.value['email'],
            username: this.form.value['username'],
            birthday: formatDate(this.form.value['birthday'], 'dd/MM/yyyy', 'en-US'),
            password: this.form.value['password'],
            premium: false,
            active: true,
            admin: false,
            moderator: false,
            achievement: [],
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone.toString()
        };
        this.httpService.registerUser(this.user)
            .subscribe(response => {
                if (response.status == 201) {
                    console.log("User successfuly register")
                    this.router.navigateByUrl('/login');
                }
                else {
                    // TODO - modal view about current email exists in the system   
                }
            });
    }

    onBackToLoginClick(): void {
        this.router.navigateByUrl('/login');
    }

    private validateForm(): void {
        const email = this.form.get('Email');
        const username = this.form.get('Username');
        const birthday = this.form.get('Birthday');
        const password = this.form.get('Password');
        const confirmPassword = this.form.get('ConfirmPassword');

        if (email.errors?.required || email.errors?.whitespace) {
            email.setErrors({ ...email.errors, emailRequired: true });
        }

        if (email.errors?.emailPattern){
            email.setErrors({ ...email.errors, emailInvalid: true });
        }

        if (username.errors?.required || username.errors?.whitespace) {
            username.setErrors({ ...username.errors, usernameRequired: true });
        }

        if (username.errors?.minlength){
            username.setErrors({ ...username.errors, usernameInvalid: true });
        }

        if (birthday.errors?.required) {
            birthday.setErrors({ ...birthday.errors, birthdayRequired: true });
        }

        if (birthday.errors?.datePattern){
            birthday.setErrors({ ...birthday.errors, birthdayInvalid: true });
        }

        if (password.errors?.required || password.errors?.whitespace) {
            password.setErrors({ ...password.errors, passwordRequired: true });
        }

        if (password.errors?.passwordPattern) {
            password.setErrors({ ...password.errors, passwordInvalid: true });
        }
        
        if (confirmPassword.errors?.required || confirmPassword.errors?.whitespace) {
            confirmPassword.setErrors({ ...confirmPassword.errors, confirmPasswordRequired: true });
        }
     
        if (confirmPassword.value !== password.value) {
            confirmPassword.setErrors({ ...confirmPassword.errors, confirmPasswordInvalid: true });
        }
    }
}
