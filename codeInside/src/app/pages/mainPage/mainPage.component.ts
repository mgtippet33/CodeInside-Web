import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'main',
    templateUrl: './mainPage.component.html',
    styleUrls: ['./mainPage.component.scss']
})
export class MainPageComponent {

    constructor(private router: Router) {

    }

    onLoginClick(): void {

    }

    onRegisterClick(): void {
        this.router.navigateByUrl('/register');
    }
}
