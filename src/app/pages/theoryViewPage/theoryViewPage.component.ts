import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faPlusSquare, faTimes } from '@fortawesome/free-solid-svg-icons';
import * as bootstrap from 'bootstrap';
import { HttpService } from 'src/app/api/http.service';
import { RangeSliderOptions } from 'src/app/components/slider/range-slider.component';
import { Task } from 'src/app/Models/task';
import { Theory } from 'src/app/Models/theory.model';
import { AuthorizationService } from 'src/app/services/authorizationService';
import { CookieService } from 'src/app/services/cookieService';

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
    isUserAdmin: boolean;
    token:string;
    faTimes = faTimes;
    faPlusSquare = faPlusSquare;
    theoryForm = new FormGroup(
        {
            theoryName: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required])
        });
    constructor(private httpService: HttpService, private router: Router) {

    }

    ngOnInit(): void {
        this.searchValueControl = new FormControl(this.searchValue);
        this.form = new FormGroup({
            SearchValueControl: this.searchValueControl
        });
        AuthorizationService.checkUserAuthorization(this.router)
        this.token = CookieService.getCookie('JWT_token')
        if (this.token == null) { return }
        this.httpService.getUserProfile(this.token).subscribe((data: any) => {
            this.isUserAdmin = data['body']['data']['role'] == 'User' ? false : true
        }, error => { })
        this.httpService.getTheory().subscribe({
            next: (data: any) => {
                data = data['data']
                var theoretics = new Array<Theory>(data.length)
                for(var i = 0; i < data.length; ++i) {
                    var theory = new Theory()
                    theory.theory_id = data[i]['id'] as number
                    theory.name = data[i]['name']
                    var desc = data[i]['desc'].replace(/<\/?[a-zA-Z]+>/gi, '').replace(/<\/?[^>]+(>|$)/g, "")
                    theory.description = desc.substring(0, desc.indexOf('.')) + '...'
                    theoretics[i] = theory
                }
                this.theory = theoretics
                this.sortedTheory = theoretics
            },
            error: (error: any) => {
                
                console.error('There was an error!', error);
            }
        });
    }

    onSearchFieldChange(value: any){
        this.searchValue = value.toLowerCase();
        this.sortedTheory = this.theory.filter(x=>x.name.toLowerCase().indexOf(this.searchValue)!=-1 || x.description.toLowerCase().indexOf(this.searchValue)!=-1);
    }

    onReadTheory(theory_id: number) {
        this.router.navigateByUrl(`/theory/${theory_id}`)
    }

    openNotificationModal() {
        var notificationModal = new bootstrap.Modal(document.getElementById("notificationModal"), {
            keyboard: false
        });
        notificationModal?.show();
    }

    onCreateTheory() {
        if (!this.theoryForm?.valid) { 
            this.openNotificationModal();
            return; 
        }
        var theory = new Theory();
        theory.name = this.theoryForm.get('theoryName').value;
        theory.description = this.theoryForm.get('description').value;
        

        this.httpService.createTheory(this.token, theory).subscribe(
            (data:any) => {
                if(data.status == 201) {
                    this.ngOnInit();
                }
            },
            (error:any) => {
                this.openNotificationModal();
            }
        )
    }
}
