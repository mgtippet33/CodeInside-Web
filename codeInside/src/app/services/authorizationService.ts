import { HttpService } from "../api/http.service";
import { CookieService } from "./cookieService";
import { HttpClient, HttpXhrBackend } from '@angular/common/http';
import { Router } from "@angular/router";
import { throwError } from "rxjs";

export class AuthorizationService {

    private static httpService: HttpService = new HttpService(new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() })))

    static checkUserAuthorization(router: Router, currentPage: string=null, nextPage: string = null): void {
        var name = 'JWT_token'
        var token = CookieService.getCookie(name)
        this.httpService.getUserProfile(token).subscribe(
            (data: any) => {
                var status_code = data['status'] as number
                if (status_code == 200 && nextPage != null) {
                    router.navigateByUrl(nextPage)
                }
            },
            error => {
                if(currentPage != 'login_register') {
                    router.navigateByUrl('/')
                    return
                }
            })
    }

}
