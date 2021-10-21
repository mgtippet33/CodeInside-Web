import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user';
import { HttpService } from 'src/app/api/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    providers: [HttpService]
})

export class RegisterComponent {
    public user: User;
    public registrationForm!: FormGroup;
    public showPassword: boolean;
    public showConfirmPassword: boolean;
    public userClick: boolean = false;

    constructor(private httpService: HttpService, private router: Router) {
        this.showPassword = false;
        this.showConfirmPassword = false;
    }

    ngOnInit(): void {
        this.registrationForm = new FormGroup({
            email: new FormControl('',
                [
                    Validators.required,
                    Validators.email
                ]),
            username: new FormControl('', [
                Validators.required,
                Validators.minLength(3)
            ]),
            birthday: new FormControl('',
                // [
                //   Validators.required,
                //   Validators.pattern('d{1,2}/\d{1,2}/\d{4}')
                // ]
            ),
            password: new FormControl('',
                // [
                //   Validators.required,
                //   Validators.pattern('^(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$')
                // ]
            ),
            confirmPassword: new FormControl(''),
        });
    }

    async onRegisterClick(): Promise<void> {
        this.userClick = true;
        if (this.registrationForm.valid) {
            this.user = {
                email: this.registrationForm.value['email'],
                username: this.registrationForm.value['username'],
                birthday: formatDate(this.registrationForm.value['birthday'], 'dd/MM/yyyy', 'en-US'),
                password: this.registrationForm.value['password'],
                premium: false,
                active: true,
                admin: false,
                moderator: false,
                achievement: []
            };
            const response = await this.httpService.registerUser(this.user)
                .toPromise();
                if (response.status == 201) {
                    console.log("User successfuly register")
                    this.router.navigateByUrl('/login');
                }
                else {
                    // TODO - modal view about current email exists in the system   
                }
        }
    }

    onBackToLoginClick(): void {
        this.router.navigateByUrl('/login');
    }
}
