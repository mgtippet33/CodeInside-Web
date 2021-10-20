import { Component  } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user';
import { HttpService } from 'src/app/api/http.service';
import { FormGroup, FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';
@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [HttpService]
})

export class RegisterComponent {
  public user!: User;
  public registrationForm!: FormGroup;
  public showPassword: boolean;
  public showConfirmPassword: boolean;

  done: boolean = false;
  statusCode: string | undefined;
  constructor(private httpService:HttpService, private router: Router) {
    this.showPassword = false;
    this.showConfirmPassword = false;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.registrationForm = new FormGroup({
        email: new FormControl(''),
        username: new FormControl(''),
        birthday: new FormControl(''),
        password: new FormControl(''),
    });
  }

  onRegisterClick(): void{
    console.log(this.registrationForm.value);
    this.user = new User(this.registrationForm.value['email'], this.registrationForm.value['username'],
    formatDate(this.registrationForm.value['birthday'], 'dd/MM/yyyy', 'en-US'), this.registrationForm.value['password'],
    false, true, false, false, []);
    console.log(this.user);
    this.httpService.postData(this.user)
                .subscribe(
                    (data: any) => {this.statusCode=data['status code']; this.done=true;},
                    error => console.log(error)
                );
  }
  
  onBackToLoginClick(): void{
    this.router.navigateByUrl('/login');
  }
}
