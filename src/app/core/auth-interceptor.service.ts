import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private storageTokenKey: string = 'access_token';

    // Can't inject the login service here, cyclic issue
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
        const authToken = localStorage.getItem(this.storageTokenKey);      

        if (authToken) {

            const headers = req.headers.set('Authorization', 'Bearer ' + authToken);

            const cloned = req.clone({ headers });

            return next.handle(cloned);
        }
        else {
            return next.handle(req);
        }
    }
}