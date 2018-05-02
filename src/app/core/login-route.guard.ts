import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../core/login.service';

@Injectable()
export class LoginRouteGuard implements CanActivate {

  constructor(private router: Router, private loginService: LoginService ) {}
  canActivate() {
    if(!this.loginService.isLoggedIn()) {
      this.router.navigateByUrl("/login");
      return false;
    }
    return true;
  }
}
