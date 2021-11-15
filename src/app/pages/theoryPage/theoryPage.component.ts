import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { HttpService } from 'src/app/api/http.service';
import { Theory } from 'src/app/Models/theory.model';
import { AuthorizationService } from 'src/app/services/authorizationService';
import { CookieService } from 'src/app/services/cookieService';

@Component({
    selector: 'theoryPage',
    templateUrl: './theoryPage.component.html',
    styleUrls: ['./theoryPage.component.scss'],
    providers: [HttpService]
})
export class TheoryPageComponent implements OnInit {

    theory: Theory = new Theory()
    faTimes = faTimes;
    backUrl: string = "theory"
    isUserAdmin: boolean;
    token: string;
    theoryForm = new FormGroup(
        {
            theoryName: new FormControl(''),
            description: new FormControl('')
        });

    constructor(private httpService: HttpService, private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        //AuthorizationService.checkUserAuthorization(this.router)
        this.token = CookieService.getCookie('JWT_token')
        if (this.token == null) { return }
        this.httpService.getUserProfile(this.token).subscribe((data: any) => {
            this.isUserAdmin = data['body']['data']['role'] == 'User' ? false : true
        }, error => { })
        this.route.params.subscribe(params => {
            const id = Number.parseInt(params['id']);
            this.httpService.getTheory(id).subscribe(
                {
                    next: (data: any) => {
                        data = data["data"]
                        this.theory = {
                            theory_id: id,
                            name: data["name"],
                            description: data["desc"]
                        }

                        this.theoryForm = new FormGroup(
                            {
                                theoryName: new FormControl(data["name"], [Validators.required]),
                                description: new FormControl(data["desc"], [Validators.required])
                            });

                    },
                    error: (error: any) => {
                    }
                }
            )
        })
    }

    onApplyChange() {
        if (!this.theoryForm?.valid) 
        { return; }
        this.theory.name = this.theoryForm.get('theoryName').value;
        this.theory.description = this.theoryForm.get('description').value;
        this.httpService.updateTheory(this.token, this.theory).subscribe(
            (data: any) => {
                if(data.status == 200) {
                    this.ngOnInit();
                }
            }
        )
    }

    onRemoveTheory() {
        this.httpService.deleteTheory(this.token, this.theory.theory_id).subscribe(
            (data: any) => {
                if(data.status == 200) {
                    this.router.navigateByUrl("/theory")
                }
            }
        )
    }
}
