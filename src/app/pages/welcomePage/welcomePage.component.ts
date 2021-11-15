import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'welcome',
    templateUrl: './welcomePage.component.html',
    styleUrls: ['./welcomePage.component.scss']
})
export class WelcomePageComponent {
    constructor(private router: Router) {

    }

    onLoginClick() {
        this.router.navigateByUrl('/login');
    }
    onRegisterClick() {
        this.router.navigateByUrl('/register');
    }
}
