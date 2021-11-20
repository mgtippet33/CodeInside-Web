import { Component, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Router } from '@angular/router';

import { faAward, faBook, faTasks, faUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.scss']
})
export class HeaderComponent implements ControlValueAccessor {
    faAward = faAward;
    faTasks = faTasks;
    faBook = faBook;
    faUser = faUser;
    faArrowLeft = faArrowLeft;

    @Input()
    headerName: string ='';
    @Input()
    navbarWithLogo: boolean = true
    @Input()
    backUrl: string = ""

    constructor(private router: Router){

    }
    writeValue(obj: any): void {
        throw new Error('Method not implemented.');
    }
    registerOnChange(fn: any): void {
        throw new Error('Method not implemented.');
    }
    registerOnTouched(fn: any): void {
        throw new Error('Method not implemented.');
    }
    setDisabledState?(isDisabled: boolean): void {
        throw new Error('Method not implemented.');
    }

    onArrowLeftClick() {
        if(this.backUrl == "task") {
            this.onTaskClick();
            return
        }
        if(this.backUrl == "theory") {
            this.onTheoryClick();
            return
        }
    }

    onAwardClick(){
        this.router.navigateByUrl('/achievement');
    }

    onTaskClick(){
        this.router.navigateByUrl('/task');
    }

    onTheoryClick(){
        this.router.navigateByUrl('/theory');
    }

    onProfileClick(){
        this.router.navigateByUrl('/profile');
    }
}
