import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/api/http.service';
import { RangeSliderOptions } from 'src/app/components/slider/range-slider.component';
import { Task } from 'src/app/models/task';
import { Theory } from 'src/app/models/theory.model';

@Component({
    selector: 'theoryView',
    templateUrl: './theoryViewPage.component.html',
    styleUrls: ['./theoryViewPage.component.scss'],
    providers: [HttpService]
})
export class TheoryViewPageComponent {
    title='Theory List';
    form: FormGroup;
    searchValueControl: FormControl;
    searchValue = '';
    theory: Array<Theory> =[
        { name: 'Theory 1', description: 'Description 1'} as Theory,
        { name: 'Theory 2', description: 'Description 2'} as Theory,
        { name: 'Theory 3', description: 'Description 3'} as Theory,
        { name: 'Theory 4', description: 'Description 4'} as Theory,
        { name: 'Theory 5', description: 'Description 5'} as Theory,
        { name: 'Theory 6', description: 'Description 6'} as Theory,
        { name: 'Theory 7', description: 'Description 7'} as Theory
    ];
    sortedTheory: Array<Theory> =[
        { name: 'Theory 1', description: 'Description 1'} as Theory,
        { name: 'Theory 2', description: 'Description 2'} as Theory,
        { name: 'Theory 3', description: 'Description 3'} as Theory,
        { name: 'Theory 4', description: 'Description 4'} as Theory,
        { name: 'Theory 5', description: 'Description 5'} as Theory,
        { name: 'Theory 6', description: 'Description 6'} as Theory,
        { name: 'Theory 7', description: 'Description 7'} as Theory
    ];
    solved: boolean = false; 
    constructor(private httpService: HttpService, private router: Router) {

    }

    ngOnInit(): void {
        this.searchValueControl = new FormControl(this.searchValue);
        this.form = new FormGroup({
            SearchValueControl: this.searchValueControl
        });
        
    }

    onSearchFieldChange(value: any){
        this.searchValue = value;
        this.sortedTheory = this.theory.filter(x=>x.name.indexOf(this.searchValue)!=-1);
    }
}
