import { Component  } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent {
  public showPassword: boolean;
  public showConfirmPassword: boolean;
  constructor(private router: Router) {
    this.showPassword = false;
    this.showConfirmPassword = false;
  }


  onRegisterClick(): void{
    
  }
  
  onBackToLoginClick(): void{
    this.router.navigateByUrl('/login');
  }
}
