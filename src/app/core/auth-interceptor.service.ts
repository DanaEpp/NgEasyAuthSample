import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { IdentityTokenInfo } from '../shared/shared.module';
import { LoggerService } from './logger.service';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private storageTokenKey: string = 'identity_token_info';

    constructor(private logger: LoggerService, private router: Router, private loginService: LoginService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
        let authToken: IdentityTokenInfo = null;

        authToken = this.loginService.userTokenInfo;

        if (authToken) 
        {
            const customReq = req.clone({ 
                headers: req.headers.set('Authorization', 'Bearer ' + authToken.access_token)
            });

            return next
                .handle(customReq)
                .do((event: HttpEvent<any>) => {
                    if( event instanceof HttpResponse) {
                        // In case you wanna do something with the response
                    }
                },
                (err: any) => {
                    if( err.status === 401 ) {
                        // Invalid token... redirect back to login
                        this.router.navigateByUrl("/login");
                    }
                });
        }
        else 
        {
            return next.handle(req);
        }
    }
}