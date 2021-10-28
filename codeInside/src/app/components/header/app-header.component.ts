import { Component, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Router } from '@angular/router';

import { faAward, faBook, faTasks, faUser } from '@fortawesome/free-solid-svg-icons';

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
    @Input()
    headerName: string ='';

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

    onAwardClick(){
        this.router.navigateByUrl('/');
    }

    onTaskClick(){
        this.router.navigateByUrl('/task');
    }

    onTheoryClick(){
        this.router.navigateByUrl('/');
    }

    onProfileClick(){
        this.router.navigateByUrl('/');
    }
}
