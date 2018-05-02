import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import { LoginService } from '../core/login.service';
import { environment } from '../../environments/environment';
import { LoggerService } from '../core/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  error: string = '';
  
  constructor( private router: Router, private loginService: LoginService, private logger: LoggerService ) { }

  public get aadUrl(): string {
    return this.loginService.baseUrl + "/.auth/login/aad?post_login_redirect_uri=" + this.postAuthUrl;
  }

  public get msaUrl(): string {
    return this.loginService.baseUrl + "/.auth/login/microsoftaccount?post_login_redirect_uri=" + this.postAuthUrl;
  }

  public get postAuthUrl(): string {
    let url: string = '';

    if( environment.production ) {
        url = this.loginService.baseUrl + "/postauth";
    }
    else {
        url = 'http://127.0.0.1:4200/postauth'; //DevSkim: ignore DS137138
    }

    return url;
  }


  loginUser(form: NgForm) {
    this.logger.trace("--> LoginComponent.loginUser()");
    this.logger.trace(form.value);

    if (form.valid) {
        this.loginService
            .login(form.value.username, form.value.password)
            .subscribe(
                result => {
                    if(result) {
                        this.router.navigateByUrl('/home');
                    } else {
                        this.error = 'Invalid username or password!';
                    }
                }
            );
    }

    this.logger.trace("<-- LoginComponent.loginUser()");
  }
}
