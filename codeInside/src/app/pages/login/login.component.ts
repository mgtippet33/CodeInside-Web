import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonValidators } from 'src/app/validators/common-validators';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    email: FormControl;
    password: FormControl;

    constructor(private router: Router) {

    }
    ngOnInit(): void {
        this.email = new FormControl('', [Validators.required, CommonValidators.noWhiteSpace, CommonValidators.emailPattern]);
        this.password = new FormControl('', [Validators.required, CommonValidators.noWhiteSpace, CommonValidators.passwordPattern]);
        this.form = new FormGroup({
            Email: this.email,
            Password: this.password,
        });
    }

    onLoginClick(): void {
        this.validateForm();
        if (!this.form?.valid) { return; }
        this.router.navigateByUrl('/main');
    }

    onRegisterClick(): void {
        this.router.navigateByUrl('/register');
    }

    private validateForm(): void {
        const email = this.form.get('Email');
        const password = this.form.get('Password');

        if (email.errors?.required || email.errors?.whitespace) {
            email.setErrors({ ...email.errors, emailRequired: true });
        }

        if (email.errors?.emailPattern){
            email.setErrors({ ...email.errors, emailValid: true });
        }

        if (password.errors?.required || password.errors?.whitespace) {
            password.setErrors({ ...password.errors, passwordRequired: true });
        }

        if (password.errors?.passwordPattern) {
            password.setErrors({ ...password.errors, passwordValid: true });
        }

    }
}
