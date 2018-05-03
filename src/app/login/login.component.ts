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

  public easyAuthLogin(provider: string) {
      this.loginService.login( provider ).then(() => {
        this.router.navigateByUrl('/home');  
      });
  }
}
