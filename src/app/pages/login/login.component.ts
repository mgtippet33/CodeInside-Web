import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonValidators } from 'src/app/validators/common-validators';
import { HttpService } from 'src/app/api/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { AuthorizationService } from 'src/app/services/authorizationService';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [HttpService]
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    email: FormControl;
    password: FormControl;

    constructor(private router: Router, private httpService: HttpService) {

    }
    ngOnInit(): void {
        //AuthorizationService.checkUserAuthorization(this.router, 'login_register', '/task')
        this.email = new FormControl('', [Validators.required, CommonValidators.noWhiteSpace, CommonValidators.emailPattern]);
        this.password = new FormControl('', [Validators.required]);
        this.form = new FormGroup({
            Email: this.email,
            Password: this.password,
        });
    }

    onLoginClick(): void {
        this.validateForm();
        if (!this.form?.valid) { return; }
        this.httpService.loginUser(this.email.value, this.password.value)
            .subscribe((data: any) => {
                if (data['status'] == 200) {
                    var token = data['body']['token']
                    document.cookie = `JWT_token=${token}; secure`
                    this.router.navigateByUrl('/task');
                    console.log("User successfuly login")
                }
            },
            error => {
                if (error instanceof HttpErrorResponse) {
                    if (error.error instanceof ErrorEvent) {
                        console.error("Error Event");
                    } else {
                        console.log(`error status : ${error.status} ${error.statusText}`);
                        switch (error.status) {
                            case 404:
                                console.log("No user with this email and password was found")
                                break;
                            case 403:
                                console.log("User is banned")   
                                break;
                        }
                    } 
                } else {
                    console.error("some thing else happened");
                }
                return throwError(error)
                
            });
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

        if (email.errors?.emailPattern) {
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
