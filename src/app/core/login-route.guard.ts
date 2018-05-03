import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../core/login.service';
import { LoggerService } from './logger.service';

@Injectable()
export class LoginRouteGuard implements CanActivate {

  constructor(private router: Router, private loginService: LoginService, private logger: LoggerService ) {}
  canActivate() {

    this.logger.trace( "--> LoginRouteGuard.canActivate()" );

    let allowThrough = false;
    
    if(this.loginService.isLoggedIn()) 
    {
      allowThrough = true;
    }
    else
    {
      this.router.navigateByUrl("/login");
      allowThrough = false;
    }

    this.logger.trace( "<-- LoginRouteGuard.canActivate() [" + allowThrough + "]" );

    return allowThrough;
  }
}
