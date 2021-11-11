import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user';
import { HttpService } from 'src/app/api/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {formatDate} from "@angular/common";
import {CommonValidators} from "../../validators/common-validators";

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    providers: [HttpService]
})

export class ProfilePageComponent {
  title='Profile';
  form: FormGroup;
  email: FormControl;
  username: FormControl;
  birthday: FormControl;
  password: FormControl;
  user: User;
  token: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InJvb3RAcm9vdC5jb20iLCJleHAiOjE2MzU1Mzk2MDIsImVtYWlsIjoicm9vdEByb290LmNvbSJ9.m76CeSVGuGMzitf98skgVMT53WEiLEYjZKAzQR5YROQ"

  constructor(private httpService: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.email = new FormControl('', [Validators.required, CommonValidators.noWhiteSpace, CommonValidators.emailPattern]);
    this.username = new FormControl('', [Validators.required, CommonValidators.noWhiteSpace, Validators.minLength(3)]);
    this.birthday = new FormControl('', [ Validators.required, CommonValidators.datePattern]);
    this.password = new FormControl('', [Validators.required, CommonValidators.noWhiteSpace, CommonValidators.passwordPattern]);

    this.form = new FormGroup({
      Email: this.email,
      Username: this.username,
      Birthday: this.birthday,
      Password: this.password,
    });
  }

  onLogoutClick() {
    this.router.navigateByUrl('/login');
  }

  onSendFormClick() {
    console.log("1qdeqdeqsw");
    this.validateForm();
    console.log(this.form);
    console.log(this.form.valid);
    if (!this.form?.valid) {console.log("validation failed"); return; }
    this.user = {
      token: this.token,
      email: this.form.value['Email'],
      username: this.form.value['Username'],
      birthday: formatDate(this.form.value['Birthday'], 'MM/dd/yyyy', 'en-US'),
      password: this.form.value['Password'],
      premium: false,
      active: true,
      admin: false,
      moderator: false,
      achievement: [],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone.toString()
    };
    /*this.httpService.registerUser(this.user)
      .subscribe((data: any) =>{
        if (data['status'] as number == 201) {
          console.log("User successfully updated")
        }
        else {
          // TODO - modal view about current email exists in the system
        }
      });*/
    console.log(this.user);
  }

  private validateForm(): void {
    const email = this.form.get('Email').value;
    const username = this.form.get('Username').value;
    const birthday = this.form.get('Birthday').value;
    console.log(email);
    console.log(username);
    console.log(birthday);

    if (email.errors?.required || email.errors?.whitespace) {
      email.setErrors({ ...email.errors, emailRequired: true });
      console.log("error email whitespace");
    }

    if (email.errors?.emailPattern){
      email.setErrors({ ...email.errors, emailInvalid: true });
      console.log("error emailPattern");
    }

    if (username.errors?.required || username.errors?.whitespace) {
      username.setErrors({ ...username.errors, usernameRequired: true });
      console.log("username whitespace");
    }

    if (username.errors?.minlength){
      username.setErrors({ ...username.errors, usernameInvalid: true });
      console.log("username minlength");
    }

    if (birthday.errors?.required) {
      birthday.setErrors({ ...birthday.errors, birthdayRequired: true });
      console.log("birthday req");
    }

    if (birthday.errors?.datePattern){
      birthday.setErrors({ ...birthday.errors, birthdayInvalid: true });
      console.log("birthday datePattern");
    }

    console.log('end of validation');
  }
}
