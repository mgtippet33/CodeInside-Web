import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user';
import { HttpService } from 'src/app/api/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { CommonValidators } from 'src/app/validators/common-validators';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'taskPage',
    templateUrl: './taskPage.component.html',
    styleUrls: ['./taskPage.component.scss'],
})

export class TaskPageComponent {
  faLocationArrow = faLocationArrow;
}
